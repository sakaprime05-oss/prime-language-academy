"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { sanitizeHtml } from "@/lib/sanitize-html";

export async function getArticles(onlyPublished = false) {
  try {
    const articles = await prisma.article.findMany({
      where: onlyPublished ? { published: true } : undefined,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true, email: true } } },
    });
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string, includeDrafts = false) {
  try {
    return await prisma.article.findFirst({
      where: includeDrafts ? { slug } : { slug, published: true },
      include: { author: { select: { name: true, email: true } } },
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function getArticleById(id: string) {
  try {
    return await prisma.article.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching article by id:", error);
    return null;
  }
}

export async function saveArticle(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = sanitizeHtml(formData.get("content") as string);
  const category = (formData.get("category") as string) || "GENERAL";
  const published = formData.get("published") === "true";
  let slug = formData.get("slug") as string;

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  try {
    if (id) {
      await prisma.article.update({
        where: { id },
        data: { title, slug, content, category, published },
      });
    } else {
      await prisma.article.create({
        data: {
          title,
          slug,
          content,
          category,
          published,
          authorId: session.user.id,
        },
      });
    }

    revalidatePath("/blog");
    revalidatePath("/dashboard/admin/articles");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving article:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteArticle(id: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.article.delete({ where: { id } });
    revalidatePath("/blog");
    revalidatePath("/dashboard/admin/articles");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
