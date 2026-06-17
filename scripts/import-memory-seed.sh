#!/usr/bin/env bash
# Import a memory-seeds/*.md file into the shared brain vault (CLAUDE_DIR/memory).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SEED="${1:-masked-signal-github-brand-rollout}"

CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
BRAIN_DIR="${BRAIN_DIR:-$CLAUDE_DIR/tools/brain}"
SRC="$ROOT/memory-seeds/project/${SEED}.md"
DEST="$CLAUDE_DIR/memory/project/${SEED}.md"

if [[ ! -f "$SRC" ]]; then
  echo "Seed not found: $SRC"
  exit 1
fi

if [[ ! -d "$BRAIN_DIR" ]]; then
  echo "Brain toolkit not found at $BRAIN_DIR"
  echo "Install tools/brain under CLAUDE_DIR or set BRAIN_DIR."
  exit 1
fi

mkdir -p "$CLAUDE_DIR/memory/project"
cp "$SRC" "$DEST"
echo "Copied → $DEST"

export CLAUDE_DIR
npm --prefix "$BRAIN_DIR" run index
npm --prefix "$BRAIN_DIR" run hot
npm --prefix "$BRAIN_DIR" run lint
echo "Brain index + hot + lint OK."
