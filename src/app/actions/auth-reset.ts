"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

const RESET_SENT_MESSAGE = "Compte trouvé. Un lien de réinitialisation vient d'être envoyé.";
const RESET_PENDING_MESSAGE =
    "Compte retrouvé, mais le paiement n'est pas encore finalisé. Un lien vient d'être envoyé pour changer le mot de passe, puis vous pourrez reprendre l'inscription avec ce même email.";
const RESET_NOT_FOUND_MESSAGE =
    "Aucun compte n'a été trouvé avec cet email. Vérifiez l'orthographe, essayez une autre adresse ou créez un compte.";

function hashResetToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(email: string) {
    const normalizedEmail = String(email || "").toLowerCase().trim();
    if (!normalizedEmail) return { error: "Entrez l'email utilisé lors de l'inscription.", code: "invalid_email" as const };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return { error: "Adresse email invalide.", code: "invalid_email" as const };
    }

    const limited = rateLimit(rateLimitKey("password-reset", normalizedEmail), 3, 15 * 60 * 1000);
    if (!limited.ok) return { error: "Trop de demandes. Patientez quelques minutes avant de réessayer.", code: "rate_limited" as const };

    try {
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) return { error: RESET_NOT_FOUND_MESSAGE, code: "not_found" as const };
        if (user.status === "SUSPENDED" || user.status === "BLOCKED") {
            return { error: "Ce compte est bloqué ou suspendu. Contactez l'administration pour le réactiver.", code: "account_unavailable" as const };
        }

        await prisma.passwordResetToken.deleteMany({ where: { email: normalizedEmail } });

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = hashResetToken(token);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

        await prisma.passwordResetToken.create({
            data: {
                email: normalizedEmail,
                token: tokenHash,
                expiresAt,
            },
        });

        const { sendPasswordResetEmail } = await import("@/lib/email");
        const sent = await sendPasswordResetEmail(normalizedEmail, user.name || "Étudiant", token);
        if (!sent) {
            await prisma.passwordResetToken.deleteMany({ where: { email: normalizedEmail } }).catch(() => undefined);
            return {
                error: "Le compte existe, mais l'email de réinitialisation n'a pas pu être envoyé. Contactez l'administration.",
                code: "email_failed" as const,
            };
        }

        return {
            success: true,
            message: user.status === "PENDING" ? RESET_PENDING_MESSAGE : RESET_SENT_MESSAGE,
            code: user.status === "PENDING" ? "pending_sent" as const : "sent" as const,
        };
    } catch (error) {
        console.error("Erreur Reset Password:", error);
        return { error: "Une erreur est survenue lors de l'envoi de l'email. Veuillez réessayer.", code: "server_error" as const };
    }
}

export async function resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) return { error: "Données incomplètes" };
    if (!/^[a-f0-9]{64}$/i.test(token)) return { error: "Lien invalide." };

    const limited = rateLimit(rateLimitKey("password-reset-submit", token.slice(0, 16)), 5, 15 * 60 * 1000);
    if (!limited.ok) return { error: "Trop de tentatives. Veuillez patienter avant de réessayer." };

    const tokenHash = hashResetToken(token);
    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token: tokenHash },
    });

    if (!resetToken) return { error: "Lien invalide." };
    if (new Date() > resetToken.expiresAt) {
        await prisma.passwordResetToken.delete({ where: { id: resetToken.id } }).catch(() => undefined);
        return { error: "Lien expiré." };
    }
    if (newPassword.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caractères." };

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
        prisma.user.update({
            where: { email: resetToken.email },
            data: { passwordHash },
        }),
        prisma.passwordResetToken.deleteMany({
            where: { email: resetToken.email },
        }),
    ]);

    return { success: true };
}
