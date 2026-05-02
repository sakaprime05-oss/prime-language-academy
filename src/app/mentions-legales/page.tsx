import Link from "next/link";
import { PLA_SESSION } from "@/lib/pla-program";

export const metadata = {
    title: "Mentions légales | Prime Language Academy",
    description: "Informations légales et contact de Prime Language Academy.",
};

export default function MentionsLegalesPage() {
    return (
        <main className="min-h-screen bg-[#080808] px-6 py-24 text-[#F5F0E8]">
            <article className="mx-auto max-w-3xl space-y-8">
                <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">Retour accueil</Link>
                <header>
                    <h1 className="font-serif text-4xl font-black">Mentions légales</h1>
                    <p className="mt-4 text-[#F5F0E8]/55">Prime Language Academy présente ici les informations essentielles relatives au site et au programme.</p>
                </header>
                <section className="space-y-4 text-sm leading-7 text-[#F5F0E8]/65">
                    <p><strong className="text-[#F5F0E8]">Nom commercial:</strong> Prime Language Academy.</p>
                    <p><strong className="text-[#F5F0E8]">Activité:</strong> formation en anglais, accompagnement linguistique, English Club et services pédagogiques associés.</p>
                    <p><strong className="text-[#F5F0E8]">Adresse:</strong> {PLA_SESSION.location}. {PLA_SESSION.locationHint}.</p>
                    <p><strong className="text-[#F5F0E8]">Contact:</strong> {PLA_SESSION.phone}.</p>
                    <p><strong className="text-[#F5F0E8]">Hébergement:</strong> Vercel Inc., plateforme d'hébergement cloud utilisée pour le déploiement du site.</p>
                    <p>Ces informations pourront être complétées avec les données administratives définitives de l'entreprise.</p>
                </section>
            </article>
        </main>
    );
}
