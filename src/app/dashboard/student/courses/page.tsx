import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, CalendarDays, FileText, Layers, Route } from "lucide-react";
import { getStudentProgressData } from "@/app/actions/student-progress";
import { getQuizzes } from "@/app/actions/quizzes";
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
            <div className="glass-card mx-auto max-w-2xl animate-in rounded-xl p-6 text-center fade-in slide-in-from-bottom-4 sm:p-8">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--primary)]/10 text-[var(--primary)]">
                    <BookOpen className="h-8 w-8" aria-hidden="true" />
                </div>
                <h1 className="mb-4 text-2xl font-black">Programme regulier termine</h1>
                <p className="mb-8 font-medium leading-7 text-[var(--foreground)]/70">
                    Vous avez complete votre structure fondamentale. Votre priorite devient maintenant la pratique orale avec le Club d'Anglais.
                </p>
                <Link href="/dashboard/student/club" className="inline-block rounded-lg bg-[var(--primary)] px-8 py-4 font-black text-white transition-opacity hover:opacity-90">
                    Rejoindre le Club d'Anglais
                </Link>
            </div>
        );
    }

    const progressData = await getStudentProgressData(session.user.id);
    const studentId = session.user.id!;
    const quizzes = await getQuizzes();
    const modules = progressData.modules || [];
    const completedLessonIds = (progressData.completedLessonIds || []) as string[];
    const pdfLessons = modules.flatMap((module: any) => module.lessons || []).filter((lesson: any) => lesson.type === "PDF");
    const totalLessons = progressData.totalLessons || 0;
    const completedLessons = progressData.completedLessons || 0;
    const hasModules = modules.length > 0;

    if (!progressData.levelName) {
        return (
            <div className="glass-card flex min-h-[50vh] flex-col items-center justify-center rounded-xl p-6 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Niveau non assigne</h2>
                <p className="mt-2 max-w-md text-[var(--foreground)]/60">
                    Vous n'avez pas encore de niveau. Contactez l'administration PLA pour activer votre programme.
                </p>
                <Link href="/dashboard/student" className="mt-8 font-bold text-[var(--primary)] hover:underline">
                    Retour au tableau de bord
                </Link>
            </div>
        );
    }

    return (
        <div className="platform-page animate-in fade-in duration-500">
            <header className="platform-page-header">
                <Link href="/dashboard/student" className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[var(--primary)] hover:underline">
                    Retour
                </Link>
                <p className="platform-eyebrow">Programme de suivi</p>
                <h2 className="platform-title">{progressData.levelName}</h2>
                <p className="platform-subtitle">
                    Votre bibliotheque PLA regroupe les supports de grammaire, vocabulaire, language focus et Wordz. Ouvrez les PDF, telechargez-les, puis marquez-les comme termines pour suivre votre progression.
                </p>
                <SupportLink context="courses" className="mt-4" />
                <div className="mt-3 flex items-center gap-4">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                        <div className="h-full bg-[var(--primary)]" style={{ width: `${progressData.percentage}%` }} />
                    </div>
                    <span className="text-xs font-bold text-[var(--primary)]">{progressData.percentage}%</span>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <CourseStat icon={<Layers className="h-4 w-4" />} label="Modules" value={String(modules.length)} />
                <CourseStat icon={<FileText className="h-4 w-4" />} label="Supports PDF" value={String(pdfLessons.length)} />
                <CourseStat icon={<BookOpen className="h-4 w-4" />} label="A faire" value={String(Math.max(0, totalLessons - completedLessons))} />
                <CourseStat icon={<Route className="h-4 w-4" />} label="Progression" value={`${progressData.percentage}%`} />
            </section>

            <section className="grid grid-cols-1 gap-3 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="glass-card border-primary/20 bg-primary/[0.03] !p-4 sm:!p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Session</p>
                    <h3 className="mt-2 text-xl font-black text-[var(--foreground)]">{PLA_SESSION.dates}</h3>
                    <p className="mt-2 text-xs font-bold leading-6 text-[var(--foreground)]/55">
                        Duree : {PLA_SESSION.duration}. Avancement : {completedLessons} / {totalLessons} contenus termines.
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
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/35">Calendrier de progression</p>
                    </div>
                    <h3 className="mt-1 text-lg font-black text-[var(--foreground)]">Ordre conseille</h3>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {hasModules ? modules.map((module: any, index: number) => (
                            <a key={module.id} href={`#module-${module.id}`} className="mobile-list-row">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/35">Etape {index + 1}</p>
                                <p className="mt-1 truncate text-sm font-black text-[var(--foreground)]">{module.title}</p>
                                <p className="mt-1 text-[11px] font-bold text-[var(--foreground)]/45">{module.lessons?.length || 0} supports</p>
                            </a>
                        )) : (
                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs font-bold leading-6 text-amber-600 sm:col-span-2">
                                Aucun module n'est encore rattache a ce niveau. Contactez l'equipe PLA pour verifier votre affectation.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="space-y-8">
                {hasModules ? modules.map((module: any, index: number) => (
                    <section key={module.id} id={`module-${module.id}`} className="scroll-mt-24 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-sm font-bold text-[var(--primary)]">
                                {index + 1}
                            </div>
                            <h3 className="text-lg font-bold text-[var(--foreground)]">{module.title}</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {(module.lessons || []).length > 0 ? module.lessons.map((lesson: any) => (
                                <LessonItem
                                    key={lesson.id}
                                    lesson={lesson}
                                    isCompleted={completedLessonIds.includes(lesson.id)}
                                />
                            )) : (
                                <div className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 p-5 text-sm font-bold text-[var(--foreground)]/50">
                                    Ce module est cree, mais aucun support n'y est encore ajoute.
                                </div>
                            )}
                        </div>
                    </section>
                )) : (
                    <div className="glass-card border-amber-500/25 bg-amber-500/[0.04] p-6 text-center">
                        <h3 className="text-lg font-black text-[var(--foreground)]">Cours en preparation</h3>
                        <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-6 text-[var(--foreground)]/55">
                            Votre niveau existe, mais il n'a pas encore de supports. L'equipe PLA peut ajouter les documents depuis l'espace admin.
                        </p>
                    </div>
                )}
            </div>

            <div className="border-t border-[var(--glass-border)] pt-8">
                <StudentQuizList quizzes={quizzes} studentId={studentId} />
            </div>
        </div>
    );
}

function CourseStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="glass-card !p-4">
            <div className="flex items-center justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                    {icon}
                </span>
                <p className="text-xl font-black text-[var(--foreground)]">{value}</p>
            </div>
            <p className="mt-3 text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/35">{label}</p>
        </div>
    );
}
