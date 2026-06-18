#!/usr/bin/env bash
# Start memory-mcp stdio server for Cursor cloud agents.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Repo-local vault — do not inherit cloud VM CLAUDE_DIR (/tmp/brain-vault).
export CLAUDE_DIR="${PORTFOLIO_BRAIN_DIR:-$ROOT/.brain}"
export BRAIN_DIR="${PORTFOLIO_BRAIN_TOOLKIT:-$ROOT/tools/brain}"

if [[ ! -d "$ROOT/tools/memory-mcp/node_modules" ]]; then
  "$ROOT/scripts/setup-memory-mcp.sh" >&2
fi

if [[ ! -f "$CLAUDE_DIR/memory/project/masked-signal-github-brand-rollout.md" ]]; then
  "$ROOT/scripts/setup-memory-mcp.sh" >&2
fi

exec node "$ROOT/tools/memory-mcp/node_modules/tsx/dist/cli.mjs" \
  "$ROOT/tools/memory-mcp/src/server.ts"
