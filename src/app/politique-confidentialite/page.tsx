import Link from "next/link";

export const metadata = {
    title: "Politique de confidentialité | Prime Language Academy",
    description: "Gestion des données personnelles collectées par Prime Language Academy.",
};

export default function ConfidentialitePage() {
    return (
        <main className="min-h-screen bg-[#080808] px-6 py-24 text-[#F5F0E8]">
            <article className="mx-auto max-w-3xl space-y-8">
                <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#E7162A] hover:underline">Retour accueil</Link>
                <header>
                    <h1 className="font-serif text-4xl font-black">Politique de confidentialité</h1>
                    <p className="mt-4 text-[#F5F0E8]/55">Cette page explique comment les données des apprenants sont utilisées dans le cadre de l'inscription et du suivi pédagogique.</p>
                </header>
                <section className="space-y-5 text-sm leading-7 text-[#F5F0E8]/65">
                    <p><strong className="text-[#F5F0E8]">Données collectées:</strong> nom, email, téléphone, commune, objectifs, niveau, formule choisie, créneaux, paiement et informations de suivi de formation.</p>
                    <p><strong className="text-[#F5F0E8]">Finalités:</strong> inscription, orientation pédagogique, gestion des paiements, accès au tableau de bord, communication administrative et rappels de cours.</p>
                    <p><strong className="text-[#F5F0E8]">Paiement:</strong> les transactions sont traitées par des prestataires de paiement. Prime Language Academy ne stocke pas les données de carte bancaire.</p>
                    <p><strong className="text-[#F5F0E8]">Emails:</strong> les emails automatiques peuvent être envoyés via Resend ou Gmail SMTP selon la configuration technique.</p>
                    <p><strong className="text-[#F5F0E8]">Droits:</strong> chaque apprenant peut demander la correction ou suppression de ses données en contactant l'administration.</p>
                </section>
            </article>
        </main>
    );
}
