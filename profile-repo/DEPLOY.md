# Deploy to KM-it-ops/KM-it-ops

Copy this folder's contents into the [KM-it-ops profile repository](https://github.com/KM-it-ops/KM-it-ops):

```bash
git clone https://github.com/KM-it-ops/KM-it-ops.git
cp README.md KM-it-ops/
mkdir -p KM-it-ops/assets
cp assets/profile-banner.svg KM-it-ops/assets/
cd KM-it-ops
git add README.md assets/profile-banner.svg
git commit -m "Refresh profile README for Masked Signal brand"
git push origin main
```

Or run from the portfolio repo root:

```bash
./scripts/deploy-profile-readme.sh
```
