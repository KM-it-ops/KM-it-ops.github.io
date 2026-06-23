import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const claudeDir = process.env.CLAUDE_DIR;
if (!claudeDir) {
  console.error("CLAUDE_DIR is required");
  process.exit(1);
}

const SECRET_RE = /sk-[a-zA-Z0-9]{20,}/;
const memoryDir = join(claudeDir, "memory");
const violations = [];

function walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs);
      continue;
    }
    if (!entry.name.endsWith(".md")) continue;
    const raw = readFileSync(abs, "utf8");
    if (SECRET_RE.test(raw)) {
      violations.push(abs);
    }
  }
}

walk(memoryDir);

if (violations.length > 0) {
  console.error("Secret lint failed:");
  for (const file of violations) {
    console.error(`  - ${file}`);
  }
  process.exit(1);
}

console.log("Lint clean");
