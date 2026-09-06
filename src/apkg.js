import { unzipSync } from "fflate";
import { Decompress } from "fzstd";
import { MAX_WORDS } from "./import-data.js";
export const MAX_FILE_BYTES = 128 * 1024 * 1024;
const MAX_DB_BYTES = 128 * 1024 * 1024;
export function extractCollection(bytes) {
  if (bytes.length > MAX_FILE_BYTES)
    throw new Error("Choose an APKG smaller than 128 MB.");
  const entries = unzipSync(bytes, {
    filter: (entry) => {
      if (
        ![
          "collection.anki21b",
          "collection.anki21",
          "collection.anki2",
        ].includes(entry.name)
      )
        return false;
      if (entry.originalSize > MAX_DB_BYTES)
        throw new Error("Anki collection exceeds the 128 MB import limit.");
      return true;
    },
  });
  const name = [
    "collection.anki21b",
    "collection.anki21",
    "collection.anki2",
  ].find((n) => entries[n]);
  if (!name) throw new Error("This APKG contains no Anki collection.");
  let result = entries[name];
  if (name.endsWith("b")) {
    const chunks = [];
    let size = 0;
    const decoder = new Decompress((chunk) => {
      size += chunk.length;
      if (size > MAX_DB_BYTES)
        throw new Error("Decompressed Anki collection exceeds 128 MB.");
      chunks.push(chunk.slice());
    });
    decoder.push(result, true);
    result = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
  }
  if (new TextDecoder().decode(result.subarray(0, 16)) !== "SQLite format 3\0")
    throw new Error("The Anki collection is not a supported SQLite database.");
  return result;
}
export function readCollection(db) {
  const query = (sql) => db.exec(sql)[0]?.values || [];
  const tables = new Set(
    query("SELECT name FROM sqlite_master WHERE type='table'").map((r) => r[0]),
  );
  if (!tables.has("notes") || !tables.has("cards"))
    throw new Error("Anki notes or cards are missing.");
  const models = new Map(),
    decks = new Map();
  if (tables.has("notetypes") && tables.has("fields")) {
    for (const [id, name] of query("SELECT id,name FROM notetypes"))
      models.set(String(id), { name, fields: [] });
    for (const [id, ord, name] of query(
      "SELECT ntid,ord,name FROM fields ORDER BY ntid,ord",
    )) {
      const model = models.get(String(id));
      if (model) model.fields[ord] = name;
    }
    for (const [id, name] of query("SELECT id,name FROM decks"))
      decks.set(String(id), name.replaceAll("\x1f", "::"));
  } else {
    const col = query("SELECT models,decks FROM col")[0];
    if (!col) throw new Error("Anki metadata is missing.");
    for (const [id, m] of Object.entries(JSON.parse(col[0])))
      models.set(id, {
        name: m.name,
        fields: [...m.flds].sort((a, b) => a.ord - b.ord).map((f) => f.name),
      });
    for (const [id, d] of Object.entries(JSON.parse(col[1])))
      decks.set(id, d.name);
  }
  const count = query("SELECT count(*) FROM notes")[0][0];
  if (count > MAX_WORDS)
    throw new Error(
      "Import up to 50,000 Anki notes at a time. Export a smaller deck from Anki.",
    );
  const groups = new Map();
  // DISTINCT imports a note once per deck, even when it generates reversed cards.
  for (const [mid, did, flds] of query(
    "SELECT DISTINCT n.id,n.mid,CASE WHEN c.odid != 0 THEN c.odid ELSE c.did END,n.flds FROM notes n JOIN cards c ON c.nid=n.id ORDER BY n.id",
  ).map((r) => r.slice(1))) {
    const model = models.get(String(mid));
    if (!model) throw new Error("Anki note type metadata is missing.");
    const key = `${did}:${mid}`;
    if (!groups.has(key))
      groups.set(key, {
        name: `${decks.get(String(did)) || "Anki deck"} · ${model.name}`,
        fields: model.fields,
        rows: [],
        html: true,
      });
    const values = flds.split("\x1f");
    if (values.length !== model.fields.length)
      throw new Error("Anki note fields do not match their note type.");
    groups.get(key).rows.push(values);
  }
  if (!groups.size) throw new Error("No notes found in this Anki deck.");
  return { groups: [...groups.values()] };
}
