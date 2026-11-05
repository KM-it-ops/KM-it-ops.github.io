# QA summary: Blueprint Schematic (Concept 3 rich), branch redesign/blueprint-schematic-2026-11

Run: `npm run build && npm run preview` (port 4181), then `QA_URL=http://127.0.0.1:4181/ python3 qa/qa.py` (Playwright, Chrome). Raw output: `reports/qa-results.json`. Not published (outside docs/).

| Gate | Result |
|---|---|
| 360/390/768/1280/1920 × dark/light × reduced-motion on/off (20 runs): horizontal overflow | PASS, 0px everywhere |
| Type floors (body ≥16, UI ≥15, labels ≥13), no display face on p/li/dd/td | PASS (min 16 / 15 / 13) |
| Contrast, every visible text node vs real bg and worst grid | PASS (min 5.33, worst-grid min 5.14), no opacity-dimmed text |
| Focus ring | PASS, 3px solid (#A84300 light / #FFC56B dark) |
| Fold (H1, role, Resume, proof link in first screen) | PASS, all 20 runs + no-JS |
| H1 accessible text / role string | PASS, exact match with content.ts |
| Reduced motion: sheets revealed at load, 0 animations, parallax off | PASS |
| Live PRM switch | PASS (motion-ok removed, all 5 sheets revealed) |
| Diagram: Enter pins, Esc clears, ↑↓ / →← rove, tap pins, chip navigates, Clear | PASS (1280 + 390 touch, PRM on/off) |
| Assembly: arrows, Enter opens, plate click/tap opens, slider sets --ex, mouse drag, Open all | PASS |
| Theme toggle → data-theme, aria-pressed, localStorage, persists after reload | PASS |
| Touch targets ≥44px | PASS |
| No-JS 360/1280 dark/light: 31 notes visible, 0 overflow, contrast, fold | PASS |
| axe-core 4.x (wcag2a/aa, 21a/aa, 22aa, best-practice), 1280/390 × dark/light × JS/no-JS | PASS, 0 violations in 8 runs |
| External runtime requests | 0 (fonts self-hosted, Google Fonts removed) |
| Link check (curl): resume.html, resume PDF, GitHub, all 9 repos, OFG, AgentForge (archived), live #labs, font licenses | 200. LinkedIn returns 999 to bots (normal LinkedIn anti-bot), URL unchanged from content.ts |

Not done: real-device touch (iOS Safari / Android Chrome), screen-reader pass (NVDA/VoiceOver).
