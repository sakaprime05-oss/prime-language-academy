import { auth } from "@/auth";
import { getSystemSettings } from "@/app/actions/system-settings";
import { LogoMark } from "@/components/logo";
import Link from "next/link";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const session = await auth();
  const systemSettings = await getSystemSettings();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start sm:justify-center px-3 py-4 sm:p-6 bg-[var(--background)] relative overflow-hidden">
      <div className="hidden sm:block bg-blob w-[500px] h-[500px] bg-primary -top-20 -left-20 animate-float opacity-10"></div>
      <div className="hidden sm:block bg-blob w-[400px] h-[400px] bg-secondary bottom-0 right-0 animate-float opacity-10" style={{ animationDelay: "-3s" }}></div>

      <div className="w-full max-w-3xl glass-card relative z-10 border-white/20 dark:border-white/10 shadow-2xl !p-4 sm:!p-8">
        <div className="text-center space-y-3 mb-6 sm:mb-8">
          <div className="mx-auto flex h-14 w-20 items-center justify-center rounded-2xl bg-white p-2.5 shadow-lg shadow-primary/15 ring-1 ring-black/5 sm:h-16 sm:w-24">
            <LogoMark className="h-9 w-14 sm:h-10 sm:w-16" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">Rejoindre Prime</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/40 mt-1">
              Établissement d'excellence
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Formation</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[var(--foreground)]/75">
              Programme structure pour progresser en anglais avec un niveau, des cours et un suivi pedagogique.
            </p>
          </div>
          <Link href="/register-club" className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 p-4 transition-colors hover:border-secondary/40 hover:bg-secondary/10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-secondary">English Club</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[var(--foreground)]/60">
              Espace membership pour pratiquer, echanger et rejoindre une communaute limitee a 26 membres.
            </p>
          </Link>
        </div>

        <RegisterForm systemSettings={systemSettings} />

        <div className="pt-8 flex flex-col items-center gap-4">
          <p className="text-xs font-bold text-[var(--foreground)]/50">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary hover:underline underline-offset-4">
              Se connecter
            </Link>
          </p>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--foreground)]/10 to-transparent"></div>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-[var(--foreground)]/30">
            © {new Date().getFullYear()} Precision Learning
          </p>
        </div>
      </div>
    </main>
  );
}
