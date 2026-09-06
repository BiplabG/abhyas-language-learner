import {
  generateSyncToken,
  validateConfig,
  validateSyncToken,
} from "./sync.js";
const $ = (s) => document.querySelector(s);
export function setupSyncUI() {
  function render(info) {
    if (!info) return;
    if (!info.connected) {
      $("#sync-saved-token").value = "";
      $("#sync-saved-token").type = "password";
    }
    $("#sync-status").textContent =
      info.message +
      (info.lastSync
        ? ` Last synced: ${new Date(info.lastSync).toLocaleString()}`
        : "");
    $("#sync-status").classList.toggle("error", !!info.error);
    $("#sync-connected").hidden = !info.connected;
    $("#sync-login").hidden =
      !!info.connected || !new URLSearchParams(location.search).has("full");
    $("#sync-setup-tab").hidden =
      !!info.connected || new URLSearchParams(location.search).has("full");
    $("#sync-account").textContent = info.tokenHint
      ? `Connected · token ending ${info.tokenHint}`
      : "";
  }
  async function send(message) {
    const r = await browser.runtime.sendMessage(message);
    if (r.error) throw new Error(r.error);
    render(r.syncStatus);
    return r;
  }
  $("#sync-setup-tab").onclick = () =>
    browser.tabs.create({
      url: browser.runtime.getURL("index.html") + "?full=1&settings=1",
    });
  $("#sync-generate").onclick = () => {
    $("#sync-token").value = generateSyncToken();
    $("#sync-token").type = "text";
    $("#sync-status").textContent =
      "Token generated. Save it in a password manager before connecting.";
  };
  $("#sync-token-toggle").onclick = () => {
    const input = $("#sync-token");
    input.type = input.type === "password" ? "text" : "password";
  };
  $("#sync-token-copy").onclick = async () => {
    try {
      const token = validateSyncToken($("#sync-token").value);
      await navigator.clipboard.writeText(token);
      $("#sync-status").textContent = "Sync token copied.";
    } catch (e) {
      $("#sync-status").textContent = e.message;
    }
  };
  $("#sync-form").onsubmit = async (e) => {
    e.preventDefault();
    const button = $("#sync-connect");
    button.disabled = true;
    try {
      const config = validateConfig(
        $("#sync-url").value.trim(),
        $("#sync-key").value.trim(),
      );
      const token = validateSyncToken($("#sync-token").value);
      // Permission requests must originate directly from this user gesture.
      const allowed = await browser.permissions.request({
        origins: [config.url + "/*"],
        data_collection: ["authenticationInfo", "websiteContent"],
      });
      if (!allowed)
        throw new Error("Permission was not granted. Sync remains off.");
      await send({
        type: "syncConnect",
        ...config,
        token,
      });
      $("#sync-token").value = "";
      $("#sync-token").type = "password";
    } catch (e) {
      $("#sync-status").textContent = e.message;
    } finally {
      button.disabled = false;
    }
  };
  $("#sync-now").onclick = async () => {
    const b = $("#sync-now");
    b.disabled = true;
    try {
      await send({ type: "syncNow" });
    } catch (e) {
      $("#sync-status").textContent = e.message;
    } finally {
      b.disabled = false;
    }
  };
  $("#sync-show-saved").onclick = async () => {
    try {
      const { token } = await send({ type: "syncCredentials" });
      if (!token) throw new Error("No saved sync token was found.");
      $("#sync-saved-token").value = token;
      $("#sync-saved-token").type = "text";
    } catch (e) {
      $("#sync-status").textContent = e.message;
    }
  };
  $("#sync-copy-saved").onclick = async () => {
    try {
      const { token } = await send({ type: "syncCredentials" });
      if (!token) throw new Error("No saved sync token was found.");
      await navigator.clipboard.writeText(token);
      $("#sync-status").textContent = "Saved sync token copied.";
    } catch (e) {
      $("#sync-status").textContent = e.message;
    }
  };
  $("#sync-disconnect").onclick = () =>
    send({ type: "syncDisconnect" }).catch(
      (e) => ($("#sync-status").textContent = e.message),
    );
  $("#sync-recovery").onclick = async () => {
    try {
      const { backup } = await send({ type: "syncBackup" });
      if (!backup) throw new Error("No remote replacement has occurred yet.");
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(backup.data, null, 2)], {
          type: "application/json",
        }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "abhyas-before-sync.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      $("#sync-status").textContent = e.message;
    }
  };
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.syncStatus)
      render(changes.syncStatus.newValue);
  });
  send({ type: "syncInfo" }).catch(
    (e) => ($("#sync-status").textContent = e.message),
  );
}
