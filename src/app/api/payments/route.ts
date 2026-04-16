import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simulation de l'appel à l'API Pawapay pour initier un paiement
export async function POST(req: Request) {
    try {
        const { studentId, planId, amount, phone } = await req.json();

        if (!studentId || !planId || !amount || !phone) {
            return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
        }

        // Créer une transaction en attente dans la BDD
        const transaction = await prisma.transaction.create({
            data: {
                planId,
                amount,
                method: "PAWAPAY",
                status: "PENDING",
                // Dans un cas réel, cette référence viendrait de la réponse de l'API Pawapay
                referenceId: `PWP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            },
        });

        // Appel théorique à l'API Pawapay
        // const response = await fetch("https://api.pawapay.io/v1/deposits", { ... })

        return NextResponse.json({
            success: true,
            message: "Paiement initié avec succès",
            transactionId: transaction.id,
            paymentUrl: "/dashboard/student", // URL de redirection (simulée)
        });

    } catch (error) {
        console.error("Erreur lors de l'initiation du paiement:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
