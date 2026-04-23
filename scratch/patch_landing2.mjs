import { readFileSync, writeFileSync } from "fs";

const filePath = "src/app/ClientLanding.tsx";
const raw = readFileSync(filePath);
let content = raw.toString("latin1");

// 1. Fix the RDV button href from /dashboard/student/appointments to /rendez-vous
const oldHref = 'href="/dashboard/student/appointments"';
const newHref = 'href="/rendez-vous"';

if (!content.includes(oldHref)) {
    if (content.includes('/rendez-vous')) {
        console.log("RDV href already updated to /rendez-vous. Skipping patch 1.");
    } else {
        console.error("Could not find RDV button href. Manual check needed.");
    }
} else {
    content = content.replace(oldHref, newHref);
    console.log("✅ Patch 1: RDV button href updated to /rendez-vous");
}

// 2. Add "Prendre RDV" link to the nav desktop links
const navLinksOld = `<Link href="/blog" className="hover:text-[#E7162A] transition-colors">Blog</Link>`;
const navLinksNew = `<Link href="/blog" className="hover:text-[#E7162A] transition-colors">Blog</Link>
            <a href="/rendez-vous" className="hover:text-[#E7162A] transition-colors">Prendre RDV</a>`;

if (content.includes(navLinksOld) && !content.includes('/rendez-vous" className="hover:text-[#E7162A] transition-colors">Prendre RDV')) {
    content = content.replace(navLinksOld, navLinksNew);
    console.log("✅ Patch 2: Nav link 'Prendre RDV' added");
} else {
    console.log("Patch 2: Nav already has RDV link or blog link not found. Skipping.");
}

// 3. Also fix the hero CTA — remove duplicate placement-test link if added by previous patch
// The previous patch added an <a href="/placement-test"> after the existing <Link href="/placement-test">
// We want to keep only one. Let's detect and remove if duplicated.
const dupPlacement = `</Link>\n\n            <a href="/placement-test"`;
if (content.includes(dupPlacement)) {
    // Find the section and remove the extra <a> tag
    const startDup = content.indexOf(dupPlacement);
    const closeA = content.indexOf("</a>", startDup + dupPlacement.length);
    if (closeA !== -1) {
        const removed = content.slice(startDup + "</Link>".length, closeA + "</a>".length);
        content = content.slice(0, startDup + "</Link>".length) + content.slice(closeA + "</a>".length);
        console.log("✅ Patch 3: Removed duplicate placement-test <a> link");
    }
} else {
    console.log("Patch 3: No duplicate placement-test link found. OK.");
}

writeFileSync(filePath, Buffer.from(content, "latin1"));
console.log("\n✅ All patches applied to ClientLanding.tsx!");
