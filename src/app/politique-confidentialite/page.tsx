import Link from "next/link";

export const metadata = {
    title: "Politique de confidentialite | Prime Language Academy",
    description: "Gestion des donnees personnelles collectees par Prime Language Academy.",
};

export default function ConfidentialitePage() {
    return (
        <main className="min-h-screen bg-[#080808] px-6 py-24 text-[#F5F0E8]">
            <article className="mx-auto max-w-3xl space-y-8">
                <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">Retour accueil</Link>
                <header>
                    <h1 className="font-serif text-4xl font-black">Politique de confidentialite</h1>
                    <p className="mt-4 text-[#F5F0E8]/55">Cette page explique comment les donnees des apprenants sont utilisees dans le cadre de l'inscription et du suivi pedagogique.</p>
                </header>
                <section className="space-y-5 text-sm leading-7 text-[#F5F0E8]/65">
                    <p><strong className="text-[#F5F0E8]">Donnees collectees:</strong> nom, email, telephone, commune, objectifs, niveau, formule choisie, creneaux, paiement et informations de suivi de formation.</p>
                    <p><strong className="text-[#F5F0E8]">Finalites:</strong> inscription, orientation pedagogique, gestion des paiements, acces au tableau de bord, communication administrative et rappels de cours.</p>
                    <p><strong className="text-[#F5F0E8]">Paiement:</strong> les transactions sont traitees par des prestataires de paiement. Prime Language Academy ne stocke pas les donnees de carte bancaire.</p>
                    <p><strong className="text-[#F5F0E8]">Emails:</strong> les emails automatiques peuvent etre envoyes via Resend ou Gmail SMTP selon la configuration technique.</p>
                    <p><strong className="text-[#F5F0E8]">Droits:</strong> chaque apprenant peut demander la correction ou suppression de ses donnees en contactant l'administration.</p>
                </section>
            </article>
        </main>
    );
}
