#!/usr/bin/env bash
# Install memory-mcp deps and seed the cloud brain vault (.brain/).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Repo-local vault — do not inherit cloud VM CLAUDE_DIR (/tmp/brain-vault).
export CLAUDE_DIR="${PORTFOLIO_BRAIN_DIR:-$ROOT/.brain}"
export BRAIN_DIR="${PORTFOLIO_BRAIN_TOOLKIT:-$ROOT/tools/brain}"

echo "Setting up memory-mcp (CLAUDE_DIR=$CLAUDE_DIR)" >&2

cd "$ROOT/tools/memory-mcp"
npm ci --silent

mkdir -p "$CLAUDE_DIR/memory/"{user,feedback,project,reference}

SEED="$CLAUDE_DIR/memory/project/masked-signal-github-brand-rollout.md"
if [[ ! -f "$SEED" ]]; then
  cp "$ROOT/memory-seeds/project/masked-signal-github-brand-rollout.md" "$SEED"
  echo "Seeded $SEED" >&2
fi

export CLAUDE_DIR
npm --prefix "$BRAIN_DIR" run index
npm --prefix "$BRAIN_DIR" run hot
npm --prefix "$BRAIN_DIR" run lint

echo "memory-mcp ready" >&2
