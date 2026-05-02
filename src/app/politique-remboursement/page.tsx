import Link from "next/link";

export const metadata = {
    title: "Politique de remboursement | Prime Language Academy",
    description: "Conditions de remboursement et annulation Prime Language Academy.",
};

export default function RemboursementPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] px-6 py-24 text-[var(--foreground)]">
            <article className="mx-auto max-w-3xl space-y-8">
                <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">Retour accueil</Link>
                <header>
                    <h1 className="font-serif text-4xl font-black">Politique de remboursement</h1>
                    <p className="mt-4 text-[var(--foreground)]/55">Règles applicables en cas d'annulation ou d'impossibilité de participer.</p>
                </header>
                <section className="space-y-5 text-sm leading-7 text-[var(--foreground)]/65">
                    <p><strong className="text-[var(--foreground)]">Avant le début des cours:</strong> une demande d'annulation peut être étudiée si elle est notifiée avant le démarrage effectif de la formation.</p>
                    <p><strong className="text-[var(--foreground)]">Après le démarrage:</strong> aucun remboursement automatique n'est garanti une fois les cours commencés.</p>
                    <p><strong className="text-[var(--foreground)]">Absence ponctuelle:</strong> une absence ne donne pas lieu à remboursement, mais un rattrapage peut être proposé selon les places disponibles.</p>
                    <p><strong className="text-[var(--foreground)]">Traitement:</strong> les demandes doivent être adressées à l'administration avec le nom de l'apprenant, la formule et la preuve de paiement.</p>
                </section>
            </article>
        </main>
    );
}
