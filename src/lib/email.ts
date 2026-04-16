export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    // Dans un environnement réel, on utiliserait un service comme Resend, SendGrid, ou Nodemailer avec SMTP.
    // Pour l'instant, nous allons simuler l'envoi d'e-mail dans la console.

    console.log("=========================================");
    console.log(`📧 ENVOI D'EMAIL SIMULÉ`);
    console.log(`À      : ${to}`);
    console.log(`Sujet  : ${subject}`);
    console.log(`Contenu:`);
    console.log(html);
    console.log("=========================================");

    // TODO: Intégrer Resend ou Nodemailer
    // Exemple avec Resend:
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: 'Acme <onboarding@resend.dev>', to, subject, html });

    return true;
}

export async function sendWelcomeEmail(to: string, name: string) {
    const subject = "Bienvenue chez Prime Language Academy ! 🎓";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #dba514;">Bonjour ${name || 'étudiant'},</h2>
            <p>Bienvenue chez <strong>Prime Language Academy</strong> ! Nous sommes ravis de vous compter parmi nos apprenants.</p>
            <p>Votre compte a été créé avec succès. Vous pouvez dès à présent vous connecter à votre espace étudiant pour consulter votre niveau, suivre vos leçons et effectuer vos paiements.</p>
            <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="background-color: #dba514; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Accéder à mon espace
                </a>
            </p>
            <p>L'équipe Prime Language Academy</p>
        </div>
    `;
    return sendEmail({ to, subject, html });
}

export async function sendPaymentReminderEmail(to: string, name: string, amount: number, dueDate: string) {
    const subject = "Rappel de paiement - Prime Language Academy ⚠️";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #e63946;">Bonjour ${name || 'étudiant'},</h2>
            <p>Ceci est un petit rappel concernant votre frais de scolarité chez <strong>Prime Language Academy</strong>.</p>
            <p>Il vous reste un solde de <strong>${amount} FCFA</strong> à régler avant le <strong>${dueDate}</strong>.</p>
            <p>Pour régulariser votre situation, veuillez vous rendre sur votre espace étudiant, rubrique Paiements.</p>
            <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/student" style="background-color: #e63946; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Effectuer le paiement
                </a>
            </p>
            <p>Si vous avez déjà effectué ce paiement, veuillez ignorer ce message ou nous contacter.</p>
            <p>L'équipe Prime Language Academy</p>
        </div>
    `;
    return sendEmail({ to, subject, html });
}

export async function sendInvoiceEmail(to: string, name: string, amount: number, transactionId: string) {
    const subject = "Votre Facture - Prime Language Academy 🧾";
    const date = new Date().toLocaleDateString('fr-FR');
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f9fb; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">Prime Academy</h1>
                <p style="color: #888; font-size: 14px; margin-top: 5px;">Reçu de paiement officiel</p>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h2 style="color: #111; font-size: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 15px; margin-bottom: 20px;">Bonjour ${name || 'Étudiant'},</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Nous vous remercions pour votre récent paiement. Ceci confirme que nous avons bien reçu votre règlement pour vos frais de scolarité.
                </p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 25px; margin-bottom: 25px;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: bold;">Référence Transaction</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-family: monospace; color: #111;">${transactionId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: bold;">Date</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111;">${date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 15px 0; color: #111; font-weight: 900; font-size: 18px;">Montant Réglé</td>
                        <td style="padding: 15px 0; text-align: right; color: #4f46e5; font-weight: 900; font-size: 18px;">${amount.toLocaleString()} FCFA</td>
                    </tr>
                </table>

                <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
                    Conservez cet email comme justificatif de paiement.<br>
                    Pour toute question, n'hésitez pas à répondre directement à cet email.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/student" style="background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);">
                    Accéder à vos cours
                </a>
            </div>
        </div>
    `;
    return sendEmail({ to, subject, html });
}
