import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/logout";
import { AdminMobileNav, AdminNav } from "@/components/admin-nav";
import { LogoMark } from "@/components/logo";
import ThemeToggle from "@/components/ThemeToggle";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const initials = session.user?.name
    ? session.user.name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "A";

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <aside className="sticky top-0 z-50 hidden h-screen w-[260px] shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] shadow-[var(--glass-shadow)] md:flex">
        <div className="border-b border-[var(--sidebar-border)] px-6 pb-5 pt-7">
          <div className="flex items-center gap-3">
            <LogoMark className="h-14 w-14 shrink-0" />
            <div>
              <p className="text-[15px] font-black leading-none tracking-tight text-[var(--sidebar-foreground)]">
                Prime Admin
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
                Back-office
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <AdminNav />
        </div>

        <div className="border-t border-[var(--sidebar-border)] p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--primary)]/15 bg-[var(--primary)]/10 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-black text-white shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[var(--sidebar-foreground)]">
                {session.user?.name || "Admin"}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--primary)]/70">
                Administrateur
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen w-full flex-col md:hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)]/95 px-5 py-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" />
            <div>
              <h1 className="text-base font-black text-[var(--foreground)]">Admin</h1>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--primary)]">
                Back-office
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-2 text-xs font-bold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/15"
              >
                Sortir
              </button>
            </form>
          </div>
        </header>
        <AdminMobileNav />
        <main className="flex-1 bg-[var(--background)] p-4 text-[var(--foreground)] sm:p-5">
          {children}
        </main>
      </div>

      <main className="hidden h-screen flex-1 flex-col overflow-y-auto bg-[var(--background)] md:flex">
        <div className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/88 px-10 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)] shadow-[0_0_8px_rgba(231,22,42,0.8)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Live · Prime Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 p-8 lg:p-12">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        title="Déconnexion"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--sidebar-border)] text-[var(--sidebar-foreground)]/45 transition-all hover:border-[var(--primary)]/25 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="sr-only">Déconnexion</span>
      </button>
    </form>
  );
}
