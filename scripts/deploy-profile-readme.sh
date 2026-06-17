#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-}"

if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 /path/to/KM-it-ops-clone"
  echo ""
  echo "Example:"
  echo "  git clone https://github.com/KM-it-ops/KM-it-ops.git /tmp/KM-it-ops"
  echo "  $0 /tmp/KM-it-ops"
  exit 1
fi

if [[ ! -d "$TARGET/.git" ]]; then
  echo "Error: $TARGET is not a git repository"
  exit 1
fi

cp "$ROOT/profile-repo/README.md" "$TARGET/README.md"
mkdir -p "$TARGET/assets"
cp "$ROOT/profile-repo/assets/profile-banner.svg" "$TARGET/assets/profile-banner.svg"

echo "Copied profile README and banner to $TARGET"
echo "Next:"
echo "  cd $TARGET"
echo "  git add README.md assets/profile-banner.svg"
echo "  git commit -m 'Refresh profile README for Masked Signal brand'"
echo "  git push origin main"
