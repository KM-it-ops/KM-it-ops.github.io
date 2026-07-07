/* KM://OPS — shared behavior. No dependencies, no build step. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "close ×" : "menu ≡";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "menu ≡";
      }
    });
  }

  /* ---------- Ticker: duplicate track content for seamless loop ---------- */
  document.querySelectorAll(".ticker__track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Score bars animate to data-score when visible ---------- */
  var bars = document.querySelectorAll(".scorebar");
  if (bars.length) {
    var animate = function (bar) {
      var fill = bar.querySelector(".fill");
      var score = parseInt(bar.getAttribute("data-score"), 10) || 0;
      requestAnimationFrame(function () { fill.style.width = score + "%"; });
    };
    if ("IntersectionObserver" in window) {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animate(en.target); bio.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      bars.forEach(function (b) { bio.observe(b); });
    } else {
      bars.forEach(animate);
    }
  }

  /* ---------- Text decode scramble ---------- */
  var GLYPHS = "<>/\\|=+*#_0134";
  function decode(el) {
    var final = el.getAttribute("data-final") || el.textContent;
    if (reduced) { el.textContent = final; return; }
    var frames = 16, i = 0;
    var t = setInterval(function () {
      i++;
      var keep = Math.floor(final.length * (i / frames));
      var s = final.slice(0, keep);
      for (var j = keep; j < final.length; j++) {
        s += final[j] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = s;
      if (i >= frames) { clearInterval(t); el.textContent = final; }
    }, 42);
  }
  var decodeEls = [].slice.call(document.querySelectorAll("[data-decode]"));
  decodeEls.forEach(function (el) {
    el.setAttribute("data-final", el.textContent);
    var head = el.closest("h1, h2");
    if (head && !head.hasAttribute("aria-label")) {
      head.setAttribute("aria-label", head.textContent.replace(/\s+/g, " ").trim());
    }
  });
  function runDecodes() { decodeEls.forEach(decode); }

  /* ---------- Boot sequence (first visit per session, home only) ---------- */
  function runBoot(done) {
    var wants = document.body.hasAttribute("data-boot");
    if (!wants || reduced || sessionStorage.getItem("kmBooted")) { done(); return; }
    try { sessionStorage.setItem("kmBooted", "1"); } catch (e) {}
    var boot = document.createElement("div");
    boot.className = "boot";
    boot.setAttribute("aria-hidden", "true");
    boot.innerHTML = '<div class="boot__inner"></div><span class="boot__skip">click to skip</span>';
    document.body.appendChild(boot);
    var inner = boot.querySelector(".boot__inner");
    var lines = [
      "KM://OPS SECURE TERMINAL v2.0",
      "&gt; authenticating visitor ......... <span class='ok'>OK</span>",
      "&gt; loading case file MK-2026-001 .. <span class='ok'>OK</span>",
      "&gt; rendering verdict ..."
    ];
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      boot.classList.add("is-done");
      setTimeout(function () { boot.remove(); done(); }, 450);
    }
    boot.addEventListener("click", finish);
    document.addEventListener("keydown", function esc(e) {
      finish(); document.removeEventListener("keydown", esc);
    });
    var i = 0;
    (function next() {
      if (finished) return;
      if (i < lines.length) {
        var d = document.createElement("div");
        d.innerHTML = lines[i++];
        inner.appendChild(d);
        setTimeout(next, 290);
      } else {
        var v = document.createElement("div");
        v.className = "boot__verdict";
        v.textContent = "TRUE POSITIVE";
        inner.appendChild(v);
        setTimeout(finish, 800);
      }
    })();
  }
  runBoot(runDecodes);

  /* ---------- Stat count-up ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var countUp = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (reduced || isNaN(target)) return;
      var decimals = (el.getAttribute("data-count").indexOf(".") > -1) ? 2 : 0;
      var start = null, dur = 900;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        p = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * p).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { cio.observe(c); });
    }
  }

  /* ---------- Terminal easter egg ---------- */
  var term = document.getElementById("terminal");
  var fab = document.getElementById("termFab");
  if (!term || !fab) return;

  var out = term.querySelector(".terminal__out");
  var input = term.querySelector("input");
  var closeBtn = term.querySelector(".terminal__close");

  function openTerm() {
    term.classList.add("is-open");
    fab.setAttribute("aria-expanded", "true");
    input.focus();
    if (!out.dataset.booted) {
      out.dataset.booted = "1";
      print("KM://OPS console v2.0 — type <b>help</b> to list commands.");
    }
  }
  function closeTerm() {
    term.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
    fab.focus();
  }
  fab.addEventListener("click", function () {
    term.classList.contains("is-open") ? closeTerm() : openTerm();
  });
  closeBtn.addEventListener("click", closeTerm);
  document.addEventListener("keydown", function (e) {
    if (e.key === "`" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault();
      term.classList.contains("is-open") ? closeTerm() : openTerm();
    }
    if (e.key === "Escape" && term.classList.contains("is-open")) closeTerm();
  });

  function print(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  var COMMANDS = {
    help: function () {
      print("commands: <b>whoami</b> · <b>projects</b> · <b>attacklens</b> · <b>agentforge</b> · <b>resume</b> · <b>contact</b> · <b>verify</b> · <b>ascii</b> · <b>boot</b> · <b>clear</b> · <b>exit</b>");
    },
    whoami: function () {
      print("Mahmoud (\"Michael\") Al Kurdi — Security+ certified SOC analyst & detection engineer. Charlotte, NC / Remote. B.S. Information Technologies (Cybersecurity), Summa Cum Laude.");
    },
    projects: function () {
      print("flagships: <a href='projects.html#agentforge'>AgentForge</a> · <a href='projects.html#attacklens'>ATT&amp;CKLens Benchmark</a><br>also: Vulnerability Management Mini Program · Security Log Anomaly Detection");
    },
    attacklens: function () {
      print("ATT&CKLens Benchmark — 7 agent artifacts, rubric-scored:<br>" +
        "Cursor 100 · Claude Code 98 · Hermes Nemotron 98 · Codex 96 · Lovable Repaired 76 · Mistral Vibe 75 · Lovable Original 40<br>" +
        "<a href='https://github.com/KM-it-ops/AgentForge-ATT-CKLens-Benchmark' target='_blank' rel='noopener'>→ reproduce it yourself</a>");
    },
    agentforge: function () {
      print("AgentForge — one spec, many agents. 6 adapter targets, npm @kmitops/agentforge@0.3.1.<br>" +
        "<a href='https://km-it-ops.github.io/AgentForge/docs/demo/' target='_blank' rel='noopener'>→ live demo</a>");
    },
    resume: function () {
      print("opening <a href='resume.html'>resume.html</a> …");
      setTimeout(function () { window.location.href = "resume.html"; }, 700);
    },
    contact: function () {
      print("escalate: <a href='mailto:kurdi.michael.it@gmail.com'>kurdi.michael.it@gmail.com</a> · <a href='contact.html'>all channels</a>");
    },
    verify: function () {
      print("verdict: <b style='color:var(--pri)'>TRUE POSITIVE</b> — every claim on this site maps to a public repo, credential, or document. No fabricated telemetry.");
    },
    ascii: function () {
      print("<pre style='margin:0;line-height:1.25;color:var(--pri)'>" +
        " _  ___  ___     __   ____  ___  ____\n" +
        "| |/ / \\/ | (__)/ /  / __ \\/ _ \\/ __/\n" +
        "|   &lt;| |\\/| |  / /  / /_/ / ___/\\ \\\n" +
        "|_|\\_\\_|  |_| /_/   \\____/_/  /___/\n" +
        "TRUE POSITIVE — verified, not vibes.</pre>");
    },
    boot: function () {
      print("replaying boot sequence …");
      try { sessionStorage.removeItem("kmBooted"); } catch (e) {}
      setTimeout(function () { window.location.href = "index.html"; }, 500);
    },
    clear: function () { out.innerHTML = ""; },
    exit: closeTerm,
    sudo: function () { print("nice try. least privilege applies here too."); },
    "rm": function () { print("blocked by policy. this is a defensive-security household."); }
  };

  input.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var raw = input.value.trim();
    input.value = "";
    if (!raw) return;
    print("<span class='in'>guest@km-ops:~$ " + raw.replace(/[<>&]/g, "") + "</span>");
    var cmd = raw.split(/\s+/)[0].toLowerCase();
    (COMMANDS[cmd] || function () {
      print("command not found: " + cmd.replace(/[<>&]/g, "") + " — try <b>help</b>");
    })();
  });
})();
