"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { put } from "@vercel/blob";
import { paystackChannels } from "@/lib/payment-methods";

const PAYSTACK_API_URL = "https://api.paystack.co/transaction/initialize";

function paystackAmount(amount: number) {
    return Math.round(amount * 100);
}

function paymentStageLabel(amountPaidBefore: number, amount: number, totalAmount: number) {
    if (amountPaidBefore <= 0 && amount >= totalAmount) return "Paiement total";
    if (amountPaidBefore <= 0) return "Prise en charge";
    if (amountPaidBefore + amount >= totalAmount) return "Réservation";
    return "Paiement partiel";
}

function matchesImageMagicBytes(buffer: Buffer, type: string) {
    if (type === "image/jpeg") {
        return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }
    if (type === "image/png") {
        return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    }
    if (type === "image/webp") {
        return buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
    }
    return false;
}

/**
 * Initiate a payment via Paystack and return a redirect URL
 * The student is then redirected to Paystack's checkout page
 */
export async function initiatePayment(formData: FormData) {
    const session = await auth();
    if (!session || !session.user) return { error: "Non autorisé" };

    if (session.user?.role !== "STUDENT") return { error: "Non autorise" };
    const limited = rateLimit(rateLimitKey("student-payment", session.user.id), 6, 10 * 60 * 1000);
    if (!limited.ok) {
        return { error: "Trop de tentatives de paiement. Veuillez patienter quelques minutes." };
    }

    const planId = formData.get("planId") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    const studentEmail = session.user.email || "student@primelangageacademy.com";

    if (!planId) {
        return { error: "Données de paiement incomplètes." };
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const configuredBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
    const baseUrl =
        configuredBaseUrl && /^https:\/\/(www\.)?primelangageacademy\.com$/.test(configuredBaseUrl.replace(/\/$/, ""))
            ? configuredBaseUrl.replace(/\/$/, "")
            : "https://primelangageacademy.com";

    if (!secretKey) {
        console.error("Paystack API key is missing");
        return { error: "Le paiement n'a pas pu être lancé pour le moment. Vérifiez vos informations ou contactez l'administration." };
    }

    try {
        const plan = await prisma.paymentPlan.findFirst({
            where: {
                id: planId,
                studentId: session.user.id,
            },
        });

        if (!plan) {
            return { error: "Plan de paiement introuvable." };
        }

        const remaining = Math.max(0, plan.totalAmount - plan.amountPaid);
        if (remaining <= 0) {
            return { error: "Ce plan est déjà réglé." };
        }

        const amount = remaining;

        // Generate a unique reference for this command
        const refCommand = `PRIME-${planId}-${Date.now()}`;

        await prisma.transaction.updateMany({
            where: {
                planId,
                status: "PENDING",
            },
            data: {
                status: "FAILED",
                failureReason: "Nouvelle tentative de paiement créée.",
            },
        });

        // Store the transaction in PENDING state with our ref_command
        const transaction = await prisma.transaction.create({
            data: {
                planId,
                amount,
                method: paymentMethod || "PAYSTACK",
                status: "PENDING",
                referenceId: refCommand,
            }
        });

        const paymentBody = {
            email: studentEmail,
            amount: paystackAmount(amount),
            reference: refCommand,
            currency: "XOF",
            channels: paystackChannels(paymentMethod),
            callback_url: `${baseUrl}/api/payments/paystack/callback?reference=${encodeURIComponent(refCommand)}&next=${encodeURIComponent("/dashboard/student/payments?status=success")}`,
            metadata: {
                transactionId: transaction.id,
                planId,
                studentId: session.user.id,
                preferredPaymentMethod: paymentMethod || "PAYSTACK",
                custom_fields: [
                    {
                        display_name: "Plan ID",
                        variable_name: "plan_id",
                        value: planId
                    }
                ]
            }
        };

        const response = await fetch(PAYSTACK_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${secretKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentBody),
        });

        const data = await response.json();

        if (!data.status) {
            console.error("Paystack error:", data);
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: "FAILED", failureReason: data.message || "Paystack API Error" }
            });
            return { error: "Le paiement n'a pas pu être lancé pour le moment. Vérifiez vos informations ou contactez l'administration." };
        }

        revalidatePath("/dashboard/student/payments");
        return {
            success: true,
            transactionId: transaction.id,
            redirectUrl: data.data.authorization_url,
            reference: data.data.reference,
            message: "Ouverture de la page de paiement...",
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
    if (!session || session.user?.role !== "STUDENT") return { error: "Non autorise" };

    const transactionId = formData.get("transactionId") as string;
    const provider = formData.get("provider") as string;
    const senderPhone = formData.get("senderPhone") as string;
    const proof = formData.get("proof") as string;

    if (!transactionId || !provider || !senderPhone) {
        return { error: "Champs manquants" };
    }

    try {
        const existingTx = await prisma.transaction.findUnique({ where: { id: transactionId } });
        if (!existingTx || existingTx.status !== "PENDING") {
            return { error: "Transaction invalide ou déjà traitée." };
        }

        const plan = await prisma.paymentPlan.findFirst({
            where: {
                id: existingTx.planId,
                studentId: session.user.id,
            },
        });

        if (!plan) {
            return { error: "Transaction non autorisee." };
        }

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
        
        // Notify admin via Email
        const { sendAdminPaymentProofEmail } = await import("@/lib/email");
        await sendAdminPaymentProofEmail(
            transaction.paymentPlan.student.name || "Étudiant Inconnu",
            provider,
            senderPhone,
            transaction.amount
        ).catch(err => console.error("Could not send proof email", err));

        // Notify admin via Telegram (Real-time)
        const { notifyTelegram } = await import("@/lib/notify");
        await notifyTelegram("payment_proof", {
            name: transaction.paymentPlan.student.name || "Étudiant Inconnu",
            email: transaction.paymentPlan.student.email,
            amount: transaction.amount,
            provider,
            phone: senderPhone
        });

        revalidatePath("/dashboard/student");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Erreur serveur" };
    }
}

