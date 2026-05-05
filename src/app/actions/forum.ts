"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasInitialPayment } from "@/lib/student-payment-gate";
import { parseForumContent, stringifyForumContent } from "@/lib/forum-content";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";

const MAX_FORUM_IMAGE_SIZE = 4 * 1024 * 1024;
const FORUM_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function matchesImageMagicBytes(buffer: Buffer, type: string) {
    if (type === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    if (type === "image/png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    if (type === "image/webp") return buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
    return false;
}

async function saveForumImage(file: File, userId: string) {
    if (!FORUM_IMAGE_TYPES.has(file.type)) throw new Error("Image invalide. Utilisez JPG, PNG ou WebP.");
    if (file.size > MAX_FORUM_IMAGE_SIZE) throw new Error("Image trop lourde. Taille maximale : 4 Mo.");

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!matchesImageMagicBytes(buffer, file.type)) throw new Error("Le contenu de l'image ne correspond pas au format annonce.");

    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const filename = `forum-${userId}-${Date.now()}.${extension}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`forum/${filename}`, buffer, {
            access: "public",
            contentType: file.type,
        });
        return blob.url;
    }

    const uploadDir = join(process.cwd(), "public", "uploads", "forum");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);
    return `/uploads/forum/${filename}`;
}

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
    const text = String(formData.get("content") || "").trim().slice(0, 5000);
    const image = formData.get("image");

    if (!title || !text) return { error: "Veuillez remplir tous les champs." };

    try {
        const imageUrl = image instanceof File && image.size > 0 ? await saveForumImage(image, access.user.id) : undefined;
        await prisma.post.create({
            data: {
                title,
                content: stringifyForumContent({ text, imageUrl }),
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

    const text = String(formData.get("content") || "").trim().slice(0, 3000);
    const image = formData.get("image");

    if (!text) return { error: "Veuillez entrer un commentaire." };

    try {
        const imageUrl = image instanceof File && image.size > 0 ? await saveForumImage(image, access.user.id) : undefined;
        const comment = await prisma.comment.create({
            data: {
                content: stringifyForumContent({ text, imageUrl }),
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
                comment.post.author.name || "Étudiant",
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

async function requireAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Action reservee a l'administration." as const };
    return { user: session.user };
}

export async function reportPost(postId: string) {
    const access = await requireForumAccess();
    if ("error" in access) return { error: access.error };

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { content: true } });
    if (!post) return { error: "Discussion introuvable." };

    const content = parseForumContent(post.content);
    await prisma.post.update({
        where: { id: postId },
        data: {
            content: stringifyForumContent({
                ...content,
                reportedBy: [...(content.reportedBy || []), access.user.id],
                reportedAt: new Date().toISOString(),
            }),
        },
    });

    revalidatePath("/dashboard/student/forum");
    revalidatePath(`/dashboard/student/forum/${postId}`);
    revalidatePath("/dashboard/admin/forum");
    return { success: true };
}

export async function reportComment(commentId: string) {
    const access = await requireForumAccess();
    if ("error" in access) return { error: access.error };

    const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { content: true, postId: true } });
    if (!comment) return { error: "Reponse introuvable." };

    const content = parseForumContent(comment.content);
    await prisma.comment.update({
        where: { id: commentId },
        data: {
            content: stringifyForumContent({
                ...content,
                reportedBy: [...(content.reportedBy || []), access.user.id],
                reportedAt: new Date().toISOString(),
            }),
        },
    });

    revalidatePath(`/dashboard/student/forum/${comment.postId}`);
    revalidatePath("/dashboard/admin/forum");
    return { success: true };
}

export async function deletePost(postId: string) {
    const admin = await requireAdmin();
    if ("error" in admin) return { error: admin.error };

    await prisma.post.delete({ where: { id: postId } });
    revalidatePath("/dashboard/student/forum");
    revalidatePath("/dashboard/admin/forum");
    return { success: true };
}

export async function deleteComment(commentId: string) {
    const admin = await requireAdmin();
    if ("error" in admin) return { error: admin.error };

    const comment = await prisma.comment.delete({ where: { id: commentId }, select: { postId: true } });
    revalidatePath(`/dashboard/student/forum/${comment.postId}`);
    revalidatePath("/dashboard/admin/forum");
    return { success: true };
}
