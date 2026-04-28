import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PaymentLock } from "@/components/payment-lock";
import { headers } from "next/headers";

/**
 * Layout de protection des routes Student.
 * Double sécurité : le middleware bloque déjà les non-STUDENT,
 * mais ce layout re-vérifie côté serveur pour éviter toute fuite.
 */
export default async function StudentLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    // Si pas connecté ou pas STUDENT → redirection immédiate
    if (!session || session.user?.role !== "STUDENT") {
        if (session?.user?.role === "ADMIN") redirect("/dashboard/admin");
        if (session?.user?.role === "TEACHER") redirect("/dashboard/teacher");
        redirect("/login");
    }

    // Récupérer le statut réel en base
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { status: true }
    });

    const headerList = await headers();
    const pathname = headerList.get("x-url") || "";
    const isPaymentPage = pathname.includes("/payments/manual");

    // Si PENDING et pas sur la page de paiement → bloquer l'accès
    if (user?.status === "PENDING" && !isPaymentPage) {
        return <PaymentLock />;
    }

    return <>{children}</>;
}
