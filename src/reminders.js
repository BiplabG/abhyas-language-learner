import { nextReminder } from "./model.js";
export async function notifyPractice(
  api,
  data,
  test = false,
  now = new Date(),
) {
  const due = data.words.filter((w) => new Date(w.card.due) <= now).length;
  // Let Firefox supply its native icon; notification delivery does not depend on SVG decoding.
  return api.notifications.create(test ? "practice-test" : "practice", {
    type: "basic",
    title: "abhyas - language learner",
    message: test
      ? "Your browser notification test. Click to open Practice."
      : due
        ? `Time to practice: ${due} word${due === 1 ? " is" : "s are"} ready to review.`
        : "Time for your daily practice. You’re caught up — collect a few new words!",
  });
}
export async function scheduleReminder(api, data, now = new Date()) {
  await api.alarms.clear("practice");
  if (!data.settings.reminders) {
    delete data.settings.reminderAt;
    return;
  }
  if (!Number.isFinite(data.settings.reminderAt))
    data.settings.reminderAt = nextReminder(data.settings.time, now);
  await api.alarms.create("practice", { when: data.settings.reminderAt });
}
export async function deliverReminder(api, data, now = new Date()) {
  if (!data.settings.reminders) return;
  try {
    await notifyPractice(api, data, false, now);
    delete data.settings.notificationError;
    data.settings.lastReminderAt = now.toISOString();
  } catch (error) {
    data.settings.notificationError =
      error.message || "Firefox could not create the notification.";
  } finally {
    data.settings.reminderAt = nextReminder(data.settings.time, now);
    await scheduleReminder(api, data, now);
  }
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
