import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentProgressData } from "@/app/actions/student-progress";

export default async function StudentProfilePage() {
    const session = await auth();
    if (!session) redirect("/login");

    const user = await (prisma as any).user.findUnique({
        where: { id: session.user.id },
        include: {
            level: true,
            badges: { include: { badge: true } },
            gradesReceived: {
                include: { teacher: { select: { name: true } } },
                orderBy: { date: 'desc' }
            }
        }
    });

    if (!user) redirect("/login");

    const progressData = await getStudentProgressData(session.user.id);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 max-w-3xl mx-auto">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Mon Profil</h2>
                <p className="text-[var(--foreground)]/50 font-medium">Gérez vos informations et consultez votre progression.</p>
            </header>

            {/* Avatar Card */}
            <div className="glass-card flex flex-col items-center text-center p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full mix-blend-multiply opacity-50 pointer-events-none -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 blur-3xl rounded-full mix-blend-multiply opacity-30 pointer-events-none -ml-24 -mb-24"></div>

                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-4xl font-black shadow-2xl shadow-primary/30 relative z-10 rotate-3">
                    <span className="-rotate-3">{user.name?.[0] || user.email[0].toUpperCase()}</span>
                </div>

                <div className="relative z-10 space-y-2">
                    <h3 className="text-2xl font-black text-[var(--foreground)]">{user.name}</h3>
                    <p className="text-sm font-bold text-[var(--foreground)]/50">{user.email}</p>
                    <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border border-primary/20">
                        🎓 Étudiant
                    </div>
                </div>

                {/* Badges Display */}
                {user.badges && user.badges.length > 0 && (
                    <div className="relative z-10 flex flex-wrap justify-center gap-2 mt-4 pt-4 border-t border-[var(--foreground)]/10">
                        {user.badges.map((b: any) => (
                            <div key={b.id} className="flex items-center gap-2 bg-[var(--foreground)]/5 px-3 py-1.5 rounded-full border border-[var(--foreground)]/10" title={b.badge.description}>
                                <span className="text-lg">{b.badge.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/70">{b.badge.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <h4 className="font-black text-lg text-[var(--foreground)]">Informations</h4>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-1">Nom complet</p>
                            <p className="text-sm font-bold text-[var(--foreground)] bg-[var(--foreground)]/5 px-4 py-3 rounded-xl">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-1">Adresse Email</p>
                            <p className="text-sm font-bold text-[var(--foreground)] bg-[var(--foreground)]/5 px-4 py-3 rounded-xl">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-1">Membre depuis</p>
                            <p className="text-sm font-bold text-[var(--foreground)] bg-[var(--foreground)]/5 px-4 py-3 rounded-xl">
                                {new Date(user.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-card space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                        </div>
                        <h4 className="font-black text-lg text-[var(--foreground)]">Progression</h4>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-1">Niveau Actuel</p>
                            <p className="text-sm font-bold bg-primary/10 text-primary px-4 py-3 rounded-xl border border-primary/20">
                                {user.level?.name || "Non assigné"}
                            </p>
                        </div>
                        {progressData.levelName && (
                            <>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-1">Avancement</p>
                                    <div className="bg-[var(--foreground)]/5 px-4 py-3 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-[var(--foreground)]/60">{progressData.completedLessons} / {progressData.totalLessons} leçons</span>
                                            <span className="text-sm font-black text-primary">{progressData.percentage}%</span>
                                        </div>
                                        <div className="h-3 bg-[var(--foreground)]/5 rounded-full overflow-hidden p-0.5">
                                            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000" style={{ width: `${progressData.percentage}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Grades and Feedbacks */}
            {user.gradesReceived && user.gradesReceived.length > 0 && (
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        </div>
                        <h4 className="font-black text-lg text-[var(--foreground)]">Évaluations & Retours</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.gradesReceived.map((grade: any) => (
                            <div key={grade.id} className="bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl p-5 relative">
                                {grade.score !== null && (
                                    <div className="absolute top-4 right-4 bg-orange-500/10 text-orange-500 font-black text-lg px-3 py-1 rounded-xl">
                                        {grade.score}
                                    </div>
                                )}
                                <div className="space-y-1 mb-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-[var(--foreground)]/60">
                                        {grade.category}
                                    </span>
                                    <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">{new Date(grade.date).toLocaleDateString('fr-FR')} • {grade.teacher.name || "Professeur"}</p>
                                </div>
                                {grade.feedback && (
                                    <p className="text-sm font-medium text-[var(--foreground)]/80 italic mt-3 bg-white/5 p-3 rounded-xl">
                                        "{grade.feedback}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Logout */}
            <div className="flex justify-center pt-4">
                <form action={async () => {
                    "use server";
                    const { signOut } = await import("@/auth");
                    await signOut({ redirectTo: "/login" });
                }}>
                    <button type="submit" className="px-8 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Se déconnecter
                    </button>
                </form>
            </div>
        </div>
    );
}
