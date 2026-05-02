import Link from "next/link";
import { PLA_FAQ, PLA_PLANS, PLA_SESSION, PLA_TIME_SLOTS, formatFcfa } from "@/lib/pla-program";

export const metadata = {
    title: "Programme officiel 2026 | Prime Language Academy",
    description: "Session de lancement Prime Language Academy du 21 juin au 19 août 2026: tarifs, horaires, méthode ISO+, FAQ et inscription.",
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
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-3">
                    {[
                        ["Infrastructure", "Salles climatisées, cadre sécurisé, WiFi haut débit, parking et espace de pause."],
                        ["Encadrement", "Formateurs experts mobilisés pour une progression claire et un suivi humain."],
                        ["Méthode ISO+", "Input, Structure, Output, Automatisation: apprendre puis transformer en réflexes."],
                    ].map(([title, text]) => (
                        <article key={title} className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-7">
                            <h2 className="mb-3 text-xl font-black">{title}</h2>
                            <p className="text-sm leading-7 text-[var(--foreground)]/55">{text}</p>
                        </article>
                    ))}
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

                <section className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-8">
                        <h2 className="mb-5 text-2xl font-black">Organisation des séances</h2>
                        <p className="mb-6 text-sm leading-7 text-[var(--foreground)]/55">Les cours se déroulent du lundi au dimanche, avec deux vagues horaires au choix.</p>
                        <div className="space-y-4">
                            {PLA_TIME_SLOTS.map((slot) => (
                                <div key={slot.id} className="rounded-xl border border-[#E7162A]/10 p-4">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E7162A]">{slot.label}</p>
                                    <p className="mt-1 text-2xl font-black">{slot.time}</p>
                                    <p className="mt-1 text-sm text-[var(--foreground)]/45">{slot.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-8">
                        <h2 className="mb-5 text-2xl font-black">Inscription et réservation</h2>
                        <div className="space-y-4 text-sm leading-7 text-[var(--foreground)]/60">
                            <p><strong className="text-[var(--foreground)]">Test de niveau gratuit:</strong> indispensable pour orienter chaque apprenant.</p>
                            <p><strong className="text-[var(--foreground)]">RDV consultant:</strong> mardi 10h-14h et jeudi 9h-14h, en visio ou vocal.</p>
                            <p><strong className="text-[var(--foreground)]">Adresse:</strong> {PLA_SESSION.location}. {PLA_SESSION.locationHint}.</p>
                            <p><strong className="text-[var(--foreground)]">WhatsApp:</strong> {PLA_SESSION.phone}</p>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/placement-test" className="rounded-full border border-[#E7162A]/40 px-6 py-3 text-sm font-black uppercase tracking-widest text-[#E7162A]">
                                Test gratuit
                            </Link>
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
