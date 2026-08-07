/* Aether — OAuth device flow (the opencode pattern). */
(function () {
  "use strict";

  var PROVIDERS = {
    github: {
      command: "aether login-device github",
      verify: "https://github.com/login/device",
    },
    google: {
      command: "aether login-device google",
      verify: "https://www.google.com/device",
    },
  };

  var panel = document.getElementById("device-panel");
  var cmdEl = document.getElementById("device-cmd");
  var urlEl = document.getElementById("device-url");
  var step1 = document.getElementById("device-step-1");
  var step2 = document.getElementById("device-step-2");
  var statusEl = document.getElementById("device-status");
  var btnCopy = document.getElementById("btn-device-copy");
  var btnOpen = document.getElementById("btn-device-open");

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
  }

  function flash(el, text) {
    var old = el.textContent;
    el.textContent = text;
    window.setTimeout(function () {
      el.textContent = old;
    }, 1600);
  }

  document.querySelectorAll(".oauth-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var provider = btn.getAttribute("data-device");
      var cfg = PROVIDERS[provider];
      if (!cfg) return;
      cmdEl.textContent = cfg.command;
      urlEl.textContent = cfg.verify;
      panel.hidden = false;
      step1.textContent = "Step 1 — copy this command and run it in your terminal:";
      step2.textContent = "Step 2 — the terminal shows a one-time code. Open the verification page and enter it:";
      statusEl.textContent =
        "The terminal polls automatically. Your token is stored on your machine (" +
        "~/.config/aether/device-tokens.json), never in this browser.";
      copyText(cfg.command).then(function () {
        flash(btnCopy, "Copied");
      }).catch(function () {});
    });
  });

  btnCopy.addEventListener("click", function () {
    copyText(cmdEl.textContent).then(function () {
      flash(btnCopy, "Copied");
    }).catch(function () {});
  });

  btnOpen.addEventListener("click", function () {
    window.open(urlEl.textContent, "_blank", "noopener");
  });
})();
