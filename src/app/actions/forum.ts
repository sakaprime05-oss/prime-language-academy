"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
    const session = await auth();
    if (!session || !session.user) return { error: "Non autorisé" };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!title || !content) return { error: "Veuillez remplir tous les champs." };

    try {
        await prisma.post.create({
            data: {
                title,
                content,
                authorId: session.user.id
            }
        });

        revalidatePath("/dashboard/student/forum");
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Une erreur est survenue." };
    }
}

export async function createComment(postId: string, formData: FormData) {
    const session = await auth();
    if (!session || !session.user) return { error: "Non autorisé" };

    const content = formData.get("content") as string;

    if (!content) return { error: "Veuillez entrer un commentaire." };

    try {
        await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: session.user.id
            }
        });

        revalidatePath(`/dashboard/student/forum/${postId}`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Une erreur est survenue." };
    }
}
