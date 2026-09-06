import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { zipSync, unzipSync } from "fflate";

const pkg = JSON.parse(await readFile("package.json", "utf8"));
const manifest = JSON.parse(await readFile("extension/manifest.json", "utf8"));
assert.equal(manifest.version, pkg.version, "Package and manifest versions must match");
const name = `abhyas_-_language_learner-${pkg.version}`;
const extensionZip = await readFile(`artifacts/${name}.zip`);
const packaged = unzipSync(extensionZip);
async function collect(directory, files = {}) {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = `${directory}/${entry.name}`;
    assert.ok(!entry.isSymbolicLink(), `Symlinks are not allowed in release inputs: ${path}`);
    if (entry.isDirectory()) await collect(path, files);
    else if (entry.isFile()) files[path] = new Uint8Array(await readFile(path));
  }
  return files;
}
const extension = await collect("extension");
assert.deepEqual(Object.keys(packaged).filter(p => !p.endsWith("/")).sort(), Object.keys(extension).map(p => p.slice(10)).sort(), "Packaged files must match extension directory");
for (const [path, bytes] of Object.entries(extension))
  assert.deepEqual(packaged[path.slice(10)], bytes, `Stale packaged file: ${path}`);
const source = { ...extension };
for (const dir of ["src", "scripts", "tests", "supabase", "docs"]) await collect(dir, source);
for (const file of ["package.json", "package-lock.json", "README.md", ".nvmrc", ".gitignore"])
  source[file] = new Uint8Array(await readFile(file));
// Explicit inputs exclude local credentials, browser profiles, dependencies and Git history.
const entries = Object.fromEntries(Object.entries(source).sort(([a], [b]) => a.localeCompare(b)).map(([path, bytes]) => [path, [bytes, { mtime: new Date(2020, 0, 1) }]]));
await mkdir("artifacts", { recursive: true });
const sourceName = `${name}-source.zip`;
const sourceZip = zipSync(entries, { level: 9 });
await writeFile(`artifacts/${sourceName}`, sourceZip);
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
await writeFile(`artifacts/${name}-SHA256SUMS.txt`, `${sha(extensionZip)}  ${name}.zip\n${sha(sourceZip)}  ${sourceName}\n`);
console.log(`Release verified: artifacts/${name}.zip\nReviewer source: artifacts/${sourceName}\nSHA-256 checksums written. Packages are unsigned.`);
