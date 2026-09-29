import Link from "next/link";
import { Download } from "lucide-react";
import { InstallAppButton } from "@/components/install-app-button";
import { LearningPathAdvisor } from "@/components/learning-path-advisor";
import {
    PLA_AMENITIES,
    PLA_CENTERS,
    PLA_CORPORATE,
    PLA_CYCLES,
    PLA_EARLY_ACCESS,
    PLA_ESP,
    PLA_FAQ,
    PLA_LEVEL_PATH,
    PLA_LEVEL_PROMISE,
    PLA_METHOD,
    PLA_ONLINE_CENTER,
    PLA_PRICING_NOTES,
    PLA_PRICING_TABLE,
    PLA_PROGRAMS,
    PLA_SESSION,
    PLA_TIME_SLOTS,
    PLA_WEEKEND_TIME_SLOT,
    PLA_WEEK_RHYTHM,
    formatFcfa,
} from "@/lib/pla-program";

export const metadata = {
    title: "Programme officiel 2026 | Prime Language Academy",
    description: `Livret complet des offres Prime Language Academy: Formation Régulière, Club d'Anglais, Weekend Hybride, modules ESP, tarifs, plannings et méthode ISO+. Cycle ${PLA_SESSION.shortDates}.`,
};

const cardClass = "rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-6";
const eyebrowClass = "mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#E7162A]";

