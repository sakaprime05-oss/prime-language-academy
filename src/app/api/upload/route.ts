import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

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
