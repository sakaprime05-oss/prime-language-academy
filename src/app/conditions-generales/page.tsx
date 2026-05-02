import Link from "next/link";
import { PLA_SESSION } from "@/lib/pla-program";

export const metadata = {
    title: "Conditions generales | Prime Language Academy",
    description: "Conditions d'inscription, paiement et participation aux programmes Prime Language Academy.",
};

export default function ConditionsGeneralesPage() {
    return (
        <main className="min-h-screen bg-[#080808] px-6 py-24 text-[#F5F0E8]">
            <article className="mx-auto max-w-3xl space-y-8">
                <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">Retour accueil</Link>
                <header>
                    <h1 className="font-serif text-4xl font-black">Conditions generales</h1>
                    <p className="mt-4 text-[#F5F0E8]/55">Conditions applicables aux inscriptions Prime Language Academy.</p>
                </header>
                <section className="space-y-5 text-sm leading-7 text-[#F5F0E8]/65">
                    <p><strong className="text-[#F5F0E8]">Inscription:</strong> l'inscription est valide apres renseignement du formulaire, choix de formule et paiement selon l'option selectionnee.</p>
                    <p><strong className="text-[#F5F0E8]">Session:</strong> la session de lancement couvre la periode {PLA_SESSION.dates}, pour une duree de {PLA_SESSION.duration}.</p>
                    <p><strong className="text-[#F5F0E8]">Paiement:</strong> l'inscription est offerte pour la session de lancement. Le solde doit etre regle avant le debut de la formation pour garantir la place.</p>
                    <p><strong className="text-[#F5F0E8]">Rattrapage:</strong> en cas d'imprevu, un rattrapage peut etre propose sur une autre vague horaire ou un autre creneau disponible de la semaine.</p>
                    <p><strong className="text-[#F5F0E8]">Attestation:</strong> l'attestation de formation depend de l'assiduite, de la participation et de l'evaluation du niveau.</p>
                </section>
            </article>
        </main>
    );
}
