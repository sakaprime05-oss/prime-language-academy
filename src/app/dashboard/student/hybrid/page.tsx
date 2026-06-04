import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, CalendarDays, ClipboardCheck, MonitorPlay, UsersRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PLA_CENTERS, PLA_HYBRID_TIME_SLOT, PLA_SESSION } from "@/lib/pla-program";
import { requireInitialPayment } from "@/lib/student-payment-gate";
import { getStudentPath, parseStudentProfileData } from "@/lib/student-profile";

const HYBRID_STEPS = [
  {
    title: "Supports plateforme",
    desc: "Ouvrez les PDF, exercices et ressources avant chaque séance pour préparer la pratique.",
    icon: BookOpen,
  },
  {
    title: "Pratique guidée",
    desc: "La vague du matin sert à transformer les notions en expression orale et écrite active.",
    icon: UsersRound,
  },
  {
    title: "Suivi et conseils",
    desc: "Utilisez les rendez-vous et la messagerie pour obtenir un accompagnement personnalisé.",
    icon: ClipboardCheck,
  },
  {
    title: "Visio et autonomie",
    desc: "Complétez le présentiel avec les rappels, conseils et échanges disponibles en ligne.",
    icon: MonitorPlay,
  },
];

export default async function StudentHybridPage() {
  const session = await auth();
  if (!session || session.user?.role !== "STUDENT") redirect("/login");
  await requireInitialPayment(session.user.id);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingData: true, registrationType: true, name: true },
  });

  const profile = parseStudentProfileData(user?.onboardingData);
  const path = getStudentPath(user?.registrationType, user?.onboardingData);
  const selectedCenter = PLA_CENTERS.find((center) => center.id === profile.centerId) || PLA_CENTERS[0];
  const days = profile.days?.length ? profile.days : ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  if (path !== "HYBRID") {
    return (
      <div className="platform-page animate-in fade-in duration-500">
        <section className="glass-card mx-auto max-w-2xl p-6 text-center sm:p-8">
          <p className="platform-eyebrow">Espace hybride</p>
          <h1 className="mt-2 text-2xl font-black text-[var(--foreground)]">Cet espace est réservé au parcours hybride.</h1>
          <p className="mt-3 text-sm font-bold leading-7 text-[var(--muted-foreground)]">
            Votre inscription actuelle n'est pas marquée comme Formation Hybride. Vous pouvez continuer avec vos cours ou contacter l'administration pour changer de parcours.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/dashboard/student/courses" className="rounded-xl border border-[var(--primary)]/25 px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--primary)]">
              Mes supports
            </Link>
            <Link href="/dashboard/student/messages" className="rounded-xl bg-[var(--primary)] px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--primary-foreground)]">
              Contacter l'admin
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="platform-page animate-in fade-in duration-500">
      <header className="platform-page-header">
        <p className="platform-eyebrow">Formation Hybride</p>
        <h1 className="platform-title">Votre espace du matin</h1>
        <p className="platform-subtitle">
          Un parcours qui combine supports numériques, pratique guidée, suivi et accompagnement visio pour progresser avec plus de rythme.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card overflow-hidden border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{PLA_SESSION.dates}</p>
              <h2 className="mt-2 text-2xl font-black text-[var(--foreground)]">{selectedCenter.name}</h2>
              <p className="mt-2 text-sm font-bold leading-7 text-[var(--muted-foreground)]">
                {selectedCenter.place}. {selectedCenter.address}
              </p>
            </div>
            <div className="rounded-2xl bg-primary px-5 py-4 text-center text-primary-foreground">
              <p className="text-[10px] font-black uppercase tracking-widest">{PLA_HYBRID_TIME_SLOT.label}</p>
              <p className="mt-1 text-2xl font-black">{PLA_HYBRID_TIME_SLOT.time}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {days.map((day) => (
              <div key={day} className="rounded-xl border border-[var(--foreground)]/10 bg-[var(--background)]/60 px-4 py-3">
                <p className="text-sm font-black text-[var(--foreground)]">{day}</p>
                <p className="mt-1 text-[11px] font-bold text-[var(--muted-foreground)]">{PLA_HYBRID_TIME_SLOT.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <CalendarDays size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Plan de suivi</p>
              <h2 className="text-lg font-black text-[var(--foreground)]">À faire chaque semaine</h2>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              "Préparer les supports PDF avant la séance.",
              "Participer aux exercices oraux pendant la vague 3.",
              "Noter les blocages dans le profil ou la messagerie.",
              "Réserver un rendez-vous si un point bloque la progression.",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 px-4 py-3 text-sm font-bold leading-6 text-[var(--foreground)]/70">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {HYBRID_STEPS.map(({ title, desc, icon: Icon }) => (
          <article key={title} className="glass-card p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={21} aria-hidden="true" />
            </div>
            <h3 className="text-base font-black text-[var(--foreground)]">{title}</h3>
            <p className="mt-2 text-xs font-bold leading-6 text-[var(--muted-foreground)]">{desc}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/dashboard/student/courses" className="rounded-2xl bg-primary px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-primary-foreground">
          Ouvrir les supports
        </Link>
        <Link href="/dashboard/student/appointments" className="rounded-2xl border border-primary/25 px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-primary">
          Réserver un suivi
        </Link>
        <Link href="/dashboard/student/forum" className="rounded-2xl border border-[var(--foreground)]/10 px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-[var(--foreground)]/70">
          Échanger avec les étudiants
        </Link>
      </section>
    </div>
  );
}
