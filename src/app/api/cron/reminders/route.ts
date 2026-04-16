import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

// Cette route sera appelée toutes les heures par Vercel Cron
export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const now = new Date();
        const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
        const inTwentyFourHours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // 1. Rappels 24H (entre 23h et 24h avant)
        const appointments24h = await prisma.appointment.findMany({
            where: {
                status: "CONFIRMED",
                reminder24hSent: false,
                startTime: {
                    gte: new Date(inTwentyFourHours.getTime() - 60 * 60 * 1000), // Between 23h and 24h from now
                    lte: inTwentyFourHours
                }
            },
            include: { student: true, admin: true }
        });

        for (const app of appointments24h) {
            const timeStr = app.startTime.toLocaleString('fr-FR', { timeZone: 'UTC', dateStyle: 'long', timeStyle: 'short' });
            
            await sendMail(
                app.student.email,
                "Rappel: Votre cours d'Anglais demain",
                `Bonjour ${app.student.name}, nous vous rappelons que vous avez un cours d'anglais demain à ${timeStr}.`
            );

            // Mark as sent
            await prisma.appointment.update({
                where: { id: app.id },
                data: { reminder24hSent: true }
            });
        }

        // 2. Rappels 1H (entre 0h et 1h avant)
        const appointments1h = await prisma.appointment.findMany({
            where: {
                status: "CONFIRMED",
                reminder1hSent: false,
                startTime: {
                    gte: now,
                    lte: inOneHour
                }
            },
            include: { student: true, admin: true }
        });

        for (const app of appointments1h) {
            const timeStr = app.startTime.toLocaleString('fr-FR', { timeZone: 'UTC', timeStyle: 'short' });
            // Generate a simple meet link placeholder for now (or a real one if integrated)
            const meetLink = `https://meet.google.com/new?hs=122&authuser=0`; // Or instructions to join

            await sendMail(
                app.student.email,
                "🚨 Votre cours d'Anglais commence dans quelques instants",
                `Bonjour ${app.student.name}, votre cours commence à ${timeStr}. Rejoignez votre professeur ici : ${meetLink}`
            );

            // Notify Teacher/Admin if they have an email
            if (app.admin?.email) {
                await sendMail(
                    app.admin.email,
                    `Rappel Professeur: Cours avec ${app.student.name}`,
                    `Votre cours avec ${app.student.name} commence à ${timeStr}. Lien: ${meetLink}`
                );
            }

            // Mark as sent
            await prisma.appointment.update({
                where: { id: app.id },
                data: { reminder1hSent: true }
            });
        }

        return NextResponse.json({ 
            success: true, 
            reminded24h: appointments24h.length,
            reminded1h: appointments1h.length
        });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }
}
