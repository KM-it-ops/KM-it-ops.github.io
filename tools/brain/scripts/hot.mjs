import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const claudeDir = process.env.CLAUDE_DIR;
if (!claudeDir) {
  console.error("CLAUDE_DIR is required");
  process.exit(1);
}

const memoryDir = join(claudeDir, "memory");
mkdirSync(memoryDir, { recursive: true });

const hot = [];
for (const bucket of ["project", "reference", "user", "feedback"]) {
  const dir = join(memoryDir, bucket);
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    const raw = readFileSync(join(dir, file), "utf8");
    const nameMatch = raw.match(/^name:\s*(.+)$/m);
    const descMatch = raw.match(/^description:\s*(.+)$/m);
    hot.push({
      name: nameMatch?.[1]?.trim() ?? file.replace(/\.md$/, ""),
      bucket,
      description: descMatch?.[1]?.trim() ?? "",
    });
  }
}

const lines = [
  "# Hot Memories",
  "",
  ...hot.map((e) => `- **[[${e.name}]]** (${e.bucket}) — ${e.description}`),
  "",
];

writeFileSync(join(memoryDir, "hot.md"), lines.join("\n"));
console.log(`Wrote memory/hot.md (${hot.length} memories)`);
