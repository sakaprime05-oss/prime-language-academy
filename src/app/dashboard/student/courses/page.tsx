import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getStudentProgressData } from "@/app/actions/student-progress";
import { getQuizzes } from "@/app/actions/quizzes";
import Link from "next/link";
import LessonItem from "./LessonItem";
import StudentQuizList from "./QuizList";
import { getStudentPhase } from "@/app/actions/student-phase";
import { PLA_SESSION } from "@/lib/pla-program";
import { requireInitialPayment } from "@/lib/student-payment-gate";
import { SupportLink } from "@/components/support-link";

export default async function StudentCoursesPage() {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") redirect("/login");
    await requireInitialPayment(session.user.id);

    const phase = await getStudentPhase();

    if (phase === "CLUB") {
        return (
            <div className="glass-card mx-auto max-w-2xl rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4 sm:p-8">
                <div className="text-6xl mb-6">🎓</div>
                <h1 className="text-2xl font-black mb-4">Programme Régulier Terminé !</h1>
                <p className="text-[var(--foreground)]/70 mb-8 font-medium">
                    Félicitations, vous avez complété vos 2 mois de structure fondamentale. Votre accès aux leçons régulières est désormais remplacé par l'accès privilégié au Club d'Anglais pour la pratique orale.
                </p>
                <Link href="/dashboard/student/club" className="inline-block rounded-lg bg-[var(--primary)] px-8 py-4 font-black text-white transition-opacity hover:opacity-90">
                    Rejoindre le Club d'Anglais
                </Link>
            </div>
        );
    }

    const progressData = await getStudentProgressData(session.user.id);
    const studentId = session.user.id!;
    const quizzes = await getQuizzes((session.user as any).levelId);
    const modules = progressData.modules || [];
    const pdfLessons = modules.flatMap((module: any) => module.lessons || []).filter((lesson: any) => lesson.type === "PDF");

    if (!progressData.levelName) {
        return (
            <div className="glass-card flex min-h-[50vh] flex-col items-center justify-center rounded-xl p-6 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
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
        <div className="platform-page animate-in fade-in duration-500">
            <header className="platform-page-header">
                <Link href="/dashboard/student" className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[var(--primary)] hover:underline">
                    ← Retour
                </Link>
                <p className="platform-eyebrow">Programme de suivi</p>
                <h2 className="platform-title">{progressData.levelName}</h2>
                <p className="platform-subtitle">
                    Vos cours sont organises comme un programme progressif. Les supports sont principalement des PDF a ouvrir ou telecharger, puis a marquer comme termines.
                </p>
                <SupportLink context="courses" className="mt-4" />
                <div className="mt-3 flex items-center gap-4">
                    <div className="flex-1 h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--primary)]" style={{ width: `${progressData.percentage}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-[var(--primary)]">{progressData.percentage}%</span>
                </div>
            </header>

            <section className="grid grid-cols-1 gap-3 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="glass-card border-primary/20 bg-primary/[0.03] !p-4 sm:!p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Session</p>
                    <h3 className="mt-2 text-xl font-black text-[var(--foreground)]">{PLA_SESSION.dates}</h3>
                    <p className="mt-2 text-xs font-bold leading-6 text-[var(--foreground)]/55">
                        Duree : {PLA_SESSION.duration}. Avancement : {progressData.completedLessons} / {progressData.totalLessons} contenus termines.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-[var(--foreground)]/5 p-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/35">Modules</p>
                            <p className="mt-1 text-2xl font-black text-[var(--foreground)]">{modules.length}</p>
                        </div>
                            <div className="rounded-lg bg-[var(--foreground)]/5 p-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/35">PDF</p>
                            <p className="mt-1 text-2xl font-black text-[var(--primary)]">{pdfLessons.length}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card !p-4 sm:!p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/35">Calendrier de progression</p>
                    <h3 className="mt-1 text-lg font-black text-[var(--foreground)]">Ordre conseille</h3>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {modules.map((module: any, index: number) => (
                            <a key={module.id} href={`#module-${module.id}`} className="mobile-list-row">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/35">Semaine {index + 1}</p>
                                <p className="mt-1 truncate text-sm font-black text-[var(--foreground)]">{module.title}</p>
                                <p className="mt-1 text-[11px] font-bold text-[var(--foreground)]/45">{module.lessons?.length || 0} supports</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <div className="space-y-8">
                {progressData.modules?.map((module: any) => (
                    <section key={module.id} id={`module-${module.id}`} className="scroll-mt-24 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-sm">
                                {module.order + 1}
                            </div>
                            <h3 className="text-lg font-bold text-[var(--foreground)]">{module.title}</h3>
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
