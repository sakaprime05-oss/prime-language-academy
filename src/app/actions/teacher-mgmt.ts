"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required.");
    }
    return session;
}

async function checkTeacherOrAdmin() {
    const session = await auth();
    if (!session || (session.user?.role !== "TEACHER" && session.user?.role !== "ADMIN")) {
        throw new Error("Unauthorized: Teacher or Admin access required.");
    }
    return session;
}

// =============================================
// ============ SCHEDULE MANAGEMENT ============
// =============================================

export async function getTeacherSchedules(teacherId?: string) {
    await checkTeacherOrAdmin();
    
    return await (prisma as any).teacherSchedule.findMany({
        where: teacherId ? { teacherId } : {},
        include: {
            teacher: { select: { name: true, email: true } },
            level: { select: { name: true } }
        },
        orderBy: [
            { dayOfWeek: 'asc' },
            { startTime: 'asc' }
        ]
    });
}

export async function createSchedule(data: {
    teacherId: string;
    levelId?: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    location?: string;
    type: string;
    isRecurring: boolean;
    specificDate?: string;
    notes?: string;
}) {
    await checkAdmin();
    
    const schedule = await (prisma as any).teacherSchedule.create({
        data: {
            teacherId: data.teacherId,
            levelId: data.type === "COURS" ? data.levelId : undefined,
            dayOfWeek: data.dayOfWeek,
            startTime: data.startTime,
            endTime: data.endTime,
            location: data.location,
            type: data.type,
            isRecurring: data.isRecurring,
            specificDate: data.isRecurring ? null : data.specificDate,
            notes: data.notes,
        }
    });
    
    revalidatePath("/dashboard/admin/calendar");
    revalidatePath("/dashboard/teacher");
    return schedule;
}

export async function deleteSchedule(id: string) {
    await checkAdmin();
    await (prisma as any).teacherSchedule.delete({ where: { id } });
    revalidatePath("/dashboard/admin/calendar");
    revalidatePath("/dashboard/teacher");
}

// =============================================
// ========= TRAINING DOCS MANAGEMENT ==========
// =============================================

/** Teachers see: all non-restricted docs + restricted docs they're allowed to see */
export async function getTrainingDocs(forTeacherId?: string) {
    await checkTeacherOrAdmin();

    if (forTeacherId) {
        // Teacher view: unrestricted OR explicitly allowed
        return await (prisma as any).trainingDocument.findMany({
            where: {
                OR: [
                    { isRestricted: false },
                    { allowedTeachers: { some: { id: forTeacherId } } }
                ]
            },
            include: {
                allowedTeachers: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Admin view: see everything
    return await (prisma as any).trainingDocument.findMany({
        include: {
            allowedTeachers: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function createTrainingDoc(data: {
    title: string;
    description?: string;
    fileUrl: string;
    category: string;
    isRestricted: boolean;
    allowedTeacherIds?: string[];
}) {
    await checkAdmin();
    
    const doc = await (prisma as any).trainingDocument.create({
        data: {
            title: data.title,
            description: data.description,
            fileUrl: data.fileUrl,
            category: data.category,
            isRestricted: data.isRestricted,
            allowedTeachers: data.isRestricted && data.allowedTeacherIds?.length
                ? { connect: data.allowedTeacherIds.map(id => ({ id })) }
                : undefined,
        }
    });
    
    revalidatePath("/dashboard/admin/resources");
    revalidatePath("/dashboard/teacher");
    return doc;
}

export async function updateDocAccess(docId: string, isRestricted: boolean, teacherIds: string[]) {
    await checkAdmin();

    // First disconnect all, then reconnect selected
    await (prisma as any).trainingDocument.update({
        where: { id: docId },
        data: {
            isRestricted,
            allowedTeachers: {
                set: isRestricted ? teacherIds.map(id => ({ id })) : []
            }
        }
    });
    
    revalidatePath("/dashboard/admin/resources");
    revalidatePath("/dashboard/teacher");
}

export async function deleteTrainingDoc(id: string) {
    await checkAdmin();
    await (prisma as any).trainingDocument.delete({ where: { id } });
    revalidatePath("/dashboard/admin/resources");
    revalidatePath("/dashboard/teacher");
}

// =============================================
// ========== TEACHER MANAGEMENT ===============
// =============================================

export async function getAllTeachers() {
    await checkAdmin();
    return await prisma.user.findMany({
        where: { role: "TEACHER" },
        include: {
            assignedLevels: true,
            _count: { select: { schedules: true, restrictedDocs: true } }
        }
    });
}

export async function assignLevelToTeacher(teacherId: string, levelId: string) {
    await checkAdmin();
    await prisma.user.update({
        where: { id: teacherId },
        data: {
            assignedLevels: {
                connect: { id: levelId }
            }
        }
    });
    revalidatePath("/dashboard/admin/teachers");
}

export async function removeLevelFromTeacher(teacherId: string, levelId: string) {
    await checkAdmin();
    await prisma.user.update({
        where: { id: teacherId },
        data: {
            assignedLevels: {
                disconnect: { id: levelId }
            }
        }
    });
    revalidatePath("/dashboard/admin/teachers");
}
