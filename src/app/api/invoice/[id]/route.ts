import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    // Allow admins to download any invoice, restrict students to their own
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const transaction = await prisma.transaction.findUnique({
        where: { id: params.id },
        include: {
            paymentPlan: {
                include: { student: { include: { level: true } } }
            }
        }
    });

    if (!transaction || transaction.status !== "COMPLETED") {
        return new NextResponse("Transaction not found or not completed", { status: 404 });
    }

    if (session.user.role === "STUDENT" && transaction.paymentPlan.studentId !== session.user.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const student = transaction.paymentPlan.student;

    const data = {
        from: "Prime Language Academy\nAbidjan, Angré 8e Tranche\nCôte d'Ivoire\ninfo@primelanguageacademy.com",
        to: `${student.name}\n${student.email}\nNiveau: ${student.level?.name || "Non défini"}`,
        logo: "https://primelanguageacademy.com/icon-512x512.png", // They need a real public URL for the logo, fallback if localhost
        number: transaction.id.split("-")[0].toUpperCase(),
        date: new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        currency: "XOF",
        items: [
            {
                name: "Frais de scolarité - Session de formation",
                quantity: 1,
                unit_cost: transaction.amount
            }
        ],
        notes: "Merci pour votre confiance. Ceci est un reçu généré électroniquement et tient lieu de justificatif de paiement.",
        terms: `Réf Interne: ${transaction.referenceId || "N/A"}\nMoyen de paiement: ${transaction.provider || transaction.method}`,
        custom_fields: [] // Can be used for extra info
    };

    try {
        const response = await fetch("https://invoice-generator.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": "Bearer YOUR_API_KEY" // Optional, if they hit rate limits they can add a key
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.error("Invoice generator error:", await response.text());
            return new NextResponse("Failed to generate PDF invoice", { status: 500 });
        }

        const pdfBuffer = await response.arrayBuffer();

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Facture_PRIME_${data.number}.pdf"`
            }
        });
    } catch (error) {
        console.error("PDF generation exception:", error);
        return new NextResponse("Erreur serveur lors de la génération", { status: 500 });
    }
}
