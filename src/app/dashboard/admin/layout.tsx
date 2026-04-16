import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/app/actions/logout";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#0a0a12] flex">
            {/* Admin Sidebar — Style Back-Office */}
            <aside className="hidden md:flex w-64 flex-col bg-[#12121e] border-r border-white/5 sticky top-0 h-screen z-50">
                <div className="p-6 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center text-lg font-black">
                            A
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white tracking-tight">Prime Admin</h1>
                            <p className="text-[9px] uppercase tracking-widest font-bold text-red-400/60">Back-Office</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 mt-6">
                    <AdminNav />
                </div>

                <div className="p-4 m-3 mt-auto rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">
                        {session.user.name?.[0] || "A"}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate">{session.user.name || "Admin"}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Administrateur</p>
                    </div>
                </div>
            </aside>

            {/* Mobile Header (Admin) */}
            <div className="md:hidden flex flex-col w-full min-h-screen">
                <header className="sticky top-0 z-40 bg-[#12121e]/95 backdrop-blur-xl border-b border-white/5 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center text-sm font-black">A</div>
                        <h1 className="text-lg font-black text-white">Admin</h1>
                    </div>
                    <form action={logoutAction}>
                        <button type="submit" className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors">
                            Déconnexion
                        </button>
                    </form>
                </header>

                {/* Admin Mobile Nav */}
                <div className="bg-[#12121e] border-b border-white/5 px-4 py-2 flex gap-2 overflow-x-auto">
                    <AdminMobileLinks />
                </div>

                <main className="flex-1 p-5 bg-[#0a0a12] text-white">
                    {children}
                </main>
            </div>

            {/* Main Content (Desktop) */}
            <main className="hidden md:block flex-1 p-8 lg:p-12 w-full h-screen overflow-y-auto bg-[#0a0a12] text-white">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function AdminMobileLinks() {
    const links = [
        { href: "/dashboard/admin", label: "Dashboard" },
        { href: "/dashboard/admin/teachers", label: "Enseignants" },
        { href: "/dashboard/admin/calendar", label: "Calendrier" },
        { href: "/dashboard/admin/students", label: "Étudiants" },
        { href: "/dashboard/admin/courses", label: "Cours" },
        { href: "/dashboard/admin/resources", label: "Documents" },
        { href: "/dashboard/admin/payments", label: "Paiements" },
        { href: "/dashboard/admin/appointments", label: "Rendez-vous" },
        { href: "/dashboard/admin/settings", label: "Paramètres" },
    ];
    return (
        <>
            {links.map(link => (
                <Link key={link.href} href={link.href} className="text-[10px] font-bold uppercase tracking-wider text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg whitespace-nowrap transition-colors">
                    {link.label}
                </Link>
            ))}
        </>
    );
}
