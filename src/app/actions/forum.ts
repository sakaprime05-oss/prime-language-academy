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
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: session.user.id
            },
            include: {
                post: { include: { author: true } }
            }
        });

        // Notify post author if commenter is not the author
        if (comment.post.authorId !== session.user.id && comment.post.author.email) {
            const { sendForumCommentEmail } = await import("@/lib/email");
            await sendForumCommentEmail(
                comment.post.author.email,
                comment.post.author.name || "Étudiant",
                session.user.name || "Un autre étudiant",
                comment.post.title,
                postId
            ).catch(err => console.error("Could not send forum notification", err));
        }

        revalidatePath(`/dashboard/student/forum/${postId}`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Une erreur est survenue." };
    }
}
