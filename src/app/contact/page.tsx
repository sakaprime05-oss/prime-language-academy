import Link from "next/link";
import { MapPin, Navigation, Route } from "lucide-react";
import { PLA_CENTERS, PLA_SESSION } from "@/lib/pla-program";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
    title: "Contact | Prime Language Academy",
    description: "Contacter Prime Language Academy a Abidjan: WhatsApp, telephone, localisation et rendez-vous consultant.",
};

export default function ContactPage() {
    const whatsappText = encodeURIComponent("Bonjour Prime Language Academy, je souhaite avoir des informations sur la session 2026.");
    const centers = PLA_CENTERS;

    return (
        <main className="min-h-screen bg-[#080808] px-6 py-24 text-[#F5F0E8]">
            <div className="mx-auto max-w-5xl space-y-12">
                <header className="max-w-3xl space-y-5">
                    <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">
                        Retour accueil
                    </Link>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#E7162A]">Contact et reservation</p>
                    <h1 className="font-serif text-4xl font-black leading-tight md:text-6xl">
                        Parlons de votre objectif en anglais.
                    </h1>
                    <p className="text-lg leading-8 text-[#F5F0E8]/60">
                        Un consultant PLA peut vous orienter vers la formule, le niveau et la vague horaire les plus adaptes.
                    </p>
                </header>

                <section className="grid gap-6 md:grid-cols-3">
                    <article className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-7">
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#E7162A]">WhatsApp</p>
                        <h2 className="text-2xl font-black">{PLA_SESSION.phone}</h2>
                        <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/55">Le canal le plus rapide pour poser une question ou demander un rendez-vous.</p>
                        <a
                            href={`${PLA_SESSION.whatsapp}?text=${whatsappText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex rounded-full bg-[#25D366] px-5 py-3 text-sm font-black uppercase tracking-widest text-black"
                        >
                            Ecrire sur WhatsApp
                        </a>
                    </article>

                    <article className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-7">
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#E7162A]">Rendez-vous</p>
                        <h2 className="text-2xl font-black">Mardi et jeudi</h2>
                        <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/55">
                            Mardi 10h-14h et jeudi 9h-14h, en visio ou vocal, avec un consultant et le responsable du programme.
                        </p>
                        <Link href="/rendez-vous" className="mt-6 inline-flex rounded-full border border-[#E7162A]/40 px-5 py-3 text-sm font-black uppercase tracking-widest text-[#E7162A]">
                            Prendre rendez-vous
                        </Link>
                    </article>

                    <article className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-7">
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#E7162A]">Adresse</p>
                        <h2 className="text-2xl font-black">Deux lieux</h2>
                        <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/55">
                            Programme 6 accueille la Formation Hybride en matinée et en soirée. Poincaré ajoute le English Club pour les profils déjà autonomes.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {centers.map((center) => (
                                <a
                                    key={center.name}
                                    href={center.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex rounded-full border border-[#E7162A]/40 px-5 py-3 text-sm font-black uppercase tracking-widest text-[#E7162A]"
                                >
                                    {center.name.replace("Centre ", "")}
                                </a>
                            ))}
                        </div>
                    </article>
                </section>

                <section className="grid overflow-hidden rounded-[2rem] border border-[#E7162A]/15 bg-white/[0.04] lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="relative min-h-[360px] overflow-hidden bg-[#141211] sm:min-h-[430px]">
                        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(245,240,232,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(245,240,232,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
                        <div className="absolute left-[-12%] top-[50%] h-4 w-[130%] -rotate-[10deg] rounded-full bg-[#F5F0E8]/10" />
                        <div className="absolute left-[8%] top-[18%] h-3 w-[95%] rotate-[24deg] rounded-full bg-[#F5F0E8]/8" />
                        <div className="absolute left-[45%] top-[-10%] h-[120%] w-3 rotate-[12deg] rounded-full bg-[#E7162A]/18" />
                        <div className="absolute inset-x-8 bottom-8 top-8 rounded-[1.75rem] border border-white/10" />
                        <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#F5F0E8]/70">
                            Abidjan · Cocody
                        </div>
                        <div className="absolute left-[18%] top-[58%]">
                            <div className="relative">
                                <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E7162A]/15" />
                                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#E7162A] text-white shadow-2xl shadow-[#E7162A]/35">
                                    <MapPin className="h-7 w-7" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="mt-3 w-44 rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur">
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#E7162A]">Centre Poincaré</p>
                                <p className="mt-1 text-sm font-black text-[#F5F0E8]">Établissement Henri Poincaré</p>
                            </div>
                        </div>
                        <div className="absolute right-[14%] top-[20%]">
                            <div className="relative ml-auto w-fit">
                                <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E7162A]/15" />
                                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#E7162A] text-white shadow-2xl shadow-[#E7162A]/35">
                                    <MapPin className="h-7 w-7" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="mt-3 w-48 rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur">
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#E7162A]">Centre Programme 6</p>
                                <p className="mt-1 text-sm font-black text-[#F5F0E8]">Cocody Angré 8e Tranche</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-5 p-6 sm:p-8">
                        <div>
                            <p className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#E7162A]">
                                <Route className="h-4 w-4" aria-hidden="true" />
                                Carte des centres
                            </p>
                            <h2 className="text-3xl font-black leading-tight">Trouvez le centre le plus pratique.</h2>
                            <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/60">
                                Les deux lieux sont indiqués sur la carte. Ouvrez le centre de votre choix pour lancer directement la navigation.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {centers.map((center) => (
                                <article key={center.name} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                    <div className="flex items-start gap-4">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E7162A] text-white">
                                            <MapPin className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E7162A]">{center.name}</p>
                                            <h3 className="mt-1 text-lg font-black">{center.place}</h3>
                                            <p className="mt-1 text-sm leading-6 text-[#F5F0E8]/55">{center.address}</p>
                                            <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold leading-5 text-[#F5F0E8]/70">{center.highlight}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {center.programs.map((program) => (
                                            <div key={program.name} className="rounded-xl bg-white/[0.04] px-3 py-2">
                                                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#E7162A]">{program.name}</p>
                                                <p className="mt-1 text-xs leading-5 text-[#F5F0E8]/60">{program.slots.join(" · ")}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <a
                                        href={center.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#E7162A] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#c71123]"
                                    >
                                        <Navigation className="h-4 w-4" aria-hidden="true" />
                                        Ouvrir l'itinéraire
                                    </a>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-8">
                    <h2 className="mb-4 text-2xl font-black">Avant de nous contacter</h2>
                    <div className="grid gap-4 text-sm leading-7 text-[#F5F0E8]/60 md:grid-cols-3">
                        <p><strong className="text-[#F5F0E8]">Test gratuit:</strong> utile si vous ne connaissez pas encore votre niveau.</p>
                        <p><strong className="text-[#F5F0E8]">Programme:</strong> la session 2026 dure {PLA_SESSION.duration}: {PLA_SESSION.dates}.</p>
                        <p><strong className="text-[#F5F0E8]">Email:</strong> {siteConfig.contact.email}</p>
                    </div>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <Link href="/placement-test" className="rounded-full border border-[#E7162A]/40 px-6 py-3 text-sm font-black uppercase tracking-widest text-[#E7162A]">
                            Faire le test
                        </Link>
                        <Link href="/programme" className="rounded-full bg-[#E7162A] px-6 py-3 text-sm font-black uppercase tracking-widest text-black">
                            Voir le programme
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
