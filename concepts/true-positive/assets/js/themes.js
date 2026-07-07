/* KM://OPS theme lab — runtime palette overrides for the preview phase.
   Usage: any page + ?theme=<slug> (persists via localStorage).
   "volt" (electric blue × violet) is the baked-in default in style.css.
   Before launch: bake the chosen palette into :root and delete this file + themes.html. */
(function () {
  "use strict";

  window.KM_THEMES = {
    volt: {
      label: "Volt", note: "Electric blue × violet — the current default.",
      vars: null // baked into style.css :root
    },
    ultraviolet: {
      label: "Ultraviolet", note: "Purple-first with cyan edges. Deep-space SOC.",
      vars: {
        "--ink": "#08050f", "--ink-rgb": "8, 5, 15", "--ink-2": "#0c0818",
        "--panel": "#120c24", "--panel-2": "#181031",
        "--line": "#2a1f4d", "--line-bright": "#4d3a8f",
        "--pri": "#a855f7", "--pri-rgb": "168, 85, 247", "--pri-dim": "#8338ec",
        "--pri-ghost": "rgba(168, 85, 247, 0.08)",
        "--sec": "#22e0ff", "--sec-rgb": "34, 224, 255", "--sec-dim": "#1898b3", "--sec-soft": "#c8f7ff",
        "--alarm": "#ff5470", "--tri": "#ff4dd8",
        "--txt-hi": "#f6f2ff", "--txt": "#e2d8ff", "--txt-mid": "#c4b4f2",
        "--txt-dim": "#a292d6", "--txt-faint": "#7a6ca6", "--txt-ghost": "#554c7e",
        "--paper-acc": "#6d28d9"
      }
    },
    synthwave: {
      label: "Synthwave", note: "Hot magenta × electric blue. Loudest option.",
      vars: {
        "--ink": "#0f0512", "--ink-rgb": "15, 5, 18", "--ink-2": "#150819",
        "--panel": "#1c0c24", "--panel-2": "#241031",
        "--line": "#40204d", "--line-bright": "#7a3a8f",
        "--pri": "#ff4dd8", "--pri-rgb": "255, 77, 216", "--pri-dim": "#d63ab2",
        "--pri-ghost": "rgba(255, 77, 216, 0.08)",
        "--sec": "#4da3ff", "--sec-rgb": "77, 163, 255", "--sec-dim": "#3579d6", "--sec-soft": "#d9e9ff",
        "--alarm": "#ff5470", "--tri": "#22e0ff",
        "--txt-hi": "#fff2fb", "--txt": "#ffd8f4", "--txt-mid": "#f2b4de",
        "--txt-dim": "#d692c0", "--txt-faint": "#a66c92", "--txt-ghost": "#7e4c6e",
        "--paper-acc": "#be185d"
      }
    },
    phosphor: {
      label: "Phosphor", note: "The original CRT green × amber. Classic terminal.",
      vars: {
        "--ink": "#040907", "--ink-rgb": "4, 9, 7", "--ink-2": "#071009",
        "--panel": "#0a140e", "--panel-2": "#0d1a12",
        "--line": "#1d3a28", "--line-bright": "#2f5f3f",
        "--pri": "#3dff77", "--pri-rgb": "61, 255, 119", "--pri-dim": "#27c257",
        "--pri-ghost": "rgba(61, 255, 119, 0.08)",
        "--sec": "#ffb648", "--sec-rgb": "255, 182, 72", "--sec-dim": "#b3742a", "--sec-soft": "#ffe9c2",
        "--alarm": "#ff5054", "--tri": "#59f7ff",
        "--txt-hi": "#f4fff7", "--txt": "#d7ffe4", "--txt-mid": "#b9e6c6",
        "--txt-dim": "#9fd4ae", "--txt-faint": "#79a98a", "--txt-ghost": "#557a63",
        "--paper-acc": "#0c5c2e"
      }
    },
    ember: {
      label: "Ember", note: "Amber terminal × alarm red. Warm and severe.",
      vars: {
        "--ink": "#0f0904", "--ink-rgb": "15, 9, 4", "--ink-2": "#170e06",
        "--panel": "#1f1409", "--panel-2": "#2a1c0d",
        "--line": "#4d3520", "--line-bright": "#8f6234",
        "--pri": "#ffb648", "--pri-rgb": "255, 182, 72", "--pri-dim": "#d98f2b",
        "--pri-ghost": "rgba(255, 182, 72, 0.08)",
        "--sec": "#ff5470", "--sec-rgb": "255, 84, 112", "--sec-dim": "#c23a52", "--sec-soft": "#ffd9e0",
        "--alarm": "#ff5470", "--tri": "#ffe066",
        "--txt-hi": "#fff8f0", "--txt": "#ffe9d2", "--txt-mid": "#f2cfa8",
        "--txt-dim": "#d6ac82", "--txt-faint": "#a67f5c", "--txt-ghost": "#7e5f42",
        "--paper-acc": "#92400e"
      }
    },
    arctic: {
      label: "Arctic", note: "Ice cyan × frost white. Cold, calm, precise.",
      vars: {
        "--ink": "#05090f", "--ink-rgb": "5, 9, 15", "--ink-2": "#081019",
        "--panel": "#0b1622", "--panel-2": "#101d2e",
        "--line": "#1e3247", "--line-bright": "#3a5c80",
        "--pri": "#7dd9ff", "--pri-rgb": "125, 217, 255", "--pri-dim": "#4aa8d6",
        "--pri-ghost": "rgba(125, 217, 255, 0.08)",
        "--sec": "#c9d8ea", "--sec-rgb": "201, 216, 234", "--sec-dim": "#8fa5bd", "--sec-soft": "#eef4fb",
        "--alarm": "#ff5470", "--tri": "#a5f3fc",
        "--txt-hi": "#f4faff", "--txt": "#d8e9f7", "--txt-mid": "#b4cee3",
        "--txt-dim": "#92b2cc", "--txt-faint": "#6c8aa3", "--txt-ghost": "#4c637a",
        "--paper-acc": "#0e4f7a"
      }
    },
    redline: {
      label: "Redline", note: "Alert red × steel white. Incident-response energy.",
      vars: {
        "--ink": "#0f0508", "--ink-rgb": "15, 5, 8", "--ink-2": "#17080c",
        "--panel": "#1f0c11", "--panel-2": "#2a1017",
        "--line": "#4d2028", "--line-bright": "#8f3a48",
        "--pri": "#ff4655", "--pri-rgb": "255, 70, 85", "--pri-dim": "#d63440",
        "--pri-ghost": "rgba(255, 70, 85, 0.08)",
        "--sec": "#e8ecf2", "--sec-rgb": "232, 236, 242", "--sec-dim": "#a8b0bd", "--sec-soft": "#f6f8fa",
        "--alarm": "#ffd166", "--tri": "#ffd166",
        "--txt-hi": "#fff2f4", "--txt": "#ffd8dd", "--txt-mid": "#f2b4bc",
        "--txt-dim": "#d6929b", "--txt-faint": "#a66c74", "--txt-ghost": "#7e4c54",
        "--paper-acc": "#b3122e"
      }
    },
    goldrush: {
      label: "Goldrush", note: "Gold × violet on onyx. Expensive-looking.",
      vars: {
        "--ink": "#0c0a04", "--ink-rgb": "12, 10, 4", "--ink-2": "#131006",
        "--panel": "#1a1609", "--panel-2": "#241e0d",
        "--line": "#4d4220", "--line-bright": "#8f7a34",
        "--pri": "#ffd166", "--pri-rgb": "255, 209, 102", "--pri-dim": "#d6a83f",
        "--pri-ghost": "rgba(255, 209, 102, 0.08)",
        "--sec": "#b46bff", "--sec-rgb": "180, 107, 255", "--sec-dim": "#7d4ac2", "--sec-soft": "#e9dcff",
        "--alarm": "#ff5470", "--tri": "#fff3c4",
        "--txt-hi": "#fffdf0", "--txt": "#f7eecd", "--txt-mid": "#e3d5a8",
        "--txt-dim": "#c6b482", "--txt-faint": "#96885c", "--txt-ghost": "#6e6342",
        "--paper-acc": "#8a5a0a"
      }
    },
    tealab: {
      label: "Tealab", note: "Teal × lime. Matrix-adjacent without the green cliché.",
      vars: {
        "--ink": "#04100d", "--ink-rgb": "4, 16, 13", "--ink-2": "#061711",
        "--panel": "#081f17", "--panel-2": "#0b2a1f",
        "--line": "#16473a", "--line-bright": "#2a8069",
        "--pri": "#2dd4bf", "--pri-rgb": "45, 212, 191", "--pri-dim": "#1fa08f",
        "--pri-ghost": "rgba(45, 212, 191, 0.08)",
        "--sec": "#a3e635", "--sec-rgb": "163, 230, 53", "--sec-dim": "#7cb324", "--sec-soft": "#ecfccb",
        "--alarm": "#ff5470", "--tri": "#67e8f9",
        "--txt-hi": "#f0fffb", "--txt": "#d2f7ec", "--txt-mid": "#aae3d2",
        "--txt-dim": "#86c6b3", "--txt-faint": "#609284", "--txt-ghost": "#446b60",
        "--paper-acc": "#0f766e"
      }
    },
    ghost: {
      label: "Ghost", note: "Monochrome white × blue accents. Brutalist minimum.",
      vars: {
        "--ink": "#06070d", "--ink-rgb": "6, 7, 13", "--ink-2": "#0a0c14",
        "--panel": "#10131d", "--panel-2": "#161a28",
        "--line": "#262b3d", "--line-bright": "#4a5271",
        "--pri": "#e8ecff", "--pri-rgb": "232, 236, 255", "--pri-dim": "#b0b6d6",
        "--pri-ghost": "rgba(232, 236, 255, 0.08)",
        "--sec": "#4da3ff", "--sec-rgb": "77, 163, 255", "--sec-dim": "#3579d6", "--sec-soft": "#d9e9ff",
        "--alarm": "#ff5470", "--tri": "#b46bff",
        "--txt-hi": "#ffffff", "--txt": "#dfe3f2", "--txt-mid": "#bcc2d8",
        "--txt-dim": "#9aa1bd", "--txt-faint": "#717898", "--txt-ghost": "#505571",
        "--paper-acc": "#1f2452"
      }
    }
  };

  var params = new URLSearchParams(window.location.search);
  var fromUrl = params.get("theme");
  if (fromUrl) {
    if (fromUrl === "volt" || !window.KM_THEMES[fromUrl]) {
      try { localStorage.removeItem("kmTheme"); } catch (e) {}
    } else {
      try { localStorage.setItem("kmTheme", fromUrl); } catch (e) {}
    }
  }

  var active = null;
  try { active = localStorage.getItem("kmTheme"); } catch (e) {}
  var theme = active && window.KM_THEMES[active];
  if (theme && theme.vars) {
    var root = document.documentElement;
    for (var k in theme.vars) root.style.setProperty(k, theme.vars[k]);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!theme || !theme.vars) return;
    var chip = document.createElement("div");
    chip.className = "theme-chip";
    chip.innerHTML = "THEME: " + theme.label +
      ' <a href="themes.html">lab</a> <button type="button">reset</button>';
    chip.querySelector("button").addEventListener("click", function () {
      try { localStorage.removeItem("kmTheme"); } catch (e) {}
      var url = new URL(window.location.href);
      url.searchParams.delete("theme");
      window.location.href = url.toString();
    });
    document.body.appendChild(chip);
  });
})();
