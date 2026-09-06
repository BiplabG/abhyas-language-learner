import { addWord, hydrate, scheduler } from "./model.js";
export const MAX_WORDS = 50000;
const dateOK = (v) => typeof v === "string" && Number.isFinite(Date.parse(v));
export function validateBackup(input) {
  if (
    input?.version !== 1 ||
    !Array.isArray(input.lists) ||
    !input.lists.length ||
    !Array.isArray(input.words) ||
    !Array.isArray(input.reviews)
  )
    throw new Error(
      "Choose a abhyas - language learner JSON export (version 1).",
    );
  if (input.words.length > MAX_WORDS)
    throw new Error("Import up to 50,000 words at a time.");
  const listIds = new Set(),
    wordIds = new Set();
  for (const l of input.lists) {
    if (
      typeof l.id !== "string" ||
      listIds.has(l.id) ||
      typeof l.name !== "string" ||
      !l.name.trim()
    )
      throw new Error("Invalid or duplicate list in backup.");
    listIds.add(l.id);
  }
  for (const w of input.words) {
    if (
      typeof w.id !== "string" ||
      wordIds.has(w.id) ||
      !listIds.has(w.listId) ||
      typeof w.word !== "string" ||
      !w.word.trim() ||
      typeof w.translation !== "string" ||
      !w.translation.trim() ||
      typeof w.details !== "string"
    )
      throw new Error("Invalid word in backup.");
    wordIds.add(w.id);
    const c = w.card;
    if (
      !c ||
      !dateOK(c.due) ||
      ![0, 1, 2, 3].includes(c.state) ||
      ![
        "stability",
        "difficulty",
        "elapsed_days",
        "scheduled_days",
        "reps",
        "lapses",
      ].every((k) => Number.isFinite(c[k]) && c[k] >= 0) ||
      !Number.isInteger(c.reps) ||
      !Number.isInteger(c.lapses) ||
      (c.last_review && !dateOK(c.last_review)) ||
      (c.reps > 0 && !c.last_review)
    )
      throw new Error("Invalid practice schedule in backup.");
    try {
      scheduler.repeat(hydrate(c), new Date());
    } catch {
      throw new Error("Invalid FSRS card in backup.");
    }
  }
  for (const r of input.reviews) {
    if (
      !dateOK(r.at) ||
      ![1, 2, 3, 4].includes(r.rating) ||
      typeof r.wordId !== "string" ||
      typeof r.listId !== "string"
    )
      throw new Error("Invalid review history in backup.");
  }
  return input;
}
// Build the entire addition before mutating state, so a failed import is atomic.
export function importBackup(state, input) {
  const source = validateBackup(input),
    lists = [],
    words = [],
    reviews = [],
    listMap = new Map(),
    wordMap = new Map();
  for (const l of source.lists) {
    const id = crypto.randomUUID();
    listMap.set(l.id, id);
    lists.push({ id, name: l.name + " (imported)" });
  }
  for (const w of source.words) {
    const id = crypto.randomUUID();
    wordMap.set(w.id, id);
    words.push({ ...w, id, listId: listMap.get(w.listId) });
  }
  for (const r of source.reviews) {
    if (!listMap.has(r.listId)) continue;
    if (!wordMap.has(r.wordId)) wordMap.set(r.wordId, crypto.randomUUID());
    reviews.push({
      ...r,
      wordId: wordMap.get(r.wordId),
      listId: listMap.get(r.listId),
    });
  }
  state.lists.push(...lists);
  state.words.push(...words);
  state.reviews.push(...reviews);
  return { added: words.length, listId: lists[0].id };
}
export function importRows(state, { name, rows }) {
  if (
    typeof name !== "string" ||
    !name.trim() ||
    !Array.isArray(rows) ||
    !rows.length ||
    rows.length > MAX_WORDS
  )
    throw new Error("Provide a list name and between 1 and 50,000 words.");
  const id = crypto.randomUUID(),
    addition = { lists: [{ id, name: name.trim() }], words: [] };
  for (const row of rows)
    addWord(addition, {
      word: row.word,
      translation: row.translation,
      details: row.details,
      listId: id,
    });
  state.lists.push(...addition.lists);
  state.words.push(...addition.words);
  return { added: rows.length, listId: id };
}
// RFC-style quoted fields, including embedded newlines and escaped quotes.
export function parseDelimited(text, delimiter = ",") {
  const rows = [];
  let row = [],
    cell = "",
    quoted = false,
    closed = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else cell += c;
      continue;
    }
    if (c === '"' && !cell && !closed) {
      quoted = true;
      continue;
    }
    if (c === delimiter) {
      row.push(cell);
      cell = "";
      closed = false;
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
      cell = "";
      closed = false;
      continue;
    }
    if (closed) throw new Error("Unexpected text after a quoted field.");
    cell += c;
  }
  if (quoted) throw new Error("Unclosed quote in import file.");
  row.push(cell);
  if (row.some((v) => v !== "")) rows.push(row);
  if (rows.length > MAX_WORDS + 1)
    throw new Error("Import up to 50,000 words at a time.");
  return rows;
}
export function parseText(text, filename) {
  const csv = /\.csv$/i.test(filename);
  let fields,
    html = false,
    delimiter = csv ? "," : "\t";
  text = text.replace(/^\uFEFF/, "");
  if (!csv) {
    const lines = text.split(/\r?\n/);
    while (lines[0]?.startsWith("#")) {
      const line = lines.shift();
      if (line.startsWith("#separator:")) {
        const value = line.slice(11).trim().toLowerCase();
        delimiter = { tab: "\t", comma: ",", semicolon: ";", pipe: "|" }[value];
        if (!delimiter) throw new Error("Unsupported Anki separator.");
      }
      if (line.startsWith("#columns:")) fields = line.slice(9).split(delimiter);
      if (line.toLowerCase() === "#html:true") html = true;
    }
    text = lines.join("\n");
  }
  const rows = parseDelimited(text, delimiter);
  if (csv) fields = rows.shift();
  if (!fields)
    fields = Array.from(
      { length: Math.max(0, ...rows.map((r) => r.length)) },
      (_, i) => ["Front", "Back"][i] || `Field ${i + 1}`,
    );
  if (!fields?.length || !rows.length)
    throw new Error("No words found in this file.");
  if (rows.some((r) => r.length !== fields.length))
    throw new Error(
      "Rows have different numbers of fields. Check the delimiter and header.",
    );
  // Undo spreadsheet protection only for our known CSV export schema.
  if (csv && fields.join("|") === "Word|English translation|Details|List")
    for (const row of rows)
      for (let i = 0; i < row.length; i++)
        if (/^'['=+@\-\t\r]/.test(row[i])) row[i] = row[i].slice(1);
  const listIndex = csv ? fields.indexOf("List") : -1,
    groups = new Map();
  for (const values of rows) {
    const name =
      listIndex >= 0
        ? values[listIndex] || "Imported words"
        : filename.replace(/\.[^.]+$/, "");
    if (!groups.has(name)) groups.set(name, { name, fields, rows: [], html });
    groups.get(name).rows.push(values);
  }
  return { groups: [...groups.values()] };
}
export function mapRows(group, mapping, clean = (v) => v) {
  const { word, translation, details } = mapping;
  if (
    !Number.isInteger(word) ||
    !Number.isInteger(translation) ||
    word === translation ||
    [word, translation, ...details].some(
      (i) => !Number.isInteger(i) || i < 0 || i >= group.fields.length,
    )
  )
    throw new Error("Choose different fields for word and translation.");
  const result = [],
    seen = new Set();
  let blank = 0,
    duplicates = 0;
  for (const cells of group.rows) {
    const row = {
      word: clean(cells[word] || "").trim(),
      translation: clean(cells[translation] || "").trim(),
      details: details
        .map((i) => {
          const v = clean(cells[i] || "").trim();
          return v;
        })
        .filter(Boolean)
        .join("\n\n"),
    };
    if (!row.word || !row.translation) {
      blank++;
      continue;
    }
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      duplicates++;
      continue;
    }
    seen.add(key);
    result.push(row);
  }
  return { rows: result, blank, duplicates };
}
