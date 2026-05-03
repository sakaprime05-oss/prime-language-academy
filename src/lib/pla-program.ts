export const PLA_SESSION = {
    label: "Session de lancement",
    dates: "21 juin - 19 août 2026",
    duration: "2 mois",
    location: "92VJ+R6, Abidjan, Cocody Angré 8e Tranche, Zone Bon Prix",
    locationHint: "À 120 m en face du carrefour Pain du Quotidien",
    phone: "+225 01 61 33 78 64",
    whatsapp: "https://wa.me/2250161337864",
};

export const PLA_CLUB_CAPACITY = 26;

export const PLA_PLANS = [
    { id: "loisir", label: "Loisir", freq: "1 séance / semaine", shortFreq: "1x/sem", price: 50000, top: false },
    { id: "essentiel", label: "Essentiel", freq: "2 séances / semaine", shortFreq: "2x/sem", price: 70000, top: false },
    { id: "equilibre", label: "Équilibre", freq: "3 séances / semaine", shortFreq: "3x/sem", price: 90000, top: false },
    { id: "performance", label: "Performance", freq: "4 séances / semaine", shortFreq: "4x/sem", price: 110000, top: false },
    { id: "intensif", label: "Intensif", freq: "5 séances / semaine", shortFreq: "5x/sem", price: 130000, top: false },
    { id: "immersion", label: "Immersion", freq: "6 séances / semaine", shortFreq: "6x/sem", price: 150000, top: true },
] as const;

export const PLA_TIME_SLOTS = [
    { id: "v1", label: "Vague 1", time: "16h00 - 18h00", desc: "Idéal pour les étudiants et apprenants disponibles en fin d'après-midi" },
    { id: "v2", label: "Vague 2", time: "18h00 - 20h00", desc: "Idéal pour les professionnels après le travail" },
] as const;

export const PLA_FAQ = [
    {
        question: "Puis-je rattraper une séance manquée ?",
        answer: "Oui. En cas d'imprévu, vous pouvez rattraper votre séance sur l'autre vague horaire de la même journée ou sur un autre créneau de la semaine, selon disponibilité.",
    },
    {
        question: "Dois-je acheter des livres ?",
        answer: "Non. Les supports pédagogiques sont offerts en format numérique et accessibles sur smartphone, tablette ou ordinateur.",
    },
    {
        question: "Est-ce que je reçois une attestation ?",
        answer: "Oui. Une attestation de formation est délivrée en fin de session, avec votre niveau selon le cadre européen CECRL, de A1 à C2.",
    },
    {
        question: "Comment se passe le paiement ?",
        answer: "L'inscription est offerte pour la session de lancement. Le solde de la formation doit être réglé avant le début des cours afin de garantir votre place.",
    },
    {
        question: "Formation régulière et English Club, est-ce pareil ?",
        answer: "Non. La formation régulière construit les bases et la structure. Le English Club est dédié à la pratique, la fluidité et l'immersion sociale. Les deux parcours sont distincts.",
    },
] as const;

export function formatFcfa(amount: number) {
    return `${amount.toLocaleString("fr-FR")} FCFA`;
}
