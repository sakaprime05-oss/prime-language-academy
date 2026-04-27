import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/app/actions/admin-stats";
import { StatsCharts } from "@/components/admin/StatsCharts";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/login");

    const stats = await getPaymentStats();
    const chartData = await getAdminStats();
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
    const totalLevels = await prisma.level.count();
    
    // Aggregations for cards
    const totalTeachers = await prisma.user.count({ where: { role: "TEACHER" } });
    const totalSchedules = await (prisma as any).teacherSchedule.count();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Tableau de Bord Admin</h2>
                    <p className="text-[var(--foreground)]/50 font-medium">Gestion globale de Prime Language Academy</p>
                </div>
                <div className="flex gap-2">
                    <div className="h-10 px-4 flex items-center bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase tracking-widest">
                        Live Stats
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/admin/students" className="glass-card group hover:scale-[1.02] active:scale-95 transition-all">
                    <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-[0.2em] mb-3">Étudiants</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-[var(--foreground)]">{totalStudents}</p>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/admin/payments" className="glass-card group hover:scale-[1.02] active:scale-95 transition-all">
                    <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-[0.2em] mb-3">Revenus (Est.)</p>
                    <div className="flex items-end justify-between">
                        <p className="text-2xl font-black text-[var(--foreground)]">{stats.totalRevenue.toLocaleString()} <span className="text-[10px]">F</span></p>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/admin/payments" className="glass-card group hover:scale-[1.02] active:scale-95 transition-all">
                    <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-[0.2em] mb-3">Retards</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-red-500">{stats.overdueCount}</p>
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/admin/courses" className="glass-card group hover:scale-[1.02] active:scale-95 transition-all">
                    <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-[0.2em] mb-3">Niveaux</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-[var(--foreground)]">{totalLevels}</p>
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.246.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Analytics Dashboards */}
            <StatsCharts data={chartData} />

            {/* Quick Actions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black text-[var(--foreground)] mb-2">Gestion Pédagogique</h3>
                        <p className="text-sm text-[var(--foreground)]/50 mb-6">Créez et modifiez les modules, leçons et exercices.</p>
                    </div>
                    <Link href="/dashboard/admin/courses" className="btn-primary">
                        Accéder au contenu
                    </Link>
                </div>

                <div className="glass-card flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black text-[var(--foreground)] mb-2">Gestion Étudiants</h3>
                        <p className="text-sm text-[var(--foreground)]/50 mb-6">Inscrivez, modifiez ou suspendez les comptes élèves.</p>
                    </div>
                    <Link href="/dashboard/admin/students" className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--secondary), var(--accent))' }}>
                        Gérer les inscrits
                    </Link>
                </div>
            </section>
        </div>
    );
}
