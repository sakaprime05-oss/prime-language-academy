import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";
import { existsSync } from "fs";
import { join } from "path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type InvoiceTransaction = NonNullable<Awaited<ReturnType<typeof getCompletedTransaction>>>;

async function getCompletedTransaction(id: string) {
    return prisma.transaction.findUnique({
        where: { id },
        include: {
            paymentPlan: {
                include: { student: { include: { level: true } } },
            },
        },
    });
}

function formatMoney(amount: number) {
    return `${Number(amount || 0).toLocaleString("fr-FR")} FCFA`;
}

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function clean(value: string | null | undefined) {
    return String(value || "Non renseigne").replace(/\s+/g, " ").trim();
}

function createInvoiceBuffer(transaction: InvoiceTransaction) {
    return new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        const doc = new PDFDocument({ size: "A4", margin: 48, info: { Title: "Recu Prime Language Academy" } });
        const student = transaction.paymentPlan.student;
        const receiptNumber = transaction.id.split("-")[0].toUpperCase();
        const method = clean(transaction.provider || transaction.method);
        const logoPath = join(process.cwd(), "public", "logo.png");

        doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        doc.on("error", reject);
        doc.on("end", () => resolve(Buffer.concat(chunks)));

        doc
            .rect(0, 0, doc.page.width, 112)
            .fill("#21286E");

        doc
            .fillColor("#FFFFFF")
            .font("Helvetica-Bold")
            .fontSize(22)
            .text("Prime Language Academy", 48, 34)
            .font("Helvetica")
            .fontSize(10)
            .text("Abidjan, Angre 8e Tranche - Cote d'Ivoire", 48, 64)
            .text("Tel: +225 01 61 33 78 64", 48, 80);

        doc
            .fillColor("#FFFFFF")
            .font("Helvetica-Bold")
            .fontSize(18)
            .text("RECU DE PAIEMENT", 360, 38, { align: "right" })
            .font("Helvetica")
            .fontSize(10)
            .text(`N. ${receiptNumber}`, 360, 66, { align: "right" });

        if (existsSync(logoPath)) {
            doc.image(logoPath, 500, 24, { width: 42 });
        }

        doc
            .fillColor("#111827")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text("Recu pour", 48, 150)
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#374151")
            .text(clean(student.name), 48, 174)
            .text(clean(student.email), 48, 190)
            .text(`Niveau: ${clean(student.level?.name)}`, 48, 206);

        doc
            .fillColor("#111827")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text("Details", 348, 150)
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#374151")
            .text(`Date: ${formatDate(transaction.date)}`, 348, 174)
            .text(`Reference: ${clean(transaction.referenceId)}`, 348, 190)
            .text(`Paiement: ${method}`, 348, 206);

        const tableTop = 268;
        doc
            .roundedRect(48, tableTop, 500, 38, 8)
            .fill("#F3F4F6")
            .fillColor("#111827")
            .font("Helvetica-Bold")
            .fontSize(10)
            .text("Description", 68, tableTop + 14)
            .text("Montant", 438, tableTop + 14, { width: 90, align: "right" });

        doc
            .roundedRect(48, tableTop + 46, 500, 58, 8)
            .strokeColor("#E5E7EB")
            .lineWidth(1)
            .stroke()
            .fillColor("#374151")
            .font("Helvetica")
            .fontSize(10)
            .text("Frais de formation / membership Prime Language Academy", 68, tableTop + 68, { width: 320 })
            .font("Helvetica-Bold")
            .fillColor("#111827")
            .text(formatMoney(transaction.amount), 438, tableTop + 68, { width: 90, align: "right" });

        doc
            .roundedRect(328, tableTop + 128, 220, 48, 8)
            .fill("#21286E")
            .fillColor("#FFFFFF")
            .font("Helvetica")
            .fontSize(10)
            .text("Total paye", 348, tableTop + 144)
            .font("Helvetica-Bold")
            .fontSize(14)
            .text(formatMoney(transaction.amount), 430, tableTop + 140, { width: 98, align: "right" });

        doc
            .moveTo(48, 760)
            .lineTo(548, 760)
            .strokeColor("#E5E7EB")
            .stroke()
            .fillColor("#6B7280")
            .fontSize(9)
            .text("Prime Language Academy - Document genere automatiquement", 48, 776, { align: "center" });

        doc.end();
    });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const transaction = await getCompletedTransaction(id);

    if (!transaction || transaction.status !== "COMPLETED") {
        return new NextResponse("Transaction not found or not completed", { status: 404 });
    }

    if (session.user.role === "STUDENT" && transaction.paymentPlan.studentId !== session.user.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const pdfBuffer = await createInvoiceBuffer(transaction);
        const receiptNumber = transaction.id.split("-")[0].toUpperCase();

        const pdfBody = new Uint8Array(pdfBuffer);

        return new NextResponse(pdfBody, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Recu_PRIME_${receiptNumber}.pdf"`,
                "Cache-Control": "private, no-store",
            },
        });
    } catch (error) {
        console.error("Local invoice generation failed:", error);
        return new NextResponse("Erreur serveur lors de la generation", { status: 500 });
    }
}
