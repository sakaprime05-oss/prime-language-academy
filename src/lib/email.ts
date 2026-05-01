import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html, attachments }: { to: string, subject: string, html: string, attachments?: any[] }) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_APP_PASSWORD;

    if (!user || !pass) {
        // Mode simulation si les credentials manquent
        console.log("=========================================");
        console.log(`📧 ENVOI D'EMAIL SIMULÉ (MANQUE IDENTIFIANTS GMAIL)`);
        console.log(`À      : ${to}`);
        console.log(`Sujet  : ${subject}`);
        if (attachments && attachments.length > 0) {
            console.log(`Pièces jointes : ${attachments.length} fichier(s)`);
        }
        console.log("=========================================");
        return true;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: user,
                pass: pass,
            },
        });

        const info = await transporter.sendMail({
            from: `"Prime Academy" <${user}>`,
            to,
            subject,
            html,
            attachments,
        });

        console.log(`Émail envoyé avec succès à ${to} (MessageID: ${info.messageId})`);
        return true;
    } catch (error) {
        console.error("Erreur d'envoi d'email (Nodemailer):", error);
        return false;
    }
}

export async function sendWelcomeEmail(to: string, name: string, type: string = "FORMATION") {
    const isClub = type === "CLUB";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://primelangageacademy.com";
    
    const subject = isClub 
        ? "Bienvenue au English Club by Prime ! 🥂" 
        : "Bienvenue chez Prime Language Academy ! 🎓";
        
    const title = isClub ? "The English Club" : "Prime Language Academy";
    const accentColor = "#E7162A";
    const mainColor = "#21286E";

    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; background-color: #ffffff; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background-color: ${mainColor}; padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">${title}</h1>
            </div>

            <div style="padding: 40px 30px;">
                <h2 style="color: ${mainColor}; font-size: 22px; margin-top: 0;">Bonjour ${name || 'cher apprenant'},</h2>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    ${isClub 
                        ? "Bienvenue dans le cercle privé de l'élite anglophone ! Nous sommes ravis de vous compter parmi les membres du <strong>English Club</strong>."
                        : "Bienvenue chez <strong>Prime Language Academy</strong> ! Votre voyage vers la maîtrise de l'anglais commence officiellement aujourd'hui."}
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Votre compte a été configuré. Pour activer votre accès et rejoindre la plateforme, cliquez sur le bouton ci-dessous :
                </p>

                <div style="text-align: center; margin: 40px 0;">
                    <a href="${appUrl}/login" style="background-color: ${accentColor}; color: white; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; shadow: 0 10px 20px rgba(231, 22, 42, 0.2);">
                        Accéder à mon espace
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; border-top: 1px solid #f3f4f6; pt: 20px;">
                    À très bientôt,<br>
                    <strong>L'équipe Prime Academy</strong>
                </p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 11px; color: #9ca3af;">
                Angré 8e Tranche, Abidjan • +225 01 61 33 78 64<br>
                Ceci est un message automatique, merci de ne pas y répondre directement.
            </div>
        </div>
    `;
    return sendEmail({ to, subject, html });
}

export async function sendAccountActivatedEmail(to: string, name: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://primelangageacademy.com";
    const subject = "Félicitations ! Votre compte est activé 🎉";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #ffffff; padding: 0; border-radius: 16px; border: 1px solid #eee; overflow: hidden;">
            <div style="background-color: #10b981; padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">Compte Activé !</h1>
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #065f46;">Félicitations ${name || ''} !</h2>
                <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
                    Nous avons bien reçu et validé votre paiement. <strong>Votre accès est désormais 100% actif !</strong>
                </p>
                <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
                    Vous pouvez maintenant accéder à tous vos cours, aux ressources et au forum.
                </p>
                <div style="text-align: center; margin-top: 35px;">
                    <a href="${appUrl}/login" style="background-color: #21286E; color: white; text-decoration: none; padding: 15px 30px; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Commencer maintenant
                    </a>
                </div>
            </div>
        </div>
    `;
    return sendEmail({ to, subject, html });
}
export async function sendPaymentReminderEmail(to: string, name: string, amount: number, dueDate: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://primelangageacademy.com";
    const subject = "Rappel de paiement - Prime Language Academy ⚠️";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #ffedd5; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #f59e0b; padding: 20px; text-align: center; color: white;">
                <h2 style="margin: 0;">Rappel de Paiement</h2>
            </div>
            <div style="padding: 30px;">
                <p>Bonjour <strong>${name || 'étudiant'}</strong>,</p>
                <p>Ceci est un petit rappel concernant votre frais de scolarité chez <strong>Prime Language Academy</strong>.</p>
                <div style="background-color: #fffbeb; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #fef3c7;">
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #b45309;">Reste à payer : ${amount.toLocaleString()} FCFA</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #d97706;">Échéance : ${dueDate}</p>
                </div>
                <p>Pour régulariser votre situation et éviter toute interruption de vos cours, merci de cliquer ci-dessous :</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="${appUrl}/dashboard/student/payments" style="background-color: #21286E; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
                        Régler mon solde
                    </a>
                </div>
            </div>
        </div>
    `;
    return sendEmail({ to, subject, html });
}

export async function sendInvoiceEmail(to: string, name: string, amount: number, transactionId: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://primelangageacademy.com";
    const subject = "Votre Facture - Prime Language Academy 🧾";
    const date = new Date().toLocaleDateString('fr-FR');
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f9fb; padding: 40px; border-radius: 16px; border: 1px solid #eee;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #21286E; margin: 0; font-size: 28px; font-weight: 900;">PRIME ACADEMY</h1>
                <p style="color: #E7162A; font-size: 14px; font-weight: bold; text-transform: uppercase;">Reçu de paiement officiel</p>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
                <h2 style="color: #21286E; font-size: 18px;">Bonjour ${name || 'Étudiant'},</h2>
                <p style="font-size: 15px; line-height: 1.6;">
                    Nous vous remercions pour votre règlement. Votre paiement a été traité avec succès.
                </p>
                
                <table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Référence</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${transactionId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Montant Réglé</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #E7162A;">${amount.toLocaleString()} FCFA</td>
                    </tr>
                </table>

                <div style="text-align: center; margin-top: 35px;">
                    <a href="${appUrl}/dashboard/student" style="background-color: #21286E; color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; display: inline-block;">
                        Accéder à mon espace
                    </a>
                </div>
            </div>
        </div>
    `;
    return sendEmail({ to, subject, html });
}

