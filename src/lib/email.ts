import nodemailer from "nodemailer";
import { Resend } from "resend";

type SendEmailInput = {
    to: string;
    subject: string;
    html: string;
    attachments?: unknown[];
};

type EmailAttachment = {
    filename?: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
};

const brand = {
    name: "Prime Language Academy",
    shortName: "Prime Academy",
    color: "#21286E",
    accent: "#E7162A",
    address: "Angre 8e Tranche, Abidjan",
    phone: "+225 01 61 33 78 64",
};

function appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://primelangageacademy.com";
}

function senderAddress() {
    const email = process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@primelangageacademy.com";
    const name = process.env.EMAIL_FROM_NAME || brand.name;
    return `"${name}" <${email}>`;
}

function adminEmail() {
    return process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "admin@primelanguageacademy.com";
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function money(amount: number) {
    return `${Number(amount || 0).toLocaleString("fr-FR")} FCFA`;
}

function emailLayout(title: string, body: string, options: { preheader?: string; footer?: string } = {}) {
    return `
        <div style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
            <div style="display:none;max-height:0;overflow:hidden;color:transparent;">${escapeHtml(options.preheader || title)}</div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6fb;padding:24px 12px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
                            <tr>
                                <td style="background:${brand.color};padding:28px 24px;text-align:center;">
                                    <div style="font-size:22px;font-weight:800;letter-spacing:.3px;color:#ffffff;">${brand.name}</div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:28px 24px;">
                                    <h1 style="margin:0 0 18px 0;font-size:22px;line-height:1.3;color:${brand.color};">${title}</h1>
                                    ${body}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:18px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;line-height:1.6;color:#6b7280;">
                                    ${options.footer || `${brand.address}<br>${brand.phone}<br>Message automatique envoyé par ${brand.name}.`}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    `;
}

function button(label: string, href: string, color = brand.accent) {
    return `
        <div style="margin:28px 0;text-align:center;">
            <a href="${href}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;padding:13px 22px;border-radius:10px;font-weight:700;font-size:15px;">
                ${label}
            </a>
        </div>
    `;
}

function paragraph(text: string) {
    return `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#374151;">${text}</p>`;
}

function detailRows(rows: Array<[string, string]>) {
    return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
            ${rows.map(([label, value]) => `
                <tr>
                    <td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;">${label}</td>
                    <td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;font-weight:700;text-align:right;">${value}</td>
                </tr>
            `).join("")}
        </table>
    `;
}

export async function sendEmail({ to, subject, html, attachments }: SendEmailInput) {
    const resendKey = process.env.RESEND_API_KEY;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_APP_PASSWORD;

    async function sendWithGmail() {
        if (!user || !pass) {
            console.log("[email:simulation]", { to, subject, attachments: attachments?.length || 0 });
            return true;
        }

        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user, pass },
            });

            const info = await transporter.sendMail({
                from: senderAddress(),
                to,
                subject,
                html,
                attachments: attachments as any[] | undefined,
            });

            console.log(`Email sent with Gmail to ${to} (${info.messageId})`);
            return true;
        } catch (error) {
            console.error("Gmail email send failed:", error);
            return false;
        }
    }

    if (resendKey) {
        try {
            const resend = new Resend(resendKey);
            const { data, error } = await resend.emails.send({
                from: senderAddress(),
                to,
                subject,
                html,
                attachments: attachments as EmailAttachment[] | undefined,
            });

            if (error) {
                console.error("Resend email failed:", error);
                return sendWithGmail();
            }

            console.log(`Email sent with Resend to ${to} (${data?.id})`);
            return true;
        } catch (error) {
            console.error("Resend email send failed:", error);
            return sendWithGmail();
        }
    }

    return sendWithGmail();
}

export async function sendWelcomeEmail(to: string, name: string, type: string = "FORMATION") {
    const isClub = type === "CLUB";
    const title = isClub ? "Bienvenue au English Club" : "Bienvenue chez Prime Language Academy";
    const body = `
        ${paragraph(`Bonjour ${escapeHtml(name || "cher apprenant")},`)}
        ${paragraph(isClub
            ? "Votre inscription au English Club a bien été enregistrée. Nous sommes heureux de vous compter parmi nos membres."
            : "Votre inscription a bien été enregistrée. Votre parcours avec Prime Language Academy peut maintenant commencer.")}
        ${paragraph("Vous pouvez vous connecter à votre espace avec l'email et le mot de passe utilisés lors de l'inscription.")}
        ${button("Accéder à mon espace", `${appUrl()}/login`)}
        ${paragraph("Si vous avez une question, répondez directement à ce message ou contactez l'administration.")}
    `;
    return sendEmail({ to, subject: title, html: emailLayout(title, body) });
}

export async function sendAccountActivatedEmail(to: string, name: string) {
    const title = "Votre compte est activé";
    const body = `
        ${paragraph(`Bonjour ${escapeHtml(name || "")},`)}
        ${paragraph("Votre paiement a été validé. Votre accès à la plateforme est maintenant actif.")}
        ${paragraph("Vous pouvez accéder à vos cours, ressources, messages et espaces de suivi depuis votre tableau de bord.")}
        ${button("Ouvrir mon espace", `${appUrl()}/login`, brand.color)}
    `;
    return sendEmail({ to, subject: title, html: emailLayout(title, body) });
}

export async function sendPaymentReminderEmail(to: string, name: string, amount: number, dueDate: string) {
    const title = "Rappel de paiement";
    const body = `
        ${paragraph(`Bonjour ${escapeHtml(name || "cher étudiant")},`)}
        ${paragraph("Nous vous rappelons qu'un solde reste à régler pour votre formation.")}
        ${detailRows([
            ["Reste à payer", money(amount)],
            ["Échéance", escapeHtml(dueDate)],
        ])}
        ${paragraph("Merci de régulariser votre situation pour éviter toute interruption d'accès aux cours.")}
        ${button("Régler mon solde", `${appUrl()}/dashboard/student/payments`, brand.color)}
    `;
    return sendEmail({ to, subject: title, html: emailLayout(title, body) });
}

export async function sendInvoiceEmail(to: string, name: string, amount: number, transactionId: string) {
    const title = "Reçu de paiement";
    const body = `
        ${paragraph(`Bonjour ${escapeHtml(name || "cher étudiant")},`)}
        ${paragraph("Nous confirmons la réception de votre paiement. Merci pour votre confiance.")}
        ${detailRows([
            ["Référence", escapeHtml(transactionId)],
            ["Montant réglé", money(amount)],
            ["Date", new Date().toLocaleDateString("fr-FR")],
        ])}
        ${button("Voir mon espace", `${appUrl()}/dashboard/student`, brand.color)}
    `;
    return sendEmail({ to, subject: title, html: emailLayout(title, body) });
}

export async function sendAdminNotificationEmail(studentName: string, amount: number, transactionId: string) {
    const title = "Paiement confirmé";
    const body = `
        ${paragraph(`Le paiement de ${escapeHtml(studentName || "un étudiant")} vient d'être confirmé.`)}
        ${detailRows([
            ["Étudiant", escapeHtml(studentName || "Non renseigné")],
            ["Montant", money(amount)],
            ["Référence", escapeHtml(transactionId)],
            ["Date", new Date().toLocaleDateString("fr-FR")],
        ])}
        ${button("Ouvrir le dashboard", `${appUrl()}/dashboard/admin`, brand.color)}
    `;
    return sendEmail({ to: adminEmail(), subject: title, html: emailLayout(title, body) });
}

export async function sendAdminNewRegistrationEmail(studentName: string, studentEmail: string, planName: string) {
    const title = "Nouvelle inscription";
    const body = `
        ${paragraph("Une nouvelle inscription vient d'être enregistrée.")}
        ${detailRows([
            ["Nom", escapeHtml(studentName || "Non renseigné")],
            ["Email", escapeHtml(studentEmail || "Non renseigné")],
            ["Formule / niveau", escapeHtml(planName || "Non renseigné")],
        ])}
        ${paragraph("Le paiement est en attente de confirmation.")}
        ${button("Voir les étudiants", `${appUrl()}/dashboard/admin/students`, brand.color)}
    `;
    return sendEmail({ to: adminEmail(), subject: title, html: emailLayout(title, body) });
}

export async function sendAdminPaymentProofEmail(studentName: string, provider: string, phone: string, amount: number) {
    const title = "Preuve de paiement à vérifier";
    const body = `
        ${paragraph("Un étudiant a soumis une preuve de paiement. Merci de vérifier le transfert avant validation.")}
        ${detailRows([
            ["Étudiant", escapeHtml(studentName || "Non renseigné")],
            ["Moyen de paiement", escapeHtml(provider || "Non renseigné")],
            ["Numéro / indication", escapeHtml(phone || "Non renseigné")],
            ["Montant déclaré", money(amount)],
        ])}
        ${button("Vérifier le paiement", `${appUrl()}/dashboard/admin/payments`, brand.color)}
    `;
    return sendEmail({ to: adminEmail(), subject: title, html: emailLayout(title, body) });
}

export async function sendForumCommentEmail(postAuthorEmail: string, postAuthorName: string, commenterName: string, postTitle: string, postId: string) {
    const title = "Nouveau commentaire sur votre publication";
    const body = `
        ${paragraph(`Bonjour ${escapeHtml(postAuthorName || "")},`)}
        ${paragraph(`${escapeHtml(commenterName || "Un membre")} a commenté votre publication.`)}
        ${detailRows([["Publication", escapeHtml(postTitle || "Sans titre")]])}
        ${button("Lire le commentaire", `${appUrl()}/dashboard/student/forum/${postId}`, brand.color)}
    `;
    return sendEmail({ to: postAuthorEmail, subject: title, html: emailLayout(title, body) });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
    const resetLink = `${appUrl()}/reset-password?token=${token}`;
    const title = "Réinitialisation de votre mot de passe";
    const body = `
        ${paragraph(`Bonjour ${escapeHtml(name || "cher utilisateur")},`)}
        ${paragraph("Nous avons reçu une demande de réinitialisation du mot de passe de votre compte.")}
        ${paragraph("Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.")}
        ${button("Choisir un nouveau mot de passe", resetLink, brand.accent)}
        ${paragraph(`Lien direct : <a href="${resetLink}" style="color:${brand.color};">${resetLink}</a>`)}
        ${paragraph("Ce lien est valable pendant 1 heure.")}
    `;
    return sendEmail({ to, subject: title, html: emailLayout(title, body) });
}
