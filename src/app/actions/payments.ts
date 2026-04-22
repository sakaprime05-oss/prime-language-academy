"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const PAYTECH_API_URL = "https://paytech.sn/api/payment/request-payment";

/**
 * Initiate a payment via PayTech and return a redirect URL
 * The student is then redirected to PayTech's checkout page
 */
export async function initiatePayment(formData: FormData) {
    const session = await auth();
    if (!session || !session.user) return { error: "Non autorisé" };

    const amount = parseFloat(formData.get("amount") as string);
    const planId = formData.get("planId") as string;
    const studentName = (formData.get("studentName") as string) || "Étudiant";
    const studentEmail = (formData.get("studentEmail") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const targetPayment = (formData.get("targetPayment") as string) || ""; // e.g. "Orange Money" or "Orange Money, Wave, Free Money"

    if (!amount || !planId) {
        return { error: "Données de paiement incomplètes." };
    }

    const apiKey = process.env.PAYTECH_API_KEY;
    const apiSecret = process.env.PAYTECH_API_SECRET;
    const env = process.env.PAYTECH_ENV || "test";
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    if (!apiKey || !apiSecret) {
        console.error("PayTech API keys are missing");
        return { error: "Configuration du système de paiement incomplète." };
    }

    try {
        // Generate a unique reference for this command
        const refCommand = `PRIME-${planId}-${Date.now()}`;

        // Store the transaction in PENDING state with our ref_command
        const transaction = await prisma.transaction.create({
            data: {
                planId,
                amount,
                method: "PAYTECH",
                status: "PENDING",
                referenceId: refCommand,
            }
        });

        // Custom field encodes our internal data (will be Base64-decoded in the IPN)
        const customField = JSON.stringify({
            transactionId: transaction.id,
            planId,
            studentId: session.user.id,
            email: studentEmail,
        });

        // Build the PayTech payment request body
        const paymentBody: Record<string, string> = {
            item_name: "Frais de scolarité - Prime Language Academy",
            item_price: String(Math.round(amount)),
            currency: "XOF",
            ref_command: refCommand,
            command_name: `Paiement scolarité - ${studentName}`,
            env: env,
            ipn_url: `${baseUrl}/api/payments/paytech/ipn`,
            success_url: `${baseUrl}/dashboard/student/payments?status=success`,
            cancel_url: `${baseUrl}/dashboard/student/payments?status=cancel`,
            custom_field: customField,
        };

        // Only set target_payment if specified
        if (targetPayment) {
            paymentBody.target_payment = targetPayment;
        }

        const paytechResponse = await fetch(PAYTECH_API_URL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "API_KEY": apiKey,
                "API_SECRET": apiSecret,
            },
            body: JSON.stringify(paymentBody),
        });

        const data = await paytechResponse.json();

        if (data.success !== 1) {
            console.error("PayTech error:", data);
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: "FAILED", failureReason: data.message || "PayTech API Error" }
            });
            return { error: "Le paiement n'a pas pu être initié. Veuillez réessayer." };
        }

        // Build redirect URL with autofill parameters if single payment method and phone provided
        let redirectUrl: string = data.redirect_url;
        if (targetPayment && !targetPayment.includes(",") && phone) {
            const cleanPhone = phone.replace(/\s+/g, "");
            // Phone for pn: +221XXXXXXXX format, for nn: without country code
            const pn = cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`;
            const nn = pn.slice(4); // Remove +221
            const isCardPayment = targetPayment === "Carte Bancaire";
            const params = new URLSearchParams({
                pn,
                nn,
                fn: studentName,
                tp: targetPayment,
                nac: isCardPayment ? "0" : "1",
            });
            redirectUrl += `?${params.toString()}`;
        }

        revalidatePath("/dashboard/student/payments");
        return {
            success: true,
            transactionId: transaction.id,
            redirectUrl,
            token: data.token,
            message: "Redirection vers la page de paiement PayTech...",
        };

    } catch (e: any) {
        console.error("Payment initiation error:", e);
        return { error: "Une erreur est survenue lors de l'initiation du paiement." };
    }
}

/**
 * Gets student's payment status and plan
 */
export async function getStudentPaymentStatus(userId: string) {
    const plan = await prisma.paymentPlan.findFirst({
        where: { studentId: userId },
        include: {
            transactions: {
                orderBy: { date: "desc" }
            }
        }
    });

    return plan;
}

export async function submitManualPayment(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Non autorisé" };

    const transactionId = formData.get("transactionId") as string;
    const provider = formData.get("provider") as string;
    const senderPhone = formData.get("senderPhone") as string;
    const proof = formData.get("proof") as string;

    if (!transactionId || !provider || !senderPhone) {
        return { error: "Champs manquants" };
    }

    try {
        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                provider,
                senderPhone,
                proof,
                status: "VERIFYING", // Nouveau status informel ou on garde PENDING avec le proof rempli
            },
            include: {
                paymentPlan: { include: { student: true } }
            }
        });
        
        // Notify admin
        const { sendAdminPaymentProofEmail } = await import("@/lib/email");
        await sendAdminPaymentProofEmail(
            transaction.paymentPlan.student.name || "Étudiant Inconnu",
            provider,
            senderPhone,
            transaction.amount
        ).catch(err => console.error("Could not send proof email", err));

        revalidatePath("/dashboard/student");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Erreur serveur" };
    }
}

export async function approveTransaction(transactionId: string) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Non autorisé" };

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                paymentPlan: { include: { student: true } }
            }
        });

        if (!transaction) return { error: "Transaction introuvable" };

        const plan = transaction.paymentPlan;
        const student = plan.student;
        
        // Update plan and transaction
        const newAmountPaid = plan.amountPaid + transaction.amount;
        const newPlanStatus = newAmountPaid >= plan.totalAmount ? "PAID" : "PARTIAL";

        await prisma.$transaction([
            prisma.transaction.update({
                where: { id: transactionId },
                data: { status: "COMPLETED" }
            }),
            prisma.paymentPlan.update({
                where: { id: plan.id },
                data: { amountPaid: newAmountPaid, status: newPlanStatus }
            }),
            prisma.user.update({
                where: { id: student.id },
                data: { status: "ACTIVE" }
            })
        ]);

        // Send invoice email if it's the first payment or full payment
        if (student.email) {
            const { sendInvoiceEmail } = await import("@/lib/email");
            await sendInvoiceEmail(
                student.email,
                student.name || "Étudiant",
                transaction.amount,
                transaction.id
            ).catch(console.error);
        }

        revalidatePath("/dashboard/admin/payments");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Erreur lors de l'approbation" };
    }
}

export async function rejectTransaction(transactionId: string, reason: string) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Non autorisé" };

    try {
        await prisma.transaction.update({
            where: { id: transactionId },
            data: { 
                status: "FAILED",
                failureReason: reason || "Paiement refusé par l'administration"
            }
        });

        revalidatePath("/dashboard/admin/payments");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Erreur lors du rejet" };
    }
}
