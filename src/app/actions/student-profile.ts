"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseStudentProfileData } from "@/lib/student-profile";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";

const MAX_PHOTO_SIZE = 3 * 1024 * 1024;
const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function matchesImageMagicBytes(buffer: Buffer, type: string) {
  if (type === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (type === "image/png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === "image/webp") return buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

async function saveProfilePhoto(userId: string, file: File) {
  if (!PHOTO_TYPES.has(file.type)) throw new Error("Format photo invalide. Utilisez JPG, PNG ou WebP.");
  if (file.size > MAX_PHOTO_SIZE) throw new Error("Photo trop lourde. Taille maximale : 3 Mo.");

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matchesImageMagicBytes(buffer, file.type)) throw new Error("Le contenu de la photo ne correspond pas au format annonce.");

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `profile-${userId}-${Date.now()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`profiles/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  const uploadDir = join(process.cwd(), "public", "uploads", "profiles");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);
  return `/uploads/profiles/${filename}`;
}

export async function updateStudentProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") return { error: "Non autorise." };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingData: true },
  });
  if (!user) return { error: "Compte introuvable." };

  const current = parseStudentProfileData(user.onboardingData);
  let profilePhotoUrl = current.profilePhotoUrl;
  const photo = formData.get("profilePhoto");

  try {
    if (photo instanceof File && photo.size > 0) {
      profilePhotoUrl = await saveProfilePhoto(session.user.id, photo);
    }

    if (!profilePhotoUrl) {
      return { error: "Ajoutez une photo de profil pour continuer." };
    }

    const next = {
      ...current,
      preferredName: String(formData.get("preferredName") || "").trim().slice(0, 80),
      phone: String(formData.get("phone") || current.phone || "").trim().slice(0, 40),
      whatsapp: String(formData.get("whatsapp") || "").trim().slice(0, 40),
      commune: String(formData.get("commune") || current.commune || "").trim().slice(0, 80),
      learningGoal: String(formData.get("learningGoal") || "").trim().slice(0, 220),
      emergencyContact: String(formData.get("emergencyContact") || "").trim().slice(0, 80),
      bio: String(formData.get("bio") || "").trim().slice(0, 280),
      birthDate: String(formData.get("birthDate") || "").trim().slice(0, 20),
      availability: String(formData.get("availability") || "").trim().slice(0, 160),
      estimatedLevel: String(formData.get("estimatedLevel") || "").trim().slice(0, 40),
      learningPreference: String(formData.get("learningPreference") || "").trim().slice(0, 80),
      profilePhotoUrl,
    };

    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingData: JSON.stringify(next) },
    });

    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/student/profile");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Impossible de mettre a jour le profil." };
  }
}
