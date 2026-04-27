"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getAdminStats() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    // 1. Revenue per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await prisma.transaction.findMany({
        where: {
            status: "COMPLETED",
            date: { gte: sixMonthsAgo }
        },
        select: {
            amount: true,
            date: true
        }
    });

    const revenueByMonth = transactions.reduce((acc: any, curr) => {
        const month = curr.date.toLocaleString('fr-FR', { month: 'short' });
        acc[month] = (acc[month] || 0) + curr.amount;
        return acc;
    }, {});

    const revenueData = Object.entries(revenueByMonth).map(([name, total]) => ({ name, total }));

    // 2. Student growth (new students per month)
    const students = await prisma.user.findMany({
        where: {
            role: "STUDENT",
            createdAt: { gte: sixMonthsAgo }
        },
        select: {
            createdAt: true
        }
    });

    const studentsByMonth = students.reduce((acc: any, curr) => {
        const month = curr.createdAt.toLocaleString('fr-FR', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    const studentData = Object.entries(studentsByMonth).map(([name, count]) => ({ name, count }));

    // 3. Level distribution
    const levelCounts = await prisma.user.groupBy({
        by: ['levelId'],
        where: { role: "STUDENT", levelId: { not: null } },
        _count: { _all: true }
    });

    const levels = await prisma.level.findMany({
        select: { id: true, name: true }
    });

    const levelData = levelCounts.map(lc => ({
        name: levels.find(l => l.id === lc.levelId)?.name || "Inconnu",
        value: lc._count._all
    }));

    return {
        revenueData,
        studentData,
        levelData
    };
}
