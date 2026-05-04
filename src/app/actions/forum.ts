"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasInitialPayment } from "@/lib/student-payment-gate";
import { revalidatePath } from "next/cache";

async function requireForumAccess() {
    const session = await auth();
    if (!session?.user) return { error: "Non autorise" as const };

    if (session.user.role === "STUDENT" && !(await hasInitialPayment(session.user.id))) {
        return { error: "Finalisez d'abord votre paiement pour participer au forum." as const };
    }

    return { user: session.user };
}

export async function createPost(formData: FormData) {
    const access = await requireForumAccess();
    if ("error" in access) return { error: access.error };

    const title = String(formData.get("title") || "").trim().slice(0, 160);
    const content = String(formData.get("content") || "").trim().slice(0, 5000);

    if (!title || !content) return { error: "Veuillez remplir tous les champs." };

    try {
        await prisma.post.create({
            data: {
                title,
                content,
                authorId: access.user.id,
            },
        });

        revalidatePath("/dashboard/student/forum");
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Une erreur est survenue." };
    }
}

export async function createComment(postId: string, formData: FormData) {
    const access = await requireForumAccess();
    if ("error" in access) return { error: access.error };

    const content = String(formData.get("content") || "").trim().slice(0, 3000);

    if (!content) return { error: "Veuillez entrer un commentaire." };

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: access.user.id,
            },
            include: {
                post: { include: { author: true } },
            },
        });

        if (comment.post.authorId !== access.user.id && comment.post.author.email) {
            const { sendForumCommentEmail } = await import("@/lib/email");
            await sendForumCommentEmail(
                comment.post.author.email,
                comment.post.author.name || "Etudiant",
                access.user.name || "Un autre etudiant",
                comment.post.title,
                postId
            ).catch((err) => console.error("Could not send forum notification", err));
        }

        revalidatePath(`/dashboard/student/forum/${postId}`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Une erreur est survenue." };
    }
}
