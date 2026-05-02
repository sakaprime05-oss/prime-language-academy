import Link from "next/link";
import { PLA_SESSION } from "@/lib/pla-program";

export const metadata = {
    title: "Mentions legales | Prime Language Academy",
    description: "Informations legales et contact de Prime Language Academy.",
};

export default function MentionsLegalesPage() {
    return (
        <main className="min-h-screen bg-[#080808] px-6 py-24 text-[#F5F0E8]">
            <article className="mx-auto max-w-3xl space-y-8">
                <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">Retour accueil</Link>
                <header>
                    <h1 className="font-serif text-4xl font-black">Mentions legales</h1>
                    <p className="mt-4 text-[#F5F0E8]/55">Prime Language Academy presente ici les informations essentielles relatives au site et au programme.</p>
                </header>
                <section className="space-y-4 text-sm leading-7 text-[#F5F0E8]/65">
                    <p><strong className="text-[#F5F0E8]">Nom commercial:</strong> Prime Language Academy.</p>
                    <p><strong className="text-[#F5F0E8]">Activite:</strong> formation en anglais, accompagnement linguistique, English Club et services pedagogiques associes.</p>
                    <p><strong className="text-[#F5F0E8]">Adresse:</strong> {PLA_SESSION.location}. {PLA_SESSION.locationHint}.</p>
                    <p><strong className="text-[#F5F0E8]">Contact:</strong> {PLA_SESSION.phone}.</p>
                    <p><strong className="text-[#F5F0E8]">Hebergement:</strong> Vercel Inc., plateforme d'hebergement cloud utilisee pour le deploiement du site.</p>
                    <p>Ces informations pourront etre completees avec les donnees administratives definitives de l'entreprise.</p>
                </section>
            </article>
        </main>
    );
}
