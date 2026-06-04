import Link from "next/link";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/logout";
import { LogoMark } from "@/components/logo";
import ThemeToggle from "@/components/ThemeToggle";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user?.role !== "TEACHER") {
    if (session?.user?.role === "ADMIN") redirect("/dashboard/admin");
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <aside className="sticky top-0 z-50 hidden h-screen w-64 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] md:flex">
        <div className="border-b border-[var(--sidebar-border)] p-6 pb-3">
          <div className="flex items-center gap-3">
            <LogoMark className="h-16 w-16 sm:h-20 sm:w-20" />
            <div>
              <h1 className="text-lg font-black tracking-tight text-[var(--sidebar-foreground)]">Prime Teacher</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Espace Enseignant</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto px-3">
          <nav className="flex flex-col gap-1">
            <TeacherLink href="/dashboard/teacher" label="Dashboard">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </TeacherLink>
            <TeacherLink href="/dashboard/teacher#resources" label="Ressources">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </TeacherLink>
            <TeacherLink href="/dashboard/teacher/messages" label="Messagerie">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </TeacherLink>
            <div className="mx-2 my-2 h-px bg-[var(--sidebar-border)]" />
            <Link href="/dashboard/student/forum" className="flex items-center gap-3 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-3 text-sm font-bold lowercase italic text-[var(--primary)] transition-all hover:bg-[var(--primary)]/15">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              # English Club Forum
            </Link>
          </nav>
        </div>

        <div className="m-3 mt-auto flex items-center gap-3 rounded-xl border border-[var(--sidebar-border)] bg-[var(--sidebar-accent)] p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/15 text-sm font-bold text-[var(--primary)]">
            {session.user.name?.[0] || "T"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-[var(--sidebar-foreground)]">{session.user.name || "Professeur"}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Enseignant</p>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      <div className="flex min-h-screen w-full flex-col md:hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)]/95 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <LogoMark className="h-12 w-12" />
            <h1 className="text-lg font-black text-[var(--foreground)]">Teacher</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action={logoutAction}>
              <button type="submit" className="rounded-lg bg-[var(--primary)]/10 px-3 py-2 text-xs font-bold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/15">
                Déconnexion
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 bg-[var(--background)] p-5 text-[var(--foreground)]">{children}</main>
      </div>

      <main className="hidden h-screen w-full flex-1 overflow-y-auto bg-[var(--background)] p-8 text-[var(--foreground)] md:block lg:p-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

function TeacherLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-tighter text-[var(--sidebar-foreground)]/65 transition-all hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-foreground)]">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {children}
      </svg>
      {label}
    </Link>
  );
}
