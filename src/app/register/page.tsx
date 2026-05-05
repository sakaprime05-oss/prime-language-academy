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
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[var(--background)] px-3 py-4 sm:justify-center sm:p-6">
      <div className="hidden sm:block bg-blob w-[500px] h-[500px] bg-primary -top-20 -left-20 animate-float opacity-10"></div>
      <div className="hidden sm:block bg-blob w-[400px] h-[400px] bg-secondary bottom-0 right-0 animate-float opacity-10" style={{ animationDelay: "-3s" }}></div>

      <div className="glass-card relative z-10 w-full max-w-3xl border-white/20 !p-4 shadow-sm dark:border-white/10 sm:!p-8">
        <div className="mb-4 space-y-2 text-center sm:mb-8 sm:space-y-3">
          <div className="mx-auto flex h-12 w-16 items-center justify-center rounded-lg bg-white p-2 shadow-sm shadow-primary/10 ring-1 ring-black/5 sm:h-16 sm:w-24 sm:rounded-xl sm:p-2.5">
            <LogoMark className="h-8 w-12 sm:h-10 sm:w-16" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">Rejoindre Prime</h1>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/40 sm:text-[10px]">
              Établissement d'excellence
            </p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-3">
          <div className="rounded-lg border border-primary/25 bg-primary/10 p-3 sm:p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-primary sm:text-[10px]">Formation</p>
            <p className="mt-1 text-xs font-bold leading-5 text-[var(--foreground)]/75 sm:mt-2 sm:text-sm sm:leading-6">
              <span className="sm:hidden">Cours + suivi</span>
              <span className="hidden sm:inline">Programme structure pour progresser en anglais avec un niveau, des cours et un suivi pedagogique.</span>
            </p>
          </div>
          <Link href="/register-club" className="rounded-lg border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 p-3 transition-colors hover:border-primary/30 hover:bg-primary/10 sm:p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--foreground)]/70 sm:text-[10px]">English Club</p>
            <p className="mt-1 text-xs font-bold leading-5 text-[var(--foreground)]/60 sm:mt-2 sm:text-sm sm:leading-6">
              <span className="sm:hidden">Pratique orale</span>
              <span className="hidden sm:inline">Espace membership pour pratiquer, echanger et rejoindre une communaute limitee a 26 membres.</span>
            </p>
          </Link>
        </div>

        <RegisterForm systemSettings={systemSettings} />

        <div className="flex flex-col items-center gap-4 pt-6 sm:pt-8">
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
