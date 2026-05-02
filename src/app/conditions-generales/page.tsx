import Link from "next/link";
import { PLA_SESSION } from "@/lib/pla-program";

export const metadata = {
    title: "Conditions générales | Prime Language Academy",
    description: "Conditions d'inscription, paiement et participation aux programmes Prime Language Academy.",
};

export default function ConditionsGeneralesPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] px-6 py-24 text-[var(--foreground)]">
            <article className="mx-auto max-w-3xl space-y-8">
                <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">Retour accueil</Link>
                <header>
                    <h1 className="font-serif text-4xl font-black">Conditions générales</h1>
                    <p className="mt-4 text-[var(--foreground)]/55">Conditions applicables aux inscriptions Prime Language Academy.</p>
                </header>
                <section className="space-y-5 text-sm leading-7 text-[var(--foreground)]/65">
                    <p><strong className="text-[var(--foreground)]">Inscription:</strong> l'inscription est valide après renseignement du formulaire, choix de formule et paiement selon l'option sélectionnée.</p>
                    <p><strong className="text-[var(--foreground)]">Session:</strong> la session de lancement couvre la période {PLA_SESSION.dates}, pour une durée de {PLA_SESSION.duration}.</p>
                    <p><strong className="text-[var(--foreground)]">Paiement:</strong> l'inscription est offerte pour la session de lancement. Le solde doit être réglé avant le début de la formation pour garantir la place.</p>
                    <p><strong className="text-[var(--foreground)]">Rattrapage:</strong> en cas d'imprévu, un rattrapage peut être proposé sur une autre vague horaire ou un autre créneau disponible de la semaine.</p>
                    <p><strong className="text-[var(--foreground)]">Attestation:</strong> l'attestation de formation dépend de l'assiduité, de la participation et de l'évaluation du niveau.</p>
                </section>
            </article>
        </main>
    );
}
