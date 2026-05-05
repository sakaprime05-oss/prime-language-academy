import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentProgressData } from "@/app/actions/student-progress";
import { getSystemSettings } from "@/app/actions/system-settings";
import { getDictionary } from "@/lib/i18n";
import Link from "next/link";
import { PLA_SESSION, PLA_TIME_SLOTS } from "@/lib/pla-program";
import { parseStudentProfileData } from "@/lib/student-profile";

function daysUntil(date: Date) {
    const now = new Date();
    return Math.max(0, Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

const dayIndex: Record<string, number> = {
    Dimanche: 0,
    Lundi: 1,
    Mardi: 2,
    Mercredi: 3,
    Jeudi: 4,
    Vendredi: 5,
    Samedi: 6,
};

function countRemainingSessions(days: string[], endDate: Date) {
    const targets = new Set(days.map((day) => dayIndex[day]).filter((value) => value !== undefined));
    if (!targets.size) return 0;

    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    let count = 0;

    while (cursor <= end) {
        if (targets.has(cursor.getDay())) count += 1;
        cursor.setDate(cursor.getDate() + 1);
    }

    return count;
}

export default async function StudentDashboardPage() {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { level: true }
    });

    const progressData = await getStudentProgressData(session.user.id);
    const systemSettings = await getSystemSettings();
    const fullDict = await getDictionary();
    const dict = fullDict.dashboard;
    const profile = parseStudentProfileData(user?.onboardingData);
    const sessionEnd = new Date("2026-08-19T23:59:59");
    const remainingDays = daysUntil(sessionEnd);
    const remainingSessions = countRemainingSessions(profile.days || [], sessionEnd);
    const selectedSlot = PLA_TIME_SLOTS.find((slot) => slot.id === profile.timeSlot);

    const isClub = user?.registrationType === "CLUB";
    const isWaitlisted = user?.status === "WAITLIST";
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('fr-FR')
        : "";

    if (isClub && isWaitlisted) {
        return (
            <div className="pb-24">
                <section className="glass-card border-amber-500/25 bg-amber-500/[0.04] p-6 sm:p-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-500">Liste d'attente Club</p>
                    <h1 className="mt-3 text-2xl sm:text-4xl font-black text-[var(--foreground)]">
                        Votre demande Club est bien enregistrée.
                    </h1>
                    <p className="mt-4 text-sm leading-7 text-[var(--foreground)]/60">
                        The English Club est limité à 26 membres pour garder une expérience premium. Vous serez contacté dès qu'une place se libère ou qu'une nouvelle vague Club est ouverte.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Link href="/english-club" className="rounded-2xl border border-amber-500/30 px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-amber-500">
                            Voir le Club
                        </Link>
                        <Link href="/dashboard/student/profile" className="rounded-2xl bg-amber-500 px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-white">
                            Mon profil
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                    <p className="text-xl md:text-2xl font-black text-[var(--foreground)] tracking-tight leading-snug truncate"
                        style={{fontFamily: 'Inter, sans-serif'}}>
                        {isClub ? `Welcome back, ${session.user.name?.split(' ')[0]} 🥂` : `${dict.welcome}, ${session.user.name?.split(' ')[0]} 👋`}
                    </p>
                    <p className="text-sm text-[var(--foreground)]/50 font-medium leading-tight">
                        {isClub ? dict.ready_club : dict.ready_course}
                    </p>
                </div>
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 text-lg border-2 border-white/20 flex-shrink-0">
                    {session.user.name?.[0]}
                </div>
            </header>

            {!user?.levelId && (
                <div className="glass-card border-amber-500/20 bg-amber-500/5 text-amber-600 flex flex-col md:flex-row items-center gap-4 p-6">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-base font-black">{dict.plan_pending}</p>
                        <p className="text-xs opacity-80 font-bold uppercase tracking-wide mt-1">{dict.plan_pending_desc}</p>
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
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                                    {isClub ? dict.your_club : dict.your_plan}
                                </p>
                                <h3 className="text-2xl font-black text-[var(--foreground)]">{progressData.levelName}</h3>
                                <p className="text-xs text-[var(--foreground)]/50 mt-2 font-bold uppercase tracking-widest">
                                    {isClub ? `${dict.member_since} : ${memberSince}` : `${dict.start_date} : ${systemSettings.currentSessionStart}`}
                                </p>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black text-[var(--foreground)]/40 uppercase tracking-widest">{dict.progress}</span>
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
                            {isClub ? "✨" : (progressData.totalLessons - progressData.completedLessons)}
                        </div>
                        <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-widest">
                            {isClub ? dict.club_status : dict.lessons_left}
                        </p>
                        <p className="text-sm font-black text-[var(--foreground)]">{isClub ? dict.active : dict.get_ready}</p>
                    </div>
                </div>
            )}

            {!isClub && (
                <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="glass-card space-y-5 p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Programme</p>
                                <h3 className="mt-1 text-xl font-black text-[var(--foreground)]">{PLA_SESSION.label}</h3>
                                <p className="mt-1 text-xs font-bold text-[var(--foreground)]/45">{PLA_SESSION.dates} - {PLA_SESSION.duration}</p>
                            </div>
                            <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center text-primary">
                                <p className="text-2xl font-black">{remainingDays}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest">jours</p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <MiniStat label="Séances restantes" value={String(remainingSessions)} />
                            <MiniStat label="Leçons restantes" value={String(Math.max(0, (progressData.totalLessons || 0) - (progressData.completedLessons || 0)))} />
                            <MiniStat label="Avancement" value={`${progressData.percentage}%`} />
                        </div>

                        <div className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40">Objectif</p>
                            <p className="mt-2 text-sm font-bold leading-6 text-[var(--foreground)]/70">
                                {profile.learningGoal || profile.objective || "Ajoutez votre objectif dans le profil pour mieux suivre votre progression."}
                            </p>
                        </div>
                    </div>

                    <div className="glass-card space-y-4 p-5 sm:p-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Emploi du temps</p>
                        <div className="space-y-3">
                            {(profile.days || []).length > 0 ? (
                                profile.days?.map((day) => (
                                    <div key={day} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 px-4 py-3">
                                        <span className="text-sm font-black text-[var(--foreground)]">{day}</span>
                                        <span className="text-xs font-bold text-[var(--foreground)]/55">{selectedSlot?.time || "Horaire à confirmer"}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs font-bold leading-6 text-amber-600">
                                    Aucun jour choisi. Vérifiez votre profil ou contactez l'administration.
                                </p>
                            )}
                        </div>
                        <p className="text-[11px] font-medium leading-5 text-[var(--foreground)]/45">
                            Lieu : {PLA_SESSION.location}. {PLA_SESSION.locationHint}
                        </p>
                    </div>
                </section>
            )}

            {/* Next Lesson CTA (Only for FORMATION) */}
            {!isClub && progressData.currentLesson && (
                <section className="glass-card border-l-4 border-l-primary p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{dict.continue}</p>
                        <h4 className="text-lg font-black text-[var(--foreground)]">{progressData.currentLesson.title}</h4>
                        <p className="text-xs font-bold text-[var(--foreground)]/40 uppercase mt-1 tracking-widest">{progressData.currentLesson.type} • Module {progressData.currentLesson.moduleId.slice(-1)}</p>
                    </div>
                    <Link href={`/dashboard/student/courses/${progressData.currentLesson.id}`} className="btn-primary !w-full md:!w-auto px-10">
                        {dict.resume}
                    </Link>
                </section>
            )}

            {/* Club Reservation CTA (Only for CLUB) */}
            {isClub && (
                <section className="glass-card border-l-4 border-l-amber-500 p-6 flex flex-col md:flex-row justify-between items-center gap-6 bg-amber-500/[0.02]">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">{dict.next_session}</p>
                        <h4 className="text-lg font-black text-[var(--foreground)]">{dict.book_talk}</h4>
                        <p className="text-xs font-bold text-[var(--foreground)]/40 uppercase mt-1 tracking-widest">Networking • Public Speaking • Debate</p>
                    </div>
                    <Link href="/dashboard/student/appointments" className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-xl font-black transition-all !w-full md:!w-auto text-center shadow-lg shadow-amber-500/20">
                        {dict.book}
                    </Link>
                </section>
            )}

            {/* Feature Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {!isClub ? (
                    <Link href="/dashboard/student/courses" className="glass-card flex flex-col items-center justify-center gap-3 p-6 hover:border-primary/50 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.246.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <p className="text-xs font-black text-[var(--foreground)]/60 uppercase tracking-widest">{dict.my_courses}</p>
                    </Link>
                ) : (
                    <Link href="/dashboard/student/appointments" className="glass-card flex flex-col items-center justify-center gap-3 p-6 hover:border-amber-500/50 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <p className="text-xs font-black text-[var(--foreground)]/60 uppercase tracking-widest">Sessions</p>
                    </Link>
                )}

                <Link href="/dashboard/student/forum" className="glass-card flex flex-col items-center justify-center gap-3 p-6 hover:border-primary/50 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">{isClub ? dict.community : fullDict.nav?.forum || "Forum"}</span>
                </Link>

                <Link href="/dashboard/student/appointments" className="glass-card flex flex-col items-center justify-center gap-3 p-6 hover:border-primary/50 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">{isClub ? dict.private_meet : fullDict.nav?.appointments || "Rendez-vous"}</span>
                </Link>

                <Link href="/dashboard/student/profile" className="glass-card flex flex-col items-center justify-center gap-3 p-6 hover:border-primary/50 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-500/10 text-slate-500 flex items-center justify-center group-hover:bg-slate-500 group-hover:text-white transition-all shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">{dict.account}</span>
                </Link>
            </div>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)]/60 p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/35">{label}</p>
            <p className="mt-1 text-xl font-black text-[var(--foreground)]">{value}</p>
        </div>
    );
}
