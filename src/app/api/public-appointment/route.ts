import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

const MAX_FIELD_LENGTH = 500;

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function cleanText(value: unknown, maxLength = MAX_FIELD_LENGTH) {
    return String(value || "").trim().slice(0, maxLength);
}

function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
    try {
        const forwardedFor = req.headers.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown";
        const limited = rateLimit(rateLimitKey("public-appointment", ip), 3, 15 * 60 * 1000);
        if (!limited.ok) {
            return NextResponse.json({ error: "Trop de demandes. Veuillez patienter quelques minutes." }, { status: 429 });
        }

        const body = await req.json();
        const name = cleanText(body.name, 120);
        const email = cleanText(body.email, 180).toLowerCase();
        const phone = cleanText(body.phone, 80);
        const date = cleanText(body.date, 20);
        const time = cleanText(body.time, 20);
        const reason = cleanText(body.reason);

        if (!name || !email || !date || !time || !isValidEmail(email)) {
            return NextResponse.json(
                { error: "Champs obligatoires invalides ou manquants." },
                { status: 400 }
            );
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
            return NextResponse.json({ error: "Format de date ou d'heure invalide." }, { status: 400 });
        }

        const [year, month, day] = date.split("-").map(Number);
        const [hours, minutes] = time.split(":").map(Number);
        const selectedDate = new Date(year, month - 1, day);
        const selectedStart = new Date(year, month - 1, day, hours, minutes, 0, 0);
        const now = new Date();
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90);

        if (
            !Number.isFinite(selectedDate.getTime()) ||
            !Number.isInteger(hours) ||
            !Number.isInteger(minutes) ||
            selectedDate.getFullYear() !== year ||
            selectedDate.getMonth() !== month - 1 ||
            selectedDate.getDate() !== day ||
            hours < 0 ||
            hours > 23 ||
            minutes < 0 ||
            minutes > 59
        ) {
            return NextResponse.json({ error: "Date invalide." }, { status: 400 });
        }

        if (selectedStart <= now) {
            return NextResponse.json({ error: "Veuillez choisir un rendez-vous a venir." }, { status: 400 });
        }

        if (selectedStart > maxDate) {
            return NextResponse.json({ error: "Les rendez-vous se prennent au maximum 90 jours a l'avance." }, { status: 400 });
        }

        if (minutes !== 0 && minutes !== 30) {
            return NextResponse.json({ error: "Choisissez un creneau a l'heure pile ou a la demi-heure." }, { status: 400 });
        }

        const dayOfWeek = selectedDate.getDay();
        if (dayOfWeek !== 2 && dayOfWeek !== 4) {
            return NextResponse.json(
                { error: "Les rendez-vous sont uniquement disponibles les mardis et jeudis." },
                { status: 400 }
            );
        }

        if (dayOfWeek === 2 && (hours < 10 || hours >= 14)) {
            return NextResponse.json(
                { error: "Le mardi, les consultations sont entre 10h00 et 14h00." },
                { status: 400 }
            );
        }

        if (dayOfWeek === 4 && (hours < 9 || hours >= 14)) {
            return NextResponse.json(
                { error: "Le jeudi, les consultations sont entre 09h00 et 14h00." },
                { status: 400 }
            );
        }

        const dateLabel = selectedDate.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safePhone = escapeHtml(phone || "Non renseigne");
        const safeTime = escapeHtml(time);
        const safeReason = escapeHtml(reason || "Non precise");

        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
          <div style="background: #21286E; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Nouvelle demande de RDV</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Depuis le site public de Prime Language Academy</p>
          </div>
          <div style="padding: 32px; background: white;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 12px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Nom</td><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">${safeName}</td></tr>
              <tr><td style="padding: 12px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Email</td><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
              <tr><td style="padding: 12px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Telephone</td><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">${safePhone}</td></tr>
              <tr><td style="padding: 12px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Date</td><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">${dateLabel}</td></tr>
              <tr><td style="padding: 12px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Heure</td><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">${safeTime}</td></tr>
              <tr><td style="padding: 12px; color: #666; font-size: 14px;">Motif</td><td style="padding: 12px; font-weight: bold;">${safeReason}</td></tr>
            </table>
          </div>
          <div style="padding: 20px 32px; background: #f9f9f9; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">Prime Language Academy - Systeme de prise de rendez-vous public</p>
          </div>
        </div>`;

        if (process.env.EMAIL_USER) {
            await sendMail(
                process.env.EMAIL_USER,
                `[RDV Public] ${name} - ${dateLabel} a ${time}`,
                `Nouvelle demande de RDV de ${name} (${email}) pour le ${dateLabel} a ${time}. Motif : ${reason || "Non precise"}`,
                html
            );

            await sendMail(
                email,
                "Votre demande de rendez-vous - Prime Language Academy",
                `Bonjour ${name},\n\nVotre demande de rendez-vous a bien ete recue.\nDate : ${dateLabel} a ${time}\nMotif : ${reason || "Non precise"}\n\nNous vous contacterons tres prochainement pour confirmer.\n\nCordialement,\nL'equipe Prime Language Academy`,
                `<div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
                  <div style="background: #21286E; padding: 28px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h2 style="color: white; margin: 0;">Demande recue</h2>
                  </div>
                  <div style="background: white; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #eee;">
                    <p>Bonjour <strong>${safeName}</strong>,</p>
                    <p>Votre demande de rendez-vous a bien ete enregistree :</p>
                    <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
                      <p style="margin: 4px 0;"><strong>Date :</strong> ${dateLabel}</p>
                      <p style="margin: 4px 0;"><strong>Heure :</strong> ${safeTime}</p>
                      <p style="margin: 4px 0;"><strong>Motif :</strong> ${safeReason}</p>
                    </div>
                    <p>Nous vous contacterons tres prochainement pour confirmer votre creneau.</p>
                    <p style="color: #999; font-size: 13px;">L'equipe Prime Language Academy</p>
                  </div>
                </div>`
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Public appointment error:", err);
        return NextResponse.json(
            { error: "Une erreur est survenue. Veuillez reessayer." },
            { status: 500 }
        );
    }
}
