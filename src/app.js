import { setupSyncUI } from "./sync-ui.js";
import { shuffleNewWords } from "./practice-order.js";
import { practiceMetrics } from "./metrics.js";
import { setupImport } from "./import-ui.js";
import { exportWords, hydrate, scheduler } from "./model.js";
const $ = (s) => document.querySelector(s);
const el = (tag, text, cls) => {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  if (cls) n.className = cls;
  return n;
};
let data,
  selected = "",
  current = null,
  revealed = false,
  sessionCount = 0,
  view = "library",
  busy = false;
let session = null;
let visibleWords = 20;
const params = new URLSearchParams(location.search);
if (location.search || window.innerWidth > 600)
  document.body.classList.add("full");
function status(text, error = false) {
  $("#status").textContent = text;
  $("#status").classList.toggle("error", error);
}
async function send(message) {
  const result = await browser.runtime.sendMessage(message);
  if (result.error) throw new Error(result.error);
  data = result.data;
  return data;
}
async function action(message, success) {
  try {
    await send(message);
    render();
    if (success) status(success);
    return true;
  } catch (e) {
    status(e.message, true);
    return false;
  }
}
function options(select, all = false, value = select.value) {
  select.replaceChildren();
  if (all) select.add(new Option("All lists", ""));
  data.lists.forEach((l) => select.add(new Option(l.name, l.id)));
  if ([...select.options].some((o) => o.value === value)) select.value = value;
}
function show(name) {
  view = name;
  document.body.classList.toggle(
    "practicing",
    name === "practice" && !!session,
  );
  document.querySelectorAll(".view").forEach((n) => (n.hidden = n.id !== name));
  document
    .querySelectorAll("nav button")
    .forEach((n) => n.classList.toggle("active", n.dataset.view === name));
  if (name === "practice") renderReview();
}
function render() {
  if (!data.lists.some((l) => l.id === selected)) selected = data.lists[0].id;
  options($("#list"), false, selected);
  options($("#practice-list"), true, data.settings.practiceListId || "");
  if (document.activeElement !== $("#practice-size"))
    $("#practice-size").value = data.settings.practiceSize || 10;
  $("#total").textContent = data.words.length;
  $("#due").textContent = data.words.filter(
    (w) => new Date(w.card.due) <= new Date(),
  ).length;
  $("#today").textContent = data.reviews.filter(
    (r) => new Date(r.at).toDateString() === new Date().toDateString(),
  ).length;
  renderReminderTimes();
  if (document.activeElement !== $("#reminders"))
    $("#reminders").checked = data.settings.reminders;
  $("#reminder-status").textContent = data.settings.notificationError
    ? `Notification error: ${data.settings.notificationError}`
    : data.settings.reminders && data.settings.reminderAt
      ? `Next browser reminder: ${new Date(data.settings.reminderAt).toLocaleString()} (${(data.settings.reminderTimes || [data.settings.time]).join(", ")} daily)`
      : "Daily reminders are off.";
  renderWords();
  if (view === "practice") renderReview();
}
function renderWords() {
  const query = $("#search").value.toLocaleLowerCase();
  const words = data.words.filter(
    (w) =>
      w.listId === selected &&
      [w.word, w.translation, w.details]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query),
  );
  const container = $("#words");
  container.replaceChildren();
  if (!words.length) {
    const empty = el("div", undefined, "empty");
    empty.append(
      el("h2", query ? "No matching words" : "Your next word belongs here"),
      el(
        "p",
        query
          ? "Try another search."
          : "Add a word, or select text on a page and right-click to capture it.",
      ),
    );
    container.append(empty);
    return;
  }
  for (const w of words.slice(0, visibleWords)) {
    const card = el("article", undefined, "word-card"),
      copy = el("div", undefined, "word-copy");
    copy.append(el("h3", w.word), el("p", w.translation, "translation"));
    if (w.details) copy.append(el("p", w.details, "details"));
    copy.append(
      el(
        "span",
        w.card.reps === 0
          ? "New word"
          : new Date(w.card.due) <= new Date()
            ? "Ready to review"
            : "Next: " + new Date(w.card.due).toLocaleDateString(),
        "badge",
      ),
    );
    const actions = el("div", undefined, "card-actions");
    for (const [text, fn] of [
      ["Edit", () => openWord(w)],
      [
        "Delete",
        async () => {
          if (confirm(`Delete “${w.word}”?`))
            await action({ type: "deleteWord", id: w.id }, "Word deleted.");
        },
      ],
    ]) {
      const b = el("button", text, "quiet");
      b.addEventListener("click", fn);
      actions.append(b);
    }
    card.append(copy, actions);
    container.append(card);
  }
  if (words.length > visibleWords) {
    const more = el(
      "button",
      `Show more (${visibleWords} of ${words.length})`,
      "quiet",
    );
    more.onclick = () => {
      visibleWords += 20;
      renderWords();
    };
    container.append(more);
  }
}
function openWord(w = {}) {
  $("#word-id").value = w.id || "";
  $("#word").value = w.word || "";
  $("#translation").value = w.translation || "";
  $("#details").value = w.details || "";
  options($("#word-list"), false, w.listId || selected);
  $("#form-title").textContent = w.id ? "Edit word" : "Plant a new word";
  $("#form-error").textContent = "";
  $("#word-dialog").showModal();
  (w.word && !w.id ? $("#translation") : $("#word")).focus();
}
function interval(date) {
  const minutes = Math.max(1, Math.round((date - new Date()) / 60000));
  return minutes < 60
    ? `${minutes}m`
    : minutes < 1440
      ? `${Math.round(minutes / 60)}h`
      : `${Math.round(minutes / 1440)}d`;
}
function renderReview() {
  const list = $("#practice-list").value;
  renderMetrics(list);
  document.body.classList.toggle("practicing", !!session);
  $("#practice-setup").hidden = !!session;
  $("#practice-metrics").hidden = !!session;
  $("#session-toolbar").hidden = !session;
  const host = $("#review");
  host.replaceChildren();
  if (!session) return;
  session.queue = session.queue.filter((entry) =>
    data.words.some((w) => w.id === entry.id && w.card.reps === entry.reps),
  );
  const old = current;
  current = data.words.find((w) => w.id === session.queue[0]?.id) || null;
  if (current?.id !== old?.id) revealed = false;
  $("#session-count").textContent =
    `${sessionCount} reviewed · ${session.queue.length} remaining · ${session.total} words in session`;
  if (!current) {
    const done = el("div", undefined, "review-card");
    done.append(
      el("h2", session.total ? "Session complete" : "You’re all caught up"),
      el("p", `${sessionCount} words reviewed. Your progress is saved.`),
    );
    const skipped = session.total - sessionCount;
    if (skipped)
      done.append(
        el(
          "p",
          `${skipped} words were removed or reviewed in another window.`,
          "muted",
        ),
      );
    const back = el("button", "Back to home");
    back.onclick = () => endSession();
    done.append(back);
    host.append(done);
    return;
  }
  const card = el("div", undefined, "review-card");
  card.append(
    el("span", "RECALL THE ENGLISH TRANSLATION", "eyebrow"),
    el("h2", current.word),
  );
  if (!revealed) {
    const b = el("button", "Show answer");
    b.onclick = () => {
      revealed = true;
      renderReview();
    };
    card.append(b);
  } else {
    const answer = el("div", undefined, "answer");
    answer.append(el("strong", current.translation));
    if (current.details) answer.append(el("p", current.details, "muted"));
    card.append(answer);
    const ratings = el("div", undefined, "ratings");
    const preview = scheduler.repeat(hydrate(current.card), new Date());
    ["Again", "Hard", "Good", "Easy"].forEach((label, i) => {
      const b = el("button", label);
      b.append(el("small", interval(preview[i + 1].card.due)));
      b.disabled = busy;
      b.onclick = async () => {
        if (busy) return;
        busy = true;
        const id = current.id,
          expectedReps = current.card.reps;
        ratings.querySelectorAll("button").forEach((n) => (n.disabled = true));
        try {
          await send({ type: "review", id, rating: i + 1, expectedReps });
          sessionCount++;
          session.queue = session.queue.filter((entry) => entry.id !== id);
          current = null;
          revealed = false;
          render();
        } catch (e) {
          status(e.message, true);
          await action({ type: "get" });
        } finally {
          busy = false;
          renderReview();
        }
      };
      ratings.append(b);
    });
    card.append(ratings);
  }
  host.append(card);
}
function download(format, all = false) {
  const content = exportWords(data, all ? "" : selected, format);
  const blob = new Blob([content], {
      type:
        format === "json"
          ? "application/json"
          : format === "csv"
            ? "text/csv;charset=utf-8"
            : "text/plain;charset=utf-8",
    }),
    url = URL.createObjectURL(blob);
  const a = el("a");
  a.href = url;
  a.download = `abhyas-language-learner-${all ? "backup" : data.lists.find((l) => l.id === selected).name.replace(/[^a-z0-9_-]/gi, "_")}.${format === "anki" ? "txt" : format}`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  status("Export downloaded.");
}
$("#list").onchange = () => {
  selected = $("#list").value;
  visibleWords = 20;
  renderWords();
};
$("#search").oninput = () => {
  visibleWords = 20;
  renderWords();
};
$("#practice-list").onchange = () => {
  current = null;
  revealed = false;
  action({ type: "practiceList", listId: $("#practice-list").value });
  renderReview();
};
$("nav").onclick = (e) => {
  if (e.target.dataset.view) show(e.target.dataset.view);
};
$("#add").onclick = () => openWord();
$("#close-dialog").onclick = () => $("#word-dialog").close();
$("#word-form").onsubmit = async (e) => {
  e.preventDefault();
  const button = e.submitter;
  button.disabled = true;
  try {
    await send({
      type: "saveWord",
      word: {
        id: $("#word-id").value,
        word: $("#word").value,
        translation: $("#translation").value,
        details: $("#details").value,
        listId: $("#word-list").value,
      },
    });
    selected = $("#word-list").value;
    $("#word-dialog").close();
    render();
    status("Word saved.");
  } catch (err) {
    $("#form-error").textContent = err.message;
  } finally {
    button.disabled = false;
  }
};
$("#new-list").onclick = async () => {
  const name = prompt("Name your new word list:");
  if (name && (await action({ type: "saveList", name }))) {
    selected = data.lists.at(-1).id;
    render();
  }
};
$("#rename-list").onclick = () => {
  const name = prompt(
    "Rename this list:",
    data.lists.find((l) => l.id === selected).name,
  );
  if (name) action({ type: "saveList", id: selected, name });
};
$("#delete-list").onclick = () => {
  if (confirm("Delete this list and every word in it? This cannot be undone."))
    action({ type: "deleteList", id: selected });
};
$("#settings-form").onsubmit = (e) => {
  e.preventDefault();
  action(
    {
      type: "settings",
      reminders: $("#reminders").checked,
      times: [...document.querySelectorAll(".reminder-time")].map(
        (input) => input.value,
      ),
    },
    "Preferences saved.",
  );
};
$("#test-notification").onclick = async () => {
  const button = $("#test-notification");
  button.disabled = true;
  await action(
    { type: "testNotification" },
    "Notification requested from Firefox. If it is not visible, check Firefox notifications in your system settings and Do Not Disturb.",
  );
  setTimeout(() => {
    button.disabled = false;
  }, 5000);
};
$("#export").onclick = () => download($("#format").value);
$("#backup").onclick = () => download("json", true);
$("#expand").onclick = () =>
  browser.tabs
    .create({ url: browser.runtime.getURL("index.html") + "?full=1" })
    .then(() => {
      if (!document.body.classList.contains("full")) window.close();
    });
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.data?.newValue) {
    data = changes.data.newValue;
    render();
  }
});
(async () => {
  try {
    await send({ type: "get" });
    render();
    if (params.has("capture")) openWord({ word: params.get("capture") });
    if (params.has("practice")) show("practice");
    if (params.has("settings")) show("settings");
    if (params.has("import")) $("#import-open").click();
  } catch (e) {
    status("Could not load your words: " + e.message, true);
  }
})();
setInterval(() => {
  if (data && !busy && !$("#word-dialog").open) render();
}, 30000);

