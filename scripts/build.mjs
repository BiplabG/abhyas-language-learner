import { copyFile } from "node:fs/promises";
import { build } from "esbuild";
await build({
  entryPoints: ["src/app.js", "src/background.js", "src/import-worker.js"],
  outdir: "extension",
  bundle: true,
  format: "iife",
  target: "firefox115",
  legalComments: "eof",
});

await copyFile(
  "node_modules/sql.js/dist/sql-wasm-browser.wasm",
  "extension/sql-wasm-browser.wasm",
);
