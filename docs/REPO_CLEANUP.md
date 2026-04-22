# Repository inventory and cleanup (KM-it-ops)

Generated from `gh repo list KM-it-ops` on 2026-04-22. Use this as the approval checklist before archiving or deleting anything.

## Public repositories (8)

| Repository | Last push (UTC) | Role |
|------------|-----------------|------|
| KM-it-ops.github.io | 2026-04-20 | **Canonical** portfolio — keep, pin |
| StockPath-Navigator | 2026-02-19 | Flagship expert system — **keep**, pin |
| Vulnerability-Management-Mini-Program | 2026-02-19 | Flagship security UI — **keep**, pin |
| phishing-email-classifier | 2026-02-18 | Resume + site featured — **keep**, pin |
| security-log-anomaly-detection | 2026-02-18 | Resume + site featured — **keep**, pin |
| cursor-starter | 2026-03-28 | Generic scaffold — **candidate to archive** if unused |
| Agentic-Critic | 2026-03-28 | Experiment — **candidate to archive** if superseded |
| Automations | 2026-03-24 | Scripts bucket — **keep or archive** based on whether you still reference it |

## Recommended pinned set (6)

Matches the portfolio and resume story:

1. KM-it-ops.github.io  
2. phishing-email-classifier  
3. security-log-anomaly-detection  
4. StockPath-Navigator  
5. Vulnerability-Management-Mini-Program  
6. *(optional sixth)* Automations — only if it showcases work you want visible; otherwise pin another repo or leave a slot open.

## Archive (after you confirm)

Archiving is reversible. Example (replace `<repo>`):

```bash
gh repo archive KM-it-ops/<repo> --confirm
```

Suggested order: confirm each repo has no inbound links from the live site or resume, then archive **cursor-starter** and **Agentic-Critic** if they are not part of your public narrative.

## Delete (only with explicit per-repo OK)

None of the eight repos are obvious empty duplicates. **Do not delete** forks or shared history without manual review. If you later create a true duplicate scaffold by mistake, delete from the GitHub UI or:

```bash
gh repo delete KM-it-ops/<repo> --confirm
```

## Polish (non-destructive)

For each kept repo, from the GitHub UI or `gh repo edit`:

- Add a one-line **description** and **topics** (e.g. `python`, `security`, `machine-learning`, `prompt-engineering`).
- Ensure **default branch** is `main` and README explains purpose in the first paragraph.

## Profile README

Paste the contents of [`PROFILE_README.md`](../PROFILE_README.md) into a repository named **`KM-it-ops`** (username and repo name must match for the profile README to appear).
