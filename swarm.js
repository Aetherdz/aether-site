/* Aether — Swarm Mission Control. Decompose a task, animate parallel subagents. */

(function () {
  "use strict";

  var DECOMPOSERS = {
    "design": ["Define endpoints", "Design data model", "Plan auth flow"],
    "api": ["Map endpoints", "Inspect auth", "Check rate limits"],
    "audit": ["Scan inputs", "Test authz", "Check deps"],
    "attack": ["Recon surface", "Probe auth", "Fuzz inputs"],
    "auth": ["Design flow", "Pick provider", "Plan sessions"],
    "go": ["Define types", "Write handlers", "Add tests"],
    "microservice": ["Define types", "Write handlers", "Add tests"],
    "write": ["Outline", "Draft", "Review"],
    "test": ["Plan cases", "Write tests", "Run coverage"],
    "plan": ["Gather context", "Draft steps", "Estimate risk"]
  };

  function pickSubtasks(task) {
    var lower = task.toLowerCase();
    for (var key in DECOMPOSERS) {
      if (lower.indexOf(key) !== -1) {
        return DECOMPOSERS[key].slice();
      }
    }
    return ["Understand the task", "Draft the approach", "Verify the details"];
  }

  function statusLine(text, cls) {
    var line = document.createElement("div");
    line.className = "swarm-line " + (cls || "");
    line.textContent = text;
    return line;
  }

  function run() {
    var form = document.getElementById("swarm-form");
    var mission = document.getElementById("mission");
    var idle = document.getElementById("swarm-idle");
    var decompose = document.getElementById("swarm-decompose");
    var status = document.getElementById("swarm-status");
    var lanes = document.getElementById("swarm-lanes");
    if (!form || !mission) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var task = mission.value.trim();
      if (!task) return;

      idle.hidden = true;
      decompose.hidden = false;
      lanes.textContent = "";
      status.textContent = "decomposing task...";
      status.className = "swarm-status";

      var subtasks = pickSubtasks(task);
      var laneEls = [];

      setTimeout(function () {
        status.textContent = "planned " + subtasks.length + " subtasks on zen/deepseek-v4-flash-free";
        subtasks.forEach(function (name, index) {
          var lane = document.createElement("div");
          lane.className = "swarm-lane";
          lane.setAttribute("role", "status");

          var head = document.createElement("div");
          head.className = "lane-head";
          var num = document.createElement("span");
          num.className = "lane-num";
          num.textContent = String(index + 1).padStart(2, "0");
          var title = document.createElement("span");
          title.className = "lane-title";
          title.textContent = name;
          head.appendChild(num);
          head.appendChild(title);

          var progress = document.createElement("div");
          progress.className = "lane-progress";
          var bar = document.createElement("div");
          bar.className = "lane-bar";
          bar.setAttribute("role", "progressbar");
          bar.setAttribute("aria-valuemin", "0");
          bar.setAttribute("aria-valuemax", "100");
          bar.setAttribute("aria-valuenow", "0");
          progress.appendChild(bar);

          var state = document.createElement("div");
          state.className = "lane-state";
          state.textContent = "queued";

          lane.appendChild(head);
          lane.appendChild(progress);
          lane.appendChild(state);
          lanes.appendChild(lane);

          laneEls.push({ bar: bar, state: state, progress: 0 });
        });

        runSwarm(laneEls, status, subtasks.length);
      }, 700);
    });
  }

  function runSwarm(laneEls, status, total) {
    var phases = ["thinking", "working", "merging"];
    var started = laneEls.map(function () { return false; });
    var done = 0;
    var interval = null;
    var tick = 0;

    laneEls.forEach(function (lane, index) {
      var startDelay = 400 + index * 650;
      setTimeout(function () {
        started[index] = true;
        lane.state.textContent = phases[0];
      }, startDelay);
    });

    interval = setInterval(function () {
      tick += 1;
      laneEls.forEach(function (lane, index) {
        if (!started[index]) return;
        if (lane.progress >= 100) return;
        var speed = 1 + (index % 3) * 0.6;
        lane.progress = Math.min(100, lane.progress + speed);
        lane.bar.style.width = lane.progress + "%";
        lane.bar.setAttribute("aria-valuenow", String(Math.round(lane.progress)));
        if (lane.progress < 40) {
          lane.state.textContent = phases[0];
        } else if (lane.progress < 85) {
          lane.state.textContent = phases[1];
        } else {
          lane.state.textContent = phases[2];
        }
        if (lane.progress >= 100 && lane.state.dataset.done !== "1") {
          lane.state.dataset.done = "1";
          done += 1;
        }
      });
      if (done >= total) {
        clearInterval(interval);
        status.textContent = total + " results merged";
        status.className = "swarm-status done";
      }
    }, 120);
  }

  function suggestions() {
    var box = document.getElementById("swarm-suggestions");
    var input = document.getElementById("mission");
    if (!box || !input) return;
    box.addEventListener("click", function (event) {
      var btn = event.target.closest(".suggestion");
      if (!btn) return;
      input.value = btn.textContent;
      input.focus();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    run();
    suggestions();
  });
})();
