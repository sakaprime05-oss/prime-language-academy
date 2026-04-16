import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StudentRow from "./StudentRow";
import Link from "next/link";

export default async function AdminStudentsPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/login");

    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        include: { level: true },
        orderBy: { createdAt: 'desc' }
    });

    const levels = await prisma.level.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <Link href="/dashboard/admin" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mb-2">
                        ← Retour à l'admin
                    </Link>
                    <h2 className="text-3xl font-extrabold text-[var(--foreground)]">Gestion Étudiants</h2>
                    <p className="text-[var(--foreground)]/60 text-sm">Gérez les inscriptions, le statut et l'assignation des niveaux.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {students.length === 0 ? (
                    <div className="glass-card text-center py-12">
                        <p className="text-[var(--foreground)]/50">Aucun étudiant inscrit pour le moment.</p>
                    </div>
                ) : (
                    students.map(student => (
                        <StudentRow
                            key={student.id}
                            student={student}
                            levels={levels}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
