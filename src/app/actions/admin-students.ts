"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PLA_CLUB_CAPACITY, PLA_PLANS } from "@/lib/pla-program";
import { sendClubSeatAvailableEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
}

export async function updateStudentStatus(studentId: string, status: string) {
    await checkAdmin();
    await prisma.user.update({
        where: { id: studentId },
        data: { status },
    });
    revalidatePath("/dashboard/admin/students");
}

export async function inviteClubWaitlistStudent(studentId: string) {
    await checkAdmin();

    const activeClubMembers = await prisma.user.count({
        where: {
            registrationType: "CLUB",
            status: { in: ["PENDING", "ACTIVE"] },
        },
    });

    if (activeClubMembers >= PLA_CLUB_CAPACITY) {
        return { error: "Le Club est déjà plein. Libérez une place avant d'inviter ce membre." };
    }

    const student = await prisma.user.findUnique({
        where: { id: studentId },
        include: { paymentPlans: true },
    });

    if (!student || student.role !== "STUDENT" || student.registrationType !== "CLUB") {
        return { error: "Membre Club introuvable." };
    }

    if (student.status !== "WAITLIST") {
        return { error: "Ce membre n'est pas en liste d'attente." };
    }

    let onboardingData: { planId?: string } = {};
    try {
        onboardingData = JSON.parse(student.onboardingData || "{}");
    } catch {}

    const plan = PLA_PLANS.find((item) => item.id === onboardingData.planId) || PLA_PLANS[0];

    await prisma.$transaction(async (tx) => {
        const existingPlan = await tx.paymentPlan.findFirst({
            where: { studentId: student.id },
        });

        if (!existingPlan) {
            await tx.paymentPlan.create({
                data: {
                    studentId: student.id,
                    totalAmount: plan.price,
                    amountPaid: 0,
                    status: "PARTIAL",
                },
            });
        }

        await tx.user.update({
            where: { id: student.id },
            data: { status: "PENDING" },
        });
    });

    if (student.email) {
        await sendClubSeatAvailableEmail(
            student.email,
            student.name || "membre Club",
            plan.label,
            plan.price
        ).catch((error) => console.error("Could not send Club seat email", error));
    }

    revalidatePath("/dashboard/admin/students");
    revalidatePath("/dashboard/admin/club-waitlist");
    revalidatePath("/register-club");

    return { success: true };
}

export async function assignStudentLevel(studentId: string, levelId: string) {
    await checkAdmin();
    await prisma.user.update({
        where: { id: studentId },
        data: { levelId },
    });
    revalidatePath("/dashboard/admin/students");
}
