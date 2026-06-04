"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function checkStudent() {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") {
        throw new Error("Unauthorized");
    }
    return session.user.id;
}

async function assertTeacherCanAccessStudent(teacherId: string, studentId: string) {
    const student = await prisma.user.findFirst({
        where: { id: studentId, role: "STUDENT" },
        select: { levelId: true },
    });

    if (!student?.levelId) throw new Error("Unauthorized");

    const assignedLevel = await prisma.level.count({
        where: {
            id: student.levelId,
            teachers: { some: { id: teacherId } },
        },
    });

    if (!assignedLevel) throw new Error("Unauthorized");
}

export async function markLessonComplete(lessonId: string) {
    const userId = await checkStudent();
    const student = await prisma.user.findUnique({
        where: { id: userId },
        select: { levelId: true },
    });

    if (!student?.levelId) throw new Error("Level not assigned");

    const lesson = await prisma.lesson.findFirst({
        where: {
            id: lessonId,
            module: { levelId: student.levelId },
        },
        select: { id: true },
    });

    if (!lesson) throw new Error("Unauthorized: Lesson access denied.");

    await prisma.progress.upsert({
        where: {
            userId_lessonId: {
                userId,
                lessonId,
            }
        },
        update: {
            completed: true,
        },
        create: {
            userId,
            lessonId,
            completed: true,
        }
    });

    // Check total completed lessons for this user
    const completedCount = await prisma.progress.count({
        where: { userId, completed: true }
    });

    // Award "Premier Pas" badge for the first lesson
    if (completedCount === 1) {
        const badge = await prisma.badge.upsert({
            where: { name: "Premier Pas" },
            update: {},
            create: {
                name: "Premier Pas",
                description: "A terminé sa première leçon avec succès.",
                icon: "🌟",
                color: "#3b82f6" // blue
            }
        });

        await prisma.studentBadge.upsert({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId: badge.id
                }
            },
            update: {},
            create: {
                userId,
                badgeId: badge.id
            }
        });
    }

    revalidatePath("/dashboard/student");
}

export async function getStudentProgressData(userId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    if (session.user.role === "STUDENT" && session.user.id !== userId) {
        throw new Error("Unauthorized");
    }

    if (session.user.role === "TEACHER") {
        await assertTeacherCanAccessStudent(session.user.id, userId);
    }

    if (session.user.role !== "STUDENT" && session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    // This helper fetches necessary data for progress calculation
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            level: {
                include: {
                    modules: {
                        orderBy: { order: 'asc' },
                        include: {
                            lessons: {
                                orderBy: { order: 'asc' }
                            }
                        }
                    }
                }
            },
            progress: true
        }
    }) as any;

    if (!user || !user.level) return { percentage: 0, levelName: "", currentLesson: null, modules: [], completedLessonIds: [] };

    const allLessons = user.level.modules.flatMap((m: any) => m.lessons);
    const completedLessonIds = new Set(user.progress.map((p: any) => p.lessonId));

    const completedCount = allLessons.filter((l: any) => completedLessonIds.has(l.id)).length;
    const totalCount = allLessons.length;

    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Find "current" lesson (first one not completed)
    const currentLesson = (completedCount === totalCount && totalCount > 0)
        ? null
        : allLessons.find((l: any) => !completedLessonIds.has(l.id)) || null;

    return {
        percentage,
        totalLessons: totalCount,
        completedLessons: completedCount,
        currentLesson,
        levelName: user.level.name,
        modules: user.level.modules,
        completedLessonIds: Array.from(completedLessonIds)
    };
}
