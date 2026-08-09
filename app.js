/* AETHER — marketing site interactions. Vanilla JS. No dependencies. */

(function () {
  "use strict";

  /* ---------- data: real command list (from crates/aether-cli) ---------- */

  var COMMANDS = [
    ["ask \"<question>\"", "one-shot streaming answer"],
    ["agent \"<task>\"", "3-model loop: plan → build → route"],
    ["chat", "interactive session"],
    ["use <provider>/<model>", "switch provider/model"],
    ["models", "list available models"],
    ["providers", "list all providers with key status"],
    ["sessions", "list / show / resume / delete"],
    ["recall \"<phrase>\"", "search past sessions"],
    ["sync", "push / pull sessions (gist or folder)"],
    ["tui", "interactive terminal UI"]
  ];

  function buildCommands() {
    var grid = document.getElementById("commands-grid");
    if (!grid) return;
    COMMANDS.forEach(function (pair) { addChip(grid, pair); });
  }

  function addChip(grid, pair) {
    var chip = document.createElement("div");
    chip.className = "cmd-chip";
    var top = document.createElement("div");
    top.className = "cmd-top";
    var code = document.createElement("code");
    code.textContent = "aether " + pair[0];
    var copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy-btn copy-btn-sm";
    copy.setAttribute("aria-label", "Copy command: " + code.textContent);
    copy.setAttribute("data-copy-text", code.textContent);
    copy.innerHTML = '<svg class="icon-copy" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="5" y="5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M11 5V3.5a1 1 0 0 0-1-1H3.5a1 1 0 0 0-1 1V10a1 1 0 0 0 1 1H5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><svg class="icon-check" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    top.appendChild(code);
    top.appendChild(copy);
    var desc = document.createElement("span");
    desc.className = "cmd-desc";
    desc.textContent = pair[1];
    chip.appendChild(top);
    chip.appendChild(desc);
    grid.appendChild(chip);
  }

  /* ---------- terminal typing animation ---------- */

  var SCRIPT = [
    { text: "$ aether ask \"explain this codebase\"", cls: "t-cmd" },
    { text: "aether v0.5.0 - rust - zen", cls: "t-dim", delay: 350 },
    { text: "model: deepseek-v4-flash-free", cls: "t-model", delay: 350 },
    { text: "AETHER", cls: "t-aether", delay: 700 },
    { text: "A single static Rust binary —", cls: "t-out", delay: 450 },
    { text: "no Node, no Electron, no runtime", cls: "t-out", delay: 450 },
    { text: "to install. Boots in milliseconds.", cls: "t-out", delay: 450 },
    { text: "", cls: "", delay: 200 },
    { text: "$ aether chat", cls: "t-cmd", delay: 900 },
    { text: "zen: deepseek-v4-flash-free", cls: "t-dim", delay: 600 },
    { text: "3 steps planned, 3 executed — 1.4s", cls: "t-green", delay: 650 },
    { text: "19 providers · 0 API keys to start", cls: "t-out", delay: 450 },
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

  function showCopied(btn) {
    btn.classList.add("copied");
    btn.setAttribute("aria-label", "Copied");
    setTimeout(function () {
      btn.classList.remove("copied");
      var base = btn.getAttribute("data-copy-label") || "Copy";
      btn.setAttribute("aria-label", base);
    }, 1500);
  }

  function setupCopy() {
    var primary = document.getElementById("copy-install");
    var hint = document.getElementById("copy-hint");
    if (primary && hint) {
      primary.addEventListener("click", function () {
        var codeEl = document.getElementById("install-code");
        var text = codeEl ? codeEl.textContent : "curl -fsSL https://aetherdz.github.io/aether-site/install.sh | sh";
        copyText(text);
        primary.classList.add("copied");
        hint.textContent = "copied!";
        setTimeout(function () {
          primary.classList.remove("copied");
          hint.textContent = "copy";
        }, 1800);
      });
    }

    var others = document.querySelectorAll("[data-copy]");
    others.forEach(function (btn) {
      btn.addEventListener("click", function () {
        copyText(btn.getAttribute("data-copy"));
        if (btn.classList.contains("copy-btn-inline")) {
          showCopied(btn);
        }
      });
    });

    var copyBtns = document.querySelectorAll(".copy-btn[data-copy-text]");
    copyBtns.forEach(function (btn) {
      btn.setAttribute("data-copy-label", btn.getAttribute("aria-label") || "Copy");
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy-text") || "";
        copyText(text);
        showCopied(btn);
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
          var wrap = group.parentElement.querySelector(".code-block[data-pane-wrap='" + method + "']");
          if (wrap) {
            var wrappers = group.parentElement.querySelectorAll(".code-block[data-pane-wrap]");
            wrappers.forEach(function (w) {
              var on = w === wrap;
              w.hidden = !on;
              var pane = w.querySelector(".install-code");
              if (pane) {
                pane.classList.toggle("active", on);
                pane.hidden = !on;
              }
            });
          }
        });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */

  function setupFaq() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var btn = item.querySelector(".faq-q");
      var panel = item.querySelector(".faq-a");
      if (!btn || !panel) return;
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        items.forEach(function (other) {
          var otherBtn = other.querySelector(".faq-q");
          var otherPanel = other.querySelector(".faq-a");
          if (!otherBtn || !otherPanel) return;
          otherBtn.setAttribute("aria-expanded", "false");
          otherPanel.hidden = true;
        });
        if (!open) {
          btn.setAttribute("aria-expanded", "true");
          panel.hidden = false;
        }
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
    var targets = document.querySelectorAll(".section, .cta, .terminal, .providers-box, .stats");
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

  /* ---------- theme toggle (light / dark) ---------- */

  var THEME_KEY = "aether-theme";

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function setStoredTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* noop */ }
  }

  function systemDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    syncThemeMeta(root, theme);
    syncThemeToggle(root, theme);
  }

  function effectiveTheme() {
    var stored = getStoredTheme();
    if (stored === "dark" || stored === "light") return stored;
    return systemDark() ? "dark" : "light";
  }

  function syncThemeMeta(root, theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0c0c0e" : "#ffffff");
  }

  function syncThemeToggle(root, theme) {
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  function setupThemeToggle() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      setStoredTheme(next);
    });
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (!getStoredTheme()) applyTheme(systemDark() ? "dark" : "light");
      });
    }
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

  applyTheme(effectiveTheme());

  document.addEventListener("DOMContentLoaded", function () {
    buildCommands();
    runTerminal();
    setupCopy();
    setupReveal();
    setupInstallTabs();
    setupFaq();
    setupThemeToggle();
    setupNavToggle();
  });
})();
