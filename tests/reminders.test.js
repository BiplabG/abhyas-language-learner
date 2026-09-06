import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState } from "../src/model.js";
import {
  scheduleReminder,
  deliverReminder,
  restoreReminder,
  notifyPractice,
  nextScheduledReminder,
} from "../src/reminders.js";
function fixture() {
  const calls = { alarms: [], notifications: [] };
  const api = {
    alarms: {
      clear: async () => {},
      create: async (name, options) => calls.alarms.push({ name, ...options }),
    },
    notifications: {
      create: async (id, options) =>
        calls.notifications.push({ id, ...options }),
    },
  };
  const data = initialState();
  data.settings = { reminders: true, time: "19:00" };
  return { api, data, calls };
}
test("daily browser notification also appears when no words are due", async () => {
  const { api, data, calls } = fixture();
  await deliverReminder(api, data, new Date(2026, 8, 6, 19));
  assert.equal(calls.notifications.length, 1);
  assert.match(calls.notifications[0].message, /caught up/);
  assert.equal(new Date(data.settings.reminderAt).getDate(), 7);
});
test("due words appear in the browser notification", async () => {
  const { api, data, calls } = fixture();
  data.words = [{ card: { due: "2026-01-01" } }];
  await notifyPractice(api, data, false, new Date(2026, 8, 6));
  assert.match(calls.notifications[0].message, /1 word is/);
});
test("restart catches up once and retains a future reminder timestamp", async () => {
  const { api, data, calls } = fixture(),
    now = new Date(2026, 8, 6, 20);
  data.settings.reminderAt = new Date(2026, 8, 5, 19).getTime();
  await restoreReminder(api, data, now);
  const next = data.settings.reminderAt;
  await restoreReminder(api, data, now);
  assert.equal(calls.notifications.length, 1);
  assert.equal(data.settings.reminderAt, next);
  assert.equal(calls.alarms.at(-1).when, next);
});
test("notification errors remain visible and do not stop tomorrow’s reminder", async () => {
  const { api, data, calls } = fixture();
  api.notifications.create = async () => {
    throw new Error("Notifications unavailable");
  };
  await deliverReminder(api, data, new Date(2026, 8, 6, 19));
  assert.equal(data.settings.notificationError, "Notifications unavailable");
  assert.equal(calls.alarms.length, 1);
});
test("disabled reminders stop scheduling; a test is independent of preferences", async () => {
  const { api, data, calls } = fixture();
  data.settings.reminders = false;
  await scheduleReminder(api, data);
  await deliverReminder(api, data);
  assert.equal(calls.notifications.length, 0);
  assert.equal(calls.alarms.length, 0);
  await notifyPractice(api, data, true);
  assert.equal(calls.notifications[0].id, "practice-test");
});
test("multiple daily times schedule the nearest future reminder", async () => {
  const { api, data, calls } = fixture();
  data.settings.reminderTimes = ["09:00", "19:00"];
  const now = new Date(2026, 8, 6, 10);
  data.settings.reminderAt = nextScheduledReminder(data.settings, now);
  await scheduleReminder(api, data, now);
  assert.equal(new Date(data.settings.reminderAt).getHours(), 19);
  assert.equal(calls.alarms.at(-1).when, data.settings.reminderAt);
  await deliverReminder(api, data, new Date(2026, 8, 6, 19));
  assert.equal(new Date(data.settings.reminderAt).getDate(), 7);
  assert.equal(new Date(data.settings.reminderAt).getHours(), 9);
});
