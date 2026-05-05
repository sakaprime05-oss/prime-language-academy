import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StudentRow from "./StudentRow";
import Link from "next/link";
import { hasRequiredProfilePhoto, parseStudentProfileData } from "@/lib/student-profile";

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
        <div className="space-y-4 animate-in fade-in duration-500 pb-12 md:space-y-6">
            <header className="flex items-start justify-between gap-4">
                <div>
                    <Link href="/dashboard/admin" className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[var(--primary)] hover:underline">
                        ← Retour à l'admin
                    </Link>
                    <p className="platform-eyebrow">Administration</p>
                    <h2 className="platform-title text-white">Gestion Étudiants</h2>
                    <p className="platform-subtitle text-white/55">Gérez les inscriptions, le statut et l'assignation des niveaux.</p>
                </div>
                <div className="hidden rounded-lg border border-red-500/15 bg-red-500/10 px-3 py-2 text-right md:block">
                    <p className="text-2xl font-black text-white">{students.length}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-300">inscrits</p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-3">
                {students.length === 0 ? (
                    <div className="glass-card text-center py-12">
                        <p className="text-[var(--foreground)]/50">Aucun étudiant inscrit pour le moment.</p>
                    </div>
                ) : (
                    students.map(student => {
                        const profile = parseStudentProfileData(student.onboardingData);
                        return (
                        <StudentRow
                            key={student.id}
                            student={{
                                ...student,
                                profileComplete: hasRequiredProfilePhoto(student.onboardingData),
                                profilePhotoUrl: profile.profilePhotoUrl,
                                phone: profile.phone,
                                commune: profile.commune,
                                learningGoal: profile.learningGoal || profile.objective,
                            }}
                            levels={levels}
                        />
                        );
                    })
                )}
            </div>
        </div>
    );
}
