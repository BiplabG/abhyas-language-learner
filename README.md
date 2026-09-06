# abhyas - language learner

A local Firefox extension for collecting vocabulary and practicing with FSRS. No account, Python server, API key, or network connection is needed for local use. Optional Supabase sync requires your project URL, publishable key, and a private shared sync token. Translations are entered manually.

## Load it now

The built extension is already in `extension/`; no build step is necessary.

1. Use Firefox desktop 142 or newer.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and select `extension/manifest.json` in this project.
4. Click the abhyas - language learner toolbar icon (look in Firefox's extensions menu if it is hidden). **Full view** opens a larger tab.

Temporary installation lasts until Firefox restarts. Reload the same manifest to use it again. For a permanent installation in standard Firefox, the package must be signed by Mozilla; the generated ZIP is unsigned. See [Mozilla's temporary installation guide](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) and [packaging/signing documentation](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/).

Already loaded an earlier build? Click **Reload** beside the extension on the same debugging page, then reopen its popup or refresh its full-view tab. Keep the existing extension installed to retain its data.

## Use it

- **Collect:** Add a word or phrase, its English translation, and optional notes. Alternatively, select text on a normal webpage and choose **Add to abhyas - language learner** from the right-click menu. A compact extension window opens with that text prefilled.
- **Organize:** Create, rename, and delete lists; edit, move, delete, or search words. Lists initially show 20 words; **Show more** adds the next 20. Switching lists or changing the search resets the visible count to 20; search and export still cover the entire list. Deleting a list deletes its words and requires confirmation. At least one list must remain.
- **Practice:** Click **Start practice** from Word lists (or open the Practice tab), choose all lists or one list, set **Words per session** (1–100, default 10), and click **Begin session**. The saved session size applies to this browser. Practice mode hides the dashboard and navigation, showing the word, answer, rating controls, and session progress. Each selected word is reviewed once; the session ends after those words. **End session** returns home with completed reviews saved. Recall the translation, reveal the answer, and rate **Again / Hard / Good / Easy**. FSRS calculates the next due time. The buttons preview each interval. New words are due immediately and appear in randomized order; revealing the answer keeps the same card, and scheduled reviews retain their due-date order. Short learning intervals make a word available in a later session.
- **Progress:** Practice shows total reviews, recall rate (Hard/Good/Easy as a share of all ratings), a daily streak, rating totals, 14 days of activity, and counts of new, learning/relearning, and review words. Metrics follow your selected practice list. A streak remains active if you practiced yesterday and have not practiced today yet. Detailed FSRS schedules and review logs are included in JSON exports.
- **Reminders:** Enable a daily reminder and choose a local time in Settings. A Firefox browser notification appears at the configured time, including when no words are due; clicking it opens Practice in a full tab. Settings shows the next scheduled reminder and a **Test browser notification** button. Firefox must be running and OS notifications must be allowed. A missed reminder is sent once when the extension next starts, then daily scheduling resumes. Disabling reminders cancels the alarm; the test button works independently of that setting.
- **Export:** Download the current list as JSON, CSV, or Anki text; Settings can export all data as JSON. JSON includes learning history. Export before uninstalling or changing Firefox profiles.

### Check browser notifications

In **Settings**, click **Test browser notification**. A notification from Firefox should appear; clicking it opens Practice. A successful API request cannot confirm that your operating system displayed a banner. If it is hidden, allow notifications for Firefox in your system notification settings and turn off Do Not Disturb / Focus. Firefox may show notifications through the operating system's notification center, depending on your platform. See [Mozilla's notification overview](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Notifications).

Enable daily reminders, choose your local time, and click **Save preferences**. Check the displayed **Next browser reminder** date/time: a time that has already passed is scheduled for tomorrow. Notification API errors are displayed in Settings; failed delivery still schedules the next day. Reminders work while the popup is closed. Temporary add-ons must be loaded again after restarting Firefox before any reminder can run.

### Persistent storage

Words, lists, preferences, and practice history are automatically saved with `browser.storage.local`, which survives closed popups, tabs, and browser restarts. Session storage is not used because it is temporary. The extension requests `unlimitedStorage` to accommodate imported decks. Data remains tied to this Firefox profile; deleting extension data, removing the extension, or deleting the profile can remove it. Export JSON backups for safekeeping. Temporary add-on installation still needs reloading after Firefox restarts; signing is needed for permanent installation.

### Import into abhyas - language learner

Click **Import words / Anki deck** in Word lists. From the toolbar popup or capture window, this automatically opens a full browser tab with the import dialog already visible. The file picker runs in that tab so losing popup focus cannot interrupt the import. If you are already in full view, the import dialog opens in the current tab.

- **JSON:** Restore exported lists, vocabulary, FSRS schedules, and review history as new lists with “(imported)” appended to their names. Existing data and reminder preferences are preserved. Importing the same backup again creates another copy.
- **CSV:** Read a header row and quoted fields, including commas, quotes, and multiline notes. Files exported by this extension keep their list groups; choose one group at a time.
- **Anki text / TSV:** Import tab-separated text, including the extension's old two-column exports and new three-column exports. Supported Anki headers include `separator`, `columns`, and `html`. Old exports combined translation and details in the Back field; that combined text remains intact and can be edited after import.
- **APKG:** Supports legacy `collection.anki2` / `collection.anki21` and modern Zstandard-compressed `collection.anki21b` collections. Select a deck and note type, then choose its **Word** and **English translation** fields. Select any number of **Details** fields; selected values are combined into the existing single details field, separated by blank lines, without field names. Preview the first three words before importing. Repeat the import to bring in other groups.

All imports are additive and create new lists. CSV, text, and APKG imports start fresh FSRS schedules; only abhyas - language learner JSON preserves practice history. Blank word/translation rows and exact duplicate mapped rows are skipped, with counts shown before import. Reversed Anki cards yield one note per deck. HTML is converted to plain text by default for APKG files. Images, audio, and card templates are not imported; image/audio placeholders remain as text. Cloze fields become plain text, not interactive cloze cards.

Limits: 128 MB per uploaded file and per decompressed Anki database, up to 50,000 notes per import. Media archive entries are ignored. Parsing runs in a local background worker. Canceling the preview makes no changes. Export a smaller deck from Anki if a package exceeds these limits.

### Import into Anki

Choose **Anki text**, download the `.txt` file, then use Anki's **File → Import**. The export has three fields: Front (word), Back (English translation), and Details. In Anki, add a Details field to your note type and map it during import to keep all three. With a two-field Basic note type, map Front and Back and ignore Details. The export declares a tab separator and disables HTML. This transfers vocabulary, not the extension's FSRS scheduling history; it is not an `.apkg` deck package.

## Development

Node 22 LTS is recommended. Dependencies are locked in `package-lock.json`.

```sh
npm ci
npm run build
npm test
npm run lint
npm run package
```

`npm run package` writes `artifacts/abhyas_-_language_learner-1.3.0.zip`. Only `extension/` is packaged, with the FSRS library bundled locally. Source lives in `src/`; rebuild after editing it, then click **Reload** in Firefox's debugging page.

```sh
npm run test:ui
```

The UI test uses an isolated headless Chromium browser with a simulated WebExtension API and the real background and UI bundles. On macOS it uses installed Google Chrome; set `CHROME_PATH` for another executable. On other systems install Playwright Chromium with `npx playwright install chromium`. It covers add/edit/delete, 20-word pagination, list creation, review scheduling, metrics, the notification-test request, popup-to-tab import handoff, preferences, export, capture, reload persistence through the storage test adapter, all import formats, and multi-field APKG mapping. The real import worker and SQLite WebAssembly run under the extension's content security policy. Unit tests cover atomic imports, backup validation, legacy/modern APKG fixtures, CSV/Anki round trips, metrics, new-word randomization, scheduling, and reminders (empty/due lists, restart catch-up, disabled reminders, and notification failures). The synthetic APKG fixtures can be regenerated with `node scripts/generate-fixtures.mjs` on Node 24+.

Firefox installation was also smoke-tested separately with `web-ext run` in a temporary headless profile. Native right-click interaction and OS notification delivery should be checked manually on your desktop. If `web-ext lint` exits with SIGBUS on Node 24.14.0/macOS, use Node 22; that local runtime crashed in its CommonJS lexer during validation.

## Design and privacy

- Firefox Manifest V2 with storage, unlimited storage, context menu, alarm, and notification permissions; no content scripts. Optional sync requests access only to your chosen Supabase project.
- A background message queue serializes writes from all extension windows. Review versions prevent accidentally rating the same card twice across windows.
- `browser.storage.local` holds lists, vocabulary, settings, and review logs in the current Firefox profile. There is no telemetry or automatic translation. Optional Supabase sync transmits vocabulary and practice history only to your configured project.
- [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) implements scheduling. `fflate`, `fzstd`, and `sql.js` read APKG archives locally; SQLite WebAssembly is bundled with the extension. Their licenses are included in `extension/THIRD_PARTY_NOTICES.txt`. The APKG reader follows [Anki's package version definitions](https://github.com/ankitects/anki/blob/main/rslib/src/import_export/package/meta.rs) and note type storage schema.
- `npm audit` currently reports an `image-size` denial-of-service advisory through the development-only Firefox validator. That dependency is not included in the extension runtime.

## Original requirements

1. A firefox extension that allows to add words. Each word has basically three fields: word, english translation, details.

2. The word list is saved locally. Word list can be viewed in the extension with all CRUD functionality. Each word can be edited. Also, the word list can be exported in json or csv or anki format. There can be more than one word list.

3. Have a timer in the app, so it reminds you to practice at configured time of the day. Use a library to implement FSRS based learning method in the app, so added words can be practiced. Keep metrics of user's learning and progress.

4. Right click to a selected text in the browser should show add to abhyas-language-learner option. And right there the extension popup should have the form prefilled and allow to add extra information.

5. Use python in the backend if needed. (optional)

6. Have a good standard UI and user experience should be based on modern standards.

## Supabase sync (optional)

Sync transfers your lists, words, FSRS schedules, and review history to your own Supabase project. A private sync token identifies the remote snapshot, so devices using the same project settings and token sync together. Reminders and notification preferences remain local. The extension continues to work offline with sync disabled or unavailable.

### One-time setup

1. Create a Supabase project, open **SQL Editor**, and run the latest [`supabase/setup.sql`](supabase/setup.sql). The function atomically compares versions and stores snapshots by a SHA-256 token hash. No Supabase Auth provider or user is required.
2. Copy your project's **Project URL** and **publishable key** from its API settings. A legacy `anon` key also works. Never use a `service_role` or `sb_secret_…` key in the extension.
3. Reload the extension. In **Settings → Sync with Supabase**, enter those values. Choose **Generate token** for the first device, then copy the token into a password manager. You may instead enter an existing valid token.
4. Choose **Connect and sync** and grant access to that project plus consent to the optional data transfer. From the popup, **Configure sync in full view** opens the setup form in a tab.
5. On another device, enter the same project URL, publishable key, and sync token. It will address the same remote snapshot. If that device already has local words, export a JSON backup before its first connection because the newer whole snapshot wins.

The extension saves all three values in this Firefox profile after a successful connection. You enter them only once while connected, and automatic sync resumes after Firefox restarts.

Only standard hosted project URLs (`https://your-project.supabase.co`) are supported. Self-hosted instances and custom domains are not configured by this version.

### Version and replacement rules

- Each vocabulary or practice change creates a revision: a monotonic millisecond counter plus a random UUID to break ties. It is independent of the JSON export schema version (`version: 1`) and extension version.
- The Supabase function compares the local and remote revisions in one transaction. If local is newer, it uploads the local snapshot. If remote is newer, the extension validates it and replaces local lists, words, and history. Equal versions do nothing.
- There is **no merge**. Simultaneous or offline edits on different browsers can result in the older snapshot's changes being discarded. Keep device clocks synchronized: revisions use the device clock, advancing past the last observed revision when necessary. With equal counters, the UUID determines the winner, not wall-clock chronology.
- Before a pull replaces local data, one recovery copy is saved in browser storage. Use **Export local copy from before last pull** in Settings to download it as JSON. Import that file to recover its words as additional lists. Each subsequent pull replaces this recovery copy.
- Existing collections are assigned a revision when this extension version first starts. A new, empty browser starts at revision zero so an existing remote snapshot wins. An unversioned collection upgraded on another browser is treated as a current local snapshot; export a backup before connecting existing collections on multiple browsers.
- Sync runs on startup when connected, every five minutes, about 30 seconds after local changes, and when you click **Sync now**. Firefox must be running and the extension loaded. Status and errors appear in Settings. Network failures leave local data intact and retry on the next scheduled sync.
- Snapshots are limited to 20 MB and 50,000 words. This is whole-collection sync, so each exchange sends the current snapshot. It is intended for personal vocabulary collections, not large shared multi-user datasets.

### Authentication and privacy

The generated token contains 256 random bits and uses a 43-character URL-safe representation. Supabase receives it over HTTPS, hashes it with SHA-256 inside the database function, and stores only the hash as the snapshot key. The function is the only client-accessible database operation; direct table privileges are revoked. The publishable key identifies your Supabase application and is not a secret.

The sync token is the credential: anyone who obtains it together with the project details can read and replace that snapshot. Store it in a password manager and do not send it in email or public issue reports. No email, password, Supabase user, access JWT, refresh token, or service-role key is used. The token and project configuration are kept separately from vocabulary; JSON exports, recovery exports, and remote payloads exclude them.

Requests use HTTPS, reject redirects, and request website access only for the configured project. The security-definer database function has a fixed empty search path, validates input and payload size, and exposes neither the plaintext token nor its hash. See [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys) and [database functions](https://supabase.com/docs/guides/database/functions).

**Disconnect** removes the saved project settings and token, removes the project permission, and stops automatic sync. It retains local and remote data. Keep the token elsewhere before disconnecting so you can reconnect. To delete cloud data, delete the matching row from `public.abhyas_token_sync` in Supabase; because only the hash is stored, the dashboard cannot reveal a lost token.

Sync is optional and sends data only to the project you configure. It is not end-to-end encrypted: the project's database administrators can access stored snapshots. Other unrelated users cannot access them through the configured RLS policies.

### Validation status

Automated tests cover token generation and validation, hashed local identity binding, revision comparison, credential exclusion, malformed remote data, network failures, and recovery copies. Browser tests exercise saved token configuration, push/pull, recovery export, and disconnect using a simulated Supabase endpoint. The SQL has not been executed against a running Supabase/PostgreSQL database in this workspace; the isolated database test was declined. After setup, test two devices with the same token and keep a JSON export before relying on cloud sync as your sole copy.