function renderMetrics(list) {
  const m = practiceMetrics(data, list),
    host = $("#practice-metrics");
  host.replaceChildren();
  const stats = el("div", undefined, "metric-grid");
  for (const [value, label] of [
    [m.total, "total reviews"],
    [m.recall === null ? "—" : m.recall + "%", "recall rate"],
    [m.streak, "day streak"],
  ]) {
    const item = el("div");
    item.append(el("strong", String(value)), el("span", label));
    stats.append(item);
  }
  host.append(
    stats,
    el(
      "p",
      "Recall rate = Hard, Good, or Easy ratings as a share of all reviews in this selection.",
      "muted",
    ),
  );
  const ratings = el("div", undefined, "rating-summary");
  ["Again", "Hard", "Good", "Easy"].forEach((name, i) =>
    ratings.append(el("span", `${name}: ${m.ratings[i]}`)),
  );
  host.append(ratings);
  const chart = el("div", undefined, "activity-chart");
  chart.setAttribute("aria-label", "Review activity over the last 14 days");
  const max = Math.max(1, ...m.days.map((d) => d.count));
  for (const day of m.days) {
    const col = el("div", undefined, "activity-day");
    col.title = `${day.label}: ${day.count} reviews`;
    col.setAttribute("aria-label", col.title);
    const bar = el("div", undefined, "activity-bar");
    bar.style.height = `${Math.max(3, (day.count / max) * 60)}px`;
    col.append(el("small", String(day.count)), bar);
    chart.append(col);
  }
  host.append(
    el("h3", "Last 14 days"),
    chart,
    el("p", `${m.days[0].label} – ${m.days.at(-1).label}`, "muted"),
    el(
      "p",
      `${m.new} new · ${m.learning} learning / relearning · ${m.review} in review`,
      "muted",
    ),
  );
}
setupImport({
  commit: async (message) => {
    const result = await browser.runtime.sendMessage(message);
    if (result.error) throw new Error(result.error);
    data = result.data;
    return result.imported;
  },
  onSuccess: (result) => {
    selected = result.listId;
    visibleWords = 20;
    $("#search").value = "";
    render();
    show("library");
    status(`${result.added} words imported and saved in browser storage.`);
  },
});

