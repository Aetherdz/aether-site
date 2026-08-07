/* Aether — connect page. Generates terminal commands only. Keys never touch this site. */

(function () {
  "use strict";

  var PROVIDERS = [
    { id: "zen", label: "OpenCode Zen", env: null, free: true, url: "https://opencode.ai/zen", note: "no key needed - free default" },
    { id: "openai", label: "OpenAI", env: "OPENAI_API_KEY", free: false, url: "https://platform.openai.com/api-keys", note: "paste key into terminal only" },
    { id: "anthropic", label: "Anthropic", env: "ANTHROPIC_API_KEY", free: false, url: "https://console.anthropic.com/settings/keys", note: "paste key into terminal only" },
    { id: "google", label: "Google Gemini", env: "GOOGLE_GENERATIVE_AI_API_KEY", free: false, url: "https://aistudio.google.com/apikey", note: "paste key into terminal only" },
    { id: "deepseek", label: "DeepSeek", env: "DEEPSEEK_API_KEY", free: false, url: "https://platform.deepseek.com/api_keys", note: "paste key into terminal only" },
    { id: "openrouter", label: "OpenRouter", env: "OPENROUTER_API_KEY", free: false, url: "https://openrouter.ai/keys", note: "paste key into terminal only" },
    { id: "ollama", label: "Ollama (local)", env: null, free: true, url: "https://ollama.com/download", note: "no key - runs locally" }
  ];

  function buildGrid() {
    var grid = document.getElementById("provider-grid");
    if (!grid) return;
    grid.textContent = "";
    PROVIDERS.forEach(function (p) {
      var item = document.createElement("article");
      item.className = "provider-item";
      item.setAttribute("role", "listitem");

      var head = document.createElement("div");
      head.className = "provider-head";
      var name = document.createElement("h3");
      name.textContent = p.label;
      var status = document.createElement("span");
      status.className = p.free ? "p-free" : "p-not";
      status.textContent = p.free ? "free / no key" : "bring your own key";
      head.appendChild(name);
      head.appendChild(status);

      var link = document.createElement("a");
      link.href = p.url;
      link.rel = "noopener";
      link.target = "_blank";
      link.className = "provider-link";
      link.textContent = p.free ? "learn more at " + p.label : "get a key from " + p.label;

      var note = document.createElement("p");
      note.className = "provider-note";
      note.textContent = p.note;

      var row = document.createElement("div");
      row.className = "key-row";
      var cmd = document.createElement("code");
      cmd.className = "provider-cmd";
      cmd.textContent = p.env ? "aether login " + p.id : "aether use " + p.id;

      var copy = document.createElement("button");
      copy.type = "button";
      copy.className = "key-save";
      copy.textContent = "copy command";
      copy.setAttribute("aria-label", "Copy " + p.label + " connect command");
      copy.dataset.copy = cmd.textContent;

      row.appendChild(cmd);
      row.appendChild(copy);

      item.appendChild(head);
      item.appendChild(link);
      item.appendChild(note);
      item.appendChild(row);
      grid.appendChild(item);
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () { /* noop */ });
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) { /* noop */ }
      document.body.removeChild(ta);
    }
  }

  function setupCopy() {
    var grid = document.getElementById("provider-grid");
    if (!grid) return;
    grid.addEventListener("click", function (event) {
      var btn = event.target.closest(".key-save");
      if (!btn) return;
      copyText(btn.dataset.copy);
      var original = btn.textContent;
      btn.textContent = "copied!";
      setTimeout(function () { btn.textContent = original; }, 1500);
    });
  }

  function setupExport() {
    var btn = document.getElementById("btn-copy-all");
    var out = document.getElementById("export-cmds");
    if (!btn || !out) return;
    var lines = [];
    lines.push("# run these in your terminal - keys stay on YOUR machine");
    lines.push("");
    lines.push("aether login openai");
    lines.push("aether login anthropic");
    lines.push("aether login google");
    lines.push("aether login deepseek");
    lines.push("aether login openrouter");
    lines.push("");
    lines.push("aether keys   # verify what is configured");
    out.textContent = lines.join("\n");
    btn.addEventListener("click", function () {
      copyText(out.textContent);
      btn.textContent = "copied!";
      setTimeout(function () { btn.textContent = "Copy all commands"; }, 1500);
    });
  }

  function init() {
    var session = window.AetherAuth.getSession();
    var gate = document.getElementById("auth-gate");
    var app = document.getElementById("connect-app");
    if (session) {
      if (gate) gate.hidden = true;
      if (app) app.hidden = false;
      if (session.provider) {
        var oauth = document.getElementById("oauth-title");
        if (oauth) oauth.textContent = "Signing in with " + (session.provider === "github" ? "GitHub" : "Google") + " — complete the device flow in your terminal";
      }
    } else {
      if (gate) gate.hidden = false;
      if (app) app.hidden = true;
    }
    buildGrid();
    setupCopy();
    setupExport();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
