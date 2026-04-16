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

        // Create student with assigned level
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role: "STUDENT",
                status: "ACTIVE",
                levelId: level?.id,
                onboardingData,
                // Create the payment plan immediately
                paymentPlans: {
                    create: {
                        totalAmount: level?.price || planPrices[planId] || 0,
                        amountPaid: 0,
                        status: "PARTIAL"
                    }
                }
            },
        });

        await sendWelcomeEmail(user.email, user.name || "Étudiant")
            .catch(err => console.error("Could not send welcome email", err));

        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Une erreur est survenue lors de l'inscription." };
    }
}
