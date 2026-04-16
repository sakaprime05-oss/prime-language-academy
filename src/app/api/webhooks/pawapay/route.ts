import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // Exemple de structure de payload Pawapay
        const { referenceId, status } = payload;

        if (!referenceId || !status) {
            return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
        }

        // 1. Trouver la transaction
        const transaction = await prisma.transaction.findUnique({
            where: { referenceId },
            include: {
                paymentPlan: {
                    include: { student: true }
                }
            }
        });

        if (!transaction) {
            return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
        }

        // 2. Mettre à jour la transaction
        await prisma.transaction.update({
            where: { id: transaction.id },
            data: { status }
        });

        // 3. Traiter le succès et envoyer la facture
        if (status === "COMPLETED") {
            const plan = transaction.paymentPlan;
            const student = plan.student;
            const isFirstPayment = plan.amountPaid === 0;

            const newAmountPaid = plan.amountPaid + transaction.amount;
            let planStatus = "PARTIAL";
            if (newAmountPaid >= plan.totalAmount) {
                planStatus = "PAID";
            }

            await prisma.paymentPlan.update({
                where: { id: plan.id },
                data: {
                    amountPaid: newAmountPaid,
                    status: planStatus
                }
            });

            // Débloquer l'étudiant s'il était bloqué
            await prisma.user.update({
                where: { id: plan.studentId },
                data: { status: "ACTIVE" }
            });

            // ENVOI DE FACTURE
            if (isFirstPayment && student.email) {
                await sendInvoiceEmail(student.email, student.name || "Étudiant", transaction.amount, transaction.id);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Erreur Webhook Pawapay:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
