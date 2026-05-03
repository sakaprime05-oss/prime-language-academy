import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

function pdfText(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\x20-\x7E]/g, "")
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)");
}

function line(text: string, x: number, y: number, size = 10, font = "F1") {
    return `BT /${font} ${size} Tf ${x} ${y} Td (${pdfText(text)}) Tj ET`;
}

function rect(x: number, y: number, w: number, h: number, color: string) {
    return `${color} rg ${x} ${y} ${w} ${h} re f`;
}

function strokeRect(x: number, y: number, w: number, h: number, color = "0.898 0.906 0.922", width = 1) {
    return `${color} RG ${width} w ${x} ${y} ${w} ${h} re S`;
}

function createPdf(objects: string[]) {
    const chunks = ["%PDF-1.4\n"];
    const offsets: number[] = [0];

    for (let i = 0; i < objects.length; i += 1) {
        offsets.push(Buffer.byteLength(chunks.join(""), "binary"));
        chunks.push(`${i + 1} 0 obj\n${objects[i]}\nendobj\n`);
    }

    const xrefOffset = Buffer.byteLength(chunks.join(""), "binary");
    chunks.push(`xref\n0 ${objects.length + 1}\n`);
    chunks.push("0000000000 65535 f \n");
    for (let i = 1; i < offsets.length; i += 1) {
        chunks.push(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
    }
    chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

    return Buffer.from(chunks.join(""), "binary");
}

function createInvoiceBuffer(transaction: InvoiceTransaction) {
    const student = transaction.paymentPlan.student;
    const receiptNumber = transaction.id.split("-")[0].toUpperCase();
    const method = clean(transaction.provider || transaction.method);
    const amount = formatMoney(transaction.amount);
    const commands = [
        rect(0, 830, 595, 12, "0.906 0.086 0.165"),
        line("Prime Language Academy", 48, 770, 24, "F2"),
        line("Abidjan, Angre 8e Tranche - Cote d'Ivoire", 48, 742, 10),
        line("+225 01 61 33 78 64", 48, 726, 10),
        rect(366, 730, 182, 66, "0.129 0.157 0.431"),
        line("RECU DE PAIEMENT", 386, 772, 15, "F2"),
        line(`N. ${receiptNumber}`, 386, 752, 9),
        "0.898 0.906 0.922 RG 1 w 48 708 m 548 708 l S",
        line("Recu pour", 48, 672, 12, "F2"),
        line(clean(student.name), 48, 648, 10),
        line(clean(student.email), 48, 632, 10),
        line(`Niveau: ${clean(student.level?.name)}`, 48, 616, 10),
        line("Details du paiement", 348, 672, 12, "F2"),
        line(`Date: ${formatDate(transaction.date)}`, 348, 648, 10),
        line(`Reference: ${clean(transaction.referenceId)}`, 348, 632, 10),
        line(`Paiement: ${method}`, 348, 616, 10),
        rect(48, 510, 500, 38, "0.953 0.957 0.965"),
        line("Description", 68, 524, 10, "F2"),
        line("Montant", 438, 524, 10, "F2"),
        strokeRect(48, 444, 500, 58),
        line("Frais de formation / membership Prime Language Academy", 68, 474, 10),
        line(amount, 438, 474, 10, "F2"),
        rect(328, 358, 220, 52, "0.129 0.157 0.431"),
        line("Total paye", 348, 388, 10),
        line(amount, 430, 384, 14, "F2"),
        "0.898 0.906 0.922 RG 1 w 48 82 m 548 82 l S",
        line("Prime Language Academy - Document genere automatiquement", 180, 60, 9),
    ];

    const stream = commands.join("\n");
    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
        `<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`,
    ];

    return createPdf(objects);
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
