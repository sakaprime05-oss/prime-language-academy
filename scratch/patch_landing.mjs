import { readFileSync, writeFileSync } from "fs";

const filePath = "src/app/ClientLanding.tsx";
const raw = readFileSync(filePath);          // read as Buffer (no charset decode)
let content = raw.toString("latin1");        // decode as latin-1 to preserve bytes

// ---- patch 1: fix hero CTA row → make it flex-wrap and add 2 buttons ----
// Find the old CTA block and replace it
const oldBlock = `className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-8"`;
const newBlock = `className="pt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6"`;

if (!content.includes(oldBlock)) {
  console.error("Block 1 not found! Dumping a preview:");
  const idx = content.indexOf("gap-8");
  console.log(content.slice(Math.max(0, idx - 120), idx + 200));
  process.exit(1);
}

content = content.replace(oldBlock, newBlock);

// ---- patch 2: Insert the 2 new CTA buttons after the existing /placement-test Link ----
const anchor = `            </Link>\n          </motion.div>\n        </div>\n      </motion.header>`;
const replacement = `            </Link>

            <a href="/placement-test" className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl rounded-2xl bg-white/5 border border-white/20 font-bold hover:bg-white/10 text-white transition-all flex items-center justify-center gap-3 hover:-translate-y-2 duration-300 shadow-2xl backdrop-blur-md">
              Test de Niveau Gratuit
            </a>

            <a href="/dashboard/student/appointments" className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl rounded-2xl bg-blue-600/20 border border-blue-400/30 font-bold hover:bg-blue-600/40 text-white transition-all flex items-center justify-center gap-3 hover:-translate-y-2 duration-300 shadow-2xl backdrop-blur-md">
              Prendre un RDV
            </a>
          </motion.div>
        </div>
      </motion.header>`;

// Find the placement-test Link ending before </motion.div>
// The anchor is the closing of the last Link before </motion.div>
const placementAnchor = `href="/placement-test"`;
const placementIdx = content.indexOf(placementAnchor);
if (placementIdx === -1) {
  console.error("placement-test link not found");
  process.exit(1);
}

// Find the </Link> after the placement-test link
const closingLinkAfterPlacement = content.indexOf("</Link>", placementIdx);
if (closingLinkAfterPlacement === -1) {
  console.error("Closing </Link> after placement-test not found");
  process.exit(1);
}

// Check what comes after that </Link>
const after = content.slice(closingLinkAfterPlacement, closingLinkAfterPlacement + 200);
console.log("After placement-test link:", JSON.stringify(after));

// Replace the segment from </Link>\n          </motion.div> with the new CTAs
const closingMotion = "</Link>\n          </motion.div>";
const closingMotionIdx = content.indexOf(closingMotion, placementIdx);
if (closingMotionIdx === -1) {
  console.error("Closing motion not found");
  process.exit(1);
}

// Check if there are already 3 buttons (i.e. patch already applied)
if (content.includes("Prendre un RDV")) {
  console.log("Patch already applied. Exiting.");
  process.exit(0);
}

// Remove the existing /placement-test Link entirely and replace with the 3 buttons  
// Find start of the /placement-test Link
const placementLinkStart = content.lastIndexOf("\n            \n            <Link href=\"/placement-test\"", closingMotionIdx);
const altStart = content.lastIndexOf("\n            <Link href=\"/placement-test\"", closingMotionIdx);
const linkStart = Math.max(placementLinkStart, altStart);

if (linkStart === -1) {
  console.error("Could not find start of placement-test Link");
  // just insert after the closing link
  content = content.slice(0, closingMotionIdx + "</Link>".length) +
    `\n\n            <a href="/placement-test" className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl rounded-2xl bg-white/5 border border-white/20 font-bold hover:bg-white/10 text-white transition-all flex items-center justify-center gap-3 hover:-translate-y-2 duration-300 shadow-2xl backdrop-blur-md">\n              Test de Niveau Gratuit\n            </a>\n\n            <a href="/dashboard/student/appointments" className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl rounded-2xl bg-blue-600/20 border border-blue-400/30 font-bold hover:bg-blue-600/40 text-white transition-all flex items-center justify-center gap-3 hover:-translate-y-2 duration-300 shadow-2xl backdrop-blur-md">\n              Prendre un RDV\n            </a>` +
    content.slice(closingMotionIdx + "</Link>".length);
} else {
  content = content.slice(0, closingMotionIdx + "</Link>".length) +
    `\n\n            <a href="/placement-test" className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl rounded-2xl bg-white/5 border border-white/20 font-bold hover:bg-white/10 text-white transition-all flex items-center justify-center gap-3 hover:-translate-y-2 duration-300 shadow-2xl backdrop-blur-md">\n              Test de Niveau Gratuit\n            </a>\n\n            <a href="/dashboard/student/appointments" className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl rounded-2xl bg-blue-600/20 border border-blue-400/30 font-bold hover:bg-blue-600/40 text-white transition-all flex items-center justify-center gap-3 hover:-translate-y-2 duration-300 shadow-2xl backdrop-blur-md">\n              Prendre un RDV\n            </a>` +
    content.slice(closingMotionIdx + "</Link>".length);
}

writeFileSync(filePath, Buffer.from(content, "latin1"));
console.log("Patch applied successfully!");
