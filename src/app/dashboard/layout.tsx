import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const role = session.user?.role;

    // Si admin ou teacher, on utilise simplement un wrapper minimal
    // Leur vrai layout est dans admin/layout.tsx et teacher/layout.tsx
    if (role === "ADMIN" || role === "TEACHER") {
        return <>{children}</>;
    }

    // ===== LAYOUT ÉTUDIANT — Expérience immersive =====
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-indigo-950/5 dark:to-indigo-950/20">

            {/* Desktop Sidebar — Étudiants */}
            <aside className="hidden md:flex w-72 flex-col bg-[var(--surface)]/80 backdrop-blur-3xl border-r border-white/20 dark:border-white/5 sticky top-0 h-screen z-50 shadow-2xl shadow-indigo-500/5">
                <div className="p-8 pb-4">
                    <div className="mb-6">
                        <Link href="/dashboard">
                            <LogoMark className="w-16 h-16" />
                        </Link>
                    </div>
                    <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Prime</h1>
                    <p className="text-[10px] uppercase tracking-widest font-black text-primary/60">Language Academy</p>
                </div>

                <div className="flex-1 overflow-y-auto px-4 mt-4">
                    <StudentSidebarNav />
                </div>

                <div className="p-6 m-4 mt-auto rounded-3xl bg-[var(--surface-hover)] border border-[var(--foreground)]/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-500 flex items-center justify-center font-black shadow-inner">
                        {session.user.name?.[0] || session.user.email?.[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-sm text-[var(--foreground)] truncate">{session.user.name || "Étudiant"}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Étudiant</p>
                    </div>
                </div>
            </aside>

            {/* Mobile Header (Student only) */}
            <div className="md:hidden flex flex-col w-full min-h-screen pb-24">
                <header className="sticky top-0 z-40 bg-[var(--surface)]/80 backdrop-blur-3xl border-b border-white/20 dark:border-white/5 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between shadow-sm">
                    <h1 className="text-xl sm:text-2xl font-black text-[var(--foreground)] flex items-center gap-3">
                        <LogoMark className="w-10 h-10" />
                        Prime
                    </h1>
                    <a href="/dashboard/student/profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-primary/20 flex items-center justify-center text-xs sm:text-sm font-bold text-primary shadow-sm hover:scale-105 transition-transform">
                        {session.user.name?.[0] || session.user.email?.[0].toUpperCase()}
                    </a>
                </header>

                {/* Main Content (Mobile) */}
                <main className="flex-1 p-4 sm:p-6 w-full">
                    {children}
                </main>

                {/* Bottom Navigation (Mobile — Student) */}
                <StudentMobileNav />
            </div>

            {/* Main Content (Desktop) */}
            <main className="hidden md:block flex-1 p-10 lg:p-14 w-full h-screen overflow-y-auto relative">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}

// ====== STUDENT NAV COMPONENTS ======

import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { StudentSidebarNavClient, StudentMobileNavClient } from "@/components/student-nav";

function StudentSidebarNav() {
    return <StudentSidebarNavClient />;
}

function StudentMobileNav() {
    return <StudentMobileNavClient />;
}
