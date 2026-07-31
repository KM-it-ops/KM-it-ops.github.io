# GITHUB_USER_TOKEN — profile bio & settings

The cloud agent can update your **GitHub profile bio, display name, location, website, and hireable flag** automatically when this secret exists.

Pinned repositories **cannot** be set via API — use the pin checklist below after the workflow runs.

## Create the token

### Option A — Fine-grained (recommended)

1. https://github.com/settings/personal-access-tokens/new
2. **Resource owner:** your account (`KM-it-ops`)
3. **Repository access:** No repository access required (account permission only)
4. **Account permissions → Profile:** Read and write
5. Generate and copy the token

### Option B — Classic PAT

1. https://github.com/settings/tokens/new
2. Scope: **`user`** (Update ALL user data)
3. Generate and copy

## Add the secret

1. https://github.com/KM-it-ops/KM-it-ops.github.io/settings/secrets/actions
2. **New repository secret**
3. Name: `GITHUB_USER_TOKEN`
4. Value: paste token

## Run

Actions → **Sync GitHub profile settings** → Run workflow

Or push a change to `.github/profile-settings.json`.

## Pin repositories (manual — no API)

After bio sync, pin these in order at https://github.com/KM-it-ops:

1. AgentForge-ATT-CKLens-Benchmark
2. AgentForge
3. memory-mcp
4. security-log-anomaly-detection
5. phishing-email-classifier
6. KM-it-ops.github.io

Click **Customize your pins** on your profile sidebar.