export async function sendAdminNotificationEmail(studentName: string, amount: number, transactionId: string) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@primelanguageacademy.com"; // Configuration par défaut
    const subject = "Nouvelle Inscription & Paiement Reçu 🚀";
    const date = new Date().toLocaleDateString('fr-FR');
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f9fb; padding: 40px; border-radius: 12px;">
            <h2 style="color: #4f46e5;">Nouvelle Confirmation d'Inscription !</h2>
            <p style="font-size: 16px; color: #4b5563;">
                L'étudiant <strong>${studentName}</strong> vient de finaliser son inscription avec succès.
            </p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 20px;">
                <p><strong>Montant payé:</strong> ${amount.toLocaleString()} FCFA</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Réf Transaction:</strong> ${transactionId}</p>
            </div>
            <p style="margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/admin" style="background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Voir dans le Dashboard
                </a>
            </p>
        </div>
        </div>
    `;
    return sendEmail({ to: adminEmail, subject, html });
}

export async function sendAdminNewRegistrationEmail(studentName: string, studentEmail: string, planName: string) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@primelanguageacademy.com";
    const subject = "⚠️ Nouvelle Inscription (En attente de paiement) !";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f9fb; padding: 40px; border-radius: 12px;">
            <h2 style="color: #dba514;">Nouvel(le) étudiant(e) inscrit(e)</h2>
            <p style="font-size: 16px; color: #4b5563;">
                L'étudiant(e) <strong>${studentName}</strong> (${studentEmail}) vient de s'inscrire pour la formule <strong>${planName}</strong>.
            </p>
            <p style="font-size: 14px; margin-top: 15px;">
                Il a été redirigé vers la page de paiement manuel. Vous devriez recevoir une soumission de preuve bientôt.
            </p>
            <p style="margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/admin/students" style="background-color: #dba514; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Voir la liste des étudiants
                </a>
            </p>
        </div>
    `;
    return sendEmail({ to: adminEmail, subject, html });
}

