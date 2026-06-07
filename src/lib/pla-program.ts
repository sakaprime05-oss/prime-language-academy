export const PLA_SESSION = {
    label: "Session de lancement",
    dates: "11 juillet - 12 septembre 2026",
    startDate: "2026-07-11",
    endDate: "2026-09-12",
    duration: "2 mois / 8 semaines",
    registrationFee: 0,
    classCapacity: 15,
    location: "Centre Programme 6: Cocody Angré 8e Tranche, à côté du Programme 6, à 120 m du carrefour Pain du Quotidien. Centre Poincaré: 2 Plateaux Vallon, au sein de l'Établissement Henri Poincaré.",
    locationHint: "Les deux centres accueillent la Formation Hybride en présentiel, matin et soirée. Le Club d'Anglais est disponible au Centre Poincaré. La visioconférence est disponible pour la Formation Hybride.",
    phone: "+225 01 61 33 78 64",
    email: "primelanguageacademy9@gmail.com",
    whatsapp: "https://wa.me/2250161337864",
    appointmentSlots: "Zoom: mardi 10h00 - 14h00 / 17h00 - 20h00 et jeudi 09h00 - 14h00 / 17h00 - 20h00. Appel: mercredi 11h00 - 14h00 / 17h00 - 20h00 et samedi 10h00 - 14h00 / 17h00 - 20h00. Sessions de 30 minutes maximum",
};

export const PLA_CLUB_CAPACITY = 26;

const PLA_BASE_PLANS = [
    { id: "loisir", label: "Loisir", freq: "1 séance / semaine", shortFreq: "1x/sem", price: 52000, top: false },
    { id: "essentiel", label: "Essentiel", freq: "2 séances / semaine", shortFreq: "2x/sem", price: 72000, top: false },
    { id: "equilibre", label: "Équilibre", freq: "3 séances / semaine", shortFreq: "3x/sem", price: 92000, top: false },
    { id: "performance", label: "Performance", freq: "4 séances / semaine", shortFreq: "4x/sem", price: 112000, top: false },
    { id: "intensif", label: "Intensif", freq: "5 séances / semaine", shortFreq: "5x/sem", price: 132000, top: false },
    { id: "immersion", label: "Immersion", freq: "6 séances / semaine", shortFreq: "6x/sem", price: 152000, top: true },
] as const;

export const PLA_PLANS = PLA_BASE_PLANS;
export const PLA_CLUB_PLANS = PLA_PLANS;

export const PLA_PAYSTACK_TEST_PLAN = {
    id: "paystack-live-test-1000",
    label: "Test Paystack Live",
    freq: "Test unique",
    shortFreq: "test",
    price: 1000,
    top: false,
} as const;

export const PLA_PAYSTACK_SPLIT_TEST_PLAN = {
    id: "paystack-live-split-test-2000",
    label: "Test Paystack Live 2 fois",
    freq: "Test 2 fois",
    shortFreq: "test-2x",
    price: 2000,
    top: false,
} as const;

export const PLA_REGULAR_TIME_SLOTS = [
    { id: "v1", label: "Vague 1", time: "16h00 - 18h00", desc: "Formation Hybride en soirée, disponible dans les deux centres. Club d'Anglais disponible au Centre Poincaré." },
    { id: "v2", label: "Vague 2", time: "18h00 - 20h00", desc: "Formation Hybride en soirée, disponible dans les deux centres. Club d'Anglais disponible au Centre Poincaré." },
] as const;

export const PLA_HYBRID_TIME_SLOT = {
    id: "v3",
    label: "Vague 3",
    time: "09h00 - 12h00",
    desc: "Formation Hybride du matin, disponible en présentiel dans les deux centres, du lundi au samedi",
} as const;

export const PLA_ONLINE_TIME_SLOT = {
    id: "online-v1",
    label: "Visioconférence",
    time: "17h30 - 20h30",
    desc: "Formation Hybride en ligne, tous les jours, où que vous soyez",
} as const;

