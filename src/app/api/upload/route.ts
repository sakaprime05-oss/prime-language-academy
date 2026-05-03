import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { put } from "@vercel/blob";
import { auth } from "@/auth";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

function safeUploadName(name: string, type: string) {
    const extension = type === "application/pdf" ? "pdf" : type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
    const base = name
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "_")
        .slice(0, 80) || "upload";
    return `${Date.now()}-${base}.${extension}`;
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorise." }, { status: 401 });
        }

        if (session.user.role !== "ADMIN" && session.user.role !== "TEACHER") {
            return NextResponse.json({ error: "Upload reserve a l'equipe pedagogique." }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
        }

        if (!ALLOWED_UPLOAD_TYPES.has(file.type)) {
            return NextResponse.json({ error: "Format de fichier non autorise." }, { status: 400 });
        }

        if (file.size > MAX_UPLOAD_SIZE) {
            return NextResponse.json({ error: "Fichier trop volumineux. Taille maximale : 5 Mo." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = safeUploadName(file.name, file.type);

        // Si Vercel Blob est configuré (recommandé pour la production)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(filename, buffer, {
                access: 'public',
                contentType: file.type,
            });
            return NextResponse.json({ url: blob.url });
        } 
        // Fallback : Stockage local (uniquement pour le développement local, car Vercel supprime ces fichiers)
        else {
            const uploadDir = join(process.cwd(), "public", "uploads");

            // Ensure directory exists
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (e) {
                // Ignore if exists
            }

            const filePath = join(uploadDir, filename);
            await writeFile(filePath, buffer);

            const url = `/uploads/${filename}`;
            return NextResponse.json({ url });
        }
    } catch (error) {
        console.error("Erreur d'upload:", error);
        return NextResponse.json({ error: "L'upload a échoué." }, { status: 500 });
    }
}
