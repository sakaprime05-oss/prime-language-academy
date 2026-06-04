"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasInitialPayment } from "@/lib/student-payment-gate";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("Acces refuse");
    }
    return session;
}

async function getSessionUser() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Non connecte");
    return session.user;
}

async function assertTeacherCanAccessLevel(teacherId: string, levelId: string) {
    const assignedLevel = await prisma.level.count({
        where: {
            id: levelId,
            teachers: { some: { id: teacherId } },
        },
    });

    if (!assignedLevel) throw new Error("Acces refuse");
}

function sanitizeQuizForStudent(quiz: any) {
    return {
        ...quiz,
        questions: (quiz.questions || []).map((question: any) => {
            const { correctAnswer: _correctAnswer, explanation: _explanation, ...safeQuestion } = question;
            return safeQuestion;
        }),
    };
}

export async function getQuizzes(levelId?: string) {
    const user = await getSessionUser();

    if (user.role === "ADMIN") {
        return await (prisma as any).quiz.findMany({
            where: levelId ? { levelId } : {},
            include: {
                questions: { orderBy: { order: "asc" } },
                _count: { select: { attempts: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    if (user.role === "TEACHER") {
        let allowedLevelIds: string[] = [];
        if (levelId) {
            await assertTeacherCanAccessLevel(user.id, levelId);
            allowedLevelIds = [levelId];
        } else {
            const levels = await prisma.level.findMany({
                where: { teachers: { some: { id: user.id } } },
                select: { id: true },
            });
            allowedLevelIds = levels.map((level) => level.id);
        }

        if (!allowedLevelIds.length) return [];

        return await (prisma as any).quiz.findMany({
            where: { levelId: { in: allowedLevelIds } },
            include: {
                questions: { orderBy: { order: "asc" } },
                _count: { select: { attempts: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    if (user.role !== "STUDENT" || !(await hasInitialPayment(user.id))) {
        throw new Error("Acces refuse");
    }

    const student = await prisma.user.findUnique({
        where: { id: user.id },
        select: { levelId: true },
    });

    if (!student?.levelId) return [];

    const quizzes = await (prisma as any).quiz.findMany({
        where: { OR: [{ levelId: student.levelId }, { levelId: null }] },
        include: {
            questions: { orderBy: { order: "asc" } },
            _count: { select: { attempts: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return quizzes.map(sanitizeQuizForStudent);
}

export async function getQuizById(id: string) {
    const user = await getSessionUser();
    const quiz = await (prisma as any).quiz.findUnique({
        where: { id },
        include: {
            questions: { orderBy: { order: "asc" } },
        },
    });

    if (!quiz) return null;
    if (user.role === "ADMIN") return quiz;
    if (user.role === "TEACHER") {
        if (quiz.levelId) await assertTeacherCanAccessLevel(user.id, quiz.levelId);
        return quiz;
    }

    if (user.role !== "STUDENT" || !(await hasInitialPayment(user.id))) {
        throw new Error("Acces refuse");
    }

    const student = await prisma.user.findUnique({
        where: { id: user.id },
        select: { levelId: true },
    });

    if (quiz.levelId && quiz.levelId !== student?.levelId) throw new Error("Acces refuse");
    return sanitizeQuizForStudent(quiz);
}

export async function createQuiz(data: {
    title: string;
    description?: string;
    levelId?: string;
    category: string;
    timeLimit?: number;
    questions: {
        question: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctAnswer: string;
        explanation?: string;
    }[];
}) {
    await checkAdmin();

    const quiz = await (prisma as any).quiz.create({
        data: {
            title: data.title,
            description: data.description,
            levelId: data.levelId,
            category: data.category,
            timeLimit: data.timeLimit,
            questions: {
                create: data.questions.map((q, i) => ({
                    ...q,
                    order: i,
                })),
            },
        },
    });

    revalidatePath("/dashboard/admin/courses");
    revalidatePath("/dashboard/student/courses");
    return quiz;
}

export async function deleteQuiz(id: string) {
    await checkAdmin();
    await (prisma as any).quiz.delete({ where: { id } });
    revalidatePath("/dashboard/admin/courses");
}

export async function submitQuizAttempt(data: {
    quizId: string;
    answers: Record<string, string>;
    timeTaken?: number;
}) {
    const user = await getSessionUser();
    if (user.role !== "STUDENT" || !(await hasInitialPayment(user.id))) {
        throw new Error("Acces refuse");
    }

    const student = await prisma.user.findUnique({
        where: { id: user.id },
        select: { levelId: true },
    });

    const quiz = await (prisma as any).quiz.findUnique({
        where: { id: data.quizId },
        include: { questions: true },
    });

    if (!quiz) throw new Error("Quiz non trouve");
    if (quiz.levelId && quiz.levelId !== student?.levelId) throw new Error("Acces refuse");
    if (!quiz.questions.length) throw new Error("Quiz invalide");

    const allowedAnswers = new Set(["A", "B", "C", "D"]);
    const normalizedAnswers: Record<string, string> = {};
    for (const question of quiz.questions) {
        const answer = String(data.answers?.[question.id] || "").toUpperCase();
        if (allowedAnswers.has(answer)) normalizedAnswers[question.id] = answer;
    }

    let correctCount = 0;
    quiz.questions.forEach((q: any) => {
        if (normalizedAnswers[q.id] === q.correctAnswer) {
            correctCount++;
        }
    });

    const score = (correctCount / quiz.questions.length) * 100;

    const attempt = await (prisma as any).quizAttempt.create({
        data: {
            quizId: data.quizId,
            userId: user.id,
            score,
            answers: JSON.stringify(normalizedAnswers),
            timeTaken: data.timeTaken,
        },
    });

    revalidatePath("/dashboard/student/courses");
    return { attemptId: attempt.id, score };
}
