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

## 1.5 · `git push` fails with 403: `Permission … denied to cursor[bot]`

`gh auth login` is correct, but **Git** may still be using a different credential (e.g. the automation user `cursor[bot]`) for HTTPS. Fix it so pushes use the same account as `gh`.

1. **Confirm the active account** (should be `KM-it-ops`, not `cursor`):

   ```bash
   gh auth status
   ```

2. **Tell Git to use `gh` for github.com** (run once per machine):

   ```bash
   gh auth setup-git
   ```

3. **Push again** from your repo:

   ```bash
   git push -u origin main
   ```

4. **If it still shows `cursor[bot]`** — check the remote has **no** embedded token:

   ```bash
   git remote -v
   ```

   It should be exactly `https://github.com/KM-it-ops/<repo>.git` with no `x-access-token` in the URL. If not, reset:

   ```bash
   git remote set-url origin https://github.com/KM-it-ops/KM-it-ops.git
   ```

   Then run `gh auth setup-git` again and push.

5. **Alternative: SSH** (if you use SSH keys on your GitHub account):

   ```bash
   git remote set-url origin git@github.com:KM-it-ops/KM-it-ops.git
   git push -u origin main
   ```

6. **Cursor cloud agents / restricted sandboxes** sometimes only have a bot token; they may be unable to push to repos other than the one the task is bound to. In that case: push from your **own computer** (after steps 1–2) or add `README.md` via the **GitHub web UI**.

---

## 2 · Profile README (the bio at the top of your GitHub page)

GitHub shows the README of a repo that matches your username exactly (`KM-it-ops` / `KM-it-ops`).

**If you see** `GraphQL: Name already exists on this account` **— skip create.** The repo is already there. Only clone, add `README.md`, push:

```bash
mkdir -p ~/tmp/km-profile && cd ~/tmp/km-profile
gh repo clone KM-it-ops/KM-it-ops
cd KM-it-ops

curl -fsSL "https://raw.githubusercontent.com/KM-it-ops/KM-it-ops.github.io/main/PROFILE_README.md" -o PROFILE_README.full
sed -n '/^---$/,$p' PROFILE_README.full | tail -n +2 > README.md
rm PROFILE_README.full

git add README.md
git commit -m "add profile README"   # or "init" if the repo is empty
git push -u origin main
```

**If the repo does not exist yet**, create and clone in one go:

```bash
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

### Windows PowerShell (use this if `&&`, `curl`, or `sed` failed)

PowerShell 5.x does not support `&&` (use `;` or separate lines). It has no `sed`/`tail` by default. **Do not** paste `cd` and `curl` on the same line.

**If you already ran** `gh repo create KM-it-ops ... --clone` **and the `KM-it-ops` folder exists**, skip the `mkdir` / `gh repo create` lines and only `cd` into that folder.

```powershell
# 1) Go to the repo folder (adjust path if yours differs)
cd $HOME\tmp\km-profile\KM-it-ops
# If you never made tmp\km-profile, create and clone instead:
# New-Item -ItemType Directory -Force -Path "$HOME\tmp\km-profile" | Out-Null
# Set-Location "$HOME\tmp\km-profile"
# gh repo clone KM-it-ops/KM-it-ops

# 2) Download PROFILE_README.md (PowerShell 6+ has curl as alias for Invoke-WebRequest)
$uri = "https://raw.githubusercontent.com/KM-it-ops/KM-it-ops.github.io/main/PROFILE_README.md"
Invoke-WebRequest -Uri $uri -OutFile "PROFILE_README.full" -UseBasicParsing

# 3) Same as: sed -n '/^---$/,$p' | tail -n +2  (from first --- to EOF, then drop 2 lines)
$lines = (Get-Content "PROFILE_README.full")
$start = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match '^\s*---\s*$') { $start = $i; break }
}
if ($start -lt 0) { throw "No --- line found in PROFILE_README" }
$segment = $lines[$start..($lines.Count - 1)]
# tail -n +2 => skip first 2 lines of that segment
$outLines = if ($segment.Count -gt 2) { $segment[2..($segment.Count - 1)] } else { @() }
$outLines -join "`n" | Set-Content -Path "README.md" -Encoding utf8
Remove-Item "PROFILE_README.full"

# 4) Commit and push
git add README.md
git commit -m "init profile README"
git push -u origin main
```

**If `git` says the remote is empty or branch is wrong:** run `git status` and `git branch`. First push: `git push -u origin main`.

**PowerShell 7+** supports `&&`. You can also use **Git Bash** (installed with Git for Windows) and run the original **bash** block from §2 unchanged.

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