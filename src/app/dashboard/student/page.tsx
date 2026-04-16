import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentProgressData } from "@/app/actions/student-progress";
import { getSystemSettings } from "@/app/actions/system-settings";
import Link from "next/link";

export default async function StudentDashboardPage() {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { level: true }
    });

    const progressData = await getStudentProgressData(session.user.id);
    const systemSettings = await getSystemSettings();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight">Salut, {session.user.name?.split(' ')[0]} 👋</h2>
                    <p className="text-[var(--foreground)]/50 font-medium text-sm">Prêt pour votre séance d'anglais ?</p>
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 text-xl border-2 border-white/20">
                    {session.user.name?.[0]}
                </div>
            </header>

            {!user?.levelId && (
                <div className="glass-card border-amber-500/20 bg-amber-500/5 text-amber-600 flex flex-col md:flex-row items-center gap-4 p-6">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-base font-black">Plan en attente d'activation</p>
                        <p className="text-xs opacity-80 font-bold uppercase tracking-wide mt-1">L'administration valide votre inscription. Merci de votre patience !</p>
                    </div>
                </div>
            )}

            {/* Plan Info Card */}
            {user?.levelId && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card md:col-span-2 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Votre Formule Actualisée</p>
                                <h3 className="text-2xl font-black text-[var(--foreground)]">{progressData.levelName}</h3>
                                <p className="text-xs text-[var(--foreground)]/50 mt-2 font-bold uppercase tracking-widest">Début : {systemSettings.currentSessionStart}</p>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black text-[var(--foreground)]/40 uppercase tracking-widest">Progression Globale</span>
                                    <span className="text-xl font-black text-primary">{progressData.percentage}%</span>
                                </div>
                                <div className="h-3 bg-[var(--foreground)]/5 rounded-full overflow-hidden p-0.5">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 shadow-sm"
                                        style={{ width: `${progressData.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card flex flex-col justify-center items-center text-center space-y-2 border-primary/20 bg-primary/5">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-lg shadow-primary/20 mb-2">
                            {progressData.totalLessons - progressData.completedLessons}
                        </div>
                        <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-widest">Leçons à venir</p>
                        <p className="text-sm font-black text-[var(--foreground)]">Préparez-vous !</p>
                    </div>
                </div>
            )}

            {/* Next Lesson CTA */}
            {progressData.currentLesson && (
                <section className="glass-card border-l-4 border-l-primary p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Continuer l'apprentissage</p>
                        <h4 className="text-lg font-black text-[var(--foreground)]">{progressData.currentLesson.title}</h4>
                        <p className="text-xs font-bold text-[var(--foreground)]/40 uppercase mt-1 tracking-widest">{progressData.currentLesson.type} • Module {progressData.currentLesson.moduleId.slice(-1)}</p>
                    </div>
                    <Link href={`/dashboard/student/courses/${progressData.currentLesson.id}`} className="btn-primary !w-full md:!w-auto px-10">
                        Reprendre
                    </Link>
                </section>
            )}

            {/* Feature Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/dashboard/student/courses" className="glass-card flex flex-col items-center justify-center gap-3 p-6 hover:border-primary/50 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.246.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">Cours</span>
                </Link>

                <Link href="/dashboard/student/forum" className="glass-card flex flex-col items-center justify-center gap-3 p-6 hover:border-primary/50 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">Forum</span>
                </Link>

                <Link href="/dashboard/student/profile" className="glass-card flex flex-col items-center justify-center gap-3 p-6 hover:border-primary/50 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">Profil</span>
                </Link>

                <Link href="/dashboard/student/payments" className="glass-card flex flex-col items-center justify-center gap-3 p-6 hover:border-primary/50 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">Paiement</span>
                </Link>
            </div>
        </div>
    );
}
