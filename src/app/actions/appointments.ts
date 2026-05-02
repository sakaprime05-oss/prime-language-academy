"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendMail } from "@/lib/mail";

const prisma = new PrismaClient();

export async function createAppointment(data: { date: Date; startTime: Date; endTime: Date; reason?: string }) {
    const session = await auth();
    if (!session || !session.user?.id) {
        throw new Error("Non autorise");
    }

    const appointment = await prisma.appointment.create({
        data: {
            studentId: session.user.id,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            reason: data.reason,
        },
        include: { student: true },
    });

    revalidatePath("/dashboard/student/appointments");
    revalidatePath("/dashboard/admin/appointments");

    if (process.env.EMAIL_USER) {
        await sendMail(
            process.env.EMAIL_USER,
            "Nouveau rendez-vous demande",
            `Un étudiant a demandé un rendez-vous.\n\nÉtudiant : ${appointment.student?.name || appointment.student?.email}\nDate : ${new Date(data.startTime).toLocaleString("fr-FR")}\nMotif : ${data.reason || "Non précisé"}`
        );
    }

    const { notifyTelegram } = await import("@/lib/notify");
    await notifyTelegram("new_appointment", {
        studentName: appointment.student?.name || appointment.student?.email,
        date: new Date(data.startTime).toLocaleDateString("fr-FR"),
        time: new Date(data.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        reason: data.reason || "Non precise",
    });

    return appointment;
}

export async function getStudentAppointments() {
    const session = await auth();
    if (!session || !session.user?.id) {
        throw new Error("Non autorise");
    }

    return await prisma.appointment.findMany({
        where: { studentId: session.user.id },
        orderBy: { date: "desc" },
        include: {
            admin: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });
}

export async function getAdminAppointments() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("Non autorise");
    }

    return await prisma.appointment.findMany({
        orderBy: { date: "desc" },
        include: {
            student: {
                select: {
                    name: true,
                    email: true,
                },
            },
            admin: {
                select: {
                    name: true,
                },
            },
        },
    });
}

export async function updateAppointmentStatus(id: string, status: string, adminId?: string) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("Non autorise");
    }

    const dataToUpdate: { status: string; adminId?: string } = { status };
    if (adminId) {
        dataToUpdate.adminId = adminId;
    }

    const appointment = await prisma.appointment.update({
        where: { id },
        data: dataToUpdate,
        include: { student: true },
    });

    revalidatePath("/dashboard/student/appointments");
    revalidatePath("/dashboard/admin/appointments");

    if (appointment.student?.email) {
        const adminName = session.user.name || "Administrateur";
        await sendMail(
            appointment.student.email,
            `Mise a jour de votre rendez-vous : ${status}`,
            `Bonjour,\n\nVotre rendez-vous prevu le ${new Date(appointment.startTime).toLocaleString("fr-FR")} a ete mis a jour.\nNouveau statut : ${status}\nMis a jour par : ${adminName}\n\nPrime Language Academy`
        );
    }

    return appointment;
}
