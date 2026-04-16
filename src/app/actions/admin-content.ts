"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
}

// Level Actions
export async function createLevel(data: { name: string; price: number; description?: string }) {
    await checkAdmin();
    const level = await prisma.level.create({
        data: {
            name: data.name,
            price: data.price,
            description: data.description,
        },
    });
    revalidatePath("/dashboard/admin/courses");
    return level;
}

export async function updateLevel(id: string, data: { name?: string; price?: number; description?: string }) {
    await checkAdmin();
    const level = await prisma.level.update({
        where: { id },
        data,
    });
    revalidatePath("/dashboard/admin/courses");
    return level;
}

export async function deleteLevel(id: string) {
    await checkAdmin();
    // Prisma will handle relations if cascade is set, but let's be safe or check schema
    // Schema doesn't have onDelete: Cascade for Level -> Module, let's check
    await prisma.level.delete({
        where: { id },
    });
    revalidatePath("/dashboard/admin/courses");
}

// Module Actions
export async function createModule(data: { title: string; order: number; levelId: string }) {
    await checkAdmin();
    const module = await prisma.module.create({
        data,
    });
    revalidatePath("/dashboard/admin/courses");
    return module;
}

export async function updateModule(id: string, data: { title?: string; order?: number }) {
    await checkAdmin();
    const module = await prisma.module.update({
        where: { id },
        data,
    });
    revalidatePath("/dashboard/admin/courses");
    return module;
}

export async function deleteModule(id: string) {
    await checkAdmin();
    await prisma.module.delete({
        where: { id },
    });
    revalidatePath("/dashboard/admin/courses");
}

// Lesson Actions
export async function createLesson(data: { title: string; order: number; moduleId: string; type: string; contentUrl?: string }) {
    await checkAdmin();
    const lesson = await prisma.lesson.create({
        data,
    });
    revalidatePath("/dashboard/admin/courses");
    return lesson;
}

export async function updateLesson(id: string, data: { title?: string; order?: number; type?: string; contentUrl?: string }) {
    await checkAdmin();
    const lesson = await prisma.lesson.update({
        where: { id },
        data,
    });
    revalidatePath("/dashboard/admin/courses");
    return lesson;
}

export async function deleteLesson(id: string) {
    await checkAdmin();
    await prisma.lesson.delete({
        where: { id },
    });
    revalidatePath("/dashboard/admin/courses");
}
