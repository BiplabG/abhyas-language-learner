import { validateBackup } from "./import-data.js";
export const EMPTY_REVISION = {
  revision: 0,
  change_id: "00000000-0000-0000-0000-000000000000",
};
export function nextRevision(previous = EMPTY_REVISION, now = Date.now()) {
  return {
    revision: Math.max(now, previous.revision + 1),
    change_id: crypto.randomUUID(),
  };
}
export function compareRevision(a, b) {
  return (
    a.revision - b.revision ||
    (a.change_id > b.change_id ? 1 : a.change_id < b.change_id ? -1 : 0)
  );
}
export function validateConfig(url, key) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Enter your Supabase project URL.");
  }
  if (
    parsed.protocol !== "https:" ||
    !/^([a-z0-9-]+)\.supabase\.co$/.test(parsed.hostname) ||
    parsed.username ||
    parsed.password ||
    parsed.port ||
    parsed.search ||
    parsed.hash ||
    !["", "/"].includes(parsed.pathname)
  )
    throw new Error(
      "Use an HTTPS project URL such as https://your-project.supabase.co.",
    );
  if (!key.startsWith("sb_publishable_")) {
    try {
      const role = JSON.parse(
        atob(key.split(".")[1].replaceAll("-", "+").replaceAll("_", "/")),
      ).role;
      if (role !== "anon") throw new Error();
    } catch {
      throw new Error(
        "Use a publishable key or legacy anon key, never a secret/service-role key.",
      );
    }
  }
  return { url: parsed.origin, key };
}
export function generateSyncToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}
export function validateSyncToken(token) {
  const value = token.trim();
  if (!/^[A-Za-z0-9_-]{43,128}$/.test(value))
    throw new Error(
      "Use a generated sync token, or enter a 43–128 character token containing only letters, numbers, - and _.",
    );
  return value;
}
export async function syncIdentity(config, token) {
  const input = new TextEncoder().encode(
    `${config.url}\n${validateSyncToken(token)}`,
  );
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", input));
  return Array.from(hash, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
export function snapshot(data) {
  return JSON.parse(
    JSON.stringify({
      version: 1,
      lists: data.lists,
      words: data.words,
      reviews: data.reviews,
    }),
  );
}
export function validateRemote(row) {
  if (
    !row ||
    !Number.isSafeInteger(row.revision) ||
    row.revision < 0 ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      row.change_id,
    )
  )
    throw new Error("Remote sync version is invalid. Local data was kept.");
  validateBackup(row.payload);
  return row;
}
async function request(config, path, body) {
  let response;
  try {
    response = await fetch(config.url + path, {
      method: "POST",
      headers: {
        apikey: config.key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error(
      "Could not reach Supabase. Local data was kept; sync will retry.",
    );
  }
  if (!response.ok) {
    const e = new Error(
      response.status === 401 || response.status === 403
        ? "Supabase access denied. Check the publishable key and run the latest SQL setup."
        : `Supabase request failed (${response.status}). Check the SQL setup and project availability.`,
    );
    e.status = response.status;
    throw e;
  }
  return response.json();
}
export async function exchange(config, syncToken, version, data) {
  const payload = validateBackup(snapshot(data));
  if (
    new TextEncoder().encode(JSON.stringify(payload)).length >
    20 * 1024 * 1024
  )
    throw new Error(
      "Sync snapshot exceeds 20 MB. Export a backup and reduce the collection before syncing.",
    );
  const result = await request(config, "/rest/v1/rpc/abhyas_token_exchange", {
    p_sync_token: validateSyncToken(syncToken),
    p_revision: version.revision,
    p_change_id: version.change_id,
    p_payload: payload,
  });
  const row = validateRemote(result?.[0]);
  return row;
}
