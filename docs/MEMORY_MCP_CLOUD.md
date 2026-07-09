# Cloud MCP: memory-mcp

This repo vendors [memory-mcp](https://github.com/KM-it-ops/memory-mcp) so **Cursor Cloud Agents** can read/write the shared brain without a local `~/.claude` install.

## What gets wired

| Piece | Path |
| --- | --- |
| MCP config | `.cursor/mcp.json` |
| Server | `tools/memory-mcp/` |
| Brain toolkit (index/hot/lint) | `tools/brain/` |
| Cloud vault (`CLAUDE_DIR`) | `.brain/` |

## Tools exposed

- `memory_search` — full-text search across vault
- `memory_read` — read one memory by name
- `memory_list` — list memories (optional bucket filter)
- `memory_links` — wikilink inbound/outbound
- `memory_write` — create/update + reindex + lint

## One-time setup (local or CI)

```bash
./scripts/setup-memory-mcp.sh
```

Seeds `masked-signal-github-brand-rollout` from `memory-seeds/` into `.brain/memory/project/`.

## How cloud agents start it

Cursor reads `.cursor/mcp.json` and runs:

```bash
bash scripts/start-memory-mcp.sh
```

Env (set by the wrapper):

- `PORTFOLIO_BRAIN_DIR` → `<repo>/.brain` (default; avoids cloud VM `CLAUDE_DIR` override)
- `PORTFOLIO_BRAIN_TOOLKIT` → `<repo>/tools/brain`

## Your real vault (Windows)

Local clients still point at `C:\AI\KM-IT-OPS` per `memory-mcp/register.md`. The cloud `.brain/` vault is **separate** unless you sync seeds via the `sync-memory-seed.yml` workflow → `KM-it-ops/memory-mcp` wiki-seeds.

Import into your real vault:

```powershell
cd $env:USERPROFILE\.claude\tools\memory-mcp
$env:CLAUDE_DIR = "C:\AI\KM-IT-OPS"
npx tsx scripts/write-wiki-seed.mts masked-signal-github-brand-rollout
```

## Verify

```bash
# After setup — search should find the rollout seed
CLAUDE_DIR=.brain BRAIN_DIR=tools/brain npx --prefix tools/memory-mcp tsx -e "
import { scanMemory } from './tools/memory-mcp/src/scan.js';
import { searchMemory } from './tools/memory-mcp/src/search.js';
const hits = searchMemory(scanMemory('.brain/memory'), { query: 'masked-signal', limit: 5 });
console.log(JSON.stringify(hits, null, 2));
"
```
