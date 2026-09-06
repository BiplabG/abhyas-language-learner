import initSqlJs from "sql.js";
import { zipSync } from "fflate";
import { zstdCompressSync } from "node:zlib";
export async function fixture(modern = false) {
  const SQL = await initSqlJs(),
    db = new SQL.Database();
  db.run(
    "CREATE TABLE notes(id integer,mid integer,flds text); CREATE TABLE cards(id integer,nid integer,did integer,odid integer);",
  );
  if (modern) {
    db.run(
      "CREATE TABLE notetypes(id integer,name text); CREATE TABLE fields(ntid integer,ord integer,name text); CREATE TABLE decks(id integer,name text);",
    );
    db.run(
      "INSERT INTO notetypes VALUES(1,'Vocabulary'); INSERT INTO decks VALUES(2,'German');",
    );
    for (const [i, name] of [
      "Expression",
      "Meaning",
      "Example",
      "Pronunciation",
    ].entries())
      db.run("INSERT INTO fields VALUES(1,?,?)", [i, name]);
  } else {
    db.run("CREATE TABLE col(models text,decks text)");
    db.run("INSERT INTO col VALUES(?,?)", [
      JSON.stringify({
        1: {
          name: "Vocabulary",
          flds: ["Expression", "Meaning", "Example", "Pronunciation"].map(
            (name, ord) => ({ name, ord }),
          ),
        },
      }),
      JSON.stringify({ 2: { name: "German" } }),
    ]);
  }
  db.run("INSERT INTO notes VALUES(10,1,?)", [
    "<b>Hallo</b>\x1fHello\x1fHallo Welt!\x1fhaˈloː",
  ]);
  db.run(
    "INSERT INTO cards VALUES(1,10,2,0); INSERT INTO cards VALUES(2,10,2,0)",
  );
  const bytes = db.export();
  db.close();
  return {
    SQL,
    bytes,
    archive: zipSync(
      modern
        ? {
            "collection.anki21b": zstdCompressSync(bytes),
            "collection.anki2": new Uint8Array([1, 2]),
          }
        : { "collection.anki2": bytes },
    ),
  };
}

// Run with Node 24+ to regenerate the small synthetic Anki archives.
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("tests/fixtures", { recursive: true });
for (const modern of [false, true])
  await writeFile(
    `tests/fixtures/${modern ? "modern" : "legacy"}.apkg`,
    (await fixture(modern)).archive,
  );
