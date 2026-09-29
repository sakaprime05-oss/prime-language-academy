"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { PLA_SESSION } from "@/lib/pla-program";

const DEFAULT_SYSTEM_SETTINGS = {
    currentSessionName: `SESSION DE LANCEMENT : ${PLA_SESSION.dates.toUpperCase()}`,
    currentSessionStart: PLA_SESSION.startDate,
    currentSessionDuration: PLA_SESSION.duration,
    enableOnlineRegistration: true,
    enableCorporateRegistration: true,
};

function hasObsoleteSessionSettings(settings: { currentSessionName: string; currentSessionStart: string; currentSessionDuration: string }) {
    const value = `${settings.currentSessionName} ${settings.currentSessionStart} ${settings.currentSessionDuration}`.toLowerCase();
    const OBSOLETE_MARKERS = [
        "18 juin",
        "19 aout",
        "19 août",
        "11 avril",
        "avril - juin",
        "11 juillet",
        "12 septembre",
        "juillet - septembre",
        "2026-04-11",
        "2026-06-18",
        "2026-07-11",
        "2026-08-19",
        "2026-09-12",
    ];
    if (OBSOLETE_MARKERS.some((marker) => value.includes(marker))) return true;
    // Toute session dont la date de début est antérieure au cycle courant est obsolète.
    const start = new Date(settings.currentSessionStart);
    return !Number.isNaN(start.getTime()) && start < new Date(PLA_SESSION.startDate);
}

export async function getSystemSettings() {
    try {
        let settings = await prisma.systemSettings.findUnique({
            where: { id: "default" }
        });

        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    id: "default",
                    ...DEFAULT_SYSTEM_SETTINGS,
                }
            });
        } else if (hasObsoleteSessionSettings(settings)) {
            settings = await prisma.systemSettings.update({
                where: { id: "default" },
                data: {
                    currentSessionName: DEFAULT_SYSTEM_SETTINGS.currentSessionName,
                    currentSessionStart: DEFAULT_SYSTEM_SETTINGS.currentSessionStart,
                    currentSessionDuration: DEFAULT_SYSTEM_SETTINGS.currentSessionDuration,
                },
            });
        }
        return settings;
    } catch (error) {
        console.error("Database connection failed in getSystemSettings:", error);
        // Fallback pour éviter que le site ne crashe
        return {
            id: "default",
            ...DEFAULT_SYSTEM_SETTINGS,
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
    const enableOnlineRegistration = formData.get("enableOnlineRegistration") === "true";
    const enableCorporateRegistration = formData.get("enableCorporateRegistration") === "true";

    try {
        await prisma.systemSettings.upsert({
            where: { id: "default" },
            update: {
                currentSessionName,
                currentSessionStart,
                currentSessionDuration,
                enableOnlineRegistration,
                enableCorporateRegistration
            },
            create: {
                id: "default",
                currentSessionName,
                currentSessionStart,
                currentSessionDuration,
                enableOnlineRegistration,
                enableCorporateRegistration
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
