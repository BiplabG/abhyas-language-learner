import { fixture } from "./apkg-fixture.js";
import { initialState, addWord, exportWords } from "../src/model.js";
import { chromium } from "@playwright/test";
import { readFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    (process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : undefined),
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1000, height: 900 },
  });
  page.setDefaultTimeout(15000);
  console.log("Browser launched");
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const manifest = JSON.parse(
    await readFile(new URL("../extension/manifest.json", import.meta.url)),
  );
  await page.route("https://extension.test/**", async (route) => {
    const name =
      new URL(route.request().url()).pathname.slice(1) || "index.html";
    let body = await readFile(new URL("../extension/" + name, import.meta.url));
    if (name === "index.html")
      body = Buffer.from(
        body
          .toString()
          .replace(
            '<script src="app.js">',
            '<script src="background.js"></script><script src="app.js">',
          ),
      );
    await route.fulfill({
      body,
      headers: { "Content-Security-Policy": manifest.content_security_policy },
      contentType: name.endsWith(".html")
        ? "text/html"
        : name.endsWith(".css")
          ? "text/css"
          : name.endsWith(".svg")
            ? "image/svg+xml"
            : name.endsWith(".wasm")
              ? "application/wasm"
              : "application/javascript",
    });
  });
  await page.addInitScript(() => {
    let listener,
      store = JSON.parse(localStorage.getItem("test-store") || "{}"),
      change = [];
    window.testTabs = [];
    window.testNotifications = [];
    window.browser = {
      runtime: {
        getURL: (p) => "https://extension.test/" + p,
        onMessage: { addListener: (fn) => (listener = fn) },
        sendMessage: async (m) =>
          structuredClone(await listener(structuredClone(m))),
      },
      storage: {
        local: {
          get: async () => structuredClone(store),
          remove: async (key) => {
            delete store[key];
            localStorage.setItem("test-store", JSON.stringify(store));
          },
          set: async (v) => {
            const old = store.data;
            store = { ...store, ...structuredClone(v) };
            localStorage.setItem("test-store", JSON.stringify(store));
            const changes = Object.fromEntries(
              Object.entries(v).map(([key, value]) => [
                key,
                { newValue: structuredClone(value) },
              ]),
            );
            change.forEach((fn) => fn(changes, "local"));
          },
        },
        onChanged: { addListener: (fn) => change.push(fn) },
      },
      permissions: {
        request: async () => true,
        contains: async () => true,
        remove: async () => true,
      },
      contextMenus: { create: () => {}, onClicked: { addListener: () => {} } },
      alarms: {
        clear: async () => {},
        create: () => {},
        onAlarm: { addListener: () => {} },
      },
      notifications: {
        create: async (id, options) => {
          window.testNotifications.push({ id, ...options });
        },
        onClicked: { addListener: () => {} },
      },
      tabs: {
        create: async (options) => {
          window.testTabs.push(options);
        },
      },
      windows: { create: () => {} },
    };
  });
  await page.goto("https://extension.test/index.html?full=1");
  console.log("Loaded", await page.locator("#status").textContent());
  await page.getByRole("button", { name: "+ Add word", exact: true }).click();
  await page.locator("#word").fill("Guten Morgen");
  await page.locator("#translation").fill("Good morning");
  await page.locator("#details").fill("A friendly greeting.");
  await page.getByRole("button", { name: "Save word", exact: true }).click();
  await page.getByRole("heading", { name: "Guten Morgen" }).waitFor();
  assert.equal(await page.locator("#total").textContent(), "1");
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.locator("#translation").fill("Good morning!");
  await page.getByRole("button", { name: "Save word", exact: true }).click();
  await page.getByText("Good morning!", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Practice", exact: true }).click();
  await page.locator("#practice-size").fill("1");
  await page.locator("#begin-practice").click();
  assert.equal(await page.locator("#practice-metrics").isVisible(), false);
  assert.equal(await page.locator("nav").isVisible(), false);
  await page.getByRole("button", { name: "Show answer" }).click();
  await page.getByRole("button", { name: /^Good / }).click();
  await page.getByText("1 reviewed", { exact: false }).waitFor();
  assert.equal(await page.locator("#today").textContent(), "1");
  await page.getByRole("heading", { name: "Session complete" }).waitFor();
  await page.getByRole("button", { name: "Back to home" }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.locator("#reminders").check();
  await page.locator("#time").fill("18:30");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await page.getByText("Preferences saved.").waitFor();
  await page.locator("#test-notification").click();
  await page.waitForFunction(() => window.testNotifications.length === 1);
  assert.equal(
    await page.evaluate(() => window.testNotifications[0].id),
    "practice-test",
  );
  assert.match(
    await page.locator("#reminder-status").textContent(),
    /Next browser reminder/,
  );
  await page.getByRole("button", { name: "Word lists", exact: true }).click();
  page.once("dialog", (d) => d.accept("German"));
  await page.getByRole("button", { name: "+ List", exact: true }).click();
  await page
    .getByRole("heading", { name: "Your next word belongs here" })
    .waitFor();
  assert.equal(await page.locator("#list option").count(), 2);
  await page.locator("#list").selectOption({ label: "My first words" });
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download", exact: true }).click();
  const file = await downloaded;
  assert.ok(file.suggestedFilename().endsWith(".json"));
  await mkdir("artifacts", { recursive: true });
  await page.screenshot({ path: "artifacts/library.png", fullPage: true });
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page
    .getByRole("heading", { name: "Your next word belongs here" })
    .waitFor();
  assert.equal(await page.locator("#total").textContent(), "0");
  await page.goto("https://extension.test/index.html?capture=bonjour");
  await page.locator("#word-dialog[open]").waitFor();
  assert.equal(await page.locator("#word").inputValue(), "bonjour");
  await page.setViewportSize({ width: 480, height: 740 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  await page.screenshot({ path: "artifacts/capture.png", fullPage: true });
  await page.locator("#close-dialog").click();
  await page.locator("#import-open").click();
  await page.waitForFunction(() => window.testTabs.length > 0);
  const importUrl = await page.evaluate(() => window.testTabs.at(-1).url);
  assert.ok(importUrl.endsWith("?full=1&import=1"));
  assert.equal(
    await page.locator("#import-dialog").evaluate((n) => n.open),
    false,
  );
  await page.goto(importUrl);
  await page.locator("#import-dialog[open]").waitFor();
  await page.locator("#import-close").click();
  for (const modern of [false, true]) {
    const f = await fixture(modern);
    await page.locator("#import-open").click();
    await page.locator("#import-file").setInputFiles({
      name: modern ? "modern.apkg" : "legacy.apkg",
      mimeType: "application/octet-stream",
      buffer: Buffer.from(f.archive),
    });
    await page.locator("#import-mapping:not([hidden])").waitFor();
    await page
      .locator("#map-details")
      .getByLabel("Example", { exact: true })
      .check();
    await page
      .locator("#map-details")
      .getByLabel("Pronunciation", { exact: true })
      .check();
    await page
      .locator("#import-preview")
      .getByText("Hallo", { exact: true })
      .waitFor();
    assert.match(
      await page.locator("#import-preview").textContent(),
      /Hallo Welt!/,
    );
    await page.locator("#import-confirm").click();
    await page
      .locator("#words")
      .getByRole("heading", { name: "Hallo", exact: true })
      .waitFor();
    assert.match(await page.locator("#words").textContent(), /haˈloː/);
  }
  const sample = initialState();
  addWord(sample, {
    word: "bonjour",
    translation: "hello",
    details: "French greeting",
    listId: sample.lists[0].id,
  });
  for (const [format, name] of [
    ["csv", "sample.csv"],
    ["anki", "sample.txt"],
    ["json", "sample.json"],
  ]) {
    await page.locator("#import-open").click();
    await page.locator("#import-file").setInputFiles({
      name,
      mimeType: "text/plain",
      buffer: Buffer.from(exportWords(sample, "", format)),
    });
    await page.locator("#import-confirm:not([disabled])").waitFor();
    await page.locator("#import-confirm").click();
    await page
      .locator("#words")
      .getByRole("heading", { name: "bonjour", exact: true })
      .waitFor();
    assert.match(await page.locator("#words").textContent(), /French greeting/);
  }
  const total = await page.locator("#total").textContent();
  await page.goto("https://extension.test/index.html?full=1");
  await page.waitForFunction(
    (n) => document.querySelector("#total").textContent === n,
    total,
  );
  await page.getByRole("button", { name: "Practice", exact: true }).click();
  await page
    .locator("#practice-metrics")
    .getByText("recall rate", { exact: true })
    .waitFor();
  assert.equal(await page.locator(".activity-day").count(), 14);
  await page.screenshot({
    path: "artifacts/practice-metrics.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Word lists", exact: true }).click();
  await page.locator("#import-open").click();
  await page.locator("#import-file").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await page.waitForFunction(
    () => document.querySelector("#import-error").textContent.length > 0,
  );
  assert.equal(await page.locator("#import-confirm").isDisabled(), true);
  await page.locator("#import-close").click();
  assert.equal(await page.locator("#total").textContent(), total);
  await page.evaluate(() =>
    window.browser.runtime.sendMessage({
      type: "importRows",
      name: "Pagination",
      rows: Array.from({ length: 45 }, (_, i) => ({
        word: `word ${i}`,
        translation: `translation ${i}`,
        details: "",
      })),
    }),
  );
  await page.locator("#list").selectOption({ label: "Pagination" });
  assert.equal(await page.locator("#words .word-card").count(), 20);
  await page
    .getByRole("button", { name: "Show more (20 of 45)", exact: true })
    .click();
  assert.equal(await page.locator("#words .word-card").count(), 40);
  await page
    .getByRole("button", { name: "Show more (40 of 45)", exact: true })
    .click();
  assert.equal(await page.locator("#words .word-card").count(), 45);
  await page.locator("#search").fill("word");
  assert.equal(await page.locator("#words .word-card").count(), 20);
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("button", { name: "Word lists", exact: true }).click();
  await page.getByRole("button", { name: "Practice", exact: true }).click();
  await page.locator("#practice-list").selectOption({ label: "Pagination" });
  await page.locator("#practice-size").fill("2");
  await page.locator("#begin-practice").click();
  await page.getByRole("button", { name: "Show answer" }).waitFor();
  assert.match(
    await page.locator("#session-count").textContent(),
    /2 remaining/,
  );
  await page.screenshot({
    path: "artifacts/focused-practice.png",
    fullPage: true,
  });
  await page.locator("#end-practice").click();
  await page.locator("#home-practice").click();
  await page.getByRole("button", { name: "Show answer" }).waitFor();
  assert.match(await page.locator("#session-count").textContent(), /2 remaining/);
  await page.locator("#end-practice").click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  let remote = null;
  const syncUser = "11111111-1111-4111-8111-111111111111";
  await page.route("https://test-project.supabase.co/**", async (route) => {
    const req = route.request(),
      headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization,apikey,content-type",
      };
    if (req.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers });
      return;
    }
    assert.equal(req.headers().authorization, undefined);
    const body = req.postDataJSON();
    assert.equal(body.p_sync_token, "a".repeat(43));
    if (!remote || body.p_revision > remote.revision)
      remote = {
        revision: body.p_revision,
        change_id: body.p_change_id,
        user_id: syncUser,
        payload: body.p_payload,
      };
    await route.fulfill({ json: [remote], headers });
  });
  await page.locator("#sync-url").fill("https://test-project.supabase.co");
  await page.locator("#sync-key").fill("sb_publishable_example");
  await page.locator("#sync-generate").click();
  assert.match(
    await page.locator("#sync-token").inputValue(),
    /^[A-Za-z0-9_-]{43}$/,
  );
  await page.locator("#sync-token").fill("a".repeat(43));
  await page.locator("#sync-connect").click();
  await page.waitForFunction(() =>
    document
      .querySelector("#sync-status")
      .textContent.includes("Remote is up to date"),
  );
  assert.ok(remote.payload.words.length > 0);
  await page.getByText(/Connected · token ending/).waitFor();
  const connectedStore = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("test-store")),
  );
  assert.equal(
    connectedStore.syncAuth.config.url,
    "https://test-project.supabase.co",
  );
  assert.equal(connectedStore.syncAuth.config.key, "sb_publishable_example");
  assert.equal(connectedStore.syncAuth.token, "a".repeat(43));
  await page.locator("#sync-show-saved").click();
  assert.equal(
    await page.locator("#sync-saved-token").inputValue(),
    "a".repeat(43),
  );
  remote = JSON.parse(JSON.stringify(remote));
  remote.revision += 10000;
  remote.change_id = syncUser;
  remote.payload.words[0].word = "remote revision word";
  await page.locator("#sync-now").click();
  await page.waitForFunction(() =>
    document
      .querySelector("#sync-status")
      .textContent.includes("Downloaded newer remote"),
  );
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("test-store")),
  );
  assert.equal(stored.data.words[0].word, "remote revision word");
  assert.notEqual(stored.syncBackup.data.words[0].word, "remote revision word");
  const recovery = page.waitForEvent("download");
  await page.locator("#sync-recovery").click();
  assert.equal((await recovery).suggestedFilename(), "abhyas-before-sync.json");
  await page.locator("#sync-disconnect").click();
  await page.waitForFunction(() =>
    document
      .querySelector("#sync-status")
      .textContent.includes("Sync disconnected"),
  );
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("test-store")).syncAuth,
    ),
    undefined,
  );
  assert.equal(await page.locator("#sync-saved-token").inputValue(), "");
  assert.equal(await page.locator("#sync-saved-token").getAttribute("type"), "password");
  assert.equal(await page.locator("#sync-token").getAttribute("type"), "password");
  const privacyLink = page.getByRole("link", { name: "Privacy notice" });
  assert.equal(await privacyLink.getAttribute("href"), "privacy.html");
  assert.deepEqual(errors, []);
  console.log(
    "UI passed: CRUD, FSRS, metrics, storage reload, reminders, export, capture, imports, shared-token Supabase sync/pull/recovery/disconnect; no page errors.",
  );
} finally {
  await browser.close();
}
