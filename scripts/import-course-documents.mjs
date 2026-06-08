import fs from "fs/promises";
import path from "path";
import { existsSync, readFileSync } from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { PrismaClient } from "@prisma/client";

const ROOT = process.cwd();
const SITE_URL = process.env.PLA_PUBLIC_SITE_URL || "https://primelangageacademy.com";
const OUTPUT_ROOT = path.join(ROOT, "public", "course-documents");

const SOURCES = [
  {
    key: "grammar",
    title: "Grammaire - temps essentiels",
    folder: "C:\\Users\\HP ELITEBOOK 840 G5\\Desktop\\GRAMMAR SUR LA PLATEFORME",
  },
  {
    key: "vocabulary",
    title: "Vocabulaire pratique",
    folder: "C:\\Users\\HP ELITEBOOK 840 G5\\Desktop\\VOCABULARY SUR PLATEFORME",
  },
  {
    key: "language-focus",
    title: "Language Focus - structures utiles",
    folder: "C:\\Users\\HP ELITEBOOK 840 G5\\Desktop\\LANGUAGE FOCUS",
  },
  {
    key: "wordz",
    title: "Wordz - outils de phrase",
    folder: "C:\\Users\\HP ELITEBOOK 840 G5\\Desktop\\WORDZ SUR PLATEFORME",
  },
];

const LEARNING_MODULES = [
  {
    key: "start",
    title: "01. Bases pour demarrer",
    description: "Les premiers reperes: present, pronoms, nombres, temps et vocabulaire utile immediatement.",
    patterns: [
      "present simple",
      "present continuous",
      "personal pronouns",
      "personnal pronouns",
      "object pronouns",
      "possessive pronouns",
      "demonstrative pronouns",
      "numbers vocabulary",
      "color vocabulary",
      "time vocabulary",
      "telling the time",
      "shapes vocabulary",
      "50 regular verbs",
    ],
  },
  {
    key: "daily-life",
    title: "02. Vocabulaire du quotidien",
    description: "La maison, le corps, les vetements, les aliments, la sante et les deplacements.",
    patterns: [
      "bathroom vocabulary",
      "bedroom vocabulary",
      "body part vocabulary",
      "genders body parts vocabulary",
      "clothes vocabulary",
      "foods and drinks vocabulary",
      "kitchen vocabulary",
      "living room vocabulary",
      "health vocabulary",
      "means of transport vocabulary",
      "natural elements vocabulary",
    ],
  },
  {
    key: "sentence-building",
    title: "03. Construire des phrases",
    description: "Les outils pour poser des questions, comparer, relier les idees et produire des phrases propres.",
    patterns: [
      "comparisons",
      "mastering questions asking",
      "tag questions",
      "directions positions vocabulary",
      "53 prepositions",
      "55 prepositions",
      "interrogative pronouns adverbs",
      "linking words",
      "modals",
      "quantifiers",
      "122 adjectives",
    ],
  },
  {
    key: "grammar-progress",
    title: "04. Grammaire progressive",
    description: "Les temps et structures qui permettent de raconter, expliquer et se projeter.",
    patterns: [
      "past simple",
      "past simple continuous",
      "present perfect",
      "present perfect continuous",
      "the future simple",
      "the future continuous",
      "conditional tenses",
    ],
  },
  {
    key: "work-society",
    title: "05. Monde professionnel et societe",
    description: "Le vocabulaire pour parler du travail, des lieux, des institutions et de la vie sociale.",
    patterns: [
      "equipments and tools vocabulary",
      "infrastructures vocabulary",
      "institutions vocabulary",
      "jobs and occupations vocabulary",
      "office vocabulary",
      "public administration vocabulary",
      "working places vocabulary",
      "wealth vocabulary",
      "matters vocabulary",
      "supermarket vocabulary",
    ],
  },
  {
    key: "fluency",
    title: "06. Fluency et niveau avance",
    description: "Les points qui renforcent la fluidite, la precision et les phrases plus naturelles.",
    patterns: [
      "past perfect continuous",
      "past perfect simple",
      "the future perfect continuous",
      "the future perfect simple",
      "direct indirect speech spacial cases",
      "direct indirect speech special cases",
      "ed prononciation",
      "ed pronunciation",
      "50 phrasal verbs",
      "51 irregular verbs",
      "indefinite pronouns",
      "intensifiers pronouns",
      "reciprocal pronouns",
      "reflexive pronouns",
      "relative pronouns",
    ],
  },
];

