import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, date, time, reason } = body;

        if (!name || !email || !date || !time) {
            return NextResponse.json(
                { error: "Champs obligatoires manquants." },
                { status: 400 }
            );
        }

        // Parse & validate date
        const [year, month, day] = date.split("-").map(Number);
        const [hours] = time.split(":").map(Number);
        const selectedDate = new Date(year, month - 1, day);
        const dayOfWeek = selectedDate.getDay(); // 0=Sun, 2=Tue, 4=Thu

        if (dayOfWeek !== 2 && dayOfWeek !== 4) {
            return NextResponse.json(
                { error: "Les rendez-vous sont uniquement disponibles les Mardis et Jeudis." },
                { status: 400 }
            );
        }

        if (dayOfWeek === 2 && (hours < 10 || hours >= 14)) {
            return NextResponse.json(
                { error: "Le Mardi, les consultations sont entre 10h00 et 14h00." },
                { status: 400 }
            );
        }

        if (dayOfWeek === 4 && (hours < 9 || hours >= 14)) {
            return NextResponse.json(
                { error: "Le Jeudi, les consultations sont entre 09h00 et 14h00." },
                { status: 400 }
            );
        }

        const dateLabel = selectedDate.toLocaleDateString("fr-FR", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });

        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
          <div style="background: #21286E; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">📅 Nouvelle Demande de RDV</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Depuis le site public de Prime Language Academy</p>
          </div>
          <div style="padding: 32px; background: white;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 12px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">👤 Nom</td><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 12px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">📧 Email</td><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 12px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">📱 Téléphone</td><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">${phone || "Non renseigné"}</td></tr>
              <tr><td style="padding: 12px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">📅 Date</td><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">${dateLabel}</td></tr>
              <tr><td style="padding: 12px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">🕐 Heure</td><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">${time}</td></tr>
              <tr><td style="padding: 12px; color: #666; font-size: 14px;">💬 Motif</td><td style="padding: 12px; font-weight: bold;">${reason || "Non précisé"}</td></tr>
            </table>
          </div>
          <div style="padding: 20px 32px; background: #f9f9f9; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">Prime Language Academy — Système de prise de rendez-vous public</p>
          </div>
        </div>`;

        if (process.env.EMAIL_USER) {
            await sendMail(
                process.env.EMAIL_USER,
                `[RDV Public] ${name} — ${dateLabel} à ${time}`,
                `Nouvelle demande de RDV de ${name} (${email}) pour le ${dateLabel} à ${time}. Motif : ${reason || "Non précisé"}`,
                html
            );

            // Confirmation email to the visitor
            await sendMail(
                email,
                "Votre demande de rendez-vous — Prime Language Academy",
                `Bonjour ${name},\n\nVotre demande de rendez-vous a bien été reçue.\nDate : ${dateLabel} à ${time}\nMotif : ${reason || "Non précisé"}\n\nNous vous contacterons très prochainement pour confirmer.\n\nCordialement,\nL'équipe Prime Language Academy`,
                `<div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
                  <div style="background: #21286E; padding: 28px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h2 style="color: white; margin: 0;">Demande reçue ✅</h2>
                  </div>
                  <div style="background: white; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #eee;">
                    <p>Bonjour <strong>${name}</strong>,</p>
                    <p>Votre demande de rendez-vous a bien été enregistrée :</p>
                    <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
                      <p style="margin: 4px 0;"><strong>📅 Date :</strong> ${dateLabel}</p>
                      <p style="margin: 4px 0;"><strong>🕐 Heure :</strong> ${time}</p>
                      <p style="margin: 4px 0;"><strong>💬 Motif :</strong> ${reason || "Non précisé"}</p>
                    </div>
                    <p>Nous vous contacterons très prochainement pour confirmer votre créneau.</p>
                    <p style="color: #999; font-size: 13px;">L'équipe Prime Language Academy</p>
                  </div>
                </div>`
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Public appointment error:", err);
        return NextResponse.json(
            { error: "Une erreur est survenue. Veuillez réessayer." },
            { status: 500 }
        );
    }
}
