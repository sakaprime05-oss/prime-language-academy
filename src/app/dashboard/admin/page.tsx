import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/app/actions/admin-stats";
import { getPaymentStats } from "@/app/actions/admin-payments";
import { StatsCharts } from "@/components/admin/StatsCharts";
import { prisma } from "@/lib/prisma";
import { PLA_CLUB_CAPACITY } from "@/lib/pla-program";
import Link from "next/link";

export default async function AdminDashboardPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/login");

    let stats = { totalRevenue: 0, overdueCount: 0 };
    let chartData = { revenueData: [], studentData: [], levelData: [] };
    let totalStudents = 0;
    let totalLevels = 0;
    let clubActive = 0;
    let clubPending = 0;
    let clubWaitlist = 0;

    try {
        const [s, c, studentCount, levelCount, activeCount, pendingCount, waitlistCount] = await Promise.all([
            getPaymentStats().catch(() => ({ totalRevenue: 0, overdueCount: 0 })),
            getAdminStats().catch(() => ({ revenueData: [], studentData: [], levelData: [] })),
            prisma.user.count({ where: { role: "STUDENT" } }).catch(() => 0),
            prisma.level.count().catch(() => 0),
            prisma.user.count({ where: { role: "STUDENT", registrationType: "CLUB", status: "ACTIVE" } }).catch(() => 0),
            prisma.user.count({ where: { role: "STUDENT", registrationType: "CLUB", status: "PENDING" } }).catch(() => 0),
            prisma.user.count({ where: { role: "STUDENT", registrationType: "CLUB", status: "WAITLIST" } }).catch(() => 0),
        ]);

        if (s) stats = s;
        if (c) chartData = c as any;
        totalStudents = studentCount;
        totalLevels = levelCount;
        clubActive = activeCount;
        clubPending = pendingCount;
        clubWaitlist = waitlistCount;
    } catch (e) {
        console.error("Dashboard data fetching error:", e);
    }

    const clubReserved = clubActive + clubPending;
    const clubRemaining = Math.max(0, PLA_CLUB_CAPACITY - clubReserved);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Tableau de Bord Admin</h2>
                    <p className="text-white/50 font-medium">Gestion globale de Prime Language Academy</p>
                </div>
                <div className="h-10 px-4 flex items-center bg-red-500/10 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest border border-red-500/20">
                    Live Stats
                </div>
            </header>

            {/* KPI Cards */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/admin/students" className="p-6 bg-[#12121e] rounded-2xl border border-white/5 group hover:scale-[1.02] transition-all">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Étudiants</p>
                    <p className="text-3xl font-black text-white">{totalStudents}</p>
                </Link>

                <Link href="/dashboard/admin/payments" className="p-6 bg-[#12121e] rounded-2xl border border-white/5 group hover:scale-[1.02] transition-all">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Revenus</p>
                    <p className="text-2xl font-black text-white">{stats.totalRevenue.toLocaleString()} <span className="text-[10px]">FCFA</span></p>
                </Link>

                <Link href="/dashboard/admin/payments" className="p-6 bg-[#12121e] rounded-2xl border border-white/5 group hover:scale-[1.02] transition-all">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Retards Paiement</p>
                    <p className="text-3xl font-black text-red-500">{stats.overdueCount}</p>
                </Link>

                <Link href="/dashboard/admin/courses" className="p-6 bg-[#12121e] rounded-2xl border border-white/5 group hover:scale-[1.02] transition-all">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Niveaux</p>
                    <p className="text-3xl font-black text-white">{totalLevels}</p>
                </Link>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <Link href="/dashboard/admin/club-waitlist" className="p-6 bg-[#12121e] rounded-2xl border border-red-500/10 group hover:border-red-500/30 transition-all">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[10px] font-black text-red-400/70 uppercase tracking-[0.2em] mb-3">English Club</p>
                            <h3 className="text-2xl font-black text-white">Capacite et liste d'attente</h3>
                            <p className="mt-2 text-sm text-white/45">Le Club reste limite a {PLA_CLUB_CAPACITY} membres. Les invitations ouvrent le paiement Paystack seulement quand une place est libre.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-xl bg-white/5 px-4 py-3">
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Pris</p>
                                <p className="mt-1 text-2xl font-black text-white">{clubReserved}</p>
                            </div>
                            <div className="rounded-xl bg-white/5 px-4 py-3">
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Libres</p>
                                <p className="mt-1 text-2xl font-black text-emerald-400">{clubRemaining}</p>
                            </div>
                            <div className="rounded-xl bg-white/5 px-4 py-3">
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Attente</p>
                                <p className="mt-1 text-2xl font-black text-amber-400">{clubWaitlist}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Analytics Charts */}
            <StatsCharts data={chartData} />

            {/* Quick Actions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-[#12121e] rounded-2xl border border-white/5">
                    <h3 className="text-xl font-black text-white mb-2">Gestion Pédagogique</h3>
                    <p className="text-sm text-white/50 mb-6">Créez et modifiez les modules, leçons et exercices.</p>
                    <Link href="/dashboard/admin/courses" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors">
                        Accéder au contenu
                    </Link>
                </div>

                <div className="p-8 bg-[#12121e] rounded-2xl border border-white/5">
                    <h3 className="text-xl font-black text-white mb-2">Gestion Étudiants</h3>
                    <p className="text-sm text-white/50 mb-6">Inscrivez, modifiez ou suspendez les comptes élèves.</p>
                    <Link href="/dashboard/admin/students" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#21286E] text-white font-bold hover:bg-[#2a348c] transition-colors">
                        Gérer les inscrits
                    </Link>
                </div>
            </section>
        </div>
    );
}
