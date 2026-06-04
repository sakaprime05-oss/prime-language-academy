import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PLA_SESSION } from "@/lib/pla-program";

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
    
    let sessionStartStr = settings?.currentSessionStart || PLA_SESSION.startDate;
    
    if (sessionStartStr.toLowerCase().includes("juillet") || sessionStartStr.toLowerCase().includes("juin")) {
        sessionStartStr = PLA_SESSION.startDate;
    } else if (sessionStartStr.toLowerCase().includes("avril")) {
        sessionStartStr = "2026-04-11";
    }

    const startDate = new Date(sessionStartStr);
    
    if (isNaN(startDate.getTime())) {
        return "TRAINING"; // Sécurité par défaut
    }

    const now = new Date();
    const sessionEnd = new Date(`${PLA_SESSION.endDate}T23:59:59`);

    if (now >= sessionEnd) {
        return "CLUB";
    }

    return "TRAINING";
}
