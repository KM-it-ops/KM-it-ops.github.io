# One-time: enable profile README auto-sync

The cloud agent cannot push to `KM-it-ops/KM-it-ops` directly. After you add a PAT secret, the workflow pushes profile changes for you.

## Steps (2 minutes)

1. **Create a fine-grained PAT**  
   GitHub → Settings → Developer settings → Fine-grained tokens → Generate  
   - Repository access: **Only `KM-it-ops/KM-it-ops`**  
   - Permissions: **Contents → Read and write**

2. **Add repo secret**  
   `KM-it-ops.github.io` → Settings → Secrets and variables → Actions → New repository secret  
   - Name: `PROFILE_REPO_TOKEN`  
   - Value: your PAT

3. **Run the workflow**  
   Actions → **Sync profile README** → Run workflow → Run

The workflow copies `profile-repo/README.md` and `profile-repo/assets/profile-banner.svg` to your live GitHub profile.

## Verify

Visit https://github.com/KM-it-ops — you should see the Masked Signal banner and SOC-focused profile README.
