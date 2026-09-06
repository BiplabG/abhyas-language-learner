import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, addWord } from "../src/model.js";
import {
  EMPTY_REVISION,
  nextRevision,
  compareRevision,
  validateConfig,
  generateSyncToken,
  validateSyncToken,
  syncIdentity,
  snapshot,
} from "../src/sync.js";
import { createSyncService } from "../src/sync-service.js";
// Materialize Node 22's lazy fetch accessor before node:test mocks it.
globalThis.fetch = globalThis.fetch;
const userId = "11111111-1111-4111-8111-111111111111";
const config = {
  url: "https://test-project.supabase.co",
  key: "sb_publishable_example",
};
const token = "a".repeat(43);
function harness() {
  const data = initialState();
  addWord(data, {
    word: "hola",
    translation: "hello",
    details: "",
    listId: data.lists[0].id,
  });
  const store = {
    data: JSON.parse(JSON.stringify(data)),
    syncMeta: {
      revision: 100,
      change_id: "22222222-2222-4222-8222-222222222222",
    },
    syncAuth: {
      config,
      token,
    },
  };
  const api = {
    storage: {
      local: {
        get: async () => structuredClone(store),
        set: async (values) => Object.assign(store, structuredClone(values)),
        remove: async (key) => delete store[key],
      },
    },
    alarms: { create: async () => {}, clear: async () => {} },
    permissions: { contains: async () => true, remove: async () => {} },
  };
  return { store, api, service: createSyncService(api) };
}
function response(body, status = 200) {
  return {
    ok: status === 200,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}
test("versions are monotonic and ties resolve deterministically", () => {
  const a = nextRevision({ revision: 1000 }, 500);
  assert.equal(a.revision, 1001);
  assert.ok(compareRevision(a, EMPTY_REVISION) > 0);
  assert.ok(
    compareRevision(
      { revision: 1, change_id: "b" },
      { revision: 1, change_id: "a" },
    ) > 0,
  );
});
test("configuration rejects insecure origins and privileged keys", () => {
  assert.deepEqual(validateConfig(config.url + "/", config.key), config);
  for (const url of [
    "http://test.supabase.co",
    "https://test.supabase.co.evil.com",
    "https://user:password@test.supabase.co",
    "https://test.supabase.co/path",
  ])
    assert.throws(() => validateConfig(url, config.key));
  for (const key of [
    "sb_secret_bad",
    "bad",
    `x.${btoa(JSON.stringify({ role: "service_role" }))}.x`,
  ])
    assert.throws(() => validateConfig(config.url, key));
});
test("generated sync tokens are strong, URL-safe, and identify shared instances", async () => {
  const generated = generateSyncToken();
  assert.equal(generated.length, 43);
  assert.equal(validateSyncToken(generated), generated);
  assert.equal(
    await syncIdentity(config, generated),
    await syncIdentity(config, generated),
  );
  assert.notEqual(
    await syncIdentity(config, generated),
    await syncIdentity(config, generateSyncToken()),
  );
  for (const invalid of ["short", "a".repeat(42), `${"a".repeat(42)}!`])
    assert.throws(() => validateSyncToken(invalid));
});
test("connect saves project details and the shared sync token", async (t) => {
  const { store, service } = harness();
  delete store.syncAuth;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.match(url, /abhyas_token_exchange$/);
    assert.equal(options.headers.Authorization, undefined);
    const body = JSON.parse(options.body);
    assert.equal(body.p_sync_token, token);
    return response([
      {
        revision: body.p_revision,
        change_id: body.p_change_id,
        payload: body.p_payload,
      },
    ]);
  });
  await service.connect({ ...config, token });
  assert.deepEqual(store.syncAuth.config, config);
  assert.equal(store.syncAuth.token, token);
  assert.notEqual(store.syncMeta.owner, token);
});
test("push sends the sync token only in the RPC body and excludes it from snapshots", async (t) => {
  const { store, service } = harness();
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.match(url, /abhyas_token_exchange$/);
    assert.equal(options.headers.Authorization, undefined);
    const body = JSON.parse(options.body);
    assert.equal(body.p_sync_token, token);
    assert.equal(body.p_payload.settings, undefined);
    assert.equal(JSON.stringify(body.p_payload).includes(token), false);
    return response([
      { ...store.syncMeta, user_id: userId, payload: body.p_payload },
    ]);
  });
  const result = await service.run();
  assert.equal(result.syncStatus.error, undefined);
  assert.equal(store.data.words[0].word, "hola");
});
test("newer remote snapshot replaces local lists and preserves a recovery copy and device preferences", async (t) => {
  const { store, service } = harness();
  const remote = initialState();
  addWord(remote, {
    word: "bonjour",
    translation: "hello",
    details: "",
    listId: remote.lists[0].id,
  });
  t.mock.method(globalThis, "fetch", async () =>
    response([
      {
        revision: 200,
        change_id: userId,
        user_id: userId,
        payload: snapshot(remote),
      },
    ]),
  );
  await service.run();
  assert.equal(store.data.words[0].word, "bonjour");
  assert.equal(store.syncBackup.data.words[0].word, "hola");
  assert.equal(store.data.settings.time, "19:00");
  assert.equal(store.syncMeta.revision, 200);
});
test("invalid remote or network error never replaces local data", async (t) => {
  const { store, service } = harness(),
    before = JSON.stringify(store.data);
  t.mock.method(globalThis, "fetch", async () =>
    response([
      {
        revision: 200,
        change_id: userId,
        user_id: userId,
        payload: { version: 999 },
      },
    ]),
  );
  await service.run();
  assert.equal(JSON.stringify(store.data), before);
  assert.equal(store.syncStatus.error, true);
  globalThis.fetch = async () => {
    throw new Error("offline");
  };
  await service.run();
  assert.equal(JSON.stringify(store.data), before);
});
test("a missing RPC reports Supabase's diagnostic without replacing local data", async (t) => {
  const { store, service } = harness(),
    before = JSON.stringify(store.data);
  t.mock.method(globalThis, "fetch", async () =>
    response(
      {
        code: "PGRST202",
        message:
          "Could not find the function public.abhyas_token_exchange in the schema cache",
      },
      404,
    ),
  );
  const result = await service.run();
  assert.equal(JSON.stringify(store.data), before);
  assert.match(result.syncStatus.message, /PGRST202/);
  assert.match(result.syncStatus.message, /supabase\/setup\.sql/);
});
test("disconnect clears saved project details and token but keeps vocabulary", async () => {
  const { store, service } = harness();
  await service.disconnect();
  assert.equal(store.syncAuth, undefined);
  assert.equal(store.data.words.length, 1);
});
test("local changes are persisted with their version atomically and retain account ownership", async () => {
  const { store, service } = harness();
  store.syncMeta.owner = "owner";
  store.data.words[0].word = "changed";
  await service.changed(store.data);
  assert.ok(store.syncMeta.revision > 100);
  assert.equal(store.syncMeta.owner, "owner");
  assert.equal(store.data.words[0].word, "changed");
});
test("a different token cannot silently upload a linked collection", async () => {
  const { store, service } = harness();
  store.syncMeta.owner = "b".repeat(64);
  await assert.rejects(
    service.connect({ ...config, token }),
    /another Supabase project or sync token/,
  );
  assert.equal(store.syncAuth.token, token);
});
