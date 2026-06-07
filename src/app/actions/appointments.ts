"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendMail } from "@/lib/mail";
import { hasInitialPayment } from "@/lib/student-payment-gate";
import { APPOINTMENT_SESSION_MINUTES, DEFAULT_APPOINTMENT_CHANNEL, getAppointmentChannel, validateAppointmentSlot } from "@/lib/appointment-schedule";

export async function createAppointment(data: { date: Date; startTime: Date; endTime: Date; reason?: string; exchangeType?: string }) {
    const session = await auth();
    if (!session || !session.user?.id) {
        throw new Error("Non autorise");
    }
    if (session.user.role === "STUDENT" && !(await hasInitialPayment(session.user.id))) {
        throw new Error("Paiement requis");
    }

    const channel = getAppointmentChannel(data.exchangeType || DEFAULT_APPOINTMENT_CHANNEL);
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    const time = `${startTime.getHours().toString().padStart(2, "0")}:${startTime.getMinutes().toString().padStart(2, "0")}`;
    const slotValidation = validateAppointmentSlot(channel.id, startTime, time);

    if (!slotValidation.ok) {
        throw new Error(slotValidation.error);
    }
    if (durationMinutes <= 0 || durationMinutes > APPOINTMENT_SESSION_MINUTES) {
        throw new Error("Une session d'appel dure 30 minutes maximum.");
    }

    const appointment = await prisma.appointment.create({
        data: {
            studentId: session.user.id,
            date: data.date,
            startTime,
            endTime,
            title: channel.publicLabel,
            reason: data.reason,
            notes: `Type d'échange : ${channel.publicLabel} · Durée : ${APPOINTMENT_SESSION_MINUTES} minutes maximum`,
        },
        include: { student: true },
    });

    revalidatePath("/dashboard/student/appointments");
    revalidatePath("/dashboard/admin/appointments");

    if (process.env.EMAIL_USER) {
        await sendMail(
            process.env.EMAIL_USER,
            "Nouveau rendez-vous demande",
            `Un étudiant a demandé un rendez-vous.\n\nÉtudiant : ${appointment.student?.name || appointment.student?.email}\nType d'échange : ${channel.publicLabel}\nDate : ${startTime.toLocaleString("fr-FR")}\nDurée : ${APPOINTMENT_SESSION_MINUTES} minutes maximum\nMotif : ${data.reason || "Non précisé"}`
        );
    }

    const { notifyTelegram } = await import("@/lib/notify");
    await notifyTelegram("new_appointment", {
        studentName: appointment.student?.name || appointment.student?.email,
        date: startTime.toLocaleDateString("fr-FR"),
        time: startTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        reason: `${channel.publicLabel} - ${data.reason || "Non precise"}`,
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
            `Bonjour,\n\nVotre rendez-vous ${appointment.title || ""} prevu le ${new Date(appointment.startTime).toLocaleString("fr-FR")} a ete mis a jour.\nNouveau statut : ${status}\nMis a jour par : ${adminName}\n\nPrime Language Academy`
        );
    }

    return appointment;
}
