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

type TeacherSession = Awaited<ReturnType<typeof checkTeacherOrAdmin>>;

async function assertCanAccessLevel(session: TeacherSession, levelId: string) {
    if (session.user.role === "ADMIN") return;

    const assignedLevel = await prisma.level.count({
        where: {
            id: levelId,
            teachers: { some: { id: session.user.id } },
        },
    });

    if (!assignedLevel) {
        throw new Error("Unauthorized: Level access denied.");
    }
}

async function assertCanAccessSchedule(session: TeacherSession, scheduleId: string) {
    const schedule = await prisma.teacherSchedule.findUnique({
        where: { id: scheduleId },
        select: { id: true, teacherId: true, levelId: true, type: true },
    });

    if (!schedule) throw new Error("Schedule not found.");
    if (session.user.role !== "ADMIN" && schedule.teacherId !== session.user.id) {
        throw new Error("Unauthorized: Schedule access denied.");
    }

    return schedule;
}

async function assertStudentFitsTeachingScope(studentId: string, levelId?: string | null, scheduleType?: string | null) {
    const student = await prisma.user.findFirst({
        where: { id: studentId, role: "STUDENT" },
        select: { id: true, levelId: true, registrationType: true },
    });

    if (!student) throw new Error("Student not found.");
    if (levelId && student.levelId !== levelId) {
        throw new Error("Unauthorized: Student is not assigned to this level.");
    }
    if (!levelId) {
        if (scheduleType !== "CLUB") {
            throw new Error("Unauthorized: Schedule level is missing.");
        }
        if (student.registrationType !== "CLUB") {
            throw new Error("Unauthorized: Student is not a club member.");
        }
    }

    return student;
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
    const session = await checkTeacherOrAdmin();
    const schedule = await assertCanAccessSchedule(session, data.scheduleId);
    await assertStudentFitsTeachingScope(data.studentId, schedule.levelId, schedule.type);

    const allowedStatuses = new Set(["PRESENT", "ABSENT", "LATE", "EXCUSED"]);
    if (!allowedStatuses.has(data.status)) {
        throw new Error("Invalid attendance status.");
    }

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
    const session = await checkTeacherOrAdmin();
    const schedule = await assertCanAccessSchedule(session, scheduleId);
    return await (prisma as any).attendance.findMany({
        where: {
            scheduleId,
            date,
            student: schedule.levelId ? { levelId: schedule.levelId } : { registrationType: "CLUB" },
        },
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
    await assertCanAccessLevel(session, data.levelId);
    await assertStudentFitsTeachingScope(data.studentId, data.levelId);

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
    const session = await checkTeacherOrAdmin();
    const student = await prisma.user.findFirst({
        where: { id: studentId, role: "STUDENT" },
        select: { levelId: true },
    });

    if (!student) throw new Error("Student not found.");

    const effectiveLevelId = levelId || (session.user.role === "ADMIN" ? undefined : student.levelId);
    if (session.user.role !== "ADMIN") {
        if (!effectiveLevelId) throw new Error("Unauthorized: Student level is missing.");
        await assertCanAccessLevel(session, effectiveLevelId);
        if (student.levelId && effectiveLevelId !== student.levelId) {
            throw new Error("Unauthorized: Student is not assigned to this level.");
        }
    }

    return await (prisma as any).studentGrade.findMany({
        where: { 
            studentId,
            ...(effectiveLevelId ? { levelId: effectiveLevelId } : {})
        },
        include: { teacher: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
    });
}
