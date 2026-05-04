"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail, sendAdminNewRegistrationEmail } from "@/lib/email";
import { notifyTelegram } from "@/lib/notify";
import { PLA_CLUB_CAPACITY, PLA_PLANS } from "@/lib/pla-program";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";
import { paystackChannels } from "@/lib/payment-methods";

const PAYSTACK_API_URL = "https://api.paystack.co/transaction/initialize";
const planPrices = Object.fromEntries(PLA_PLANS.map((plan) => [plan.id, plan.price])) as Record<string, number>;

type PaystackInitInput = {
    email: string;
    amount: number;
    reference: string;
    transactionId: string;
    planId: string;
    studentId: string;
    preferredPaymentMethod?: string;
    callbackPath?: string;
};

function paystackAmount(amount: number) {
    return Math.round(amount * 100);
}

async function initializePaystackCheckout(input: PaystackInitInput) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const configuredBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
    const baseUrl =
        configuredBaseUrl && /^https:\/\/(www\.)?primelangageacademy\.com$/.test(configuredBaseUrl.replace(/\/$/, ""))
            ? configuredBaseUrl.replace(/\/$/, "")
            : "https://primelangageacademy.com";

    if (!secretKey) {
        console.error("[Registration] Missing PAYSTACK_SECRET_KEY");
        return { error: "Le paiement n'a pas pu etre lance pour le moment. Contactez l'administration pour finaliser votre inscription." };
    }

    const paystackResponse = await fetch(PAYSTACK_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${secretKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: input.email,
            amount: paystackAmount(input.amount),
            reference: input.reference,
            currency: "XOF",
            channels: paystackChannels(input.preferredPaymentMethod),
            callback_url: `${baseUrl}${input.callbackPath || "/login?status=payment_success"}`,
            metadata: {
                transactionId: input.transactionId,
                planId: input.planId,
                studentId: input.studentId,
                preferredPaymentMethod: input.preferredPaymentMethod || "PAYSTACK",
            },
        }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || !paystackData.data?.authorization_url) {
        console.error("[Registration] Paystack initialization failed:", paystackData.message || paystackData);
        return { error: "Le paiement n'a pas pu etre lance pour le moment. Verifiez vos informations ou contactez l'administration." };
    }

    return { redirectUrl: paystackData.data.authorization_url as string };
}

async function createRegistrationCheckout(input: {
    userId: string;
    email: string;
    paymentPlanId: string;
    amount: number;
    preferredPaymentMethod?: string;
    retry?: boolean;
}) {
    const refPrefix = input.retry ? "REG-RETRY" : "REG";
    const refCommand = `${refPrefix}-${input.paymentPlanId}-${Date.now()}`;

    await prisma.transaction.updateMany({
        where: {
            planId: input.paymentPlanId,
            status: "PENDING",
        },
        data: {
            status: "FAILED",
            failureReason: "Nouvelle tentative de paiement creee.",
        },
    });

    const transaction = await prisma.transaction.create({
        data: {
            planId: input.paymentPlanId,
            amount: Number(input.amount),
            method: input.preferredPaymentMethod || "PAYSTACK",
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
        preferredPaymentMethod: input.preferredPaymentMethod,
        callbackPath: `/api/payments/paystack/callback?reference=${encodeURIComponent(refCommand)}`,
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
    const limited = rateLimit(rateLimitKey("register", normalizedEmail), 5, 15 * 60 * 1000);
    if (!limited.ok) {
        return { error: "Trop de tentatives. Veuillez patienter quelques minutes avant de reessayer." };
    }

    let onboardingParams: any = {};
    try {
        onboardingParams = JSON.parse(onboardingData);
    } catch (e) { }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: { paymentPlans: true },
        });

        if (existingUser) {
            if (existingUser.status !== "PENDING") {
                if (existingUser.status === "WAITLIST" && existingUser.registrationType === "CLUB") {
                    return { success: true, waitlisted: true, redirectUrl: "/register-club/waitlist" };
                }
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

            const submittedTotalAmount = planPrices[planId];
            const updatedTotalAmount = submittedTotalAmount || paymentPlan.totalAmount;
            const remaining = Math.max(0, updatedTotalAmount - paymentPlan.amountPaid);
            if (remaining <= 0) {
                return { error: "Votre paiement est déjà complet. Patientez quelques instants puis connectez-vous." };
            }

            if (submittedTotalAmount && (paymentPlan.totalAmount !== submittedTotalAmount || existingUser.onboardingData !== onboardingData)) {
                await prisma.$transaction([
                    prisma.paymentPlan.update({
                        where: { id: paymentPlan.id },
                        data: { totalAmount: submittedTotalAmount },
                    }),
                    prisma.user.update({
                        where: { id: existingUser.id },
                        data: { onboardingData },
                    }),
                ]);
            }

            const amountToPay =
                onboardingParams.paymentOption === "fractionne" && paymentPlan.amountPaid <= 0
                    ? updatedTotalAmount * 0.5
                    : remaining;

            const checkout = await createRegistrationCheckout({
                userId: existingUser.id,
                email: existingUser.email,
                paymentPlanId: paymentPlan.id,
                amount: amountToPay,
                preferredPaymentMethod: onboardingParams.paymentMethod,
                retry: true,
            });

            if (checkout.error) return { error: checkout.error };

            return { success: true, redirectUrl: checkout.redirectUrl };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const registrationType = onboardingParams.type === "CLUB" ? "CLUB" : "FORMATION";
        const isClubRegistration = registrationType === "CLUB";

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

        if (isClubRegistration) {
            const currentClubMembers = await prisma.user.count({
                where: {
                    registrationType: "CLUB",
                    status: { in: ["PENDING", "ACTIVE"] },
                },
            });

            if (currentClubMembers >= PLA_CLUB_CAPACITY) {
                const waitlistedUser = await prisma.user.create({
                    data: {
                        name,
                        email: normalizedEmail,
                        passwordHash: hashedPassword,
                        role: "STUDENT",
                        status: "WAITLIST",
                        levelId: level?.id,
                        onboardingData,
                        registrationType,
                    },
                });

                sendAdminNewRegistrationEmail(waitlistedUser.name || "Nouveau", waitlistedUser.email, "English Club - liste d'attente")
                    .catch(err => console.error("Could not send admin waitlist email", err));

                notifyTelegram("new_registration", {
                    name: waitlistedUser.name,
                    email: waitlistedUser.email,
                    type: "CLUB_WAITLIST",
                }).catch(err => console.error("Telegram waitlist notify failed", err));

                return { success: true, waitlisted: true, redirectUrl: "/register-club/waitlist" };
            }
        }

        const amountToPay = onboardingParams.paymentOption === "fractionne" ? totalAmount * 0.5 : totalAmount;

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

        const checkout = await createRegistrationCheckout({
            userId: user.id,
            email: user.email,
            paymentPlanId: paymentPlan.id,
            amount: amountToPay,
            preferredPaymentMethod: onboardingParams.paymentMethod,
        });

        if (checkout.error) {
            console.error("[Registration] Paystack Init Failed:", checkout.error);
            return { error: checkout.error };
        }

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
