import { readFileSync, writeFileSync } from "fs";

const files = [
  "src/app/blog/[slug]/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/dashboard/admin/articles/page.tsx",
];

for (const file of files) {
  try {
    const raw = readFileSync(file);
    let content = raw.toString("utf8");

    // Count escaped backticks before fix
    const before = (content.match(/\\`/g) || []).length;

    // Replace \` with ` (escaped backticks → real backticks)
    content = content.replace(/\\`/g, "`");
    // Also replace \${  with ${ inside template literals
    content = content.replace(/\\\$/g, "$");

    const after = (content.match(/\\`/g) || []).length;

    writeFileSync(file, content, "utf8");
    console.log(`✅ ${file}: fixed ${before} escaped backtick(s), ${after} remaining`);
  } catch (e) {
    console.error(`❌ Error processing ${file}:`, e.message);
  }
}

console.log("\nDone!");