function loadEnvFile(fileName) {
  const filePath = path.join(ROOT, fileName);
  if (!existsSync(filePath)) return;

  const content = requireText(filePath);
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[1].startsWith("#")) continue;

    let value = match[2].trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}

function requireText(filePath) {
  return readFileSync(filePath, "utf8");
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "document";
}

function titleCase(value) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      if (/^\d+$/.test(word)) return word;
      if (["ed", "pdf"].includes(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function readableTitle(fileName) {
  const raw = path.basename(fileName, path.extname(fileName));
  const cleaned = raw
    .replace(/^handh?ou?t\s+for\s+/i, "")
    .replace(/\bVocabulary\b/i, "Vocabulary")
    .replace(/\bWordz\b/i, "")
    .replace(/\s+\d+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return titleCase(cleaned);
}

function displayTitle(title) {
  return title
    .replace(/\bPersonnal\b/g, "Personal")
    .replace(/\bPrononciation\b/g, "Pronunciation")
    .replace(/\bSpacial\b/g, "Special");
}

function normalizeTitle(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function classifyDocument(title) {
  const normalizedTitle = normalizeTitle(title);
  const module = LEARNING_MODULES.find((candidate) =>
    candidate.patterns.some((pattern) => normalizedTitle.includes(normalizeTitle(pattern)))
  );

  if (!module) {
    return LEARNING_MODULES[LEARNING_MODULES.length - 1];
  }

  return module;
}

function documentPriority(title, learningModule) {
  const normalizedTitle = normalizeTitle(title);
  const index = learningModule.patterns.findIndex((pattern) => normalizedTitle.includes(normalizeTitle(pattern)));
  return index === -1 ? 999 : index;
}

async function listPdfFiles(folder) {
  const entries = await fs.readdir(folder, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf"))
    .map((entry) => path.join(folder, entry.name))
    .sort((a, b) => a.localeCompare(b, "fr"));
}

async function addSiteQrToPdf(inputPath, outputPath) {
  const input = await fs.readFile(inputPath);
  const pdf = await PDFDocument.load(input, { ignoreEncryption: true });
  const pages = pdf.getPages();
  const page = pages.at(-1);
  if (!page) throw new Error(`PDF sans page: ${inputPath}`);

  const qrDataUrl = await QRCode.toDataURL(SITE_URL, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 260,
  });

  const qrImage = await pdf.embedPng(qrDataUrl.split(",")[1]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width } = page.getSize();
  const qrSize = 70;
  const boxWidth = 210;
  const boxHeight = 98;
  const padding = 12;
  const x = Math.max(24, width - boxWidth - 28);
  const y = 24;

  page.drawRectangle({
    x,
    y,
    width: boxWidth,
    height: boxHeight,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.91, 0.91, 0.91),
    borderWidth: 0.8,
    opacity: 0.96,
  });

  page.drawText("Prime Language Academy", {
    x: x + padding,
    y: y + boxHeight - 24,
    size: 9.5,
    font: boldFont,
    color: rgb(0.08, 0.08, 0.08),
  });

  page.drawText("Scannez pour visiter", {
    x: x + padding,
    y: y + boxHeight - 42,
    size: 8,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText("le site officiel PLA.", {
    x: x + padding,
    y: y + boxHeight - 56,
    size: 8,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText("primelangageacademy.com", {
    x: x + padding,
    y: y + 14,
    size: 7,
    font,
    color: rgb(0.42, 0.42, 0.42),
  });

  page.drawImage(qrImage, {
    x: x + boxWidth - qrSize - padding,
    y: y + padding,
    width: qrSize,
    height: qrSize,
  });

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, Buffer.from(await pdf.save()));
}

async function generateDocuments() {
  const generated = [];

  for (const source of SOURCES) {
    if (!existsSync(source.folder)) {
      throw new Error(`Dossier introuvable: ${source.folder}`);
    }

    const files = await listPdfFiles(source.folder);
    const usedSlugs = new Set();

    for (const [index, filePath] of files.entries()) {
      const rawTitle = readableTitle(filePath);
      const title = displayTitle(rawTitle);
      const baseSlug = slugify(rawTitle);
      let slug = baseSlug;
      let suffix = 2;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
      usedSlugs.add(slug);

      const relativeUrl = `/course-documents/${source.key}/${slug}.pdf`;
      const outputPath = path.join(OUTPUT_ROOT, source.key, `${slug}.pdf`);
      await addSiteQrToPdf(filePath, outputPath);
      const learningModule = classifyDocument(title);

      generated.push({
        sourceKey: source.key,
        moduleKey: learningModule.key,
        moduleTitle: learningModule.title,
        priority: documentPriority(title, learningModule),
        order: 0,
        title,
        url: relativeUrl,
      });
    }
  }

  for (const learningModule of LEARNING_MODULES) {
    generated
      .filter((doc) => doc.moduleKey === learningModule.key)
      .sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title, "fr"))
      .forEach((doc, index) => {
        doc.order = index + 1;
      });
  }

  return generated;
}

async function seedDatabase(documents) {
  loadEnvFile(".env.local");
  loadEnvFile(".env.production.local");
  loadEnvFile(".env");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL manquant. Les PDFs sont generes, mais la base ne peut pas etre completee.");
  }

  const prisma = new PrismaClient();
  try {
    const levels = await prisma.level.findMany({ orderBy: { createdAt: "asc" } });
    if (!levels.length) throw new Error("Aucun niveau trouve dans la base.");

    let createdLessons = 0;
    let updatedLessons = 0;
    let movedLessons = 0;
    let deletedEmptyModules = 0;

    for (const level of levels) {
      for (const [moduleIndex, learningModule] of LEARNING_MODULES.entries()) {
        const moduleDocs = documents.filter((doc) => doc.moduleKey === learningModule.key);
        let module = await prisma.module.findFirst({
          where: { levelId: level.id, title: learningModule.title },
        });

        if (!module) {
          module = await prisma.module.create({
            data: {
              levelId: level.id,
              title: learningModule.title,
              order: moduleIndex + 1,
            },
          });
        } else if (module.order !== moduleIndex + 1 || module.title !== learningModule.title) {
          module = await prisma.module.update({
            where: { id: module.id },
            data: { order: moduleIndex + 1, title: learningModule.title },
          });
        }

        for (const doc of moduleDocs) {
          const existing = await prisma.lesson.findFirst({
            where: {
              module: { levelId: level.id },
              OR: [
                { title: doc.title },
                { contentUrl: doc.url },
              ],
            },
          });

          if (existing) {
            await prisma.lesson.update({
              where: { id: existing.id },
              data: {
                moduleId: module.id,
                title: doc.title,
                type: "PDF",
                contentUrl: doc.url,
                order: doc.order,
              },
            });
            if (existing.moduleId !== module.id) movedLessons += 1;
            updatedLessons += 1;
          } else {
            await prisma.lesson.create({
              data: {
                moduleId: module.id,
                title: doc.title,
                type: "PDF",
                contentUrl: doc.url,
                order: doc.order,
              },
            });
            createdLessons += 1;
          }
        }
      }

      for (const source of SOURCES) {
        const legacyModule = await prisma.module.findFirst({
          where: { levelId: level.id, title: source.title },
          include: { _count: { select: { lessons: true } } },
        });

        if (legacyModule && legacyModule._count.lessons === 0) {
          await prisma.module.delete({ where: { id: legacyModule.id } });
          deletedEmptyModules += 1;
        }
      }
    }

    return { levels: levels.length, createdLessons, updatedLessons, movedLessons, deletedEmptyModules };
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  console.log(`QR target: ${SITE_URL}`);
  const documents = await generateDocuments();
  const result = await seedDatabase(documents);
  console.log(JSON.stringify({ generatedDocuments: documents.length, ...result }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
