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

export async function markLessonComplete(lessonId: string) {
    const userId = await checkStudent();

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

    revalidatePath("/dashboard/student");
}

export async function getStudentProgressData(userId: string) {
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

    if (!user || !user.level) return { percentage: 0, levelName: "", currentLesson: null, modules: [] };

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
