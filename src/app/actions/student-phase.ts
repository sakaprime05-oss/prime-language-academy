import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getStudentPhase() {
    const session = await auth();
    
    if (session?.user?.id) {
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (user?.onboardingData) {
            try {
                const data = JSON.parse(user.onboardingData);
                if (data.type === "CLUB") return "CLUB";
            } catch (e) {}
        }
    }

    const settings = await prisma.systemSettings.findUnique({ where: { id: "default" } });
    
    let sessionStartStr = settings?.currentSessionStart || "2026-06-18"; 
    
    if (sessionStartStr.toLowerCase().includes("juin")) {
        sessionStartStr = "2026-06-18";
    } else if (sessionStartStr.toLowerCase().includes("avril")) {
        sessionStartStr = "2026-04-11";
    }

    const startDate = new Date(sessionStartStr);
    
    if (isNaN(startDate.getTime())) {
        return "TRAINING"; // Sécurité par défaut
    }

    const now = new Date();
    // 60 jours en millisecondes
    const sixtyDaysMs = 60 * 24 * 60 * 60 * 1000;

    if (now.getTime() - startDate.getTime() >= sixtyDaysMs) {
        return "CLUB";
    }

    return "TRAINING";
}
