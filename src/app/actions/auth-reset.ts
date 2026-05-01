"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function requestPasswordReset(email: string) {
    if (!email) return { error: "Email requis" };

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { error: "Aucun compte n'est associé à cette adresse email." };
        }

        // Nettoyer les anciens tokens pour cet email (optionnel mais propre)
        await prisma.passwordResetToken.deleteMany({ where: { email } });

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expiresAt
            }
        });

        const { sendPasswordResetEmail } = await import("@/lib/email");
        await sendPasswordResetEmail(email, user.name || "Étudiant", token);

        return { success: true, message: "Un lien de réinitialisation a été envoyé à votre adresse email." };
    } catch (error: any) {
        console.error("Erreur Reset Password:", error);
        return { error: "Une erreur est survenue lors de l'envoi de l'email. Veuillez réessayer." };
    }
}

export async function resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) return { error: "Données incomplètes" };

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token }
    });

    if (!resetToken) return { error: "Lien invalide." };
    if (new Date() > resetToken.expiresAt) return { error: "Lien expiré." };

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.user.update({
        where: { email: resetToken.email },
        data: { passwordHash }
    });

    // Supprimer le token utilisé
    await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
    });

    return { success: true };
}
