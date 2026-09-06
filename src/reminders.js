import { nextReminder } from "./model.js";

export function reminderTimes(settings) {
  const times = Array.isArray(settings.reminderTimes)
    ? settings.reminderTimes
    : [settings.time || "19:00"];
  const valid = [
    ...new Set(times.filter((time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time))),
  ].sort();
  return valid.length ? valid : ["19:00"];
}

export function nextScheduledReminder(settings, now = new Date()) {
  const times = reminderTimes(settings);
  return Math.min(...times.map((time) => nextReminder(time, now)));
}

async function setReminderBadge(api, active) {
  if (!api.browserAction) return;
  await api.browserAction.setBadgeBackgroundColor({ color: "#a45c4f" });
  await api.browserAction.setBadgeText({ text: active ? "!" : "" });
  await api.browserAction.setTitle({
    title: active
      ? "abhyas - language learner: practice reminder"
      : "abhyas - language learner",
  });
}
export async function notifyPractice(
  api,
  data,
  test = false,
  now = new Date(),
) {
  const due = data.words.filter((w) => new Date(w.card.due) <= now).length;
  // Let Firefox supply its native icon; notification delivery does not depend on SVG decoding.
  const id = test ? "practice-test" : "practice";
  console.info("[abhyas reminders] Creating notification", {
    id,
    test,
    dueWords: due,
    at: now.toISOString(),
  });
  try {
    const created = await api.notifications.create(id, {
      type: "basic",
      title: "abhyas - language learner",
      message: test
        ? "Your browser notification test. Click to open Practice."
        : due
          ? `Time to practice: ${due} word${due === 1 ? " is" : "s are"} ready to review.`
          : "Time for your daily practice. You’re caught up — collect a few new words!",
    });
    console.info("[abhyas reminders] Notification API request succeeded", {
      id,
      created,
    });
    return created;
  } catch (error) {
    console.error("[abhyas reminders] Notification API request failed", {
      id,
      message: error.message || String(error),
    });
    throw error;
  }
}
export async function scheduleReminder(api, data, now = new Date()) {
  await api.alarms.clear("practice");
  if (!data.settings.reminders) {
    delete data.settings.reminderAt;
    await setReminderBadge(api, false);
    return;
  }
  data.settings.reminderTimes = reminderTimes(data.settings);
  data.settings.time = data.settings.reminderTimes[0];
  if (!Number.isFinite(data.settings.reminderAt))
    data.settings.reminderAt = nextScheduledReminder(data.settings, now);
  await api.alarms.create("practice", { when: data.settings.reminderAt });
}
export async function deliverReminder(api, data, now = new Date()) {
  if (!data.settings.reminders) return;
  try {
    await notifyPractice(api, data, false, now);
    await setReminderBadge(api, true);
    delete data.settings.notificationError;
    data.settings.lastReminderAt = now.toISOString();
  } catch (error) {
    data.settings.notificationError =
      error.message || "Firefox could not create the notification.";
  } finally {
    data.settings.reminderAt = nextScheduledReminder(data.settings, now);
    await scheduleReminder(api, data, now);
  }
}

export async function acknowledgeReminder(api) {
  await setReminderBadge(api, false);
}
export async function restoreReminder(api, data, now = new Date()) {
  if (
    data.settings.reminders &&
    Number.isFinite(data.settings.reminderAt) &&
    data.settings.reminderAt <= now.getTime()
  )
    await deliverReminder(api, data, now);
  else await scheduleReminder(api, data, now);
}
