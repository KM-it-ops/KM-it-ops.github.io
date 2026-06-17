# GitHub Profile Setup

## Profile README repository

**Repo:** [github.com/KM-it-ops/KM-it-ops](https://github.com/KM-it-ops/KM-it-ops)

Source of truth in this portfolio repo:

- [`PROFILE_README.md`](../PROFILE_README.md) → `README.md`
- [`assets/profile-banner.svg`](../assets/profile-banner.svg) → `assets/profile-banner.svg`

Deploy from this repo:

```bash
git clone https://github.com/KM-it-ops/KM-it-ops.git /tmp/KM-it-ops
./scripts/deploy-profile-readme.sh /tmp/KM-it-ops
cd /tmp/KM-it-ops && git push origin main
```

Or copy manually from [`profile-repo/`](../profile-repo/).

## Profile bio

GitHub → **Settings → Profile → Bio** — paste:

```
Security+ · SOC / Detection Engineering · MITRE ATT&CK
Building inspectable defensive security: AgentForge, log detection, vuln workflows
Charlotte NC · Remote · km-it-ops.github.io
```

## Display name

```
Mahmoud ("Michael") Al Kurdi
```

## Pinned repositories (in this order)

1. [AgentForge-ATT-CKLens-Benchmark](https://github.com/KM-it-ops/AgentForge-ATT-CKLens-Benchmark)
2. [AgentForge](https://github.com/KM-it-ops/AgentForge)
3. [memory-mcp](https://github.com/KM-it-ops/memory-mcp)
4. [security-log-anomaly-detection](https://github.com/KM-it-ops/security-log-anomaly-detection)
5. [phishing-email-classifier](https://github.com/KM-it-ops/phishing-email-classifier)
6. [KM-it-ops.github.io](https://github.com/KM-it-ops/KM-it-ops.github.io)

Pin via: GitHub profile → **Customize pins**.

## Profile photo

Use the same image as the portfolio: `assets/profile-portrait.png`

## Social preview

The profile README banner (`assets/profile-banner.svg`) renders at the top of your GitHub profile. OG/social cards for the portfolio site use `assets/og-image.svg`.

## Per-repo README standard

For flagship repos, open with:

```markdown
## Problem
## Method
## Evidence
## Verify locally
## Links
```

Reference: [ZuriZeal/Security_Portfolio](https://github.com/ZuriZeal/Security_Portfolio)
