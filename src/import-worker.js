import initSqlJs from "sql.js/dist/sql-wasm-browser.js";
import { extractCollection, readCollection } from "./apkg.js";
import { parseText, validateBackup } from "./import-data.js";
self.onmessage = async ({ data: { buffer, name } }) => {
  try {
    let result;
    if (/\.apkg$/i.test(name)) {
      const SQL = await initSqlJs({
        locateFile: (file) => new URL(file, self.location.href).href,
      });
      const db = new SQL.Database(extractCollection(new Uint8Array(buffer)));
      try {
        result = readCollection(db);
      } finally {
        db.close();
      }
    } else {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
      result = /\.json$/i.test(name)
        ? { backup: validateBackup(JSON.parse(text)) }
        : parseText(text, name);
    }
    self.postMessage({ result });
  } catch (error) {
    self.postMessage({ error: error.message || "Could not read this file." });
  }
};
