import { readFileSync, writeFileSync } from "fs";

const filePath = "src/app/ClientLanding.tsx";
try {
    const raw = readFileSync(filePath);
    // Try to decode as latin1 which is usually how these weird encodings look on Windows
    // then write back as proper UTF-8
    const content = raw.toString("latin1");
    writeFileSync(filePath, content, "utf8");
    console.log("✅ ClientLanding.tsx sanitized to UTF-8");
} catch (e) {
    console.error("❌ Error sanitizing file:", e.message);
}
