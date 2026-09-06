import { mapRows } from "./import-data.js";
const $ = (s) => document.querySelector(s);
export function plainAnki(value) {
  const safe = value
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<br\s*\/?\s*>|<\/(div|p|li|tr)>/gi, "\n")
    .replace(/<img\b[^>]*>/gi, "[image]")
    .replace(/\[sound:([^\]]+)\]/g, "[audio: $1]");
  return new DOMParser()
    .parseFromString(safe, "text/html")
    .body.textContent.replace(/\{\{c\d+::(.*?)(?:::[\s\S]*?)?\}\}/g, "$1")
    .replace(/\u00a0/g, " ")
    .trim();
}
export function setupImport({ commit, onSuccess }) {
  let parsed = null,
    worker = null,
    token = 0,
    preview = null;
  const dialog = $("#import-dialog");
  function clear() {
    parsed = null;
    preview = null;
    $("#import-mapping").hidden = true;
    $("#import-backup").hidden = true;
    $("#import-confirm").disabled = true;
    $("#import-error").textContent = "";
    $("#import-preview").replaceChildren();
  }
  function cancel() {
    token++;
    worker?.terminate();
    worker = null;
  }
  $("#import-open").onclick = async () => {
    if (!new URLSearchParams(location.search).has("full")) {
      try {
        await browser.tabs.create({
          url: browser.runtime.getURL("index.html") + "?full=1&import=1",
        });
      } catch (error) {
        document.querySelector("#status").textContent =
          `Could not open import tab: ${error.message}`;
      }
      return;
    }
    cancel();
    clear();
    $("#import-file").value = "";
    $("#import-info").textContent =
      "Choose a file to preview. Everything is processed on this device.";
    dialog.showModal();
  };
  $("#import-close").onclick = () => dialog.close();
  dialog.addEventListener("close", () => {
    cancel();
    parsed = null;
    preview = null;
  });
  $("#import-file").onchange = async () => {
    cancel();
    clear();
    const file = $("#import-file").files[0];
    if (!file) return;
    if (file.size > 128 * 1024 * 1024) {
      $("#import-error").textContent = "Choose a file smaller than 128 MB.";
      return;
    }
    if (!/\.(json|csv|txt|tsv|apkg)$/i.test(file.name)) {
      $("#import-error").textContent =
        "Choose JSON, CSV, Anki text, TSV, or APKG.";
      return;
    }
    const currentToken = token;
    $("#import-info").textContent = "Reading file…";
    try {
      const buffer = await file.arrayBuffer();
      if (currentToken !== token) return;
      const result = await new Promise((resolve, reject) => {
        worker = new Worker(browser.runtime.getURL("import-worker.js"));
        worker.onmessage = ({ data }) =>
          data.error ? reject(new Error(data.error)) : resolve(data.result);
        worker.onerror = (e) =>
          reject(new Error(e.message || "Could not read the file."));
        worker.postMessage({ name: file.name, buffer }, [buffer]);
      });
      if (currentToken !== token) return;
      worker.terminate();
      worker = null;
      parsed = result;
      if (parsed.backup) {
        $("#import-backup").hidden = false;
        $("#import-info").textContent =
          `${parsed.backup.lists.length} lists · ${parsed.backup.words.length} words · ${parsed.backup.reviews.length} reviews`;
        $("#import-confirm").disabled = false;
      } else {
        $("#import-mapping").hidden = false;
        $("#import-group").replaceChildren(
          ...parsed.groups.map(
            (g, i) =>
              new Option(`${g.name} (${g.rows.length} notes)`, String(i)),
          ),
        );
        $("#import-info").textContent =
          "Choose a group and map its fields. Repeat the import for other groups.";
        selectGroup();
      }
    } catch (e) {
      if (currentToken === token) {
        worker?.terminate();
        worker = null;
        $("#import-info").textContent = "Nothing has been imported.";
        $("#import-error").textContent = e.message;
      }
    }
  };
  function selectGroup() {
    const g = parsed.groups[Number($("#import-group").value)];
    $("#import-name").value = g.name;
    for (const id of ["#map-word", "#map-translation"])
      $(id).replaceChildren(
        ...g.fields.map((f, i) => new Option(f, String(i))),
      );
    const word = g.fields.findIndex((f) =>
        /^(word|front|expression|term)$/i.test(f),
      ),
      translation = g.fields.findIndex((f) =>
        /^(english translation|translation|back|meaning)$/i.test(f),
      );
    $("#map-word").value = String(word >= 0 ? word : 0);
    $("#map-translation").value = String(
      translation >= 0 ? translation : Math.min(1, g.fields.length - 1),
    );
    $("#map-details").replaceChildren();
    g.fields.forEach((field, i) => {
      const label = document.createElement("label");
      label.className = "check";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = String(i);
      input.checked = /^details$/i.test(field);
      input.onchange = updatePreview;
      label.append(input, document.createTextNode(field));
      $("#map-details").append(label);
    });
    $("#import-html").checked = g.html;
    updatePreview();
  }
  function updatePreview() {
    try {
      const group = parsed.groups[Number($("#import-group").value)];
      preview = mapRows(
        group,
        {
          word: Number($("#map-word").value),
          translation: Number($("#map-translation").value),
          details: [...$("#map-details").querySelectorAll("input:checked")].map(
            (n) => Number(n.value),
          ),
        },
        $("#import-html").checked ? plainAnki : (v) => v,
      );
      $("#import-error").textContent = "";
      $("#import-summary").textContent =
        `${preview.rows.length} words to import · ${preview.blank} blank notes skipped · ${preview.duplicates} exact duplicates skipped`;
      const host = $("#import-preview");
      host.replaceChildren();
      for (const row of preview.rows.slice(0, 3)) {
        const article = document.createElement("article");
        article.className = "word-card";
        const copy = document.createElement("div");
        copy.className = "word-copy";
        for (const [tag, value] of [
          ["strong", row.word],
          ["p", row.translation],
          ["pre", row.details],
        ]) {
          const n = document.createElement(tag);
          n.textContent = value;
          copy.append(n);
        }
        article.append(copy);
        host.append(article);
      }
      $("#import-confirm").disabled = !preview.rows.length;
    } catch (e) {
      preview = null;
      $("#import-error").textContent = e.message;
      $("#import-confirm").disabled = true;
      $("#import-preview").replaceChildren();
    }
  }
  $("#import-group").onchange = selectGroup;
  $("#map-word").onchange = updatePreview;
  $("#map-translation").onchange = updatePreview;
  $("#import-html").onchange = updatePreview;
  $("#import-form").onsubmit = async (e) => {
    e.preventDefault();
    if (!parsed) return;
    $("#import-confirm").disabled = true;
    $("#import-file").disabled = true;
    try {
      const result = await commit(
        parsed.backup
          ? { type: "importBackup", backup: parsed.backup }
          : {
              type: "importRows",
              name: $("#import-name").value,
              rows: preview?.rows,
            },
      );
      dialog.close();
      onSuccess(result);
    } catch (err) {
      $("#import-error").textContent = err.message;
    } finally {
      $("#import-confirm").disabled = false;
      $("#import-file").disabled = false;
    }
  };
}