export async function sendAdminPaymentProofEmail(studentName: string, provider: string, phone: string, amount: number) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@primelanguageacademy.com";
    const subject = "💰 Preuve de paiement soumise ! Action requise !";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f9fb; padding: 40px; border-radius: 12px; border: 2px solid #3b82f6;">
            <h2 style="color: #3b82f6;">Preuve de Paiement Déposée</h2>
            <p style="font-size: 16px; color: #4b5563;">
                L'étudiant(e) <strong>${studentName}</strong> affirme avoir effectué le transfert pour ses frais (<strong>${amount.toLocaleString()} FCFA</strong>).
            </p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 20px;">
                <p><strong>Moyen :</strong> ${provider}</p>
                <p><strong>Numéro d'envoi :</strong> ${phone}</p>
            </div>
            <p style="font-size: 14px; margin-top: 15px; font-weight: bold; color: #ef4444;">
                Veuillez vérifier votre téléphone, puis valider ou rejeter la transaction dans votre tableau de bord.
            </p>
            <p style="margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/admin/payments" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Vérifier le Reçu
                </a>
            </p>
        </div>
    `;
    return sendEmail({ to: adminEmail, subject, html });
}

export async function sendForumCommentEmail(postAuthorEmail: string, postAuthorName: string, commenterName: string, postTitle: string, postId: string) {
    const subject = `Nouveau commentaire sur votre post : "${postTitle}" 💬`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f9fb; padding: 40px; border-radius: 12px;">
            <h2 style="color: #E7162A;">Bonjour ${postAuthorName},</h2>
            <p style="font-size: 16px; color: #4b5563;">
                <strong>${commenterName}</strong> vient de commenter votre publication sur le forum.
            </p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 20px;">
                <p><strong>Post :</strong> ${postTitle}</p>
            </div>
            <p style="margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/student/forum/${postId}" style="background-color: #E7162A; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Répondre au commentaire
                </a>
            </p>
            <p style="font-size: 12px; color: #999; margin-top: 30px;">
                Ceci est une notification automatique de Prime Language Academy.
            </p>
        </div>
    `;
    return sendEmail({ to: postAuthorEmail, subject, html });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://primelangageacademy.com";
    const resetLink = `${appUrl}/reset-password?token=${token}`;
    const subject = "Réinitialisation de votre mot de passe - Prime Academy 🔒";

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #21286E; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900;">PRIME ACADEMY</h1>
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #21286E; font-size: 20px; margin-top: 0;">Bonjour ${name || 'cher utilisateur'},</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.
                </p>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Pour choisir un nouveau mot de passe, cliquez sur le bouton ci-dessous :
                </p>
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${resetLink}" style="background-color: #E7162A; color: white; padding: 18px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Réinitialiser mon mot de passe
                    </a>
                </div>
                <p style="font-size: 13px; color: #9ca3af; text-align: center;">
                    Ce lien est valable pendant 1 heure.<br>
                    Si le bouton ne fonctionne pas, copiez-collez ce lien : <br>
                    <span style="color: #21286E;">${resetLink}</span>
                </p>
            </div>
        </div>
    `;
    return sendEmail({ to, subject, html });
}

