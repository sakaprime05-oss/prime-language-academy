"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getSystemSettings() {
    try {
        let settings = await prisma.systemSettings.findUnique({
            where: { id: "default" }
        });

        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    id: "default",
                    currentSessionName: "SESSION DE LANCEMENT : 18 JUIN – 19 AOUT 2026",
                    currentSessionStart: "18 Juin 2026",
                    currentSessionDuration: "02 MOIS"
                }
            });
        }
        return settings;
    } catch (error) {
        console.error("Database connection failed in getSystemSettings:", error);
        // Fallback pour éviter que le site ne crashe
        return {
            id: "default",
            currentSessionName: "SESSION DE LANCEMENT : 18 JUIN – 19 AOUT 2026",
            currentSessionStart: "18 Juin 2026",
            currentSessionDuration: "02 MOIS",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}

export async function updateSystemSettings(formData: FormData) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return { error: "Non autorisé" };
    }

    const currentSessionName = formData.get("currentSessionName") as string;
    const currentSessionStart = formData.get("currentSessionStart") as string;
    const currentSessionDuration = formData.get("currentSessionDuration") as string;

    try {
        await prisma.systemSettings.upsert({
            where: { id: "default" },
            update: {
                currentSessionName,
                currentSessionStart,
                currentSessionDuration,
            },
            create: {
                id: "default",
                currentSessionName,
                currentSessionStart,
                currentSessionDuration,
            }
        });

        // Revalidate the pages that show this data
        revalidatePath("/");
        revalidatePath("/register");
        revalidatePath("/dashboard/admin/settings");

        return { success: true };
    } catch (error) {
        return { error: "Erreur lors de la mise à jour des paramètres" };
    }
}
