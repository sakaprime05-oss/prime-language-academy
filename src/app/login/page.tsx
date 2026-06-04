import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { LogoMark } from "@/components/logo";
import ThemeToggle from "@/components/ThemeToggle";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-app-shell relative flex min-h-[100svh] flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[var(--primary)]/10 blur-3xl dark:bg-[var(--primary)]/15" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[var(--primary)]/5 blur-3xl dark:bg-[var(--primary)]/10" />

      <div className="relative z-10 flex min-h-[100svh] w-full flex-col px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:items-center sm:justify-center sm:p-6">
        <header className="mb-5 flex items-center justify-between sm:hidden">
          <Link href="/" className="flex items-center gap-3 text-[var(--foreground)] no-underline">
            <span className="flex h-11 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-sm">
              <LogoMark className="h-7 w-8" />
            </span>
            <span className="text-[10px] font-black uppercase leading-4 tracking-[0.18em] text-[var(--muted-foreground)]">
              Prime<br />Academy
            </span>
          </Link>
          <ThemeToggle />
        </header>

        <section className="auth-login-card relative mx-auto flex w-full max-w-sm flex-1 flex-col justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl shadow-black/5 dark:shadow-black/30 sm:flex-none sm:p-6">
          <div className="absolute right-4 top-4 hidden sm:block">
            <ThemeToggle />
          </div>

          <div className="mb-8 space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 shadow-sm sm:h-24 sm:w-24 sm:p-4">
              <LogoMark className="h-14 w-14 sm:h-16 sm:w-16" />
            </div>
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">Espace membre</p>
              <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">Prime Academy</h1>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Plateforme d'excellence
              </p>
            </div>
          </div>

          <LoginForm />

          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} Prime Language Academy
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
