const fs = require('fs');

const files = [
  'src/app/ClientLanding.tsx',
  'src/app/blog/page.tsx',
  'src/app/blog/[slug]/page.tsx'
];

const replacements = [
  { search: /\bbg-slate-950\b/g, replace: "bg-slate-50 dark:bg-slate-950" },
  { search: /\btext-slate-50\b/g, replace: "text-slate-900 dark:text-slate-50" },
  { search: /\bbg-slate-900\b/g, replace: "bg-white dark:bg-slate-900" },
  { search: /\bbg-slate-800\b/g, replace: "bg-slate-100 dark:bg-slate-800" },
  { search: /\border-slate-800\b/g, replace: "border-slate-200 dark:border-slate-800" },
  { search: /\border-slate-700\b/g, replace: "border-slate-300 dark:border-slate-700" },
  { search: /\border-white\/10\b/g, replace: "border-black/10 dark:border-white/10" },
  { search: /\btext-white\b/g, replace: "text-slate-900 dark:text-white" },
  { search: /\btext-slate-400\b/g, replace: "text-slate-600 dark:text-slate-400" },
  { search: /\btext-slate-300\b/g, replace: "text-slate-700 dark:text-slate-300" },
  { search: /\btext-slate-500\b/g, replace: "text-slate-500 dark:text-slate-400" },
  { search: /\bbg-\[#060A14\]\b/g, replace: "bg-slate-100 dark:bg-[#060A14]" },
  { search: /\btext-slate-600\b/g, replace: "text-slate-500 dark:text-slate-600" }
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  for (const { search, replace } of replacements) {
    // We only replace if it's not already preceded by dark: or if it hasn't been changed yet
    // Actually simpler: let's just do a blanket replace and then fix duplicate dark:dark:
    content = content.replace(search, replace);
  }
  // fix duplicates like dark:bg-slate-50 dark:bg-slate-950
  content = content.replace(/dark:bg-slate-50 dark:bg-slate-950/g, 'dark:bg-slate-950');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
}
