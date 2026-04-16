"use server";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function requestPasswordReset(email: string) {
    if (!email) return { error: "Email requis" };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // Pour des raisons de sécurité, on ne dit pas si l'email existe ou non de manière explicite.
        return { success: true, message: "Si cet email existe, un lien a été envoyé." };
    }

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

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    
    await sendMail(
        email,
        "Prime Language Academy - Réinitialisation du mot de passe",
        `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
        `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Réinitialisation de mot de passe</h2>
            <p>Bonjour ${user.name || "Étudiant"},</p>
            <p>Quelqu'un a demandé une réinitialisation de mot de passe pour votre compte.</p>
            <p>Si ce n'est pas vous, vous pouvez ignorer cet email.</p>
            <p>Sinon, cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Réinitialiser mon mot de passe</a>
            <p style="margin-top: 30px; font-size: 12px; color: gray;">Ce lien est valable 1 heure.</p>
        </div>
        `
    );

    return { success: true, message: "Si cet email existe, un lien a été envoyé." };
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
