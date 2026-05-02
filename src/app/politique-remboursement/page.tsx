import Link from "next/link";

export const metadata = {
    title: "Politique de remboursement | Prime Language Academy",
    description: "Conditions de remboursement et annulation Prime Language Academy.",
};

export default function RemboursementPage() {
    return (
        <main className="min-h-screen bg-[#080808] px-6 py-24 text-[#F5F0E8]">
            <article className="mx-auto max-w-3xl space-y-8">
                <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">Retour accueil</Link>
                <header>
                    <h1 className="font-serif text-4xl font-black">Politique de remboursement</h1>
                    <p className="mt-4 text-[#F5F0E8]/55">Regles applicables en cas d'annulation ou d'impossibilite de participer.</p>
                </header>
                <section className="space-y-5 text-sm leading-7 text-[#F5F0E8]/65">
                    <p><strong className="text-[#F5F0E8]">Avant le debut des cours:</strong> une demande d'annulation peut etre etudiee si elle est notifiee avant le demarrage effectif de la formation.</p>
                    <p><strong className="text-[#F5F0E8]">Apres le demarrage:</strong> aucun remboursement automatique n'est garanti une fois les cours commences.</p>
                    <p><strong className="text-[#F5F0E8]">Absence ponctuelle:</strong> une absence ne donne pas lieu a remboursement, mais un rattrapage peut etre propose selon les places disponibles.</p>
                    <p><strong className="text-[#F5F0E8]">Traitement:</strong> les demandes doivent etre adressees a l'administration avec le nom de l'apprenant, la formule et la preuve de paiement.</p>
                </section>
            </article>
        </main>
    );
}
