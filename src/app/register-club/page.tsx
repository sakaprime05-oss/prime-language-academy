import { auth } from "@/auth";
import { LogoMark } from "@/components/logo";
import Link from "next/link";
import { redirect } from "next/navigation";
import RegisterClubForm from "./register-club-form";
import { prisma } from "@/lib/prisma";
import { PLA_CLUB_CAPACITY } from "@/lib/pla-program";

export default async function RegisterClubPage({ searchParams }: { searchParams?: Promise<{ level?: string }> }) {
  const session = await auth();
  const params = await searchParams;

  if (session) {
    redirect("/dashboard");
  }

  const activeClubMembers = await prisma.user.count({
    where: {
      registrationType: "CLUB",
      status: { in: ["PENDING", "ACTIVE"] },
    },
  });
  const remainingSeats = Math.max(0, PLA_CLUB_CAPACITY - activeClubMembers);
  const isWaitlistMode = remainingSeats === 0;
  const initialLevel = params?.level?.toLowerCase().includes("avanc")
    ? "Avancé (C1/C2)"
    : params?.level?.toLowerCase().includes("inter")
      ? "Intermédiaire (B1/B2)"
      : "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:p-6 bg-[var(--background)] relative overflow-hidden">
      <div className="bg-blob w-[500px] h-[500px] bg-secondary -top-20 -left-20 animate-float opacity-10"></div>
      <div className="bg-blob w-[400px] h-[400px] bg-primary bottom-0 right-0 animate-float opacity-10" style={{ animationDelay: "-3s" }}></div>

      <div className="w-full max-w-5xl relative z-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <section className="glass-card border-secondary/20 bg-[#0D0D14] text-[#F5F0E8] shadow-2xl">
          <div className="space-y-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-secondary/70">Membership privé</p>
            <h2 className="text-3xl font-black leading-tight">The English Club est limité à 26 membres.</h2>
            <p className="text-sm leading-7 text-[#F5F0E8]/60">
              Pour garder des échanges utiles, un vrai suivi et une communauté premium, les inscriptions Club sont volontairement limitées.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-secondary/15 bg-white/[0.04] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#F5F0E8]/40">Capacité</p>
                <p className="mt-1 text-3xl font-black text-secondary">{PLA_CLUB_CAPACITY}</p>
              </div>
              <div className="rounded-2xl border border-secondary/15 bg-white/[0.04] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#F5F0E8]/40">{isWaitlistMode ? "Statut" : "Places"}</p>
                <p className="mt-1 text-3xl font-black text-secondary">{isWaitlistMode ? "Liste" : remainingSeats}</p>
              </div>
            </div>
            <p className="rounded-2xl border border-secondary/15 bg-secondary/10 p-4 text-xs font-bold leading-6 text-[#F5F0E8]/75">
              {isWaitlistMode
                ? "Le Club est complet. Votre demande sera enregistrée en liste d'attente, sans paiement immédiat."
                : "Votre paiement réserve votre place. Une fois les 26 places atteintes, les nouvelles demandes passent en liste d'attente."}
            </p>
          </div>
        </section>

        <section className="glass-card border-secondary/20 shadow-2xl">
          <div className="text-center space-y-4 mb-8">
            <div className="mx-auto flex h-16 w-24 items-center justify-center rounded-2xl bg-white p-2.5 shadow-lg shadow-secondary/15 ring-1 ring-black/5">
              <LogoMark className="h-10 w-16" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">The English Club</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mt-1">
                {isWaitlistMode ? "Liste d'attente" : "Cercle privé - Membership"}
              </p>
            </div>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <Link href="/register" className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 p-4 transition-colors hover:border-primary/40 hover:bg-primary/10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Formation</p>
              <p className="mt-2 text-sm font-bold leading-6 text-[var(--foreground)]/60">
                Cours structurés, niveau, progression et accompagnement pédagogique.
              </p>
            </Link>
            <div className="rounded-2xl border border-secondary/25 bg-secondary/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-secondary">English Club</p>
              <p className="mt-2 text-sm font-bold leading-6 text-[var(--foreground)]/75">
                Pratique conversationnelle, communauté privée et places limitées.
              </p>
            </div>
          </div>

          <RegisterClubForm isWaitlistMode={isWaitlistMode} remainingSeats={remainingSeats} initialLevel={initialLevel} />

          <div className="pt-8 flex flex-col items-center gap-4">
            <p className="text-xs font-bold text-[var(--foreground)]/50">
              Déjà membre ?{" "}
              <Link href="/login" className="text-secondary hover:underline underline-offset-4">
                Se connecter
              </Link>
            </p>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--foreground)]/10 to-transparent"></div>
            <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-[var(--foreground)]/30">
              © {new Date().getFullYear()} Prime Language Academy
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
