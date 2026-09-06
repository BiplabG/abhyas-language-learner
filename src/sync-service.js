import {
  EMPTY_REVISION,
  nextRevision,
  compareRevision,
  validateConfig,
  validateSyncToken,
  syncIdentity,
  exchange,
} from "./sync.js";
export function createSyncService(api) {
  const read = async () =>
    api.storage.local.get(["data", "syncMeta", "syncAuth", "syncStatus"]);
  async function status(message, extra = {}) {
    const syncStatus = { message, ...extra };
    await api.storage.local.set({ syncStatus });
    return syncStatus;
  }
  async function initialize(data) {
    const saved = await read();
    if (saved.syncAuth && !saved.syncAuth.token) {
      await api.storage.local.remove("syncAuth");
      if (saved.syncMeta) {
        delete saved.syncMeta.owner;
        await api.storage.local.set({
          syncMeta: saved.syncMeta,
          syncStatus: {
            connected: false,
            message:
              "Sync authentication changed. Connect once with a shared sync token.",
          },
        });
      }
      saved.syncAuth = undefined;
    }
    if (!saved.syncMeta)
      await api.storage.local.set({
        syncMeta:
          data.words.length || data.reviews.length
            ? nextRevision()
            : { ...EMPTY_REVISION },
      });
    if (saved.syncAuth)
      await api.alarms.create("sync", {
        periodInMinutes: 5,
        delayInMinutes: 1,
      });
  }
  async function changed(data) {
    const saved = await read();
    const syncMeta = { ...saved.syncMeta, ...nextRevision(saved.syncMeta) };
    await api.storage.local.set({ data, syncMeta });
    if (saved.syncAuth) {
      await api.alarms.create("sync-soon", { delayInMinutes: 0.5 });
      await status("Local changes saved. Sync pending.", {
        connected: true,
        tokenHint: saved.syncAuth.token.slice(-6),
      });
    }
  }
  async function run() {
    const saved = await read();
    if (!saved.syncAuth)
      return { data: saved.data, syncStatus: saved.syncStatus };
    const { config, token } = saved.syncAuth;
    const info = {
      connected: true,
      tokenHint: token.slice(-6),
      url: config.url,
    };
    try {
      if (
        !(await api.permissions.contains({
          origins: [config.url + "/*"],
          data_collection: ["authenticationInfo", "websiteContent"],
        }))
      )
        throw new Error(
          "Supabase permission was removed. Disconnect and connect again.",
        );
      await status("Syncing…", info);
      const remote = await exchange(
        config,
        token,
        saved.syncMeta || EMPTY_REVISION,
        saved.data,
      );
      const local = saved.syncMeta || EMPTY_REVISION,
        comparison = compareRevision(remote, local);
      if (comparison < 0)
        throw new Error(
          "Remote returned an older version unexpectedly. Local data was kept.",
        );
      if (comparison > 0) {
        const data = {
          ...saved.data,
          version: 1,
          lists: remote.payload.lists,
          words: remote.payload.words,
          reviews: remote.payload.reviews,
        };
        await api.storage.local.set({
          syncBackup: {
            data: saved.data,
            meta: local,
            at: new Date().toISOString(),
          },
          data,
          syncMeta: {
            ...local,
            revision: remote.revision,
            change_id: remote.change_id,
          },
        });
      }
      const syncStatus = await status(
        comparison > 0
          ? "Downloaded newer remote data. Previous local data is available below."
          : "Remote is up to date with this browser.",
        {
          ...info,
          lastSync: new Date().toISOString(),
          revision: remote.revision,
        },
      );
      return { data: (await read()).data, syncStatus };
    } catch (e) {
      const syncStatus = await status(e.message, { ...info, error: true });
      return { data: (await read()).data, syncStatus };
    }
  }
  async function connect(message) {
    const config = validateConfig(message.url.trim(), message.key.trim());
    const token = validateSyncToken(message.token);
    if (
      !(await api.permissions.contains({
        origins: [config.url + "/*"],
        data_collection: ["authenticationInfo", "websiteContent"],
      }))
    )
      throw new Error("Allow access to your Supabase project to enable sync.");
    const saved = await read(),
      owner = await syncIdentity(config, token);
    if (
      saved.syncMeta?.owner &&
      /^[0-9a-f]{64}$/.test(saved.syncMeta.owner) &&
      saved.syncMeta.owner !== owner
    )
      throw new Error(
        "This collection is linked to another Supabase project or sync token. Use the original token or a separate Firefox profile.",
      );
    await api.storage.local.set({
      syncAuth: { config, token },
      syncMeta: { ...(saved.syncMeta || EMPTY_REVISION), owner },
    });
    await api.alarms.create("sync", { periodInMinutes: 5, delayInMinutes: 5 });
    return run();
  }
  async function disconnect() {
    const saved = await read();
    await api.storage.local.remove("syncAuth");
    await api.alarms.clear("sync");
    await api.alarms.clear("sync-soon");
    if (saved.syncAuth)
      await api.permissions.remove({
        origins: [saved.syncAuth.config.url + "/*"],
      });
    return {
      data: saved.data,
      syncStatus: await status(
        "Sync disconnected. Local and remote data are retained. Keep your sync token to reconnect.",
        { connected: false },
      ),
    };
  }
  async function info() {
    const s = await read();
    return {
      data: s.data,
      syncStatus: s.syncStatus || {
        connected: false,
        message: "Sync is off. Your data stays in this browser.",
      },
    };
  }
  return { initialize, changed, run, connect, disconnect, info };
}