export default function ProgrammePage() {
    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-24">
            <div className="mx-auto max-w-6xl space-y-20">
                {/* ── HEADER ── */}
                <header className="max-w-3xl space-y-6">
                    <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">
                        Retour accueil
                    </Link>
                    <div className="space-y-3">
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#E7162A]">{PLA_SESSION.label}</p>
                        <h1 className="font-serif text-4xl font-black leading-tight md:text-6xl">
                            Livret complet des offres<br />
                            <span className="text-[#E7162A]">{PLA_SESSION.dates}</span>
                        </h1>
                        <p className="text-lg leading-8 text-[var(--foreground)]/60">
                            Trois parcours — Formation Régulière, Club d&apos;Anglais et Formule Weekend Hybride — en présentiel
                            dans nos deux centres d&apos;Abidjan ou en visioconférence, portés par la méthode ISO+ et les modules
                            de spécialisation métier ESP.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link href="/register" className="rounded-full bg-[#E7162A] px-6 py-3 text-sm font-black uppercase tracking-widest text-white">
                                Réserver ma place
                            </Link>
                            <InstallAppButton />
                            <a
                                href="/brochure-pla-2026.pdf"
                                download
                                className="inline-flex items-center gap-2 rounded-full border border-[#E7162A]/40 px-6 py-3 text-sm font-black uppercase tracking-widest text-[#E7162A]"
                            >
                                <Download size={16} aria-hidden="true" />
                                Brochure PDF
                            </a>
                        </div>
                    </div>
                </header>

                {/* ── PILIERS ── */}
                <section className="grid gap-4 md:grid-cols-3">
                    {[
                        ["Infrastructure", `Salles sécurisées et climatisées, WiFi haut débit, parking, espace Breakout et ${PLA_SESSION.classCapacity} places maximum par salle.`],
                        ["Encadrement", "Formateurs et consultants expérimentés, suivi humain et corrections actives à chaque séance."],
                        ["Méthode ISO+", "Input, Structure, Output, Automatisation: apprendre puis transformer en réflexes."],
                    ].map(([title, text]) => (
                        <article key={title} className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-7">
                            <h2 className="mb-3 text-xl font-black">{title}</h2>
                            <p className="text-sm leading-7 text-[var(--foreground)]/55">{text}</p>
                        </article>
                    ))}
                </section>

                {/* ── PARCOURS ── */}
                <section className="space-y-6">
                    <div className="max-w-3xl">
                        <p className={eyebrowClass}>Les parcours</p>
                        <h2 className="text-3xl font-black">Trois façons d&apos;apprendre et de pratiquer</h2>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3">
                        {PLA_PROGRAMS.map((program) => (
                            <article key={program.id} className="flex flex-col rounded-3xl border border-[#E7162A]/15 bg-white/[0.04] p-6">
                                <span className="text-3xl">{program.emoji}</span>
                                <h3 className="mt-3 text-2xl font-black">{program.name}</h3>
                                <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#E7162A]">{program.tagline}</p>
                                <p className="mt-4 text-sm leading-7 text-[var(--foreground)]/60">{program.concept}</p>
                                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--foreground)]/45">Pour qui ?</p>
                                <p className="mt-1 text-sm leading-6 text-[var(--foreground)]/55">{program.audience}</p>
                                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--foreground)]/45">Objectifs</p>
                                <ul className="mt-2 space-y-1">
                                    {program.goals.map((goal) => (
                                        <li key={goal} className="text-sm leading-6 text-[var(--foreground)]/55">— {goal}</li>
                                    ))}
                                </ul>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {program.activities.map((activity) => (
                                        <span key={activity} className="rounded-full border border-[#E7162A]/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#E7162A]">
                                            {activity}
                                        </span>
                                    ))}
                                </div>
                                <Link
                                    href={program.registerPath}
                                    className="mt-6 inline-flex justify-center rounded-full border border-[#E7162A]/40 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#E7162A]"
                                >
                                    S&apos;inscrire
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ── MÉTHODE ISO+ ── */}
                <section className="space-y-6">
                    <div className="max-w-3xl">
                        <p className={eyebrowClass}>Méthode exclusive {PLA_METHOD.name}</p>
                        <h2 className="text-3xl font-black">{PLA_METHOD.subtitle}</h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/55">{PLA_METHOD.intro}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {PLA_METHOD.pillars.map((pillar) => (
                            <article key={pillar.id} className={cardClass}>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E7162A]">{pillar.n} · {pillar.subtitle}</p>
                                <h3 className="mt-2 text-xl font-black">{pillar.title}</h3>
                                <ul className="mt-3 space-y-2">
                                    {pillar.points.map((point) => (
                                        <li key={point} className="text-sm leading-6 text-[var(--foreground)]/55">— {point}</li>
                                    ))}
                                </ul>
                                <p className="mt-4 rounded-xl bg-[#E7162A]/8 p-3 text-xs font-bold leading-6 text-[var(--foreground)]/70">
                                    Principe: {pillar.principle}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <LearningPathAdvisor />

                {/* ── PROGRESSION ── */}
                <section className="space-y-6">
                    <div className="max-w-3xl">
                        <p className={eyebrowClass}>Progression</p>
                        <h2 className="text-3xl font-black">De Débutant à Mastery Professionnel</h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/55">{PLA_LEVEL_PROMISE}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                        {PLA_LEVEL_PATH.map((level, index) => (
                            <article key={level.id} className={cardClass}>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E7162A]">Étape {index + 1}</p>
                                <h3 className="mt-2 text-xl font-black">{level.name}</h3>
                                <p className="mt-2 text-sm leading-6 text-[var(--foreground)]/55">{level.summary}</p>
                            </article>
                        ))}
                    </div>
                    <div className={cardClass}>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E7162A]">Calendrier des cycles annuels</p>
                        <p className="mt-2 text-sm text-[var(--foreground)]/55">6 sessions de 2 mois tout au long de l&apos;année.</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {PLA_CYCLES.map((cycle) => (
                                <span
                                    key={cycle.id}
                                    className={`rounded-full border px-4 py-2 text-xs font-black ${
                                        cycle.id === "nov-dec"
                                            ? "border-[#E7162A] bg-[#E7162A]/10 text-[#E7162A]"
                                            : "border-[#E7162A]/20 text-[var(--foreground)]/55"
                                    }`}
                                >
                                    {cycle.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── ESP ── */}
                <section className="space-y-6">
                    <div className="max-w-3xl">
                        <p className={eyebrowClass}>{PLA_ESP.subtitle}</p>
                        <h2 className="text-3xl font-black">{PLA_ESP.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/55">{PLA_ESP.intro}</p>
                        <p className="mt-2 text-sm font-black text-[#E7162A]">{PLA_ESP.access}</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        {PLA_ESP.modules.map((module) => (
                            <article key={module.id} className="rounded-2xl border border-[#E7162A]/12 bg-white/[0.04] p-5">
                                <span className="text-2xl">{module.emoji}</span>
                                <h3 className="mt-2 text-sm font-black leading-5">{module.name}</h3>
                                <p className="mt-1 text-xs italic text-[var(--foreground)]/45">{module.en}</p>
                            </article>
                        ))}
                    </div>
                    <p className="max-w-3xl text-sm leading-7 text-[var(--foreground)]/55">{PLA_ESP.outro}</p>
                </section>

                {/* ── CENTRES ── */}
                <section className="space-y-6">
                    <div className="max-w-3xl">
                        <p className={eyebrowClass}>Centres et plannings</p>
                        <h2 className="text-3xl font-black">Choisissez le centre adapté à votre parcours</h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/55">{PLA_WEEK_RHYTHM}</p>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                        {PLA_CENTERS.map((center) => (
                            <article key={center.id} className="rounded-3xl border border-[#E7162A]/15 bg-white/[0.04] p-6">
                                <p className="mb-3 inline-flex rounded-full border border-[#E7162A]/25 bg-[#E7162A]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#E7162A]">
                                    {center.highlight}
                                </p>
                                <h3 className="text-2xl font-black">{center.name}</h3>
                                <p className="mt-1 text-sm font-bold text-[var(--foreground)]/70">{center.place}</p>
                                <p className="mt-1 text-xs leading-6 text-[var(--foreground)]/45">{center.address}</p>
                                <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/55">{center.positioning}</p>
                                <div className="mt-5 space-y-2">
                                    {center.schedule.map((entry) => (
                                        <div key={entry.days} className="flex flex-col gap-1 rounded-2xl border border-[#E7162A]/10 bg-[var(--background)]/45 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm font-black">{entry.days}</p>
                                                <p className="mt-1 text-xs font-bold text-[var(--foreground)]/50">{entry.program}</p>
                                            </div>
                                            <p className="rounded-full bg-[#E7162A]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#E7162A]">
                                                {entry.slots.join(" · ")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href={center.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-5 inline-flex rounded-full border border-[#E7162A]/40 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#E7162A]"
                                >
                                    Voir sur Maps
                                </a>
                            </article>
                        ))}

                        <article className="rounded-3xl border border-[#E7162A]/15 bg-white/[0.04] p-6 lg:col-span-2">
                            <p className="mb-3 inline-flex rounded-full border border-[#E7162A]/25 bg-[#E7162A]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#E7162A]">
                                {PLA_ONLINE_CENTER.highlight}
                            </p>
                            <h3 className="text-2xl font-black">{PLA_ONLINE_CENTER.name}</h3>
                            <p className="mt-1 text-sm font-bold text-[var(--foreground)]/70">{PLA_ONLINE_CENTER.place}</p>
                            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/55">Programmes disponibles: {PLA_ONLINE_CENTER.programs}</p>
                            <div className="mt-5 grid gap-2 md:grid-cols-2">
                                {PLA_ONLINE_CENTER.schedule.map((entry) => (
                                    <div key={entry.days} className="flex flex-col gap-1 rounded-2xl border border-[#E7162A]/10 bg-[var(--background)]/45 p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-black">{entry.days}</p>
                                            <p className="mt-1 text-xs font-bold text-[var(--foreground)]/50">{entry.program}</p>
                                        </div>
                                        <p className="rounded-full bg-[#E7162A]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#E7162A]">
                                            {entry.slots.join(" · ")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>
                </section>

                {/* ── TARIFS ── */}
                <section className="space-y-6">
                    <div className="max-w-3xl">
                        <p className={eyebrowClass}>Grille tarifaire — session de 2 mois</p>
                        <h2 className="text-3xl font-black">Des tarifs clairs, sans frais caché</h2>
                        <p className="mt-2 text-sm text-[var(--foreground)]/50">
                            🎁 Offre spéciale de lancement: frais d&apos;inscription OFFERTS (0 FCFA).
                        </p>
                    </div>

                    <div className="space-y-8">
                        {PLA_PRICING_TABLE.map((block) => (
                            <div key={block.id} className="rounded-3xl border border-[#E7162A]/15 bg-white/[0.04] p-6">
                                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                                    <h3 className="text-2xl font-black">
                                        <span aria-hidden="true">{block.emoji}</span> {block.title}
                                    </h3>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--foreground)]/45">{block.subtitle}</p>
                                </div>
                                <div className="space-y-5">
                                    {block.rows.map((row) => (
                                        <div key={`${block.id}-${row.program}`}>
                                            <p className="mb-3 text-sm font-black uppercase tracking-[0.12em] text-[#E7162A]">{row.name}</p>
                                            <div className="grid gap-3 md:grid-cols-3">
                                                {row.plans.map((plan) => (
                                                    <div
                                                        key={plan.id}
                                                        className={`rounded-2xl border p-5 ${plan.top ? "border-[#E7162A] bg-[#E7162A]/10" : "border-[#E7162A]/15 bg-[var(--background)]/40"}`}
                                                    >
                                                        <p className="text-sm font-black">{plan.label}</p>
                                                        <p className="mt-1 text-xs text-[var(--foreground)]/45">{plan.freq}</p>
                                                        <p className="mt-4 font-serif text-2xl font-black text-[#E7162A]">{formatFcfa(plan.price)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <ul className="space-y-2">
                        {PLA_PRICING_NOTES.map((note) => (
                            <li key={note} className="text-sm leading-7 text-[var(--foreground)]/55">⚠️ {note}</li>
                        ))}
                    </ul>
                </section>

                {/* ── DÉMARRAGE IMMÉDIAT ── */}
                <section className="rounded-3xl border border-[#E7162A]/20 bg-[#E7162A]/5 p-8">
                    <p className={eyebrowClass}>🎯 Accès anticipé</p>
                    <h2 className="text-3xl font-black">{PLA_EARLY_ACCESS.title}</h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground)]/60">{PLA_EARLY_ACCESS.intro}</p>
                    <ol className="mt-5 grid gap-3 md:grid-cols-2">
                        {PLA_EARLY_ACCESS.benefits.map((benefit, index) => (
                            <li key={benefit} className="flex gap-3 rounded-2xl border border-[#E7162A]/15 bg-[var(--background)]/50 p-4">
                                <span className="font-serif text-xl font-black text-[#E7162A]">{index + 1}</span>
                                <span className="text-sm leading-6 text-[var(--foreground)]/60">{benefit}</span>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* ── CONFORT ── */}
                <section className="space-y-6">
                    <div className="max-w-3xl">
                        <p className={eyebrowClass}>Confort & commodités</p>
                        <h2 className="text-3xl font-black">Un cadre pensé pour apprendre sereinement</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                        {PLA_AMENITIES.map((item) => (
                            <article key={item.id} className={cardClass}>
                                <span className="text-2xl">{item.emoji}</span>
                                <h3 className="mt-2 text-lg font-black leading-6">{item.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-[var(--foreground)]/55">{item.desc}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ── CORPORATE ── */}
                <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl border border-[#E7162A]/15 bg-white/[0.04] p-8">
                        <p className={eyebrowClass}>Corporate & B to B</p>
                        <h2 className="text-3xl font-black">{PLA_CORPORATE.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/60">{PLA_CORPORATE.intro}</p>
                        <div className="mt-5 space-y-3">
                            {PLA_CORPORATE.offers.map((offer) => (
                                <div key={offer.id} className="rounded-2xl border border-[#E7162A]/10 bg-[var(--background)]/45 p-4">
                                    <p className="text-sm font-black">{offer.name}</p>
                                    <p className="mt-1 text-sm leading-6 text-[var(--foreground)]/55">{offer.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[var(--foreground)]/55">🤝 {PLA_CORPORATE.quote}</p>
                        <Link href="/rendez-vous" className="mt-6 inline-flex rounded-full bg-[#E7162A] px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white">
                            Demander un devis
                        </Link>
                    </div>

                    <div className="rounded-3xl border border-[#E7162A]/15 bg-white/[0.04] p-8">
                        <h2 className="mb-5 text-2xl font-black">Inscription et réservation</h2>
                        <div className="space-y-4 text-sm leading-7 text-[var(--foreground)]/60">
                            <p><strong className="text-[var(--foreground)]">Test de niveau gratuit:</strong> indispensable pour orienter chaque apprenant.</p>
                            <p><strong className="text-[var(--foreground)]">RDV consultant:</strong> {PLA_SESSION.appointmentSlots}.</p>
                            <p><strong className="text-[var(--foreground)]">Adresse:</strong> {PLA_SESSION.location}</p>
                            <p><strong className="text-[var(--foreground)]">WhatsApp uniquement:</strong> {PLA_SESSION.phone}</p>
                            <p><strong className="text-[var(--foreground)]">E-mail:</strong> {PLA_SESSION.email}</p>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/placement-test" className="rounded-full border border-[#E7162A]/40 px-6 py-3 text-sm font-black uppercase tracking-widest text-[#E7162A]">
                                Test gratuit
                            </Link>
                            <a
                                href="/brochure-pla-2026.pdf"
                                download
                                className="inline-flex items-center gap-2 rounded-full border border-[#E7162A]/40 px-6 py-3 text-sm font-black uppercase tracking-widest text-[#E7162A]"
                            >
                                <Download size={16} aria-hidden="true" />
                                Brochure
                            </a>
                            <Link href="/register" className="rounded-full bg-[#E7162A] px-6 py-3 text-sm font-black uppercase tracking-widest text-white">
                                Réserver ma place
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── HORAIRES ── */}
                <section className="grid gap-4 md:grid-cols-3">
                    {PLA_TIME_SLOTS.map((slot) => (
                        <div key={slot.id} className={cardClass}>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E7162A]">{slot.label}</p>
                            <p className="mt-1 text-2xl font-black">{slot.time}</p>
                            <p className="mt-1 text-sm text-[var(--foreground)]/45">{slot.desc}</p>
                        </div>
                    ))}
                    <div className={cardClass}>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E7162A]">{PLA_WEEKEND_TIME_SLOT.label}</p>
                        <p className="mt-1 text-2xl font-black">{PLA_WEEKEND_TIME_SLOT.time}</p>
                        <p className="mt-1 text-sm text-[var(--foreground)]/45">{PLA_WEEKEND_TIME_SLOT.desc}</p>
                    </div>
                </section>

                {/* ── PWA ── */}
                <section className="rounded-3xl border border-[#E7162A]/15 bg-[#E7162A]/5 p-6 md:hidden">
                    <p className={eyebrowClass}>Raccourci mobile</p>
                    <h2 className="text-2xl font-black">Gardez la plateforme à portée de main</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/60">
                        Ajoutez un raccourci vers vos cours, paiements, rendez-vous et ressources. C&apos;est optionnel.
                    </p>
                    <div className="mt-4">
                        <InstallAppButton className="w-full" />
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-black">FAQ</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {PLA_FAQ.map((item) => (
                            <article key={item.question} className={cardClass}>
                                <h3 className="mb-2 font-black">{item.question}</h3>
                                <p className="text-sm leading-7 text-[var(--foreground)]/55">{item.answer}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
