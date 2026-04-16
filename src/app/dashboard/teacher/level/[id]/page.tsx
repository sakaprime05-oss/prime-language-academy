import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLevelStudentsWithProgress } from "@/app/actions/teacher-data";
import { getTeacherSchedules } from "@/app/actions/teacher-mgmt";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { StudentActionsClient } from "./StudentActionsClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function TeacherLevelPage({ params }: PageProps) {
    const session = await auth();
    if (!session || (session.user?.role !== "TEACHER" && session.user?.role !== "ADMIN")) {
        redirect("/login");
    }

    const { id } = await params;
    const level = await prisma.level.findUnique({
        where: { id },
        select: { name: true }
    });

    if (!level) redirect("/dashboard/teacher");

    const students = await getLevelStudentsWithProgress(id);
    const teacherId = session.user.id!;
    const allSchedules = await getTeacherSchedules(teacherId);
    const levelSchedules = (allSchedules as any[]).filter(s => s.levelId === id || s.type === "CLUB");

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <header className="mb-8">
                <Link href="/dashboard/teacher" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mb-2">
                    ← Retour au tableau de bord
                </Link>
                <h2 className="text-3xl font-extrabold text-[var(--foreground)]">{level.name}</h2>
                <p className="text-[var(--foreground)]/60 text-sm">Liste des étudiants et suivi de progression en temps réel.</p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {students.length === 0 ? (
                    <div className="glass-card text-center py-12">
                        <p className="text-[var(--foreground)]/50">Aucun étudiant inscrit dans ce niveau.</p>
                    </div>
                ) : (
                    students.map(student => (
                        <div key={student.id} className="glass-card !p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-lg">
                                    {student.name?.[0] || student.email[0].toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[var(--foreground)]">{student.name || "Sans Nom"}</h4>
                                    <p className="text-xs text-[var(--foreground)]/50">{student.email}</p>
                                </div>
                            </div>

                            <div className="flex-1 max-w-md w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Progression</span>
                                    <span className="text-xs font-black text-[var(--primary)]">{student.progressPercentage}%</span>
                                </div>
                                <div className="h-2 w-full bg-[var(--surface-hover)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--primary)] transition-all duration-700"
                                        style={{ width: `${student.progressPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-[var(--foreground)]/30 mt-1 text-right">
                                    {student.completedLessons} / {student.totalLessons} leçons terminées
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider ${student.status === "ACTIVE" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                                    }`}>
                                    {student.status}
                                </span>
                                
                                <StudentActionsClient 
                                    studentId={student.id}
                                    studentName={student.name || "Sans Nom"}
                                    levelId={id}
                                    schedules={levelSchedules}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
