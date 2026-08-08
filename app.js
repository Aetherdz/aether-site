/* AETHER — marketing site interactions. Vanilla JS. No dependencies. */

(function () {
  "use strict";

  /* ---------- data: command list ---------- */

  var COMMANDS = [
    ["chat", "start a session"],
    ["swarm", "parallel subagents"],
    ["use", "switch provider/model"],
    ["providers", "list providers"],
    ["sessions", "browse/resume sessions"],
    ["sessions resume <id>", "reopen a session"],
    ["stats", "token usage, all sessions"],
    ["recall <phrase>", "search all past sessions"],
    ["mcp", "list connected MCP servers"],
    ["doctor", "health check"],
    ["status", "model + cost"],
    ["upgrade", "update aether"],
    ["completions", "shell completions"],
    ["alias", "manage aliases"],
    ["config", "get/set config"],
    ["login", "store API key"],
    ["logout", "remove API key"],
    ["keys", "list stored keys"],
    ["cost", "session cost"],
    ["sync setup gist", "free cross-device sync via GitHub"],
    ["sync setup folder <path>", "sync via Dropbox/Drive/Nextcloud"],
    ["sync push", "upload sessions"],
    ["sync pull", "download + merge sessions"],
    ["help", "all commands"]
  ];

  function buildCommands() {
    var grid = document.getElementById("commands-grid");
    if (!grid) return;
    COMMANDS.forEach(function (pair) {
      var chip = document.createElement("div");
      chip.className = "cmd-chip";
      var code = document.createElement("code");
      code.textContent = "aether " + pair[0];
      var desc = document.createElement("span");
      desc.className = "cmd-desc";
      desc.textContent = pair[1];
      chip.appendChild(code);
      chip.appendChild(desc);
      grid.appendChild(chip);
    });
  }

  /* ---------- terminal typing animation ---------- */

  var SCRIPT = [
    { text: "$ aether \"explain this codebase\"", cls: "t-cmd" },
    { text: "aether v0.1.0 - zen", cls: "t-dim", delay: 350 },
    { text: "model: deepseek-v4-flash-free", cls: "t-model", delay: 350 },
    { text: "AETHER", cls: "t-aether", delay: 700 },
    { text: "It's a Node CLI with a readline REPL,", cls: "t-out", delay: 450 },
    { text: "hand-rolled ANSI themes, and a", cls: "t-out", delay: 450 },
    { text: "swarm runner that fans out subagents.", cls: "t-out", delay: 450 },
    { text: "", cls: "", delay: 200 },
    { text: "$ aether swarm \"map the attack surface\"", cls: "t-cmd", delay: 900 },
    { text: "spawned 4 subagents in parallel", cls: "t-dim", delay: 600 },
    { text: "recon  /api - 23 endpoints", cls: "t-out", delay: 450 },
    { text: "auth  /login - 2 flows", cls: "t-out", delay: 450 },
    { text: "logic checkout - race window", cls: "t-out", delay: 450 },
    { text: "oss   deps - 0 critical", cls: "t-out", delay: 450 },
    { text: "4 results merged in 3.2s", cls: "t-green", delay: 650 },
    { text: "", cls: "", delay: 300 },
    { text: "$ ", cls: "t-cmd" }
  ];

  function runTerminal() {
    var el = document.getElementById("terminal");
    if (!el) return;
    var i = 0;
    var char = 0;
    var lineEl = null;
    var baseDelay = 12;

    function tick() {
      if (i >= SCRIPT.length) return;
      var item = SCRIPT[i];

      if (char === 0) {
        if (lineEl && lineEl.textContent === "") {
          el.removeChild(lineEl);
        }
        lineEl = document.createElement("span");
        lineEl.className = item.cls;
        el.appendChild(lineEl);
        if (item.text === "") {
          el.appendChild(document.createTextNode("\n"));
          char = 0;
          i += 1;
          setTimeout(tick, item.delay || 120);
          return;
        }
      }

      if (char < item.text.length) {
        lineEl.textContent += item.text.charAt(char);
        char += 1;
        setTimeout(tick, baseDelay);
      } else {
        el.appendChild(document.createTextNode("\n"));
        char = 0;
        i += 1;
        setTimeout(tick, item.delay || 200);
      }
    }

    // caret at end while typing
    var caret = document.createElement("span");
    caret.className = "t-caret";
    caret.setAttribute("aria-hidden", "true");

    setTimeout(function () {
      el.appendChild(caret);
      tick();
    }, 600);

    // keep caret pinned at the bottom line
    var moveCaret = function () {
      if (lineEl) el.appendChild(caret);
    };
    setInterval(moveCaret, 400);
  }

  /* ---------- copy buttons ---------- */

  function setupCopy() {
    var primary = document.getElementById("copy-install");
    var hint = document.getElementById("copy-hint");
    if (primary && hint) {
      primary.addEventListener("click", function () {
        copyText("npm install -g aetherdz");
        hint.textContent = "copied!";
        setTimeout(function () { hint.textContent = "copy"; }, 1800);
      });
    }

    var others = document.querySelectorAll("[data-copy]");
    others.forEach(function (btn) {
      btn.addEventListener("click", function () {
        copyText(btn.getAttribute("data-copy"));
      });
    });
  }

  /* ---------- install method tabs ---------- */

  function setupInstallTabs() {
    var tabs = document.querySelectorAll(".install-tabs");
    tabs.forEach(function (group) {
      var buttons = group.querySelectorAll(".install-tab");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var method = btn.getAttribute("data-method");
          buttons.forEach(function (b) {
            var on = b === btn;
            b.classList.toggle("active", on);
            b.setAttribute("aria-selected", on ? "true" : "false");
          });
          var pane = group.parentElement.querySelector(".install-code[data-pane='" + method + "']");
          if (pane) {
            var siblings = group.parentElement.querySelectorAll(".install-code");
            siblings.forEach(function (p) {
              var on = p === pane;
              p.classList.toggle("active", on);
              p.hidden = !on;
            });
          }
        });
      });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
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

  /* ---------- reveal on scroll ---------- */

  function setupReveal() {
    var targets = document.querySelectorAll(".section, .cta, .terminal, .providers-box");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }

  /* ---------- mobile nav toggle ---------- */

  function setupNavToggle() {
    var toggle = document.getElementById("nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- init ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    buildCommands();
    runTerminal();
    setupCopy();
    setupReveal();
    setupInstallTabs();
    setupNavToggle();
  });
})();
