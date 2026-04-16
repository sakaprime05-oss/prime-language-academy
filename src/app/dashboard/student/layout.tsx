import { auth } from "@/auth";
import { redirect } from "next/navigation";

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

    return <>{children}</>;
}
