"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

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

        // Find or create the level based on planId
        let level = await prisma.level.findFirst({
            where: { name: { contains: planId } }
        });

        // Map plan IDs to prices if level doesn't exist or to ensure sync
        const planPrices: Record<string, number> = {
            "essentiel": 75000,
            "intensif": 110000,
            "immersion": 140000
        };

        if (!level && planPrices[planId]) {
            level = await prisma.level.create({
                data: {
                    name: planId.charAt(0).toUpperCase() + planId.slice(1),
                    price: planPrices[planId],
                    description: `Plan ${planId} pour English Mastery Program`
                }
            });
        }

        let onboardingParams: any = {};
        try {
            onboardingParams = JSON.parse(onboardingData);
        } catch (e) { }

        const totalAmount = level?.price || planPrices[planId] || 0;
        const amountToPay = onboardingParams.paymentOption === "fractionne" ? (totalAmount * 0.2) : totalAmount;

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
                paymentPlans: {
                    create: {
                        totalAmount,
                        amountPaid: 0,
                        status: "PARTIAL"
                    }
                }
            },
            include: { paymentPlans: true }
        });

        const paymentPlan = user.paymentPlans[0];

        // --- BYPASS PAYTECH FOR MANUAL PAYMENT ---
        // (Comment everything out to keep it as backup)
        // const refCommand = `PRIME-${paymentPlan.id}-${Date.now()}`;
        //
        // const customField = JSON.stringify({
        //     transactionId: transaction.id,
        //     planId: paymentPlan.id,
        //     studentId: user.id,
        //     email: user.email,
        // });
        //
        // const apiKey = process.env.PAYTECH_API_KEY!;
        // const apiSecret = process.env.PAYTECH_API_SECRET!;
        // const env = process.env.PAYTECH_ENV || "test";
        // const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        //
        // const paymentBody: Record<string, string> = { ... };

        const refCommand = `PRIME-${paymentPlan.id}-${Date.now()}`;
        
        await prisma.transaction.create({
            data: {
                planId: paymentPlan.id,
                amount: amountToPay,
                method: "MANUAL",
                status: "PENDING",
                referenceId: refCommand,
            }
        });

        const redirectUrl = "/dashboard/student/payments/manual";

        // Notify user
        await sendWelcomeEmail(user.email, user.name || "Étudiant")
            .catch(err => console.error("Could not send welcome email", err));

        // Notify admin
        const { sendAdminNewRegistrationEmail } = await import("@/lib/email");
        await sendAdminNewRegistrationEmail(user.name || "Nouveau", user.email, level?.name || planId)
            .catch(err => console.error("Could not send admin reg email", err));

        return { success: true, redirectUrl };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Une erreur est survenue lors de l'inscription." };
    }
}
