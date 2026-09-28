"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PLA_PRICING_NOTES,
  PLA_PRICING_TABLE,
  PLA_SESSION,
  formatFcfa,
  type PlaModeId,
  type PlaPlan,
} from "@/lib/pla-program";

type PlanCard = PlaPlan & {
  programName: string;
  modeTitle: string;
  emoji: string;
  tag: string;
  tagColor: string;
  description: string;
  fullDescription: string;
  features: string[];
  audience: string[];
  schedule: string;
  duration: string;
  registerHref: string;
};

const tagColorMap: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const MODE_EMOJI: Record<PlaModeId, string> = {
  PRESENTIEL: "🏢",
  ONLINE: "💻",
  WEEKEND: "🗓️",
};

const REGULAR_FEATURES = [
  "Méthode ISO+ appliquée à chaque séance",
  "Documentation pédagogique offerte",
  "Accès plateforme & suivi de progression",
];

const CLUB_FEATURES = [
  "English Only Environment",
  "Débats, jeux de rôle & storytelling",
  "Modules ESP (anglais de spécialité)",
];

const WEEKEND_FEATURES = [
  "4h de pratique intensive par weekend",
  "Format hybride: centre ou visioconférence",
  "Idéal pour les emplois du temps chargés",
];

function buildCards(): PlanCard[] {
  const cards: PlanCard[] = [];

  for (const group of PLA_PRICING_TABLE) {
    for (const row of group.rows) {
      for (const plan of row.plans) {
        const isClub = plan.program === "CLUB";
        const isWeekend = plan.program === "WEEKEND";
        const weekly = plan.sessions * 2;

        cards.push({
          ...plan,
          programName: row.name,
          modeTitle: group.title,
          emoji: MODE_EMOJI[plan.mode],
          tag: isWeekend ? "Weekend" : group.title,
          tagColor: isWeekend ? "amber" : isClub ? "indigo" : plan.mode === "ONLINE" ? "blue" : "emerald",
          description: isWeekend
            ? "Une séance de 4h le samedi ou le dimanche, de 10h00 à 14h00, au Centre Poincaré ou en visioconférence."
            : `${plan.freq} de 2h, ${group.title.toLowerCase()}, sur le cycle de 2 mois.`,
          fullDescription: isWeekend
            ? "La Formule Weekend Hybride condense la semaine en une séance intensive de 4h. Structuration le matin, pratique guidée au format Club ensuite, puis prolongement sur la plateforme entre deux weekends. C'est le format des professionnels qui ne peuvent pas se libérer en semaine."
            : isClub
              ? `Le Club d'Anglais est un environnement 100% anglophone réservé aux profils de niveau Autonome et plus. Avec ${plan.freq.toLowerCase()}, vous entretenez et professionnalisez votre anglais par la pratique: débats, simulations professionnelles, storytelling, networking et modules ESP.`
              : `La Formation Régulière suit la méthode ISO+ (Input, Structuration, Output, Automatisation). Avec ${plan.freq.toLowerCase()} de 2h, vous progressez d'un palier par cycle de 2 mois: Débutant vers Autonome, Autonome vers Mastery, puis Mastery Professionnel.`,
          features: isWeekend ? WEEKEND_FEATURES : isClub ? CLUB_FEATURES : REGULAR_FEATURES,
          audience: isWeekend
            ? ["Professionnels très occupés", "Apprenants hors d'Abidjan", "Reprise en douceur"]
            : isClub
              ? ["Niveau Autonome et plus", "Anciens apprenants PLA", "Cadres & entrepreneurs"]
              : ["Débutants complets", "Faux débutants", "Candidats IELTS / TOEFL"],
          schedule: isWeekend
            ? "1 séance × 4h / weekend (samedi ou dimanche, 10h00 - 14h00)"
            : `${plan.sessions} séances × 2h / semaine (16h-18h ou 18h-20h)`,
          duration: isWeekend
            ? "Cycle de 2 mois (8 séances de 4h)"
            : `Cycle de 2 mois (${plan.sessions * 8} séances, ${weekly}h / semaine)`,
          registerHref: isClub
            ? `/register-club?plan=${plan.id}`
            : `/register?plan=${plan.id}${isWeekend ? "&path=hybrid" : ""}`,
        });
      }
    }
  }

  return cards;
}

const CARDS = buildCards();
const GROUPS = PLA_PRICING_TABLE.map((group) => ({
  id: group.id,
  title: group.title,
  subtitle: group.subtitle,
  emoji: group.emoji,
  cards: CARDS.filter((card) => card.mode === group.mode),
}));

