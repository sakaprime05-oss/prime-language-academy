"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
}

export async function getTransactions() {
    await checkAdmin();
    return await prisma.transaction.findMany({
        include: {
            paymentPlan: {
                include: {
                    student: true
                }
            }
        },
        orderBy: { date: 'desc' },
    });
}

export async function getPaymentStats() {
    await checkAdmin();

    const completedTransactions = await prisma.transaction.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true }
    });

    const pendingTransactions = await prisma.transaction.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true }
    });

    const overduePlans = await prisma.paymentPlan.count({
        where: { status: "OVERDUE" }
    });

    return {
        totalRevenue: completedTransactions._sum.amount || 0,
        pendingRevenue: pendingTransactions._sum.amount || 0,
        overdueCount: overduePlans
    };
}

import { sendPaymentReminderEmail } from "@/lib/email";

export async function sendPaymentReminderAction(planId: string) {
    await checkAdmin();

    const plan = await prisma.paymentPlan.findUnique({
        where: { id: planId },
        include: { student: true }
    });

    if (!plan || !plan.student?.email) {
        throw new Error("Plan ou étudiant introuvable");
    }

    const dueAmount = plan.totalAmount - plan.amountPaid;

    // In a real scenario, dueDate might be on the plan model, using a mock date for now (+7 days)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    await sendPaymentReminderEmail(
        plan.student.email,
        plan.student.name || "Étudiant",
        dueAmount,
        dueDate.toLocaleDateString("fr-FR")
    );

    return { success: true };
}
