"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("Accès refusé");
    }
}

export async function getQuizzes(levelId?: string) {
    return await (prisma as any).quiz.findMany({
        where: levelId ? { levelId } : {},
        include: {
            questions: { orderBy: { order: 'asc' } },
            _count: { select: { attempts: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getQuizById(id: string) {
    return await (prisma as any).quiz.findUnique({
        where: { id },
        include: {
            questions: { orderBy: { order: 'asc' } }
        }
    });
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
                    order: i
                }))
            }
        }
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
    const session = await auth();
    if (!session || !session.user?.id) throw new Error("Non connecté");

    const quiz = await (prisma as any).quiz.findUnique({
        where: { id: data.quizId },
        include: { questions: true }
    });

    if (!quiz) throw new Error("Quiz non trouvé");

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q: any) => {
        if (data.answers[q.id] === q.correctAnswer) {
            correctCount++;
        }
    });

    const score = (correctCount / quiz.questions.length) * 100;

    const attempt = await (prisma as any).quizAttempt.create({
        data: {
            quizId: data.quizId,
            userId: session.user.id,
            score,
            answers: JSON.stringify(data.answers),
            timeTaken: data.timeTaken
        }
    });

    revalidatePath("/dashboard/student/courses");
    return { attempt, score };
}
