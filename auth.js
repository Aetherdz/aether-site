/* Aether — shared auth state (demo). Session stores name+email only. Never a password. */

(function () {
  "use strict";

  var STORAGE_KEY = "aether.session.v1";

  function loadSession() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

  window.AetherAuth = {
    getSession: loadSession,
    signIn: function (email, name) {
      var session = { email: email, name: name || email.split("@")[0], createdAt: Date.now() };
      saveSession(session);
      return session;
    },
    signInWithProvider: function (provider) {
      var label = provider === "github" ? "GitHub" : "Google";
      var session = { email: "you@" + provider + ".com", name: label + " user", provider: provider, createdAt: Date.now() };
      saveSession(session);
      return session;
    },
    signOut: function () {
      clearSession();
      window.location.href = "./index.html";
    }
  };

  function setError(fieldId, message) {
    var el = document.getElementById(fieldId);
    if (!el) return;
    el.textContent = message;
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function initAuthPage() {
    var form = document.getElementById("auth-form");
    var tabSignin = document.getElementById("tab-signin");
    var tabSignup = document.getElementById("tab-signup");
    var fieldName = document.getElementById("field-name");
    var submit = document.getElementById("auth-submit");
    var title = document.getElementById("auth-title");
    var sub = document.getElementById("auth-sub");
    var alertEl = document.getElementById("form-alert");
    if (!form) return;

    var mode = "signin";

    function setMode(next) {
      mode = next;
      var isSignup = mode === "signup";
      tabSignin.classList.toggle("active", !isSignup);
      tabSignup.classList.toggle("active", isSignup);
      tabSignin.setAttribute("aria-selected", String(!isSignup));
      tabSignup.setAttribute("aria-selected", String(isSignup));
      fieldName.hidden = !isSignup;
      title.textContent = isSignup ? "Create your account" : "Sign in to Aether";
      sub.textContent = isSignup
        ? "One account. Every provider. Sync your terminal across machines."
        : "Sync your providers and keys across the terminal and the web.";
      submit.textContent = isSignup ? "Create account" : "Sign in";
      document.getElementById("password").setAttribute("autocomplete", isSignup ? "new-password" : "current-password");
      alertEl.hidden = true;
    }

    tabSignin.addEventListener("click", function () { setMode("signin"); });
    tabSignup.addEventListener("click", function () { setMode("signup"); });

    document.querySelectorAll(".oauth-login .oauth-btn").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        var provider = btn.getAttribute("data-provider");
        if (provider === "github" || provider === "google") {
          window.AetherAuth.signInWithProvider(provider);
        }
        window.location.href = "./connect.html";
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      alertEl.hidden = true;
      var email = document.getElementById("email").value.trim();
      var password = document.getElementById("password").value;
      var name = document.getElementById("name").value.trim();
      var ok = true;

      setError("err-email", "");
      setError("err-password", "");
      setError("err-name", "");

      if (mode === "signup" && !name) {
        setError("err-name", "Display name is required.");
        ok = false;
      }
      if (!validEmail(email)) {
        setError("err-email", "Enter a valid email address.");
        ok = false;
      }
      if (password.length < 8) {
        setError("err-password", "Password must be at least 8 characters.");
        ok = false;
      }

      if (!ok) return;

      var session = window.AetherAuth.signIn(email, name);
      var next = new URLSearchParams(window.location.search).get("next") || "./connect.html";
      if (next === "swarm") next = "./swarm.html";
      window.location.href = next;
    });
  }

  function initConnectHeader() {
    var chip = document.getElementById("user-chip");
    var session = loadSession();
    if (!chip) return;
    if (session) {
      chip.hidden = false;
      chip.textContent = session.name;
      chip.title = session.email;
      chip.addEventListener("click", function () {
        window.AetherAuth.signOut();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initAuthPage();
    initConnectHeader();
  });
})();
