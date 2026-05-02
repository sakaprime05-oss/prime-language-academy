"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail, sendAdminNewRegistrationEmail } from "@/lib/email";
import { notifyTelegram } from "@/lib/notify";
import { PLA_PLANS } from "@/lib/pla-program";

const PAYSTACK_API_URL = "https://api.paystack.co/transaction/initialize";
const planPrices = Object.fromEntries(PLA_PLANS.map((plan) => [plan.id, plan.price])) as Record<string, number>;

type PaystackInitInput = {
    email: string;
    amount: number;
    reference: string;
    transactionId: string;
    planId: string;
    studentId: string;
    callbackPath?: string;
};

async function initializePaystackCheckout(input: PaystackInitInput) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

    if (!secretKey) {
        return { error: "Erreur de configuration: clé API Paystack manquante sur le serveur." };
    }

    const paystackResponse = await fetch(PAYSTACK_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${secretKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: input.email,
            amount: Math.round(input.amount), // XOF: no subunit multiplier in this integration
            reference: input.reference,
            currency: "XOF",
            callback_url: `${baseUrl}${input.callbackPath || "/login?status=payment_success"}`,
            metadata: {
                transactionId: input.transactionId,
                planId: input.planId,
                studentId: input.studentId,
            },
        }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || !paystackData.data?.authorization_url) {
        return { error: `Erreur Paystack: ${paystackData.message || "Impossible d'initialiser le paiement"}` };
    }

    return { redirectUrl: paystackData.data.authorization_url as string };
}

async function createRegistrationCheckout(input: {
    userId: string;
    email: string;
    paymentPlanId: string;
    amount: number;
    retry?: boolean;
}) {
    const refPrefix = input.retry ? "REG-RETRY" : "REG";
    const refCommand = `${refPrefix}-${input.paymentPlanId}-${Date.now()}`;

    const transaction = await prisma.transaction.create({
        data: {
            planId: input.paymentPlanId,
            amount: Number(input.amount),
            method: "PAYSTACK",
            status: "PENDING",
            referenceId: refCommand,
        },
    });

    const checkout = await initializePaystackCheckout({
        email: input.email,
        amount: input.amount,
        reference: refCommand,
        transactionId: transaction.id,
        planId: input.paymentPlanId,
        studentId: input.userId,
    });

    if (checkout.error) {
        await prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: "FAILED", failureReason: checkout.error },
        });
    }

    return checkout;
}

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const planId = formData.get("planId") as string;
    const onboardingData = formData.get("onboardingData") as string;

    if (!name || !email || !password) {
        return { error: "Tous les champs sont obligatoires." };
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: { paymentPlans: true },
        });

        if (existingUser) {
            if (existingUser.status !== "PENDING") {
                return { error: "Cet email est déjà utilisé." };
            }

            const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
            if (!isPasswordValid) {
                return { error: "Cette inscription est en attente de paiement. Utilisez le même mot de passe pour reprendre le paiement." };
            }

            const paymentPlan = existingUser.paymentPlans[0];
            if (!paymentPlan) {
                return { error: "Compte en attente incomplet. Contactez le support pour finaliser votre inscription." };
            }

            const remaining = Math.max(0, paymentPlan.totalAmount - paymentPlan.amountPaid);
            if (remaining <= 0) {
                return { error: "Votre paiement est déjà complet. Patientez quelques instants puis connectez-vous." };
            }

            const checkout = await createRegistrationCheckout({
                userId: existingUser.id,
                email: existingUser.email,
                paymentPlanId: paymentPlan.id,
                amount: remaining,
                retry: true,
            });

            if (checkout.error) return { error: checkout.error };

            return { success: true, redirectUrl: checkout.redirectUrl };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let onboardingParams: any = {};
        try {
            onboardingParams = JSON.parse(onboardingData);
        } catch (e) { }

        const registrationType = onboardingParams.type === "CLUB" ? "CLUB" : "FORMATION";

        const pedagogicalLevelName = onboardingParams.level || "Débutant";
        let level = await prisma.level.findFirst({
            where: { name: { contains: pedagogicalLevelName, mode: "insensitive" } },
        });

        if (!level) {
            level = await prisma.level.create({
                data: {
                    name: pedagogicalLevelName,
                    price: 0,
                    description: `Niveau ${pedagogicalLevelName}`,
                },
            });
        }

        const totalAmount = planPrices[planId];
        if (!totalAmount) {
            return { error: "Formule invalide. Veuillez choisir une formule de formation." };
        }

        const amountToPay = onboardingParams.paymentOption === "fractionne" ? totalAmount * 0.5 : totalAmount;

        console.log(`[Registration] Creating user: ${normalizedEmail}, Plan: ${planId}, Amount: ${amountToPay}`);

        const user = await prisma.user.create({
            data: {
                name,
                email: normalizedEmail,
                passwordHash: hashedPassword,
                role: "STUDENT",
                status: "PENDING",
                levelId: level?.id,
                onboardingData,
                registrationType,
                paymentPlans: {
                    create: {
                        totalAmount: Number(totalAmount),
                        amountPaid: 0,
                        status: "PARTIAL",
                    },
                },
            },
            include: { paymentPlans: true },
        });

        const paymentPlan = user.paymentPlans[0];

        console.log(`[Registration] User created ID: ${user.id}. Initializing Paystack checkout.`);

        const checkout = await createRegistrationCheckout({
            userId: user.id,
            email: user.email,
            paymentPlanId: paymentPlan.id,
            amount: amountToPay,
        });

        if (checkout.error) {
            console.error("[Registration] Paystack Init Failed:", checkout.error);
            return { error: checkout.error };
        }

        console.log("[Registration] Paystack Init Success, redirecting...");

        sendWelcomeEmail(user.email, user.name || "Étudiant", registrationType)
            .catch(err => console.error("Could not send welcome email", err));

        sendAdminNewRegistrationEmail(user.name || "Nouveau", user.email, level?.name || planId)
            .catch(err => console.error("Could not send admin reg email", err));

        notifyTelegram("new_registration", {
            name: user.name,
            email: user.email,
            type: registrationType,
        }).catch(err => console.error("Telegram notify failed", err));

        return { success: true, redirectUrl: checkout.redirectUrl };

    } catch (error: any) {
        console.error("[Registration] CRITICAL ERROR:", error);
        return { error: `Erreur technique lors de l'inscription: ${error.message || "Veuillez contacter le support."}` };
    }
}
