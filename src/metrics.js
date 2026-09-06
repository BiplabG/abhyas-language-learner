export function practiceMetrics(state, listId = "", now = new Date()) {
  const words = state.words.filter((w) => !listId || w.listId === listId),
    reviews = state.reviews.filter(
      (r) => (!listId || r.listId === listId) && new Date(r.at) <= now,
    );
  const dayKey = (date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const counts = new Map(),
    ratings = [0, 0, 0, 0];
  for (const r of reviews) {
    const key = dayKey(new Date(r.at));
    counts.set(key, (counts.get(key) || 0) + 1);
    ratings[r.rating - 1]++;
  }
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - 13 + i);
    return {
      label: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      count: counts.get(dayKey(date)) || 0,
    };
  });
  let streak = 0,
    cursor = new Date(now);
  if (!counts.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (counts.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return {
    total: reviews.length,
    recall: reviews.length
      ? Math.round((100 * (reviews.length - ratings[0])) / reviews.length)
      : null,
    streak,
    ratings,
    days,
    new: words.filter((w) => w.card.state === 0).length,
    learning: words.filter((w) => [1, 3].includes(w.card.state)).length,
    review: words.filter((w) => w.card.state === 2).length,
  };
}