export async function confirmWavePayment(formData: FormData) {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") return { error: "Non autorise" };

    try {
        const transactionId = formData.get("transactionId") as string;
        const file = formData.get("proof") as File | null;

        if (!transactionId || !file || file.size === 0) {
            return { error: "Veuillez importer la capture d'écran de votre reçu." };
        }

        const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
        if (!allowedTypes.has(file.type)) {
            return { error: "Format invalide. Importez une image JPG, PNG ou WebP." };
        }

        if (file.size > 5 * 1024 * 1024) {
            return { error: "Image trop lourde. Taille maximale : 5 Mo." };
        }

        const existingTx = await prisma.transaction.findUnique({ 
            where: { id: transactionId },
            include: { paymentPlan: { include: { student: true } } }
        });
        
        if (!existingTx || existingTx.status !== "PENDING") {
            return { error: "Transaction invalide ou déjà traitée." };
        }

        if (existingTx.paymentPlan.studentId !== session.user.id) {
            return { error: "Transaction non autorisee." };
        }

        // Sauvegarder le fichier
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        if (!matchesImageMagicBytes(buffer, file.type)) {
            return { error: "Le contenu du fichier ne correspond pas au format annonce." };
        }
        
        const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const filename = `proof-${existingTx.id}-${Date.now()}.${extension}`;
        let proofUrl: string;

        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(`proofs/${filename}`, buffer, {
                access: "public",
                contentType: file.type,
            });
            proofUrl = blob.url;
        } else {
            const uploadDir = join(process.cwd(), "public", "uploads", "proofs");
            const filePath = join(uploadDir, filename);
            await mkdir(uploadDir, { recursive: true });
            await writeFile(filePath, buffer);
            proofUrl = `/uploads/proofs/${filename}`;
        }

        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                provider: "WAVE",
                status: "VERIFYING",
                proof: proofUrl
            }
        });

        // Notify admin via Email
        const { sendAdminPaymentProofEmail } = await import("@/lib/email");
        await sendAdminPaymentProofEmail(
            existingTx.paymentPlan.student.name || "Étudiant Inconnu",
            "WAVE (Avec capture d'écran)",
            "Voir tableau de bord",
            existingTx.amount
        ).catch(err => console.error("Could not send proof email", err));

        // Notify admin via Telegram (Real-time)
        const { notifyTelegram } = await import("@/lib/notify");
        await notifyTelegram("payment_proof", {
            name: existingTx.paymentPlan.student.name || "Étudiant Inconnu",
            email: existingTx.paymentPlan.student.email,
            amount: existingTx.amount,
            provider: "WAVE",
            phone: "Capture envoyée"
        });

        revalidatePath("/checkout/" + transactionId);
        return { success: true };
    } catch (e) {
        console.error("Erreur d'upload:", e);
        return { error: "Une erreur est survenue lors de l'envoi de la capture d'écran." };
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
        if (transaction.status === "COMPLETED") return { success: true };
        if (transaction.status !== "VERIFYING" && transaction.status !== "PENDING") {
            return { error: "Transaction déjà traitée ou invalide" };
        }

        const plan = transaction.paymentPlan;
        const student = plan.student;
        
        // Update plan and transaction
        const stageLabel = paymentStageLabel(plan.amountPaid, transaction.amount, plan.totalAmount);
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
            const { sendInvoiceEmail, sendAccountActivatedEmail } = await import("@/lib/email");
            
            if (plan.amountPaid <= 0) {
                await sendAccountActivatedEmail(
                    student.email,
                    student.name || "Étudiant"
                ).catch(console.error);
            }

            // 2. Envoyer la facture
            await sendInvoiceEmail(
                student.email,
                student.name || "Étudiant",
                transaction.amount,
                transaction.id,
                transaction.provider || transaction.method,
                stageLabel
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

