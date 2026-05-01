import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getStudentProgressData } from "@/app/actions/student-progress";
import { getQuizzes } from "@/app/actions/quizzes";
import Link from "next/link";
import LessonItem from "./LessonItem";
import StudentQuizList from "./QuizList";
import { getStudentPhase } from "@/app/actions/student-phase";

export default async function StudentCoursesPage() {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") redirect("/login");

    const phase = await getStudentPhase();

    if (phase === "CLUB") {
        return (
            <div className="p-8 text-center max-w-2xl mx-auto rounded-3xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-6xl mb-6">🎓</div>
                <h1 className="text-2xl font-black mb-4">Programme Régulier Terminé !</h1>
                <p className="text-[var(--foreground)]/70 mb-8 font-medium">
                    Félicitations, vous avez complété vos 2 mois de structure fondamentale. Votre accès aux leçons régulières est désormais remplacé par l'accès privilégié au Club d'Anglais pour la pratique orale.
                </p>
                <Link href="/dashboard/student/club" className="bg-[var(--primary)] text-white font-black py-4 px-8 rounded-xl shadow-lg hover:opacity-90 transition-opacity inline-block">
                    Rejoindre le Club d'Anglais
                </Link>
            </div>
        );
    }

    const progressData = await getStudentProgressData(session.user.id);
    const studentId = session.user.id!;
    const quizzes = await getQuizzes((session.user as any).levelId);

    if (!progressData.levelName) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Niveau non assigné</h2>
                <p className="text-[var(--foreground)]/60 max-w-md mt-2">
                    Vous n'avez pas encore de niveau assigné. Veuillez contacter l'administration de Prime Language Academy.
                </p>
                <Link href="/dashboard/student" className="mt-8 text-[var(--primary)] font-bold hover:underline">
                    ← Retour au tableau de bord
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-16 animate-in fade-in duration-500 pb-20">
            <header>
                <Link href="/dashboard/student" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mb-2">
                    ← Retour
                </Link>
                <h2 className="text-3xl font-extrabold text-[var(--foreground)]">{progressData.levelName}</h2>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1 h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--primary)]" style={{ width: `${progressData.percentage}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-[var(--primary)]">{progressData.percentage}%</span>
                </div>
            </header>

            <div className="space-y-12">
                {progressData.modules?.map((module: any) => (
                    <section key={module.id} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-sm">
                                {module.order + 1}
                            </div>
                            <h3 className="font-bold text-xl text-[var(--foreground)]">{module.title}</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {module.lessons.map((lesson: any) => (
                                <LessonItem
                                    key={lesson.id}
                                    lesson={lesson}
                                    isCompleted={(progressData.completedLessonIds as string[]).includes(lesson.id)}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Quizzes Section */}
            <div className="pt-8 border-t border-[var(--glass-border)]">
                <StudentQuizList quizzes={quizzes} studentId={studentId} />
            </div>
        </div>
    );
}
