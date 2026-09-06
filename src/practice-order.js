// Shuffle only new cards; scheduled cards keep their due-order positions.
export function shuffleNewWords(words, random = Math.random) {
  const fresh = words.filter((word) => word.card.state === 0);
  for (let i = fresh.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [fresh[i], fresh[j]] = [fresh[j], fresh[i]];
  }
  let index = 0;
  return words.map((word) => (word.card.state === 0 ? fresh[index++] : word));
}
