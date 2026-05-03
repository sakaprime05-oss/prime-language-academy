import Link from "next/link";
import { PLA_SESSION } from "@/lib/pla-program";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
    title: "Contact | Prime Language Academy",
    description: "Contacter Prime Language Academy a Abidjan: WhatsApp, telephone, localisation et rendez-vous consultant.",
};

export default function ContactPage() {
    const whatsappText = encodeURIComponent("Bonjour Prime Language Academy, je souhaite avoir des informations sur la session 2026.");

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
                        <h2 className="text-2xl font-black">Cocody Angre</h2>
                        <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/55">
                            {PLA_SESSION.location}. {PLA_SESSION.locationHint}.
                        </p>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PLA_SESSION.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex rounded-full border border-[#E7162A]/40 px-5 py-3 text-sm font-black uppercase tracking-widest text-[#E7162A]"
                        >
                            Voir la carte
                        </a>
                    </article>
                </section>

                <section className="rounded-2xl border border-[#E7162A]/15 bg-white/[0.04] p-8">
                    <h2 className="mb-4 text-2xl font-black">Avant de nous contacter</h2>
                    <div className="grid gap-4 text-sm leading-7 text-[#F5F0E8]/60 md:grid-cols-3">
                        <p><strong className="text-[#F5F0E8]">Test gratuit:</strong> utile si vous ne connaissez pas encore votre niveau.</p>
                        <p><strong className="text-[#F5F0E8]">Programme:</strong> la session 2026 dure 2 mois, du 21 juin au 19 aout.</p>
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