setupSyncUI();

function endSession() {
  if (busy) return;
  session = null;
  current = null;
  revealed = false;
  document.body.classList.remove("practicing");
  show("library");
}
$("#end-practice").onclick = endSession;
$("#home-practice").onclick = () => beginPractice();
$("#begin-practice").onclick = () => beginPractice();
$("#home-sync").onclick = async () => {
  const button = $("#home-sync");
  button.disabled = true;
  try {
    const result = await browser.runtime.sendMessage({ type: "syncNow" });
    if (result.error) throw new Error(result.error);
    data = result.data;
    render();
    status(
      result.syncStatus?.message || "Sync finished.",
      !!result.syncStatus?.error,
    );
  } catch (e) {
    status(e.message, true);
  } finally {
    button.disabled = false;
  }
};
async function beginPractice() {
  const input = $("#practice-size");
  if (!input.reportValidity()) return;
  const button = $("#begin-practice");
  const homeButton = $("#home-practice");
  button.disabled = true;
  homeButton.disabled = true;
  try {
    await send({ type: "practiceSize", size: Number(input.value) });
    const list = $("#practice-list").value;
    const words = shuffleNewWords(
      data.words
        .filter(
          (w) =>
            (!list || w.listId === list) && new Date(w.card.due) <= new Date(),
        )
        .sort((a, b) => new Date(a.card.due) - new Date(b.card.due)),
    ).slice(0, Number(input.value));
    session = {
      queue: words.map((w) => ({ id: w.id, reps: w.card.reps })),
      total: words.length,
    };
    sessionCount = 0;
    current = null;
    revealed = false;
    show("practice");
    renderReview();
    window.scrollTo(0, 0);
  } catch (e) {
    status(e.message, true);
  } finally {
    button.disabled = false;
    homeButton.disabled = false;
  }
}

function reminderInputs() {
  return [...document.querySelectorAll(".reminder-time")];
}
function addReminderTime(value = "19:00") {
  const row = el("div", undefined, "reminder-time-row");
  const input = document.createElement("input");
  input.type = "time";
  input.required = true;
  input.value = value;
  input.className = "reminder-time";
  if (!reminderInputs().length) input.id = "time";
  const remove = el("button", "Remove", "quiet");
  remove.type = "button";
  remove.onclick = () => {
    if (reminderInputs().length === 1) return;
    row.remove();
    reminderInputs()[0].id = "time";
  };
  row.append(input, remove);
  $("#reminder-times").append(row);
}
function renderReminderTimes() {
  if (reminderInputs().some((input) => input === document.activeElement))
    return;
  const times = data.settings.reminderTimes || [data.settings.time || "19:00"];
  if (
    reminderInputs()
      .map((input) => input.value)
      .join(",") === times.join(",")
  )
    return;
  $("#reminder-times").replaceChildren();
  times.forEach(addReminderTime);
}
$("#add-reminder-time").onclick = () => addReminderTime();
