import Link from "next/link";
import { Download } from "lucide-react";
import { InstallAppButton } from "@/components/install-app-button";
import { LearningPathAdvisor } from "@/components/learning-path-advisor";
import { PLA_CENTERS, PLA_FAQ, PLA_HYBRID_TIME_SLOT, PLA_PLANS, PLA_SESSION, PLA_TIME_SLOTS, formatFcfa } from "@/lib/pla-program";

export const metadata = {
    title: "Programme officiel 2026 | Prime Language Academy",
    description: `Session de lancement Prime Language Academy du ${PLA_SESSION.dates}: tarifs, horaires, méthode ISO+, FAQ et inscription.`,
};

export default function ProgrammePage() {
    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-24">
            <div className="mx-auto max-w-6xl space-y-16">
                <header className="max-w-3xl space-y-6">
                    <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">
                        Retour accueil
                    </Link>
                    <div className="space-y-3">
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#E7162A]">{PLA_SESSION.label}</p>
                        <h1 className="font-serif text-4xl font-black leading-tight md:text-6xl">
                            Programme officiel PLA<br />
                            <span className="text-[#E7162A]">{PLA_SESSION.dates}</span>
                        </h1>
                        <p className="text-lg leading-8 text-[var(--foreground)]/60">
                            Une immersion premium à Abidjan pour transformer l'anglais en compétence vivante:
                            méthode ISO+, formateurs experts, suivi personnalisé et environnement de formation confortable.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link href="/register" className="rounded-full bg-[#E7162A] px-6 py-3 text-sm font-black uppercase tracking-widest text-black">
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

                <section className="grid gap-4 md:grid-cols-3">
                    {[
                        ["Infrastructure", `Salles sécurisées et climatisées, WiFi haut débit, parking, espace de pause et ${PLA_SESSION.classCapacity} places maximum par salle.`],
                        ["Encadrement", "Formateurs experts mobilisés pour une progression claire et un suivi humain."],
                        ["Méthode ISO+", "Input, Structure, Output, Automatisation: apprendre puis transformer en réflexes."],
                    ].map(([title, text]) => (
                        <article key={title} className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-7">
                            <h2 className="mb-3 text-xl font-black">{title}</h2>
                            <p className="text-sm leading-7 text-[var(--foreground)]/55">{text}</p>
                        </article>
                    ))}
                </section>

                <LearningPathAdvisor />

                <section className="space-y-6">
                    <div className="max-w-3xl">
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#E7162A]">Centres et formations</p>
                        <h2 className="text-3xl font-black">Choisissez le centre adapté à votre parcours</h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/55">
                            Programme 6 accueille la Formation Régulière et la vague hybride du matin. Poincaré est le centre complet avec Formation Régulière, Club d'Anglais et Formation Hybride.
                        </p>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                        {PLA_CENTERS.map((center) => (
                            <article key={center.id} className="rounded-3xl border border-[#E7162A]/15 bg-white/[0.04] p-6">
                                <p className="mb-3 inline-flex rounded-full border border-[#E7162A]/25 bg-[#E7162A]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#E7162A]">
                                    {center.highlight}
                                </p>
                                <h3 className="text-2xl font-black">{center.name}</h3>
                                <p className="mt-1 text-sm font-bold text-[var(--foreground)]/70">{center.place}</p>
                                <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/55">{center.positioning}</p>
                                <div className="mt-5 space-y-3">
                                    {center.programs.map((program) => (
                                        <div key={program.name} className="rounded-2xl border border-[#E7162A]/10 bg-[var(--background)]/45 p-4">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-black">{program.name}</p>
                                                    <p className="mt-1 text-xs font-bold text-[var(--foreground)]/45">{program.schedule}</p>
                                                </div>
                                                <p className="rounded-full bg-[#E7162A]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#E7162A]">
                                                    {program.slots.join(" · ")}
                                                </p>
                                            </div>
                                            <p className="mt-3 text-sm leading-6 text-[var(--foreground)]/55">{program.summary}</p>
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
                    </div>
                </section>

                <section className="space-y-6">
                    <div>
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#E7162A]">Tarifs 2 mois</p>
                        <h2 className="text-3xl font-black">Grille à la carte</h2>
                        <p className="mt-2 text-sm text-[var(--foreground)]/50">Inscription offerte: 0 FCFA. Le solde doit être réglé avant le démarrage pour garantir la place.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {PLA_PLANS.map((plan) => (
                            <div key={plan.id} className={`rounded-2xl border p-6 ${plan.top ? "border-[#E7162A] bg-[#E7162A]/10" : "border-[#E7162A]/15 bg-white/[0.04]"}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-xl font-black">{plan.label}</h3>
                                        <p className="mt-1 text-sm text-[var(--foreground)]/45">{plan.freq}</p>
                                    </div>
                                    {plan.top && <span className="rounded-full bg-[#E7162A] px-3 py-1 text-[10px] font-black uppercase text-black">Complet</span>}
                                </div>
                                <p className="mt-6 font-serif text-3xl font-black text-[#E7162A]">{formatFcfa(plan.price)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-[#E7162A]/15 bg-[#E7162A]/5 p-6 md:hidden">
                    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                        <div>
                            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#E7162A]">Application gratuite</p>
                            <h2 className="text-2xl font-black md:text-3xl">Installez la plateforme sans passer par les stores</h2>
                            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/60">
                                Ajoutez Prime Academy sur votre Ã©cran d'accueil comme une application. AccÃ¨s rapide aux cours,
                                paiements, rendez-vous et ressources, sans frais de store.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#E7162A]/15 bg-[var(--background)] p-5">
                            <div className="mb-4 space-y-2 text-sm text-[var(--foreground)]/60">
                                <p><strong className="text-[var(--foreground)]">TÃ©lÃ©phone:</strong> ouvrez le menu du navigateur puis choisissez Installer l'application.</p>
                                <p><strong className="text-[var(--foreground)]">iPhone:</strong> ouvrez le partage puis choisissez Ajouter Ã  l'Ã©cran d'accueil.</p>
                            </div>
                            <InstallAppButton className="w-full" />
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-8">
                        <h2 className="mb-5 text-2xl font-black">Organisation des séances</h2>
                        <p className="mb-6 text-sm leading-7 text-[var(--foreground)]/55">Les cours se déroulent du lundi au samedi. La Formation Régulière utilise les vagues 1 et 2, et la Formation Hybride utilise la vague 3.</p>
                        <div className="space-y-4">
                            {PLA_TIME_SLOTS.map((slot) => (
                                <div key={slot.id} className="rounded-xl border border-[#E7162A]/10 p-4">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E7162A]">{slot.label}</p>
                                    <p className="mt-1 text-2xl font-black">{slot.time}</p>
                                    <p className="mt-1 text-sm text-[var(--foreground)]/45">{slot.desc}</p>
                                </div>
                            ))}
                            <div className="rounded-xl border border-[#E7162A]/10 p-4">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E7162A]">{PLA_HYBRID_TIME_SLOT.label}</p>
                                <p className="mt-1 text-2xl font-black">{PLA_HYBRID_TIME_SLOT.time}</p>
                                <p className="mt-1 text-sm text-[var(--foreground)]/45">{PLA_HYBRID_TIME_SLOT.desc}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-8">
                        <h2 className="mb-5 text-2xl font-black">Inscription et réservation</h2>
                        <div className="space-y-4 text-sm leading-7 text-[var(--foreground)]/60">
                            <p><strong className="text-[var(--foreground)]">Test de niveau gratuit:</strong> indispensable pour orienter chaque apprenant.</p>
                            <p><strong className="text-[var(--foreground)]">RDV consultant:</strong> {PLA_SESSION.appointmentSlots}.</p>
                            <p><strong className="text-[var(--foreground)]">Adresse:</strong> {PLA_SESSION.location}. {PLA_SESSION.locationHint}.</p>
                            <p><strong className="text-[var(--foreground)]">WhatsApp:</strong> {PLA_SESSION.phone}</p>
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
                                Télécharger la brochure
                            </a>
                            <Link href="/register" className="rounded-full bg-[#E7162A] px-6 py-3 text-sm font-black uppercase tracking-widest text-black">
                                Réserver ma place
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-black">FAQ</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {PLA_FAQ.map((item) => (
                            <article key={item.question} className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-6">
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
