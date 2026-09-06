import { createSyncService } from "./sync-service.js";
import {
  notifyPractice,
  scheduleReminder,
  deliverReminder,
  restoreReminder,
} from "./reminders.js";
import { importBackup, importRows } from "./import-data.js";
import { initialState, addWord, reviewWord, nextReminder } from "./model.js";
let queue = Promise.resolve();
const sync = createSyncService(browser);
const dataActions = new Set([
  "importBackup",
  "importRows",
  "saveWord",
  "deleteWord",
  "saveList",
  "deleteList",
  "review",
]);
async function state() {
  const saved = await browser.storage.local.get("data");
  return saved.data || initialState();
}
async function handle(message) {
  if (message.type === "syncConnect") return sync.connect(message);
  if (message.type === "syncNow") return sync.run();
  if (message.type === "syncDisconnect") return sync.disconnect();
  if (message.type === "syncInfo") return sync.info();
  if (message.type === "syncCredentials") {
    const saved = await browser.storage.local.get("syncAuth");
    return { token: saved.syncAuth?.token || "" };
  }
  if (message.type === "syncBackup")
    return {
      backup: (await browser.storage.local.get("syncBackup")).syncBackup,
    };
  const data = await state();
  let imported;
  switch (message.type) {
    case "importBackup":
      imported = importBackup(data, message.backup);
      break;
    case "importRows":
      imported = importRows(data, message);
      break;
    case "get":
      break;
    case "saveWord":
      addWord(data, message.word);
      break;
    case "deleteWord":
      data.words = data.words.filter((w) => w.id !== message.id);
      break;
    case "saveList": {
      const name = message.name.trim();
      if (!name) throw new Error("Enter a list name.");
      if (message.id) {
        const list = data.lists.find((l) => l.id === message.id);
        if (!list) throw new Error("List no longer exists.");
        list.name = name;
      } else data.lists.push({ id: crypto.randomUUID(), name });
      break;
    }
    case "deleteList":
      if (data.lists.length === 1) throw new Error("Keep at least one list.");
      data.lists = data.lists.filter((l) => l.id !== message.id);
      data.words = data.words.filter((w) => w.listId !== message.id);
      break;
    case "review":
      reviewWord(data, message.id, message.rating, message.expectedReps);
      break;
    case "testNotification":
      await notifyPractice(browser, data, true);
      break;
    case "practiceSize":
      if (
        !Number.isInteger(message.size) ||
        message.size < 1 ||
        message.size > 100
      )
        throw new Error("Choose 1 to 100 words per session.");
      data.settings.practiceSize = message.size;
      break;
    case "settings":
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(message.time))
        throw new Error("Choose a valid time.");
      data.settings = {
        ...data.settings,
        reminders: !!message.reminders,
        time: message.time,
        reminderAt: nextReminder(message.time),
      };
      await scheduleReminder(browser, data);
      break;
    default:
      throw new Error("Unknown action.");
  }
  if (dataActions.has(message.type)) await sync.changed(data);
  else await browser.storage.local.set({ data });
  return { data, imported };
}
browser.runtime.onMessage.addListener((message) => {
  const result = queue.then(() => handle(message));
  queue = result.catch(() => {});
  return result.catch((error) => ({ error: error.message }));
});
browser.contextMenus.create({
  id: "add-word",
  title: "Add to abhyas - language learner",
  contexts: ["selection"],
});
browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "add-word")
    browser.windows.create({
      url:
        browser.runtime.getURL("index.html") +
        "?capture=" +
        encodeURIComponent(info.selectionText || ""),
      type: "popup",
      width: 520,
      height: 740,
    });
});
browser.alarms.onAlarm.addListener((alarm) => {
  if (["sync", "sync-soon"].includes(alarm.name)) {
    queue = queue.then(() => sync.run()).catch(console.error);
    return;
  }
  if (alarm.name !== "practice") return;
  const result = queue.then(async () => {
    const data = await state();
    await deliverReminder(browser, data);
    await browser.storage.local.set({ data });
  });
  queue = result.catch(console.error);
});
browser.notifications.onClicked.addListener((id) => {
  if (id !== "practice" && id !== "practice-test") return;
  browser.tabs.create({
    url: browser.runtime.getURL("index.html") + "?full=1&practice=1",
  });
});
// Persist the intended reminder time: browser alarms themselves disappear on restart.
queue = queue
  .then(async () => {
    const data = await state();
    await restoreReminder(browser, data);
    await browser.storage.local.set({ data });
    await sync.initialize(data);
    await sync.run();
  })
  .catch(console.error);
