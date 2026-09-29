import Link from "next/link";
import { PLA_CLASS_CAPACITY, PLA_SESSION, formatFcfa } from "@/lib/pla-program";

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
                    <p><strong className="text-[var(--foreground)]">Inscription:</strong> l&apos;inscription est enregistrée après renseignement du formulaire et choix de la formule (Formation Régulière, Club d&apos;Anglais ou Formule Weekend Hybride), en présentiel ou en visioconférence.</p>
                    <p><strong className="text-[var(--foreground)]">Frais d&apos;inscription:</strong> offerts ({formatFcfa(PLA_SESSION.registrationFee)}) dans le cadre de l&apos;offre de lancement. Aucun frais caché n&apos;est appliqué.</p>
                    <p><strong className="text-[var(--foreground)]">Session:</strong> le cycle en cours couvre la période {PLA_SESSION.dates}, pour une durée de {PLA_SESSION.duration}. Nos formations s&apos;organisent en 6 cycles de 2 mois par an (janvier-février, mars-avril, mai-juin, juillet-août, septembre-octobre, novembre-décembre).</p>
                    <p><strong className="text-[var(--foreground)]">Paiement et réservation de place:</strong> le solde total doit être réglé avant le début de la formation. Un acompte ne verrouille pas la place: seule la totalité du règlement garantit définitivement votre inscription, dans la limite des places disponibles.</p>
                    <p><strong className="text-[var(--foreground)]">Tarifs:</strong> les tarifs s&apos;entendent par cycle de 2 mois et dépendent du programme (Régulière ou Club), du mode (présentiel ou en ligne) et du nombre de séances hebdomadaires (2, 3 ou 4). La Formule Weekend Hybride est facturée 50 000 FCFA pour 4h par weekend. La grille complète est publiée sur la page Programme.</p>
                    <p><strong className="text-[var(--foreground)]">Accès anticipé:</strong> dès l&apos;inscription, l&apos;apprenant bénéficie du test de niveau, de l&apos;accès à la plateforme, de la documentation pédagogique, de la préformation et de séances d&apos;accompagnement en visioconférence, avant même le début officiel du cycle.</p>
                    <p><strong className="text-[var(--foreground)]">Capacité et confort:</strong> les salles de formation en présentiel accueillent {PLA_CLASS_CAPACITY} apprenants maximum. Le Club d&apos;Anglais est accessible à partir du niveau Autonome.</p>
                    <p><strong className="text-[var(--foreground)]">Rattrapage:</strong> en cas d&apos;imprévu, un rattrapage peut être proposé sur un autre créneau disponible de la semaine (16h-18h, 18h-20h) ou sur la session de suivi du dimanche, selon les places disponibles.</p>
                    <p><strong className="text-[var(--foreground)]">Formations privées et entreprises:</strong> les formations corporate, B2B et privées font l&apos;objet d&apos;un devis personnalisé et d&apos;un calendrier dédié, établis après une prise de rendez-vous avec un consultant.</p>
                    <p><strong className="text-[var(--foreground)]">Attestation:</strong> l&apos;attestation de formation dépend de l&apos;assiduité, de la participation et de l&apos;évaluation du niveau.</p>
                </section>
            </article>
        </main>
    );
}