export default function PricingSection() {
  const [selected, setSelected] = useState<PlanCard | null>(null);

  return (
    <>
      <div className="flex flex-col gap-12">
        {GROUPS.map((group) => (
          <div key={group.id}>
            <div className="mb-5 flex items-baseline gap-3">
              <span className="text-2xl">{group.emoji}</span>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-[var(--foreground)]">{group.title}</h3>
                <p className="text-xs font-medium text-[var(--foreground)]/50">{group.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {group.cards.map((card) => (
                <div
                  key={card.id}
                  className="glass-card group relative flex flex-col justify-between overflow-hidden border-white/40 backdrop-blur-md transition-all hover:border-primary/50 dark:border-white/5"
                >
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{card.emoji}</span>
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${tagColorMap[card.tagColor]}`}>
                        {card.tag}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">{card.programName}</p>
                      <h3 className="mt-1 text-xl font-black text-[var(--foreground)]">{card.label}</h3>
                      <div className="mt-1 text-3xl font-black text-primary">
                        {card.price.toLocaleString("fr-FR")} <span className="text-base font-bold text-[var(--foreground)]/40">FCFA</span>
                      </div>
                      <p className="mt-3 text-xs font-medium leading-relaxed text-[var(--foreground)]/50">{card.description}</p>
                    </div>
                    <ul className="space-y-2 border-t border-[var(--foreground)]/5 pt-4">
                      {card.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-[var(--foreground)]/70">
                          <svg className="h-3 w-3 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative z-10 flex flex-col gap-2 pt-6">
                    <button
                      onClick={() => setSelected(card)}
                      className="w-full rounded-xl border border-[var(--foreground)]/10 px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 transition-all hover:border-primary/40 hover:text-primary"
                    >
                      En savoir plus
                    </button>
                    <Link
                      href={card.registerHref}
                      className="flex w-full items-center justify-center rounded-2xl bg-[var(--foreground)]/5 px-8 py-4 text-center text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary hover:text-white"
                    >
                      Choisir cette formule
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ul className="mt-10 grid gap-2 rounded-2xl border border-primary/15 bg-primary/5 p-5">
        {PLA_PRICING_NOTES.map((note) => (
          <li key={note} className="flex items-start gap-2 text-xs font-bold leading-5 text-[var(--foreground)]/70">
            <span className="text-primary">•</span> {note}
          </li>
        ))}
      </ul>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[var(--glass-border,rgba(255,255,255,0.1))] bg-[var(--surface,#1a1a2e)] p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--foreground)]/10 text-[var(--foreground)]/60 transition-colors hover:bg-[var(--foreground)]/20"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6 flex items-center gap-4">
              <span className="text-4xl">{selected.emoji}</span>
              <div>
                <span className={`rounded border px-2 py-1 text-[10px] font-black uppercase tracking-widest ${tagColorMap[selected.tagColor]}`}>
                  {selected.programName} · {selected.modeTitle}
                </span>
                <h2 className="mt-1 text-2xl font-black text-[var(--foreground)]">{selected.label}</h2>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div>
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Investissement / cycle de 2 mois</div>
                <div className="text-3xl font-black text-primary">{formatFcfa(selected.price)}</div>
              </div>
              <div className="text-right">
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Rythme</div>
                <div className="font-black text-[var(--foreground)]">{selected.shortFreq}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-[10px] font-black uppercase tracking-widest text-primary">Détail de la formule</h3>
              <p className="text-sm leading-relaxed text-[var(--foreground)]/70">{selected.fullDescription}</p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[var(--foreground)]/5 p-4">
                <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">📅 Organisation</div>
                <div className="text-sm font-bold text-[var(--foreground)]">{selected.schedule}</div>
              </div>
              <div className="rounded-2xl bg-[var(--foreground)]/5 p-4">
                <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">⏱️ Durée</div>
                <div className="text-sm font-bold text-[var(--foreground)]">{selected.duration}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Cette formule est faite pour</h3>
              <ul className="space-y-2">
                {selected.audience.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/70">
                    <span className="text-primary">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="mb-3 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Ce qui est inclus</h3>
              <ul className="space-y-2">
                {selected.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]/70">
                    <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mb-4 text-center text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">
              {PLA_SESSION.label} · Frais d&apos;inscription offerts
            </p>

            <Link
              href={selected.registerHref}
              className="flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              onClick={() => setSelected(null)}
            >
              S&apos;inscrire (inscription offerte)
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
