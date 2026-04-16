import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

export const sendMail = async (to: string | string[], subject: string, text: string, html?: string) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        console.warn("⚠️ Configuration email (EMAIL_USER et EMAIL_APP_PASSWORD) manquante, email non envoyé.");
        return;
    }

    try {
        await transporter.sendMail({
            from: `"Prime Language Academy" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log(`Email envoyé avec succès à ${to}`);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
    }
};
