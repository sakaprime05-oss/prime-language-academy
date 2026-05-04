"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

const RESET_PUBLIC_MESSAGE = "Si ce compte existe, un lien de reinitialisation a ete envoye.";

export async function requestPasswordReset(email: string) {
    const normalizedEmail = String(email || "").toLowerCase().trim();
    if (!normalizedEmail) return { success: true, message: RESET_PUBLIC_MESSAGE };

    const limited = rateLimit(rateLimitKey("password-reset", normalizedEmail), 3, 15 * 60 * 1000);
    if (!limited.ok) return { success: true, message: RESET_PUBLIC_MESSAGE };

    try {
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) return { success: true, message: RESET_PUBLIC_MESSAGE };

        await prisma.passwordResetToken.deleteMany({ where: { email: normalizedEmail } });

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

        await prisma.passwordResetToken.create({
            data: {
                email: normalizedEmail,
                token,
                expiresAt,
            },
        });

        const { sendPasswordResetEmail } = await import("@/lib/email");
        await sendPasswordResetEmail(normalizedEmail, user.name || "Etudiant", token);

        return { success: true, message: RESET_PUBLIC_MESSAGE };
    } catch (error) {
        console.error("Erreur Reset Password:", error);
        return { error: "Une erreur est survenue lors de l'envoi de l'email. Veuillez reessayer." };
    }
}

export async function resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) return { error: "Donnees incompletes" };

    const limited = rateLimit(rateLimitKey("password-reset-submit", token.slice(0, 16)), 5, 15 * 60 * 1000);
    if (!limited.ok) return { error: "Trop de tentatives. Veuillez patienter avant de reessayer." };

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    });

    if (!resetToken) return { error: "Lien invalide." };
    if (new Date() > resetToken.expiresAt) return { error: "Lien expire." };
    if (newPassword.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caracteres." };

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email: resetToken.email },
        data: { passwordHash },
    });

    await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
    });

    return { success: true };
}
