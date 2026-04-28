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
    const subject = isClub 
        ? "Bienvenue au English Club by Prime ! 🥂" 
        : "Bienvenue chez Prime Language Academy ! 🎓";
        
    const title = isClub ? "The English Club" : "Prime Language Academy";
    const accentColor = "#E7162A";
    const mainColor = "#21286E";

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f9fb; padding: 40px; border-radius: 12px; border: 1px solid #eee;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: ${mainColor}; margin: 0; font-size: 24px; font-weight: 900;">${title}</h1>
                <div style="height: 3px; width: 60px; background-color: ${accentColor}; margin: 10px auto;"></div>
            </div>

            <h2 style="color: ${mainColor}; font-size: 20px;">Bonjour ${name || 'apprenant'},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                ${isClub 
                    ? "Bienvenue dans le cercle privé de l'élite anglophone d'Abidjan ! Nous sommes ravis de vous compter parmi les membres du <strong>English Club</strong>."
                    : "Bienvenue chez <strong>Prime Language Academy</strong> ! Votre voyage vers la maîtrise de l'anglais commence officiellement aujourd'hui."}
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                Votre compte a été créé avec succès. Pour finaliser votre inscription et activer votre accès complet, veuillez vous connecter et confirmer votre paiement initial via votre espace personnel.
            </p>

            <div style="text-align: center; margin-top: 35px; margin-bottom: 35px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="background-color: ${mainColor}; color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(33, 40, 110, 0.2);">
                    Accéder à mon espace
                </a>
            </div>

            <p style="font-size: 15px; color: #6b7280; line-height: 1.6;">
                À très bientôt,<br>
                <strong>L'équipe Prime Academy</strong>
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999;">
                Angré 8e Tranche, Abidjan • +225 01 61 33 78 64
            </div>
        </div>
    `;
    return sendEmail({ to, subject, html });
}

export async function sendAccountActivatedEmail(to: string, name: string) {
    const subject = "Félicitations ! Votre compte est activé 🎉";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f9fb; padding: 40px; border-radius: 12px;">
            <h2 style="color: #4f46e5;">Félicitations ${name || ''} !</h2>
            <p style="font-size: 16px; color: #4b5563;">
                Nous avons bien reçu et validé votre paiement. <strong>Votre compte est désormais 100% actif !</strong>
            </p>
            <p style="font-size: 16px; color: #4b5563;">
                Vous pouvez maintenant vous connecter et accéder à tous vos cours, aux ressources de l'académie et au forum des étudiants.
            </p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.primelanguageacademy.com'}/login" style="background-color: #E7162A; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(231, 22, 42, 0.2);">
                    Accéder à mon espace étudiant
                </a>
            </div>
            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
                Bienvenue dans l'aventure !<br>L'équipe Prime Language Academy
            </p>
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
    
    // Génération du PDF via Invoice-Generator API
    let pdfBuffer: Buffer | null = null;
    let filename = `Facture_${transactionId}.pdf`;
    let attachments: any[] = [];
    
    try {
        const invoiceData = {
            from: "PRIME LANGUAGE ACADEMY\\nAbidjan, Côte d'Ivoire",
            to: name + "\\n" + to,
            logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png", // Remplacer par votre vrai logo URL
            number: transactionId,
            date: date,
            currency: "XOF",
            items: [
                {
                    name: "Frais de scolarité - Formation English Mastery",
                    quantity: 1,
                    unit_cost: amount
                }
            ],
            amount_paid: amount,
            notes: "Merci pour votre confiance. En cas de paiement fractionné, n'oubliez pas que le solde est dû avant le début de la formation.",
            terms: "En cas d'annulation avant le début de la formation, un remboursement de 80% est possible. Aucun remboursement n'est effectué après le début des cours."
        };

        const response = await fetch("https://invoice-generator.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoiceData)
        });

        if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            pdfBuffer = Buffer.from(arrayBuffer);
            
            // Sauvegarder le PDF localement
            const fs = await import("fs/promises");
            const path = await import("path");
            const uploadDir = path.join(process.cwd(), "public", "uploads", "invoices");
            await fs.writeFile(path.join(uploadDir, filename), pdfBuffer);
            
            const invoiceUrl = `/uploads/invoices/${filename}`;
            
            // Mettre à jour la base de données avec l'URL de la facture
            const { prisma } = await import("@/lib/prisma");
            await prisma.transaction.update({
                where: { id: transactionId },
                data: { invoiceUrl }
            }).catch(console.error);

            attachments = [
                {
                    filename: filename,
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ];
        } else {
            console.error("Erreur génération PDF:", await response.text());
        }
    } catch (e) {
        console.error("Impossible de générer le PDF", e);
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f9fb; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #21286E; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">PRIME ACADEMY</h1>
                <p style="color: #E7162A; font-size: 14px; margin-top: 5px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Reçu de paiement officiel</p>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h2 style="color: #21286E; font-size: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 15px; margin-bottom: 20px;">Bonjour ${name || 'Étudiant'},</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Nous vous remercions pour votre récent paiement. Ceci confirme que nous avons bien reçu votre règlement pour vos frais de scolarité.
                </p>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    <strong>Veuillez trouver votre facture officielle au format PDF en pièce jointe de cet email.</strong>
                </p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 25px; margin-bottom: 25px;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: bold;">Référence Transaction</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-family: monospace; color: #21286E; font-weight: bold;">${transactionId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: bold;">Date</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #21286E; font-weight: bold;">${date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 15px 0; color: #21286E; font-weight: 900; font-size: 18px;">Montant Réglé</td>
                        <td style="padding: 15px 0; text-align: right; color: #E7162A; font-weight: 900; font-size: 18px;">${amount.toLocaleString()} FCFA</td>
                    </tr>
                </table>

                <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
                    Conservez cet email comme justificatif de paiement.<br>
                    Pour toute question, n'hésitez pas à répondre directement à cet email.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.primelanguageacademy.com'}/login" style="background-color: #21286E; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(33, 40, 110, 0.2);">
                    Accéder à mon espace
                </a>
            </div>
        </div>
    `;
    return sendEmail({ to, subject, html, attachments });
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

