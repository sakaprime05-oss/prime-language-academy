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

export async function updateStudentStatus(studentId: string, status: string) {
    await checkAdmin();
    await prisma.user.update({
        where: { id: studentId },
        data: { status },
    });
    revalidatePath("/dashboard/admin/students");
}

export async function assignStudentLevel(studentId: string, levelId: string) {
    await checkAdmin();
    await prisma.user.update({
        where: { id: studentId },
        data: { levelId },
    });
    revalidatePath("/dashboard/admin/students");
}
