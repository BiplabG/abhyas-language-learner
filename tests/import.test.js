import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  addWord,
  reviewWord,
  exportWords,
} from "../src/model.js";
import {
  parseText,
  parseDelimited,
  mapRows,
  importRows,
  importBackup,
} from "../src/import-data.js";
import { extractCollection, readCollection } from "../src/apkg.js";
import { practiceMetrics } from "../src/metrics.js";
import { fixture } from "./apkg-fixture.js";
function state() {
  const s = initialState();
  addWord(s, {
    word: "你好",
    translation: "Hello",
    details: 'line 1\nline 2, "quote"\ttab',
    listId: s.lists[0].id,
  });
  return s;
}
test("JSON restores schedules and metrics into new lists without overwriting", () => {
  const s = state();
  reviewWord(s, s.words[0].id, 3, 0);
  const backup = JSON.parse(exportWords(s, "", "json"));
  const before = s.words[0];
  const result = importBackup(s, backup);
  assert.equal(result.added, 1);
  assert.equal(s.words.length, 2);
  assert.equal(s.words[0], before);
  assert.notEqual(s.words[1].id, before.id);
  assert.equal(s.words[1].card.reps, 1);
  assert.equal(s.reviews[1].wordId, s.words[1].id);
  assert.equal(practiceMetrics(s, result.listId).total, 1);
});
test("malformed backups and row batches never partially mutate state", () => {
  const s = state(),
    saved = JSON.stringify(s),
    backup = JSON.parse(exportWords(s, "", "json"));
  backup.words[0].card.due = "invalid";
  assert.throws(() => importBackup(s, backup));
  assert.throws(() =>
    importRows(s, {
      name: "x",
      rows: [
        { word: "a", translation: "b" },
        { word: "bad", translation: "" },
      ],
    }),
  );
  assert.equal(JSON.stringify(s), saved);
});
test("CSV and new Anki text round-trip multiline fields and quotes", () => {
  for (const format of ["csv", "anki"]) {
    const s = state(),
      parsed = parseText(
        exportWords(s, "", format),
        format === "csv" ? "words.csv" : "words.txt",
      );
    const mapped = mapRows(parsed.groups[0], {
      word: 0,
      translation: 1,
      details: [2],
    });
    assert.equal(mapped.rows[0].details, s.words[0].details);
    assert.equal(mapped.rows[0].word, "你好");
  }
});
test("spreadsheet escaping is reversible for formula text and literal apostrophes", () => {
  for (const value of ["=SUM(A1)", "'=literal", "-term"]) {
    const s = state();
    s.words[0].word = value;
    assert.equal(
      parseText(exportWords(s, "", "csv"), "words.csv").groups[0].rows[0][0],
      value,
    );
  }
});
test("legacy two-column Anki text remains importable; invalid CSV is rejected", () => {
  const p = parseText(
    "#separator:Tab\n#html:false\n#columns:Front\tBack\nhola\thello — greeting",
    "old.txt",
  );
  assert.equal(p.groups[0].rows[0][1], "hello — greeting");
  assert.throws(() => parseDelimited('"unclosed'));
});
test("mapping combines detail values, skips blanks and identical rows", () => {
  const g = {
    fields: ["Word", "Translation", "Example", "Pronunciation"],
    rows: [
      ["hallo", "hello", "Hallo!", "halo"],
      ["hallo", "hello", "Hallo!", "halo"],
      ["", "x", "", ""],
    ],
  };
  const r = mapRows(g, { word: 0, translation: 1, details: [2, 3] });
  assert.equal(r.rows[0].details, "Hallo!\n\nhalo");
  assert.equal(r.blank, 1);
  assert.equal(r.duplicates, 1);
  assert.throws(() => mapRows(g, { word: 0, translation: 0, details: [] }));
});
for (const modern of [false, true])
  test(`${modern ? "modern Zstandard" : "legacy"} APKG exposes ordered fields and deduplicates reversed cards`, async () => {
    const f = await fixture(modern);
    const db = new f.SQL.Database(extractCollection(f.archive));
    try {
      const result = readCollection(db);
      assert.equal(result.groups.length, 1);
      assert.equal(result.groups[0].rows.length, 1);
      assert.deepEqual(result.groups[0].fields, [
        "Expression",
        "Meaning",
        "Example",
        "Pronunciation",
      ]);
      assert.match(result.groups[0].name, /German/);
    } finally {
      db.close();
    }
  });
test("metrics use local days, list filtering, and distinguish recall from again", () => {
  const s = state(),
    id = s.lists[0].id,
    now = new Date(2026, 8, 8, 12);
  s.reviews = [
    { listId: id, rating: 1, at: new Date(2026, 8, 7, 15).toISOString() },
    { listId: id, rating: 3, at: new Date(2026, 8, 8, 9).toISOString() },
    { listId: "other", rating: 4, at: new Date(2026, 8, 8, 10).toISOString() },
  ];
  const m = practiceMetrics(s, id, now);
  assert.equal(m.recall, 50);
  assert.equal(m.streak, 2);
  assert.equal(m.days.at(-1).count, 1);
  assert.equal(m.total, 2);
  assert.equal(practiceMetrics(initialState(), " ", now).recall, null);
});
