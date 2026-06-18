import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const claudeDir = process.env.CLAUDE_DIR;
if (!claudeDir) {
  console.error("CLAUDE_DIR is required");
  process.exit(1);
}

const buckets = ["user", "feedback", "project", "reference"];
const entries = [];

for (const bucket of buckets) {
  const dir = join(claudeDir, "memory", bucket);
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    const raw = readFileSync(join(dir, file), "utf8");
    const nameMatch = raw.match(/^name:\s*(.+)$/m);
    const descMatch = raw.match(/^description:\s*(.+)$/m);
    entries.push({
      bucket,
      name: nameMatch?.[1]?.trim() ?? file.replace(/\.md$/, ""),
      description: descMatch?.[1]?.trim() ?? "",
    });
  }
}

const lines = [
  "# Memory Index",
  "",
  "| Name | Type | Description |",
  "| --- | --- | --- |",
  ...entries.map((e) => `| [[${e.name}]] | ${e.bucket} | ${e.description} |`),
  "",
];

writeFileSync(join(claudeDir, "MEMORY.md"), lines.join("\n"));
console.log(`Wrote MEMORY.md (${entries.length} memories)`);
