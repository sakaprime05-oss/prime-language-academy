"use client";

import { useState } from "react";
import Link from "next/link";

const levels = [
  {
    id: "loisir",
    name: "Parcours Loisir",
    price: 50000,
    emoji: "🌱",
    tag: "Initiation",
    tagColor: "emerald",
    sessionsPerWeek: 1,
    description: "1 séance par semaine. Idéal pour s'initier ou maintenir un contact léger avec la langue.",
    fullDescription: "Le Parcours Loisir est la porte d'entrée idéale pour ceux qui souhaitent découvrir l'anglais sans pression. Avec 1 séance par semaine, vous avancez à votre rythme tout en bénéficiant de notre méthode ISO+. Ce parcours est parfait pour les personnes qui souhaitent garder un contact régulier avec la langue, que ce soit pour des voyages, la culture ou une simple curiosité.",
    features: ["Accès flexible", "Supports numériques inclus", "Attestation de formation"],
    for: ["Débutants complets", "Personnes très occupées", "Retraités & hobbyistes"],
    schedule: "1 séance × 2h / semaine",
    duration: "2 mois (8 séances)",
  },
  {
    id: "essentiel",
    name: "Parcours Essentiel",
    price: 70000,
    emoji: "📘",
    tag: "Populaire",
    tagColor: "blue",
    sessionsPerWeek: 2,
    description: "2 séances par semaine. Parfait pour construire des bases solides avec régularité.",
    fullDescription: "Le Parcours Essentiel est notre offre de référence. Avec 2 séances par semaine, vous progressez à un rythme soutenu et construisez des bases linguistiques durables. La régularité des séances permet une meilleure mémorisation et une progression visible dès la première session. Idéal pour les actifs qui souhaitent progresser efficacement sans sacrifier leur emploi du temps.",
    features: ["Programme structuré", "Suivi personnalisé", "Supports numériques inclus"],
    for: ["Professionnels actifs", "Étudiants", "Toute personne motivée"],
    schedule: "2 séances × 2h / semaine",
    duration: "2 mois (16 séances)",
  },
  {
    id: "equilibre",
    name: "Parcours Équilibre",
    price: 90000,
    emoji: "⚖️",
    tag: "Recommandé",
    tagColor: "indigo",
    sessionsPerWeek: 3,
    description: "3 séances par semaine. Le juste milieu pour progresser sereinement.",
    fullDescription: "Le Parcours Équilibre est le choix des apprenants sérieux qui veulent une transformation réelle sans excès. 3 séances par semaine permettent d'appliquer la méthode ISO+ dans toute sa puissance : Input régulier, Structuration claire, Output pratiqué 3x par semaine, et début de l'automatisation. Vous commencerez à penser en anglais bien avant la fin de la session.",
    features: ["Pratique orale renforcée", "Accès WiFi inclus", "Attestation certifiée"],
    for: ["Apprenants ambitieux", "Entrepreneurs", "Candidats TOEIC/IELTS"],
    schedule: "3 séances × 2h / semaine",
    duration: "2 mois (24 séances)",
  },
  {
    id: "performance",
    name: "Parcours Performance",
    price: 110000,
    emoji: "🚀",
    tag: "Intense",
    tagColor: "orange",
    sessionsPerWeek: 4,
    description: "4 séances par semaine. Pour ceux qui veulent des résultats tangibles rapidement.",
    fullDescription: "Le Parcours Performance passe à la vitesse supérieure. 4 séances par semaine créent une immersion quasi totale dans la langue. Les apprenants de ce parcours développent des réflexes rapides, une aisance à l'oral notable, et une compréhension nettement améliorée. Idéal avant une expatriation, un entretien international, ou une promotion professionnelle nécessitant l'anglais.",
    features: ["Immersion dynamique", "Corrections intensives", "Espace breakout accessible"],
    for: ["Cadres en mobilité", "Avant expatriation", "Objectif promotion professionnelle"],
    schedule: "4 séances × 2h / semaine",
    duration: "2 mois (32 séances)",
  },
  {
    id: "intensif",
    name: "Parcours Intensif",
    price: 130000,
    emoji: "🔥",
    tag: "Transformation",
    tagColor: "red",
    sessionsPerWeek: 5,
    description: "5 séances par semaine. Une transformation radicale de votre anglais.",
    fullDescription: "5 séances par semaine placent l'anglais au centre de votre semaine. C'est le rythme idéal pour une transformation rapide et profonde. À ce niveau, la méthode ISO+ atteint son plein potentiel : chaque jour apporte de nouveaux automatismes, et le cerveau de l'apprenant commence à « switcher » naturellement vers l'anglais dans les situations de la vie courante.",
    features: ["Quasi-quotidien", "Objectifs hebdomadaires", "Méthode ISO+ appliquée"],
    for: ["Personnes disponibles", "Avant un voyage long", "Objectif niveau B2+"],
    schedule: "5 séances × 2h / semaine",
    duration: "2 mois (40 séances)",
  },
  {
    id: "immersion",
    name: "Parcours Immersion",
    price: 150000,
    emoji: "🏆",
    tag: "Élite",
    tagColor: "amber",
    sessionsPerWeek: 6,
    description: "6 séances par semaine. L'élite de la formation pour une maîtrise totale.",
    fullDescription: "Le Parcours Immersion représente le sommet de notre offre. 6 séances par semaine, c'est une immersion comparable à un séjour linguistique, mais dans votre propre ville. Les apprenants bénéficient de l'attention maximale de nos formateurs, d'un suivi pas-à-pas, et d'une progression extrêmement rapide. En 2 mois, les apprenants passent généralement de A2 à B2, ou de B1 à C1.",
    features: ["Immersion totale", "Priorité aux séances", "Expertise formateurs premium"],
    for: ["Dirigeants", "Objectif excellence", "Besoin urgent de maîtrise totale"],
    schedule: "6 séances × 2h / semaine",
    duration: "2 mois (48 séances)",
  },
];

