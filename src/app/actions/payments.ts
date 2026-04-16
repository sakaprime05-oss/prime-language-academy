"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Initiates a payment via PawaPay (Simulated logic for now, ready for API integration)
 */
export async function initiatePayment(formData: FormData) {
    const session = await auth();
    if (!session || !session.user) return { error: "Non autorisé" };

    const amount = parseFloat(formData.get("amount") as string);
    const phone = formData.get("phone") as string;
    const provider = formData.get("provider") as string || "ORANGE_CIV";
    const planId = formData.get("planId") as string;

    if (!amount || !phone || !planId) {
        return { error: "Données de paiement incomplètes." };
    }

    // Standardize phone number for PawaPay (e.g., 225XXXXXXXXX)
    let formattedPhone = phone.replace(/\s+/g, "");
    if (!formattedPhone.startsWith("225")) {
        formattedPhone = "225" + formattedPhone;
    }

    try {
        const depositId = crypto.randomUUID();

        // 1. Log the transaction in PENDING state
        const transaction = await prisma.transaction.create({
            data: {
                planId,
                amount,
                method: "PAWAPAY",
                provider,
                status: "PENDING",
                referenceId: depositId
            }
        });

        // 2. Call PawaPay API
        const pawaResponse = await fetch(`${process.env.PAWAPAY_BASE_URL}/v1/deposits`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PAWAPAY_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                depositId,
                amount: amount.toString(),
                currency: process.env.PAWAPAY_CURRENCY || "XOF",
                correspondent: provider,
                payer: {
                    address: { value: formattedPhone }
                },
                statementDescription: "Paiement Prime Academy",
                callbackUrl: `${process.env.NEXTAUTH_URL}/api/payments/pawapay/callback`
            })
        });

        const data = await pawaResponse.json();

        if (!pawaResponse.ok) {
            console.error("PawaPay error:", data);
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: "FAILED", failureReason: data.message || "PawaPay API Error" }
            });
            return { error: "Le paiement n'a pas pu être initié. Veuillez vérifier votre numéro." };
        }

        revalidatePath("/dashboard/student/payments");
        return {
            success: true,
            transactionId: transaction.id,
            message: "Demande de paiement envoyée. Veuillez valider sur votre téléphone."
        };

    } catch (e: any) {
        console.error("Payment initiation error:", e);
        return { error: "Une erreur est survenue lors de l'initiation du paiement." };
    }
}

/**
 * Gets student's payment status
 */
export async function getStudentPaymentStatus(userId: string) {
    const plan = await prisma.paymentPlan.findFirst({
        where: { studentId: userId },
        include: {
            transactions: {
                orderBy: { date: 'desc' }
            }
        }
    });

    return plan;
}
