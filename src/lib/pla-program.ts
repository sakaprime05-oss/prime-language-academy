export const PLA_SESSION = {
    label: "Session de lancement",
    dates: "21 juin - 19 aout 2026",
    duration: "2 mois",
    location: "92VJ+R6, Abidjan, Cocody Angre 8e Tranche, Zone Bon Prix",
    locationHint: "A 120 m en face du carrefour Pain du Quotidien",
    phone: "+225 01 61 33 78 64",
    whatsapp: "https://wa.me/2250161337864",
};

export const PLA_PLANS = [
    { id: "loisir", label: "Loisir", freq: "1 seance / semaine", shortFreq: "1x/sem", price: 50000, top: false },
    { id: "essentiel", label: "Essentiel", freq: "2 seances / semaine", shortFreq: "2x/sem", price: 70000, top: false },
    { id: "equilibre", label: "Equilibre", freq: "3 seances / semaine", shortFreq: "3x/sem", price: 90000, top: false },
    { id: "performance", label: "Performance", freq: "4 seances / semaine", shortFreq: "4x/sem", price: 110000, top: false },
    { id: "intensif", label: "Intensif", freq: "5 seances / semaine", shortFreq: "5x/sem", price: 130000, top: false },
    { id: "immersion", label: "Immersion", freq: "6 seances / semaine", shortFreq: "6x/sem", price: 150000, top: true },
] as const;

export const PLA_TIME_SLOTS = [
    { id: "v1", label: "Vague 1", time: "16h00 - 18h00", desc: "Ideal pour les etudiants et apprenants disponibles en fin d'apres-midi" },
    { id: "v2", label: "Vague 2", time: "18h00 - 20h00", desc: "Ideal pour les professionnels apres le travail" },
] as const;

export const PLA_FAQ = [
    {
        question: "Puis-je rattraper une seance manquee ?",
        answer: "Oui. En cas d'imprevu, vous pouvez rattraper votre seance sur l'autre vague horaire de la meme journee ou sur un autre creneau de la semaine, selon disponibilite.",
    },
    {
        question: "Dois-je acheter des livres ?",
        answer: "Non. Les supports pedagogiques sont offerts en format numerique et accessibles sur smartphone, tablette ou ordinateur.",
    },
    {
        question: "Est-ce que je recois une attestation ?",
        answer: "Oui. Une attestation de formation est delivree en fin de session, avec votre niveau selon le cadre europeen CECRL, de A1 a C2.",
    },
    {
        question: "Comment se passe le paiement ?",
        answer: "L'inscription est offerte pour la session de lancement. Le solde de la formation doit etre regle avant le debut des cours afin de garantir votre place.",
    },
    {
        question: "Formation reguliere et English Club, est-ce pareil ?",
        answer: "Non. La formation reguliere construit les bases et la structure. Le English Club est dedie a la pratique, la fluidite et l'immersion sociale. Les deux parcours sont distincts.",
    },
] as const;

export function formatFcfa(amount: number) {
    return `${amount.toLocaleString("fr-FR")} FCFA`;
}
