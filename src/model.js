import { createEmptyCard, fsrs, Rating } from "ts-fsrs";
export const scheduler = fsrs();
export { Rating };
export function initialState() {
  return {
    version: 1,
    lists: [{ id: crypto.randomUUID(), name: "My first words" }],
    words: [],
    reviews: [],
    settings: {
      reminders: false,
      time: "19:00",
      reminderTimes: ["19:00"],
      practiceSize: 10,
      practiceListId: "",
    },
  };
}
export function hydrate(card) {
  return {
    ...card,
    due: new Date(card.due),
    ...(card.last_review ? { last_review: new Date(card.last_review) } : {}),
  };
}
export function addWord(state, data) {
  const word = data.word?.trim(),
    translation = data.translation?.trim();
  if (!word || !translation)
    throw new Error("Enter both a word and its English translation.");
  if (!state.lists.some((l) => l.id === data.listId))
    throw new Error("Choose an existing list.");
  if (data.id) {
    const existing = state.words.find((w) => w.id === data.id);
    if (!existing) throw new Error("This word was deleted.");
    Object.assign(existing, {
      word,
      translation,
      details: (data.details || "").trim(),
      listId: data.listId,
    });
  } else
    state.words.push({
      id: crypto.randomUUID(),
      word,
      translation,
      details: (data.details || "").trim(),
      listId: data.listId,
      createdAt: new Date().toISOString(),
      card: createEmptyCard(),
    });
}
export function reviewWord(state, id, rating, expectedReps, now = new Date()) {
  const word = state.words.find((w) => w.id === id);
  if (!word) throw new Error("This word was deleted.");
  if (word.card.reps !== expectedReps)
    throw new Error("This card was already reviewed in another window.");
  if (![1, 2, 3, 4].includes(rating)) throw new Error("Invalid rating.");
  const result = scheduler.next(hydrate(word.card), now, rating);
  word.card = result.card;
  state.reviews.push({
    wordId: id,
    listId: word.listId,
    at: now.toISOString(),
    rating,
    log: result.log,
  });
}
export function nextReminder(time, now = new Date()) {
  const [h, m] = time.split(":").map(Number),
    next = new Date(now);
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime();
}
const safeCell = (value) => (/^['=+@\-\t\r]/.test(value) ? "'" + value : value);
export function exportWords(state, listId, format) {
  const words = state.words.filter((w) => !listId || w.listId === listId);
  if (format === "json")
    return JSON.stringify(
      {
        ...state,
        lists: state.lists.filter((l) => !listId || l.id === listId),
        words,
        reviews: state.reviews.filter((r) => !listId || r.listId === listId),
      },
      null,
      2,
    );
  if (format === "anki")
    return (
      "#separator:Tab\n#html:false\n#columns:Front\tBack\tDetails\n" +
      words
        .map((w) =>
          [w.word, w.translation, w.details]
            .map((v) => '"' + v.replaceAll('"', '""') + '"')
            .join("\t"),
        )
        .join("\n")
    );
  return (
    "\uFEFF" +
    [
      ["Word", "English translation", "Details", "List"],
      ...words.map((w) => [
        w.word,
        w.translation,
        w.details,
        state.lists.find((l) => l.id === w.listId)?.name || "",
      ]),
    ]
      .map((row) =>
        row.map((v) => '"' + safeCell(v).replaceAll('"', '""') + '"').join(","),
      )
      .join("\r\n")
  );
}
