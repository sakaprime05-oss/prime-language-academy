import { auth } from "@/auth";
import { getSystemSettings } from "@/app/actions/system-settings";
import { LogoMark } from "@/components/logo";
import Link from "next/link";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

const paymentBadges = ["Wave", "Orange", "MTN", "Moov", "Carte"];
const trustPoints = [
  "Test de niveau gratuit",
  "Supports numériques inclus",
  "Attestation en fin de session",
];

export default async function RegisterPage() {
  const session = await auth();
  const systemSettings = await getSystemSettings();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-3 py-4 text-[var(--foreground)] sm:p-6">
      <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <section className="hidden overflow-hidden rounded-lg border border-primary/15 bg-[#24110f] text-white shadow-xl shadow-primary/10 dark:bg-[#160b0a] lg:block">
          <div className="relative min-h-[520px] p-5 sm:p-7">
            <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />

            <div className="relative z-10 flex h-full min-h-[472px] flex-col">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3 text-white no-underline">
                  <span className="flex h-12 w-14 items-center justify-center rounded-xl bg-white p-2 shadow-lg">
                    <LogoMark className="h-8 w-10" />
                  </span>
                  <span className="text-[10px] font-black uppercase leading-4 tracking-[0.2em] text-white/65">
                    Prime Language<br />Academy
                  </span>
                </Link>
                <Link href="/login" className="rounded-full border border-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/75">
                  Connexion
                </Link>
              </div>

              <div className="mt-9 max-w-md">
                <p className="mb-3 inline-flex rounded-full border border-primary/35 bg-primary/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                  Session 21 juin - 19 août
                </p>
                <h1 className="font-[var(--font-lexend)] text-[2.4rem] font-black leading-[0.98] tracking-normal sm:text-5xl">
                  Rejoignez la formation qui vous fait parler anglais.
                </h1>
                <p className="mt-4 text-sm font-medium leading-7 text-white/68 sm:text-base">
                  Créez votre compte, choisissez votre rythme, puis sécurisez votre place en quelques minutes.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.08] p-3">
                  <p className="text-2xl font-black text-primary">2</p>
                  <p className="mt-1 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-white/55">mois de suivi</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.08] p-3">
                  <p className="text-2xl font-black text-primary">6</p>
                  <p className="mt-1 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-white/55">formules</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.08] p-3">
                  <p className="text-2xl font-black text-primary">0</p>
                  <p className="mt-1 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-white/55">frais cachés</p>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <div className="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Paiement disponible</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {paymentBadges.map((badge) => (
                      <span key={badge} className="rounded-full border border-white/10 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#291715]">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-xs font-bold text-white/70">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">✓</span>
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-primary/15 bg-white/80 p-4 shadow-sm backdrop-blur dark:bg-white/5 sm:p-6">
          <div className="mb-4 rounded-lg border border-primary/15 bg-primary/10 p-3 lg:hidden">
            <Link href="/" className="mb-3 flex items-center gap-3 text-[var(--foreground)] no-underline">
              <span className="flex h-11 w-14 items-center justify-center rounded-lg bg-white p-2 shadow-sm">
                <LogoMark className="h-7 w-10" />
              </span>
              <span className="text-[10px] font-black uppercase leading-4 tracking-[0.18em] text-[var(--foreground)]/55">
                Prime Language<br />Academy
              </span>
            </Link>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">Session 21 juin - 19 août</p>
            <p className="mt-1 text-sm font-bold leading-6 text-[var(--foreground)]/70">
              Inscrivez-vous à la formation et sécurisez votre place en quelques minutes.
            </p>
          </div>

          <div className="mb-4 flex items-start justify-between gap-4 sm:mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Inscription formation</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Réservez votre place</h2>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-[var(--foreground)]/55">
                Les informations demandées servent uniquement à orienter votre niveau, votre formule et vos horaires.
              </p>
            </div>
            <Link href="/register-club" className="hidden rounded-lg border border-[var(--foreground)]/10 px-4 py-3 text-right text-[10px] font-black uppercase leading-4 tracking-[0.14em] text-[var(--foreground)]/55 transition hover:border-primary/30 hover:text-primary sm:block">
              English Club
            </Link>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-3">
            <div className="rounded-lg border border-primary/25 bg-primary/10 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">Formation</p>
              <p className="mt-1 text-xs font-bold leading-5 text-[var(--foreground)]/70">Cours, suivi et plateforme inclus.</p>
            </div>
            <Link href="/register-club" className="rounded-lg border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 p-3 transition-colors hover:border-primary/30 hover:bg-primary/10">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--foreground)]/60">English Club</p>
              <p className="mt-1 text-xs font-bold leading-5 text-[var(--foreground)]/60">Pratique orale pour niveau fort.</p>
            </Link>
          </div>

          <RegisterForm systemSettings={systemSettings} />

          <div className="flex flex-col items-center gap-3 pt-6">
            <p className="text-xs font-bold text-[var(--foreground)]/50">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Se connecter
              </Link>
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[var(--foreground)]/25">
              Prime Language Academy
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
