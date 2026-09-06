import { test } from "node:test";
import assert from "node:assert/strict";
import { shuffleNewWords } from "../src/practice-order.js";
test("new words shuffle without changing scheduled cards or the source list", () => {
  const words = [0, 2, 0, 1, 0].map((state, id) => ({ id, card: { state } }));
  const result = shuffleNewWords(words, () => 0);
  assert.deepEqual(
    result.map((w) => w.id),
    [2, 1, 4, 3, 0],
  );
  assert.deepEqual(
    words.map((w) => w.id),
    [0, 1, 2, 3, 4],
  );
  assert.equal(new Set(result).size, words.length);
});
test("empty lists and lists with no new cards retain their order", () => {
  assert.deepEqual(shuffleNewWords([]), []);
  const reviews = [{ card: { state: 2 } }, { card: { state: 3 } }];
  assert.deepEqual(shuffleNewWords(reviews), reviews);
});
