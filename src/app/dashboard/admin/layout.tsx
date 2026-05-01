import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/logout";
import { AdminNav } from "@/components/admin-nav";
import { LogoMark } from "@/components/logo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const initials = session.user?.name
        ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
        : "A";

    return (
        <div className="min-h-screen flex" style={{ background: "#07070f", color: "#F0EDE8" }}>

            {/* ── PREMIUM ADMIN SIDEBAR ── */}
            <aside className="hidden md:flex w-[260px] flex-col sticky top-0 h-screen z-50 shrink-0" style={{
                background: "linear-gradient(180deg, #0d0d1a 0%, #0a0a14 100%)",
                borderRight: "1px solid rgba(231,22,42,0.1)",
                boxShadow: "4px 0 40px rgba(0,0,0,0.5)",
            }}>

                {/* Logo area */}
                <div className="px-6 pt-7 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center gap-3">
                        <LogoMark className="w-14 h-14 shrink-0" />
                        <div>
                            <p className="text-white font-black text-[15px] tracking-tight leading-none">Prime Admin</p>
                            <p className="text-[9px] uppercase tracking-[0.25em] font-bold mt-1" style={{ color: "#E7162A" }}>Back-Office</p>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <div className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
                    <AdminNav />
                </div>

                {/* User card */}
                <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "rgba(231,22,42,0.06)", border: "1px solid rgba(231,22,42,0.12)" }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0" style={{ background: "linear-gradient(135deg, #E7162A, #B30012)", boxShadow: "0 4px 12px rgba(231,22,42,0.3)" }}>
                            {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">{session.user?.name || "Admin"}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(231,22,42,0.6)" }}>Administrateur</p>
                        </div>
                        <form action={logoutAction}>
                            <button type="submit" title="Déconnexion" className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110" style={{ color: "rgba(255,255,255,0.3)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#E7162A")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* ── MOBILE LAYOUT ── */}
            <div className="md:hidden flex flex-col w-full min-h-screen">
                <header className="sticky top-0 z-40 px-5 py-4 flex items-center justify-between" style={{
                    background: "rgba(10,10,20,0.95)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(231,22,42,0.1)",
                }}>
                    <div className="flex items-center gap-3">
                        <LogoMark className="w-10 h-10" />
                        <h1 className="text-base font-black text-white">Admin</h1>
                    </div>
                    <form action={logoutAction}>
                        <button type="submit" className="text-xs font-bold px-3 py-2 rounded-xl transition-colors" style={{ color: "#E7162A", background: "rgba(231,22,42,0.1)", border: "1px solid rgba(231,22,42,0.2)" }}>
                            Déconnexion
                        </button>
                    </form>
                </header>
                <main className="flex-1 p-5" style={{ background: "#07070f", color: "#F0EDE8" }}>
                    {children}
                </main>
            </div>

            {/* ── MAIN CONTENT (Desktop) ── */}
            <main className="hidden md:flex flex-col flex-1 h-screen overflow-y-auto" style={{ background: "#07070f" }}>
                {/* Top bar */}
                <div className="sticky top-0 z-30 px-10 py-4 flex items-center justify-between shrink-0" style={{
                    background: "rgba(7,7,15,0.85)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#E7162A", boxShadow: "0 0 8px rgba(231,22,42,0.8)" }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(240,237,232,0.3)" }}>Live · Prime Admin</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(240,237,232,0.25)" }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    </div>
                </div>

                {/* Page content */}
                <div className="flex-1 p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
