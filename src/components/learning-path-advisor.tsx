import Link from "next/link";
import { ArrowRight, Clock, MapPin, MessageCircle, Moon, Sparkles, SunMedium } from "lucide-react";
import { PLA_CENTERS, PLA_HYBRID_TIME_SLOT, PLA_ONLINE_TIME_SLOT, PLA_TIME_SLOTS } from "@/lib/pla-program";

const programme6 = PLA_CENTERS.find((center) => center.id === "programme-6") || PLA_CENTERS[0];
const poincare = PLA_CENTERS.find((center) => center.id === "poincare") || PLA_CENTERS[1] || programme6;

const PATHS = [
  {
    id: "regular",
    icon: Moon,
    eyebrow: "Je debute ou je veux progresser",
    title: "Formation Hybride Soir / En ligne",
    center: programme6,
    schedule: `${PLA_TIME_SLOTS[0].label} ou ${PLA_TIME_SLOTS[1].label} · ${PLA_ONLINE_TIME_SLOT.label} ${PLA_ONLINE_TIME_SLOT.time}`,
    text: "Le choix le plus simple pour apprendre avec un cadre clair, des bases solides, des ressources numériques et un rythme compatible avec la journée.",
    href: "/register?center=programme-6",
    cta: "Reserver ce parcours",
    featured: true,
  },
  {
    id: "club",
    icon: MessageCircle,
    eyebrow: "J'ai deja un bon niveau",
    title: "Club d'Anglais",
    center: poincare,
    schedule: `${poincare.name} · pratique, réseau, immersion`,
    text: "Pour parler plus naturellement, garder le rythme, rencontrer d'autres profils et pratiquer dans un cadre premium.",
    href: "/register-club?center=poincare",
    cta: "Demander l'acces Club",
    featured: false,
  },
  {
    id: "hybrid",
    icon: SunMedium,
    eyebrow: "Je suis disponible le matin",
    title: "Formation Hybride",
    center: poincare,
    schedule: `${PLA_HYBRID_TIME_SLOT.label} · ${PLA_HYBRID_TIME_SLOT.time}`,
    text: "Un format intensif pour avancer le matin avec ressources numeriques, suivi et pratique accompagnee.",
    href: "/register?path=hybrid&center=poincare",
    cta: "Choisir l'hybride",
    featured: false,
  },
];

export function LearningPathAdvisor({ className = "" }: { className?: string }) {
  return (
    <section className={`rounded-[1.75rem] border border-[var(--primary)]/20 bg-[var(--card)]/90 p-4 text-[var(--foreground)] shadow-xl shadow-black/5 backdrop-blur sm:p-6 ${className}`}>
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--primary)]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Orientation rapide
          </p>
          <h2 className="text-2xl font-black leading-tight sm:text-3xl">Choisissez le bon parcours sans vous tromper.</h2>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            Trois chemins simples: Formation Hybride soir/en ligne, English Club pour les profils forts, ou Formation Hybride du matin.
          </p>
          <div className="rounded-2xl border border-[var(--primary)]/15 bg-[var(--primary)]/10 p-4 text-sm leading-7 text-[var(--muted-foreground)]">
            <strong className="text-[var(--foreground)]">Conseil:</strong> si vous hésitez, commencez par la Formation Hybride. Le test de niveau permet ensuite d'ajuster le groupe et de vérifier si le Club est plus adapté.
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {PATHS.map((path) => {
            const Icon = path.icon;

            return (
              <article
                key={path.id}
                className={`flex min-h-[25rem] flex-col rounded-2xl border p-4 transition hover:-translate-y-1 ${
                  path.featured
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-[var(--border)] bg-[var(--background)]/60"
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--primary)] text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {path.featured && (
                    <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white">
                      Recommande
                    </span>
                  )}
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--primary)]">{path.eyebrow}</p>
                <h3 className="mt-2 text-xl font-black leading-tight">{path.title}</h3>
                <div className="mt-4 space-y-3 text-xs font-bold text-[var(--foreground)]/75">
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                    <span>
                      {path.center.name}
                      <span className="block font-medium leading-5 text-[var(--muted-foreground)]">{path.center.place}</span>
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                    <span>{path.schedule}</span>
                  </p>
                </div>
                <p className="mt-4 flex-1 text-sm leading-7 text-[var(--muted-foreground)]">{path.text}</p>
                <Link
                  href={path.href}
                  className={`mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] transition ${
                    path.featured
                      ? "bg-[var(--primary)] text-white hover:brightness-110"
                      : "border border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                  }`}
                >
                  {path.cta}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
