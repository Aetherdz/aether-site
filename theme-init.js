/* AETHER — theme: dark/light toggle. No dependencies. Loaded in <head> to prevent FOUC. */
(function () {
  "use strict";

  var KEY = "aether-theme";
  var root = document.documentElement;

  function currentTheme() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
    if (saved === "light" || saved === "dark") return saved;
    var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;
    return mq && mq.matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "light" ? "#f6f6fa" : "#0a0a14");
    }
  }

  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    try { localStorage.setItem(KEY, next); } catch (e) { /* storage blocked */ }
    applyTheme(next);
  }

  function injectButton() {
    var scope = document.querySelector(".nav-inner") || document.body;
    if (document.querySelector(".theme-toggle")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "Toggle theme");
    btn.setAttribute("title", "Toggle theme");
    btn.innerHTML =
      '<svg class="theme-icon theme-icon-sun" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3.2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.3 3.3l1.4 1.4M11.3 11.3l1.4 1.4M12.7 3.3l-1.4 1.4M4.7 11.3l-1.4 1.4"/></svg>' +
      '<svg class="theme-icon theme-icon-moon" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z"/></svg>';

    btn.addEventListener("click", toggleTheme);
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTheme(); }
    });

    var actions = scope.querySelector(".nav-actions");
    if (actions) {
      actions.insertBefore(btn, actions.firstChild);
    } else {
      scope.appendChild(btn);
    }
  }

  function init() {
    applyTheme(currentTheme());
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", injectButton);
    } else {
      injectButton();
    }
  }

  init();
})();