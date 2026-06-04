"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function checkTeacher() {
    const session = await auth();
    if (!session || (session.user?.role !== "TEACHER" && session.user?.role !== "ADMIN")) {
        throw new Error("Unauthorized");
    }
    return session;
}

async function assertCanAccessLevel(levelId: string, session: Awaited<ReturnType<typeof checkTeacher>>) {
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

export async function getAssignedLevels() {
    const session = await checkTeacher();

    if (session.user.role === "ADMIN") {
        return await prisma.level.findMany({
            include: {
                _count: {
                    select: { students: true }
                }
            }
        }) as any;
    }

    return await prisma.level.findMany({
        where: {
            teachers: {
                some: { id: session.user.id }
            }
        },
        include: {
            _count: {
                select: { students: true }
            }
        }
    }) as any;
}

export async function getLevelStudentsWithProgress(levelId: string) {
    const session = await checkTeacher();
    await assertCanAccessLevel(levelId, session);

    const students = await prisma.user.findMany({
        where: {
            levelId,
            role: "STUDENT"
        },
        include: {
            progress: true,
            level: {
                include: {
                    modules: {
                        include: {
                            lessons: true
                        }
                    }
                }
            }
        }
    }) as any;

    return (students as any[]).map(student => {
        const allLessons = student.level?.modules.flatMap((m: any) => m.lessons) || [];
        const completedCount = student.progress.length;
        const totalCount = allLessons.length;
        const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
            id: student.id,
            name: student.name,
            email: student.email,
            status: student.status,
            progressPercentage: percentage,
            completedLessons: completedCount,
            totalLessons: totalCount
        };
    });
}
