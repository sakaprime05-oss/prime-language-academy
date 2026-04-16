"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function checkTeacherOrAdmin() {
    const session = await auth();
    if (!session || (session.user?.role !== "TEACHER" && session.user?.role !== "ADMIN")) {
        throw new Error("Unauthorized: Teacher or Admin access required.");
    }
    return session;
}

// ==========================================
// ============ ATTENDANCE ==================
// ==========================================

export async function markAttendance(data: {
    studentId: string;
    scheduleId: string;
    date: string; // "YYYY-MM-DD"
    status: string; // "PRESENT", "ABSENT", "LATE", "EXCUSED"
    note?: string;
}) {
    await checkTeacherOrAdmin();

    const attendance = await (prisma as any).attendance.upsert({
        where: {
            studentId_scheduleId_date: {
                studentId: data.studentId,
                scheduleId: data.scheduleId,
                date: data.date,
            }
        },
        update: {
            status: data.status,
            note: data.note,
        },
        create: {
            studentId: data.studentId,
            scheduleId: data.scheduleId,
            date: data.date,
            status: data.status,
            note: data.note,
        }
    });

    revalidatePath("/dashboard/teacher/level/[id]", "page");
    return attendance;
}

export async function getAttendancesForSchedule(scheduleId: string, date: string) {
    await checkTeacherOrAdmin();
    return await (prisma as any).attendance.findMany({
        where: { scheduleId, date },
        include: { student: { select: { id: true, name: true, email: true } } }
    });
}

// ==========================================
// ============ GRADING & FEEDBACK ==========
// ==========================================

export async function submitGrade(data: {
    studentId: string;
    levelId: string;
    score?: number;
    category: string;
    feedback?: string;
    date: string;
}) {
    const session = await checkTeacherOrAdmin();

    const grade = await (prisma as any).studentGrade.create({
        data: {
            studentId: data.studentId,
            teacherId: session.user.id!,
            levelId: data.levelId,
            score: data.score,
            category: data.category,
            feedback: data.feedback,
            date: data.date,
        }
    });

    // Auto-award Excellence Badge
    if (data.score && data.score >= 18) {
        const badgeName = `Excellence en ${data.category}`;
        // Create badge if not exists
        const badge = await (prisma as any).badge.upsert({
            where: { name: badgeName },
            update: {},
            create: {
                name: badgeName,
                description: `A obtenu une note excellente en ${data.category}`,
                icon: "🏅",
                color: "#10b981", // emerald
            }
        });
        
        // Award to student
        await (prisma as any).studentBadge.upsert({
            where: {
                userId_badgeId: {
                    userId: data.studentId,
                    badgeId: badge.id
                }
            },
            update: {},
            create: {
                userId: data.studentId,
                badgeId: badge.id
            }
        });
    }

    revalidatePath("/dashboard/teacher/level/[id]", "page");
    revalidatePath("/dashboard/student/profile");
    return grade;
}

export async function getStudentGrades(studentId: string, levelId?: string) {
    await checkTeacherOrAdmin();
    return await (prisma as any).studentGrade.findMany({
        where: { 
            studentId,
            ...(levelId ? { levelId } : {})
        },
        include: { teacher: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
    });
}
