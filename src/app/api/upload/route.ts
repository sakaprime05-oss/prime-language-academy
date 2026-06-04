import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

function matchesMagicBytes(buffer: Buffer, type: string) {
  if (type === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (type === "image/png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (type === "image/webp") {
    return buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  }
  if (type === "application/pdf") {
    return buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  }
  return false;
}

function safeUploadName(name: string, type: string) {
  const extension = type === "application/pdf" ? "pdf" : type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
  const base = name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .slice(0, 80) || "upload";
  return `${Date.now()}-${base}.${extension}`;
}

function resolveQrTarget(request: Request, rawValue: FormDataEntryValue | null) {
  const requestOrigin = new URL(request.url).origin;
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || requestOrigin;
  const defaultTarget = process.env.PLA_PDF_QR_URL || `${appBaseUrl.replace(/\/$/, "")}/dashboard/student/courses`;
  const candidate = typeof rawValue === "string" && rawValue.trim() ? rawValue.trim() : defaultTarget;

  try {
    const url = new URL(candidate, appBaseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return defaultTarget;
    }
    return url.toString();
  } catch {
    return defaultTarget;
  }
}

async function addQrToLastPdfPage(buffer: Buffer, qrTarget: string) {
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: false });
  const pages = pdf.getPages();
  const lastPage = pages.at(-1);

  if (!lastPage) {
    throw new Error("PDF without pages");
  }

  const qrDataUrl = await QRCode.toDataURL(qrTarget, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 280,
  });
  const qrImage = await pdf.embedPng(qrDataUrl.split(",")[1]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width } = lastPage.getSize();

  const qrSize = 82;
  const padding = 14;
  const boxWidth = 236;
  const boxHeight = 116;
  const x = Math.max(28, width - boxWidth - 32);
  const y = 28;

  lastPage.drawRectangle({
    x,
    y,
    width: boxWidth,
    height: boxHeight,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.9, 0.9, 0.9),
    borderWidth: 0.8,
  });

  lastPage.drawText("Prime Language Academy", {
    x: x + padding,
    y: y + boxHeight - 28,
    size: 10,
    font: boldFont,
    color: rgb(0.08, 0.08, 0.08),
  });

  lastPage.drawText("Scannez pour acceder", {
    x: x + padding,
    y: y + boxHeight - 46,
    size: 8.5,
    font,
    color: rgb(0.22, 0.22, 0.22),
  });

  lastPage.drawText("a votre espace cours.", {
    x: x + padding,
    y: y + boxHeight - 60,
    size: 8.5,
    font,
    color: rgb(0.22, 0.22, 0.22),
  });

  lastPage.drawImage(qrImage, {
    x: x + boxWidth - qrSize - padding,
    y: y + padding,
    width: qrSize,
    height: qrSize,
  });

  return Buffer.from(await pdf.save());
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Upload réservé à l'équipe pédagogique." }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    if (!ALLOWED_UPLOAD_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Format de fichier non autorisé." }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux. Taille maximale : 5 Mo." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!matchesMagicBytes(buffer, file.type)) {
      return NextResponse.json({ error: "Le contenu du fichier ne correspond pas au format annoncé." }, { status: 400 });
    }

    const filename = safeUploadName(file.name, file.type);
    let uploadBuffer = buffer;

    if (file.type === "application/pdf" && formData.get("addQr") !== "false") {
      try {
        uploadBuffer = await addQrToLastPdfPage(buffer, resolveQrTarget(request, formData.get("qrUrl")));
      } catch (error) {
        console.error("Erreur ajout QR PDF:", error);
        return NextResponse.json({ error: "Impossible d'ajouter le QR code au PDF." }, { status: 400 });
      }
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, uploadBuffer, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    }

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, uploadBuffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Erreur d'upload:", error);
    return NextResponse.json({ error: "L'upload a échoué." }, { status: 500 });
  }
}
