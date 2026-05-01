import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const now = new Date();
        const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
        const inTwentyFourHours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const appointments24h = await prisma.appointment.findMany({
            where: {
                status: "CONFIRMED",
                reminder24hSent: false,
                startTime: {
                    gte: new Date(inTwentyFourHours.getTime() - 60 * 60 * 1000),
                    lte: inTwentyFourHours,
                },
            },
            include: { student: true, admin: true },
        });

        for (const app of appointments24h) {
            const timeStr = app.startTime.toLocaleString("fr-FR", {
                timeZone: "UTC",
                dateStyle: "long",
                timeStyle: "short",
            });

            await sendMail(
                app.student.email,
                "Rappel : votre cours d'anglais est prevu demain",
                `Bonjour ${app.student.name || ""},\n\nNous vous rappelons que votre cours d'anglais est prevu demain a ${timeStr}.\n\nPrime Language Academy`
            );

            await prisma.appointment.update({
                where: { id: app.id },
                data: { reminder24hSent: true },
            });
        }

        const appointments1h = await prisma.appointment.findMany({
            where: {
                status: "CONFIRMED",
                reminder1hSent: false,
                startTime: {
                    gte: now,
                    lte: inOneHour,
                },
            },
            include: { student: true, admin: true },
        });

        for (const app of appointments1h) {
            const timeStr = app.startTime.toLocaleString("fr-FR", { timeZone: "UTC", timeStyle: "short" });
            const meetLink = "https://meet.google.com/new?hs=122&authuser=0";

            await sendMail(
                app.student.email,
                "Votre cours d'anglais commence bientot",
                `Bonjour ${app.student.name || ""},\n\nVotre cours commence a ${timeStr}.\nLien de connexion : ${meetLink}\n\nPrime Language Academy`
            );

            if (app.admin?.email) {
                await sendMail(
                    app.admin.email,
                    `Rappel professeur : cours avec ${app.student.name || "un etudiant"}`,
                    `Votre cours avec ${app.student.name || "un etudiant"} commence a ${timeStr}.\nLien : ${meetLink}`
                );
            }

            await prisma.appointment.update({
                where: { id: app.id },
                data: { reminder1hSent: true },
            });
        }

        return NextResponse.json({
            success: true,
            reminded24h: appointments24h.length,
            reminded1h: appointments1h.length,
        });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }
}
