"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail, sendAdminNewRegistrationEmail } from "@/lib/email";
import { notifyTelegram } from "@/lib/notify";
import { PLA_PLANS } from "@/lib/pla-program";

const PAYSTACK_API_URL = "https://api.paystack.co/transaction/initialize";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const planId = formData.get("planId") as string;
    const onboardingData = formData.get("onboardingData") as string;

    if (!name || !email || !password) {
        return { error: "Tous les champs sont obligatoires." };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Cet email est déjà utilisé." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let onboardingParams: any = {};
        try {
            onboardingParams = JSON.parse(onboardingData);
        } catch (e) { }

        const registrationType = onboardingParams.type === "CLUB" ? "CLUB" : "FORMATION";

        // Find or create the pedagogical level based on onboardingData
        const pedagogicalLevelName = onboardingParams.level || "Débutant";
        let level = await prisma.level.findFirst({
            where: { name: { contains: pedagogicalLevelName, mode: 'insensitive' } }
        });

        if (!level) {
            level = await prisma.level.create({
                data: {
                    name: pedagogicalLevelName,
                    price: 0,
                    description: `Niveau ${pedagogicalLevelName}`
                }
            });
        }

        const planPrices = Object.fromEntries(PLA_PLANS.map((plan) => [plan.id, plan.price])) as Record<string, number>;

        const totalAmount = planPrices[planId] || 72000;
        const amountToPay = onboardingParams.paymentOption === "fractionne" ? (totalAmount * 0.5) : totalAmount;

        console.log(`[Registration] Creating user: ${email}, Plan: ${planId}, Amount: ${amountToPay}`);

        // Create student with assigned level, status PENDING
        const user = await prisma.user.create({
            data: {
                name,
                email,
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
                        status: "PARTIAL"
                    }
                }
            },
            include: { paymentPlans: true }
        });

        const paymentPlan = user.paymentPlans[0];
        const refCommand = `REG-${paymentPlan.id}-${Date.now()}`;

        console.log(`[Registration] User created ID: ${user.id}. Creating transaction ref: ${refCommand}`);

        // Create transaction record
        const transaction = await prisma.transaction.create({
            data: {
                planId: paymentPlan.id,
                amount: Number(amountToPay),
                method: "PAYSTACK",
                status: "PENDING",
                referenceId: refCommand,
            }
        });

        // Initialize Paystack payment
        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

        if (!secretKey) {
            console.error("[Registration] CRITICAL: PAYSTACK_SECRET_KEY is missing");
            return { error: "Erreur de configuration: Clé API Paystack manquante sur le serveur." };
        }

        console.log(`[Registration] Initializing Paystack at ${PAYSTACK_API_URL}`);

        const paystackResponse = await fetch(PAYSTACK_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${secretKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                amount: Math.round(amountToPay), // NO * 100 for XOF/XAF on Paystack
                reference: refCommand,
                currency: "XOF",
                callback_url: `${baseUrl}/login?status=payment_success`,
                metadata: {
                    transactionId: transaction.id,
                    planId: paymentPlan.id,
                    studentId: user.id,
                }
            }),
        });

        const paystackData = await paystackResponse.json();

        if (!paystackData.status) {
            console.error("[Registration] Paystack Init Failed:", paystackData);
            return { error: `Erreur Paystack: ${paystackData.message || "Impossible d'initialiser le paiement"}` };
        }

        console.log("[Registration] Paystack Init Success, redirecting...");

        // Notify user with welcome email (async, don't wait to avoid timeout)
        sendWelcomeEmail(user.email, user.name || "Étudiant", registrationType)
            .catch(err => console.error("Could not send welcome email", err));

        // Notify admin via Email
        sendAdminNewRegistrationEmail(user.name || "Nouveau", user.email, level?.name || planId)
            .catch(err => console.error("Could not send admin reg email", err));

        // Notify admin via Telegram
        notifyTelegram("new_registration", {
            name: user.name,
            email: user.email,
            type: registrationType
        }).catch(err => console.error("Telegram notify failed", err));

        return { success: true, redirectUrl: paystackData.data.authorization_url };

    } catch (error: any) {
        console.error("[Registration] CRITICAL ERROR:", error);
        return { error: `Erreur technique lors de l'inscription: ${error.message || "Veuillez contacter le support."}` };
    }
}
