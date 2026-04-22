# Public-facing polish — one-page checklist

Everything below is designed so you can paste each block into a terminal with `gh` (the GitHub CLI) authenticated as **KM-it-ops**, and be done. Order matters only within a section.

> **Why can't the cloud agent do this automatically?** Its scoped token only has push access to this single repo, not org/user/repo-metadata or cross-repo branch API. So I prepared the content here; you run the commands.

---

## 1 · Verify `gh` is logged in as you

```bash
gh auth status
# Expect: Logged in to github.com account KM-it-ops
```

If not: `gh auth login` and pick **github.com → HTTPS → authenticate via browser**.

---

## 2 · Profile README (the bio at the top of your GitHub page)

GitHub shows the README of a repo that matches your username exactly. Create it once:

```bash
# From anywhere on your machine
mkdir -p ~/tmp/km-profile && cd ~/tmp/km-profile
gh repo create KM-it-ops --public --description "Profile README" --clone
cd KM-it-ops

# Copy the polished profile content out of this portfolio repo
curl -fsSL https://raw.githubusercontent.com/KM-it-ops/KM-it-ops.github.io/main/PROFILE_README.md \
  | sed -n '/^---$/,$p' | tail -n +2 > README.md

git add README.md
git commit -m "init"
git push -u origin main
```

> The `sed` line strips the HTML comment + first `---` from `PROFILE_README.md`; the rest is the ready-to-display bio.

Visit `https://github.com/KM-it-ops` and your new bio renders.

---

## 3 · Repo descriptions, homepages, topics

One `gh repo edit` call per repo. Safe to run repeatedly — it's idempotent. Replace / add / remove topics as you like.

```bash
# Portfolio site
gh repo edit KM-it-ops/KM-it-ops.github.io \
  --description 'Mahmoud ("Michael") Al Kurdi — personal site. Static HTML/CSS/vanilla JS, zero deps.' \
  --homepage 'https://km-it-ops.github.io' \
  --add-topic portfolio --add-topic github-pages --add-topic static-site \
  --add-topic html --add-topic css --add-topic javascript

# Phishing classifier
gh repo edit KM-it-ops/phishing-email-classifier \
  --description 'ML classifier for phishing emails — TF-IDF + Random Forest with 5-fold CV and interpretable feature importance.' \
  --add-topic python --add-topic machine-learning --add-topic scikit-learn \
  --add-topic cybersecurity --add-topic phishing --add-topic nlp

# Log anomaly detection
gh repo edit KM-it-ops/security-log-anomaly-detection \
  --description 'Rule-based + statistical SOC anomaly engine: brute force, port scans, off-hours access, privilege escalation, volume spikes.' \
  --add-topic python --add-topic pandas --add-topic numpy \
  --add-topic soc --add-topic detection-engineering --add-topic incident-response

# StockPath Navigator
gh repo edit KM-it-ops/StockPath-Navigator \
  --description 'AI-powered stock trading expert system — 17 prompt-engineering techniques, ReAct workflows, React dashboard.' \
  --add-topic prompt-engineering --add-topic llm --add-topic react \
  --add-topic expert-system --add-topic fintech

# VulnTrack
gh repo edit KM-it-ops/Vulnerability-Management-Mini-Program \
  --description 'VulnTrack — vulnerability management dashboard in Flask + SQLite with KPIs, CRUD, REST API, and dark-mode UI.' \
  --add-topic python --add-topic flask --add-topic sqlite \
  --add-topic cybersecurity --add-topic vulnerability-management --add-topic dashboard

# Cursor starter (keep only if still useful; otherwise archive — see §5)
gh repo edit KM-it-ops/cursor-starter \
  --description 'Template repo for bootstrapping a new Cursor project with a global orchestrator user rule.' \
  --add-topic cursor --add-topic template --add-topic developer-tools
```

Verify:

```bash
gh repo list KM-it-ops --json name,description,homepage,repositoryTopics \
  --jq '.[] | {name, description, homepage, topics:[.repositoryTopics[].name]}'
```

---

## 4 · Pinned repositories

Pins have no CLI — do this in the UI once:

1. Go to `https://github.com/KM-it-ops`
2. Under your avatar, click **Customize your pins**
3. Pin these six, in this order:
   1. `KM-it-ops.github.io`
   2. `phishing-email-classifier`
   3. `security-log-anomaly-detection`
   4. `StockPath-Navigator`
   5. `Vulnerability-Management-Mini-Program`
   6. *(optional)* `cursor-starter` — only if it still represents current work

---

## 5 · Branch + repo cleanup

### Stale branches on `cursor-starter`

There's a long-lived `genspark_ai_developer` branch (1 commit ahead of `main`, never merged) and an open PR #1. Decide:

```bash
# If you want the work on main:
gh pr merge KM-it-ops/cursor-starter#1 --squash --delete-branch

# If you want to drop it:
gh pr close KM-it-ops/cursor-starter#1 --delete-branch
```

### Archive repos you're done with

Archiving is reversible and removes a repo from the "active" ranking on your profile without deleting anything.

```bash
# Only if cursor-starter is not representative work:
gh repo archive KM-it-ops/cursor-starter --yes

# Delete only if you're certain (this IS destructive):
# gh repo delete KM-it-ops/<repo> --yes
```

### Verify no loose branches across active repos

```bash
for r in KM-it-ops.github.io phishing-email-classifier security-log-anomaly-detection \
         StockPath-Navigator Vulnerability-Management-Mini-Program cursor-starter; do
  echo "=== $r ==="
  gh api "repos/KM-it-ops/$r/branches" --jq '.[] | .name'
done
```

Anything other than `main` (and, while in flight, feature branches you're actively working on) can usually be deleted:

```bash
gh api -X DELETE "repos/KM-it-ops/<repo>/git/refs/heads/<branch>"
```

---

## 6 · Social accounts on your GitHub profile

UI-only (no CLI). On `https://github.com/KM-it-ops`, click **Edit profile** and confirm:

- **Name:** `Mahmoud ("Michael") Al Kurdi`
- **Bio:** `Security engineer · detection analyst · Python tooling & LLM expert systems. Charlotte, NC.`
- **URL:** `https://km-it-ops.github.io`
- **Company:** (blank or current)
- **Location:** `Charlotte, NC`
- **Social accounts:** add the LinkedIn URL.

---

## 7 · LinkedIn headline (paste as-is)

If you want the site and GitHub to match LinkedIn:

```
Security engineer · detection analyst · Python tooling & LLM expert systems
CompTIA Security+ · B.S. IT Cybersecurity (SNHU, summa cum laude)
```

---

## 8 · Smoke test

```bash
# Site is up
curl -sI https://km-it-ops.github.io/ | head -1
# → HTTP/2 200

# PDF resolves under the new filename
curl -sI https://km-it-ops.github.io/assets/Mahmoud_Al_Kurdi_Resume_2026.pdf | head -1
# → HTTP/2 200

# Profile README renders
curl -sI https://github.com/KM-it-ops | head -1
```

---

Done. Your public surface area should now read as a single coherent identity: site, profile, repo descriptions, pins, and résumé all aligned.
