# Firefox release guide

## Build and validate

Use Node 22 (`nvm use` if available), then run from the repository root:

```sh
npm ci
npx playwright install chromium
npm run release
```

On macOS the UI suite uses installed Google Chrome; `CHROME_PATH` overrides its executable. Linux CI installs Chromium and its OS dependencies. The UI suite runs the actual bundles with a simulated extension API and Supabase endpoint; it does not prove native Firefox permissions or a hosted Supabase deployment work.

`release` builds the extension, runs unit tests, validates the manifest and packaged code with Mozilla's validator, runs browser tests, then generates:

- `artifacts/abhyas_-_language_learner-1.3.0.zip`: unsigned extension for AMO.
- `artifacts/abhyas_-_language_learner-1.3.0-source.zip`: original source, locked dependencies, static assets, SQL, tests and build instructions for reviewers.
- `artifacts/abhyas_-_language_learner-1.3.0-SHA256SUMS.txt`: checksums for both archives.

The release script checks that every packaged file matches the current extension directory. Source inputs are explicitly limited to project files and exclude local environment files, credentials, dependencies, artifacts and Git history. Inspect archives before uploading. Screenshots produced by UI tests use synthetic data and are available in `artifacts/`.

For updates, change the version in `package.json`, `package-lock.json` and `extension/manifest.json` together. Keep the existing Gecko ID: changing it creates a different extension with separate storage. Its email-like syntax is an identifier, not a contact address.

## Reviewer build instructions

Extract the source archive into an empty directory. With Node 22 and npm installed, run `npm ci` and `npm run build`. No secrets, environment variables, services or private packages are needed. Build outputs are `extension/app.js`, `extension/background.js`, `extension/import-worker.js` and `extension/sql-wasm-browser.wasm`. Other files in `extension/` are original static assets. Upload the whole source archive when AMO requests source; do not upload only the bundled JavaScript.

Bundled dependencies come from npm with integrity hashes in `package-lock.json`. Scheduling uses [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs); imports use [fflate](https://github.com/101arrowz/fflate), [fzstd](https://github.com/101arrowz/fzstd) and [sql.js](https://github.com/sql-js/sql.js). License texts are in `extension/THIRD_PARTY_NOTICES.txt`. WebAssembly is the sql.js SQLite engine; it runs locally in the import worker. There is no remote executable code.

## Store listing copy

**Name:** abhyas - language learner

**Summary:** Collect vocabulary, import Anki decks, and practice with spaced repetition. Works offline with optional sync to your own Supabase project.

**Description:**

Build your vocabulary while browsing. Select text on a webpage to save a word or phrase, add an English translation and notes, and organize your collection into lists.

Practice with FSRS spaced repetition, track your progress, and set daily browser reminders. Import CSV, text, JSON backups or supported Anki decks. Export your vocabulary whenever you want.

Local use needs no account, API key or server. Translations are entered manually. Optional cross-device sync requires your own hosted Supabase project and a private shared token. Sync replaces the older collection with the newer one; it does not merge simultaneous edits. Anki media and card templates are not imported.

Firefox desktop 142 or newer is required. Reminders require Firefox to be running and notifications enabled in your operating system.

**Privacy:** Copy the content of `extension/privacy.html` into the AMO privacy-policy field, or host it at a public URL and link it in the listing. Do not use a local extension URL as the public policy URL.

**Reviewer notes:** Local features work immediately without credentials. To test capture, select text on a normal web page and use the context menu. For import fixtures see `tests/fixtures/`. Sync is optional, uses the user's own Supabase project, and requests optional host and data permissions only on connection. Follow README's Supabase setup and execute `supabase/setup.sql`; generate a disposable token for testing. No developer-hosted test account is required for local features.

## Final checks and submission

1. In Firefox desktop 142+ load the manifest temporarily. Check selected-text capture, popup and full-view navigation, local persistence, import, keyboard use, notification delivery and permission denial.
2. For sync, execute the SQL on a disposable Supabase project. Connect two Firefox profiles with the same token, verify push/pull and recovery export, then deny/revoke permissions and disconnect. Export local data before testing replacement. Automated tests mock the hosted endpoint, so this live check remains necessary.
3. Sign in to the [AMO Developer Hub](https://addons.mozilla.org/developers/) and submit the extension ZIP for a public listing (or choose self-distribution if desired). Supply the source ZIP, build instructions, listing copy, privacy notice and screenshots.
4. Select the license that reflects your intended distribution rights; this repository does not grant a project-wide open-source license. Set your publisher identity and real support contact in AMO. These account and legal choices belong to the publisher.
5. Resolve AMO review feedback and obtain Mozilla's signed package. Verify installation of the signed version before announcing availability. The local ZIP cannot be permanently installed in standard Firefox without signing.

Nothing in `npm run release` uploads or publishes anything. Mozilla review/signing and the publisher's account fields are separate steps.

References: [submission](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/), [source submission](https://extensionworkshop.com/documentation/publish/source-code-submission/), [add-on policies](https://extensionworkshop.com/documentation/publish/add-on-policies/).
