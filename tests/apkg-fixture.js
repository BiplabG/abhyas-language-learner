import initSqlJs from "sql.js";
import { readFile } from "node:fs/promises";
export async function fixture(modern = false) {
  return {
    SQL: await initSqlJs(),
    archive: new Uint8Array(
      await readFile(
        new URL(
          `./fixtures/${modern ? "modern" : "legacy"}.apkg`,
          import.meta.url,
        ),
      ),
    ),
  };
}
