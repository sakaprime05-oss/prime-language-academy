import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/app/actions/logout";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session || session.user?.role !== "TEACHER") {
        if (session?.user?.role === "ADMIN") redirect("/dashboard/admin");
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#0a0f15] flex">
            {/* Teacher Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-[#101820] border-r border-white/5 sticky top-0 h-screen z-50">
                <div className="p-6 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center text-lg font-black">
                            T
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white tracking-tight">Prime Teacher</h1>
                            <p className="text-[10px] uppercase tracking-widest font-black text-teal-300">Espace Enseignant</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 mt-6">
                    <nav className="flex flex-col gap-1">
                        <Link href="/dashboard/teacher" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all uppercase tracking-tighter">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Dashboard
                        </Link>
                        <Link href="/dashboard/teacher#resources" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all uppercase tracking-tighter">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Ressources
                        </Link>
                        <Link href="/dashboard/teacher/messages" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all uppercase tracking-tighter">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            Messagerie
                        </Link>
                        <div className="h-px bg-white/5 my-2 mx-2"></div>
                        <Link href="/dashboard/student/forum" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 transition-all lowercase italic">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                            # English Club Forum
                        </Link>
                    </nav>
                </div>

                <div className="p-4 m-3 mt-auto rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                        {session.user.name?.[0] || "T"}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate">{session.user.name || "Professeur"}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-teal-300">Enseignant</p>
                    </div>
                </div>
            </aside>

            {/* Mobile Header (Teacher) */}
            <div className="md:hidden flex flex-col w-full min-h-screen">
                <header className="sticky top-0 z-40 bg-[#101820]/95 backdrop-blur-xl border-b border-white/5 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-black">T</div>
                        <h1 className="text-lg font-black text-white">Teacher</h1>
                    </div>
                    <form action={logoutAction}>
                        <button type="submit" className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-2 rounded-lg hover:bg-teal-500/20 transition-colors">
                            Déconnexion
                        </button>
                    </form>
                </header>

                <main className="flex-1 p-5 bg-[#0a0f15] text-white">
                    {children}
                </main>
            </div>

            {/* Main Content (Desktop) */}
            <main className="hidden md:block flex-1 p-8 lg:p-12 w-full h-screen overflow-y-auto bg-[#0a0f15] text-white">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
