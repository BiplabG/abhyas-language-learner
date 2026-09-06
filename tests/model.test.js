import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  addWord,
  reviewWord,
  exportWords,
  nextReminder,
} from "../src/model.js";
function fixture() {
  const s = initialState();
  addWord(s, {
    word: "hola",
    translation: "hello",
    details: "a greeting",
    listId: s.lists[0].id,
  });
  return s;
}
test("words validate required fields and editing retains learning history", () => {
  const s = fixture(),
    w = s.words[0];
  assert.throws(() =>
    addWord(s, { word: " ", translation: "x", listId: s.lists[0].id }),
  );
  reviewWord(s, w.id, 3, 0);
  addWord(s, { ...w, translation: "hi" });
  assert.equal(w.translation, "hi");
  assert.equal(w.card.reps, 1);
  assert.equal(s.reviews.length, 1);
});
test("FSRS survives storage serialization and rejects duplicate ratings", () => {
  let s = fixture();
  reviewWord(s, s.words[0].id, 1, 0);
  s = JSON.parse(JSON.stringify(s));
  assert.throws(() => reviewWord(s, s.words[0].id, 3, 0));
  reviewWord(s, s.words[0].id, 3, 1, new Date(Date.now() + 60000));
  assert.equal(s.words[0].card.reps, 2);
  assert.ok(new Date(s.words[0].card.due) > new Date());
});
test("export preserves Unicode and escapes CSV; Anki preserves three fields", () => {
  const s = fixture();
  s.words[0].word = "=1+1";
  s.words[0].details = 'a,"b"\n你好';
  const csv = exportWords(s, "", "csv");
  assert.ok(csv.includes("'=1+1"));
  assert.ok(csv.includes('""b""'));
  assert.equal(JSON.parse(exportWords(s, "", "json")).words.length, 1);
  const anki = exportWords(s, "", "anki");
  assert.ok(anki.includes("#columns:Front\tBack\tDetails"));
  assert.ok(anki.includes("你好"));
});
test("reminder rolls past times to tomorrow in local time", () => {
  const now = new Date(2026, 8, 5, 20, 0);
  assert.equal(new Date(nextReminder("19:00", now)).getDate(), 6);
  assert.equal(new Date(nextReminder("21:00", now)).getDate(), 5);
});