const tagColorMap: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function PricingSection() {
  const [selected, setSelected] = useState<(typeof levels)[0] | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <div
            key={level.id}
            className="glass-card flex flex-col justify-between group hover:border-primary/50 transition-all border-white/40 dark:border-white/5 relative overflow-hidden backdrop-blur-md"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-3xl">{level.emoji}</span>
                <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${tagColorMap[level.tagColor]}`}>
                  {level.tag}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--foreground)]">{level.name}</h3>
                <div className="mt-1 text-3xl font-black text-primary">
                  {level.price.toLocaleString()} <span className="text-base font-bold text-[var(--foreground)]/40">FCFA</span>
                </div>
                <p className="text-xs text-[var(--foreground)]/50 mt-3 font-medium leading-relaxed">
                  {level.description}
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-[var(--foreground)]/5">
                {level.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-tight">
                    <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 relative z-10 flex flex-col gap-2">
              <button
                onClick={() => setSelected(level)}
                className="w-full text-center text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl border border-[var(--foreground)]/10 hover:border-primary/40 hover:text-primary transition-all text-[var(--foreground)]/50"
              >
                En savoir plus
              </button>
              <Link
                href={`/register?plan=${level.id}`}
                className="w-full text-center flex items-center justify-center px-8 py-4 rounded-2xl bg-[var(--foreground)]/5 font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all"
              >
                Choisir ce parcours
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - En savoir plus */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[var(--surface,#1a1a2e)] border border-[var(--glass-border,rgba(255,255,255,0.1))] rounded-3xl p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--foreground)]/10 flex items-center justify-center hover:bg-[var(--foreground)]/20 transition-colors text-[var(--foreground)]/60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{selected.emoji}</span>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${tagColorMap[selected.tagColor]}`}>
                  {selected.tag}
                </span>
                <h2 className="text-2xl font-black text-[var(--foreground)] mt-1">{selected.name}</h2>
              </div>
            </div>

            {/* Price */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6 flex justify-between items-center">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-1">Investissement / session</div>
                <div className="text-3xl font-black text-primary">{selected.price.toLocaleString()} FCFA</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-1">Rythme</div>
                <div className="font-black text-[var(--foreground)]">{selected.sessionsPerWeek}x/semaine</div>
              </div>
            </div>

            {/* Full description */}
            <div className="mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Détail du parcours</h3>
              <p className="text-sm leading-relaxed text-[var(--foreground)]/70">{selected.fullDescription}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[var(--foreground)]/5 rounded-2xl p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-2">📅 Organisation</div>
                <div className="text-sm font-bold text-[var(--foreground)]">{selected.schedule}</div>
              </div>
              <div className="bg-[var(--foreground)]/5 rounded-2xl p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-2">⏱️ Durée</div>
                <div className="text-sm font-bold text-[var(--foreground)]">{selected.duration}</div>
              </div>
            </div>

            {/* For Who */}
            <div className="mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-3">Ce parcours est fait pour</h3>
              <ul className="space-y-2">
                {selected.for.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/70">
                    <span className="text-primary">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-3">Ce qui est inclus</h3>
              <ul className="space-y-2">
                {selected.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]/70">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <Link
              href={`/register?plan=${selected.id}`}
              className="w-full flex items-center justify-center py-4 px-6 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:opacity-90 transition-opacity"
              onClick={() => setSelected(null)}
            >
              S'inscrire à ce parcours (Inscription Offerte)
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