export const PLA_TIME_SLOTS = PLA_REGULAR_TIME_SLOTS;

export const PLA_CENTERS = [
    {
        id: "programme-6",
        name: "Centre Programme 6",
        place: "Cocody Angré 8e Tranche",
        address: "À côté du Programme 6, à 120 m du carrefour Pain du Quotidien, ruelle longeant la cité Programme 6",
        mapUrl: "https://maps.app.goo.gl/udHU3RYt2qGDjr8C8?g_st=iwb",
        positioning: "Centre principal à Angré 8e Tranche, avec la Formation Hybride en matinée et en soirée.",
        highlight: "Centre principal: Hybride matin + soirée",
        programs: [
            {
                name: "Formation Hybride Soirée",
                slots: ["Vague 1: 16h00 - 18h00", "Vague 2: 18h00 - 20h00"],
                schedule: "Du lundi au samedi",
                summary: "Apprentissage structuré, pratique guidée, supports numériques et suivi pour progresser après la journée.",
            },
            {
                name: "Formation Hybride Matin",
                slots: ["Vague 3: 09h00 - 12h00"],
                schedule: "Du lundi au samedi",
                summary: "Format intensif du matin avec cours, pratique guidée, plateforme et accompagnement.",
            },
        ],
    },
    {
        id: "poincare",
        name: "Centre Poincaré",
        place: "Établissement Henri Poincaré",
        address: "Cocody 2 Plateaux Vallon, Abidjan",
        mapUrl: "https://maps.app.goo.gl/6hsw26QJcq55zyv69?g_st=iwb",
        positioning: "Centre premium complet de Prime Language Academy, avec Formation Hybride et English Club.",
        highlight: "Centre complet: Hybride + English Club",
        programs: [
            {
                name: "Formation Hybride Soirée",
                slots: ["Vague 1: 16h00 - 18h00", "Vague 2: 18h00 - 20h00"],
                schedule: "Du lundi au samedi",
                summary: "Parcours complet pour développer la compréhension, la structure et l'expression active.",
            },
            {
                name: "Club d'Anglais",
                slots: ["Vague 1: 16h00 - 18h00", "Vague 2: 18h00 - 20h00"],
                schedule: "Du lundi au samedi",
                summary: "Pratique régulière pour maintenir le niveau, développer la fluidité et parler plus naturellement.",
            },
            {
                name: "Formation Hybride Matin",
                slots: ["Vague 3: 09h00 - 12h00"],
                schedule: "Du lundi au samedi",
                summary: "Apprentissage structuré, pratique guidée et ressources numériques pour accélérer la progression.",
            },
        ],
    },
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
        answer: "Oui. Une attestation de formation peut être délivrée en fin de session, selon l'assiduité, la participation et l'évaluation du niveau.",
    },
    {
        question: "Comment se passe le paiement ?",
        answer: "L'inscription est offerte pour la session de lancement. Le solde de la formation doit être réglé avant le début des cours afin de garantir votre place.",
    },
    {
        question: "Formation Hybride et English Club, est-ce pareil ?",
        answer: "Non. La Formation Hybride sert à apprendre, structurer et débloquer l'expression. Le English Club est réservé aux profils déjà autonomes qui veulent pratiquer, réseauter et maintenir leur niveau en immersion.",
    },
    {
        question: "Y a-t-il des frais d'inscription ?",
        answer: "Non. Les frais d'inscription sont offerts (0 FCFA) pour toutes nos offres. Vous ne payez que vos cours — aucun frais caché.",
    },
    {
        question: "Puis-je accéder à la plateforme avant le début officiel ?",
        answer: "Oui ! Dès votre inscription, vous accédez immédiatement à notre plateforme de formation, à la documentation pédagogique complète et à une préformation pour bien démarrer. N'attendez pas le 11 juillet pour progresser.",
    },
] as const;

export function formatFcfa(amount: number) {
    return `${amount.toLocaleString("fr-FR")} FCFA`;
}
