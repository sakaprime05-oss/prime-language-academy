/**
 * Source de vérité unique du programme Prime Language Academy.
 * Mise à jour: livret complet des offres (cycles de 2 mois, 6 sessions par an).
 */

export const PLA_TAGLINE = "Parlez anglais. Devenez Vraiment Bon en Anglais.";

export const PLA_SESSION = {
    label: "Cycle Novembre - Décembre 2026",
    dates: "2 novembre - 31 décembre 2026",
    shortDates: "Novembre - Décembre 2026",
    startDate: "2026-11-02",
    endDate: "2026-12-31",
    duration: "2 mois / 8 semaines",
    registrationFee: 0,
    classCapacity: 15,
    location:
        "Centre Programme 6: Cocody Angré 8e Tranche, à côté du Programme 6, à 120 m du carrefour Pain du Quotidien. Centre Poincaré: 2 Plateaux Vallon, au sein de l'Établissement Henri Poincaré.",
    locationHint:
        "Formation Régulière et Club d'Anglais en présentiel dans nos deux centres (16h-18h et 18h-20h), en visioconférence partout en Côte d'Ivoire, et Formule Weekend Hybride le samedi et le dimanche de 10h00 à 14h00.",
    phone: "+225 01 61 33 78 64",
    phoneCall: "+225 01 61 33 78 64",
    whatsappNumber: "0161337864",
    email: "primelanguageacademy9@gmail.com",
    whatsapp: "https://wa.me/2250161337864",
    appointmentSlots:
        "Zoom: mardi 10h00 - 14h00 / 17h00 - 20h00 et jeudi 09h00 - 14h00 / 17h00 - 20h00. Appel: mercredi 11h00 - 14h00 / 17h00 - 20h00 et samedi 10h00 - 14h00 / 17h00 - 20h00. Sessions de 30 minutes maximum",
} as const;

/** Capacité maximale par salle (présentiel). */
export const PLA_CLASS_CAPACITY = 15;
/** Capacité du Club d'Anglais par vague. */
export const PLA_CLUB_CAPACITY = 15;

/* ──────────────────────────── CYCLES ANNUELS ──────────────────────────── */

export const PLA_CYCLES = [
    { id: "jan-fev", label: "Janvier – Février", order: 1 },
    { id: "mar-avr", label: "Mars – Avril", order: 2 },
    { id: "mai-juin", label: "Mai – Juin", order: 3 },
    { id: "juil-aout", label: "Juillet – Août", order: 4 },
    { id: "sep-oct", label: "Septembre – Octobre", order: 5 },
    { id: "nov-dec", label: "Novembre – Décembre", order: 6 },
] as const;

export const PLA_CURRENT_CYCLE_ID = "nov-dec";

/* ──────────────────────────── PROGRESSION DES NIVEAUX ──────────────────── */

export const PLA_LEVEL_PATH = [
    {
        id: "debutant",
        name: "Débutant",
        summary: "Point de départ: reconstruire des bases claires et oser les premières prises de parole.",
    },
    {
        id: "autonome",
        name: "Autonome",
        summary: "Vous tenez une conversation, vous vous débrouillez seul dans la plupart des situations courantes.",
    },
    {
        id: "mastery",
        name: "Mastery",
        summary: "Niveau fluent en anglais général: aisance, spontanéité et confiance à l'oral comme à l'écrit.",
    },
    {
        id: "mastery-pro",
        name: "Mastery Professionnel",
        summary: "Niveau fluent en anglais de spécialité: vous exercez votre métier en anglais (modules ESP).",
    },
] as const;

/** Libellés de niveau proposés à l'inscription. */
export const PLA_LEVEL_NAMES = PLA_LEVEL_PATH.map((level) => level.name);

export const PLA_LEVEL_PROMISE =
    "Passez sûrement de Débutant à Autonome en 2 mois, d'Autonome à Mastery en 2 mois, puis de Mastery à Mastery Professionnel en 2 mois, en Formation Régulière comme au Club d'Anglais.";

/* ──────────────────────────── MÉTHODE ISO+ ─────────────────────────────── */

export const PLA_METHOD = {
    name: "ISO+",
    subtitle: "Input · Structure · Output + Automatisation",
    intro:
        "La maîtrise d'une langue est un processus vivant et progressif: nourrir, structurer, s'exprimer… puis automatiser. La méthode ISO+ est pensée spécifiquement pour les francophones.",
    pillars: [
        {
            id: "input",
            n: "01",
            title: "INPUT — Nourrir la compréhension",
            subtitle: "Actif & contextuel",
            points: [
                "Exposition à des mots et expressions en contexte réel et à des blocs de sens (chunks) immédiatement utilisables.",
                "Immersion progressive dans les sons et les rythmes pour créer une familiarité naturelle.",
            ],
            principle: "L'input est répété et réutilisé régulièrement pour favoriser une mémorisation durable.",
        },
        {
            id: "structure",
            n: "02",
            title: "STRUCTURATION — Construire une base claire et utile",
            subtitle: "Grammaire fonctionnelle",
            points: [
                "Une grammaire simple et immédiatement applicable.",
                "Les fonctions langagières essentielles: se présenter, demander, expliquer, convaincre…",
                "Des comparaisons stratégiques avec le français pour lever instantanément les blocages.",
            ],
            principle: "La structure reste légère et toujours orientée vers l'expression.",
        },
        {
            id: "output",
            n: "03",
            title: "OUTPUT — S'exprimer dès le début",
            subtitle: "Prise de parole immédiate",
            points: [
                "Prise de parole active dès les premières séances.",
                "Jeux de rôle, mises en situation réelles, dialogues guidés puis libres.",
                "Tâches concrètes (appels, présentations) et défis avec contrainte de temps.",
            ],
            principle: "Développer la fluidité, la spontanéité et la confiance en éliminant la peur de l'erreur.",
        },
        {
            id: "automatisation",
            n: "04",
            title: "AUTOMATISATION — Transformer en réflexes",
            subtitle: "Répétition espacée",
            points: [
                "Répétition intelligente et espacée, exercices rapides de questions-réponses.",
                "Activités sous pression pour réagir vite et répondre sans préparation.",
            ],
            principle: "L'étape clé pour passer de « je comprends » à « je parle facilement », sans réfléchir à la structure.",
        },
    ],
} as const;

/* ──────────────────────────── PARCOURS ─────────────────────────────────── */

export type PlaProgramId = "REGULIERE" | "CLUB" | "WEEKEND";
export type PlaModeId = "PRESENTIEL" | "ONLINE" | "WEEKEND";

export const PLA_PROGRAMS = [
    {
        id: "REGULIERE" as const,
        name: "Formation Régulière",
        emoji: "📘",
        tagline: "Construire, structurer, progresser",
        audience: "Apprenants de tout niveau, du débutant au confirmé.",
        goals: [
            "Reconstruire des bases solides et enrichir le vocabulaire.",
            "Améliorer la compréhension orale et écrite.",
            "Développer une véritable aisance à l'oral comme à l'écrit.",
            "Préparer les exigences linguistiques internationales.",
        ],
        concept:
            "Un parcours structuré qui constitue également une base solide pour préparer les tests internationaux d'anglais, notamment l'IELTS et le TOEFL.",
        activities: [
            "Grammaire & vocabulaire",
            "Compréhension orale",
            "Expression écrite",
            "Compréhension écrite",
            "Expression orale & communication",
        ],
        registerPath: "/register",
    },
    {
        id: "CLUB" as const,
        name: "English Club",
        emoji: "🗣️",
        tagline: "English only. Pratique, réseau, immersion.",
        audience:
            "Apprenants autonomes, avancés, experts et anciens apprenants de PLA souhaitant maintenir et élever leur niveau.",
        goals: [
            "Maintenir le niveau et éviter de perdre l'anglais acquis.",
            "Enrichir le vocabulaire en situation réelle.",
            "Développer une confiance totale à l'oral.",
            "Évoluer dans un environnement anglophone permanent.",
        ],
        concept:
            "Ce n'est pas un cours classique mais un espace vivant de communication. English Only Environment: les échanges se font exclusivement en anglais pour une immersion totale.",
        activities: [
            "Débats (société, business, actualité)",
            "Discussions thématiques",
            "Jeux de rôle & storytelling",
            "Simulations professionnelles",
            "Networking & ateliers de groupe",
            "Interventions spéciales sur scène",
        ],
        registerPath: "/register-club",
    },
    {
        id: "WEEKEND" as const,
        name: "Formule Weekend Hybride",
        emoji: "🎓",
        tagline: "4h par weekend, tout est condensé",
        audience: "Actifs et étudiants indisponibles en semaine qui veulent tout de même avancer vite.",
        goals: [
            "Combiner apprentissage structuré et pratique guidée en une seule séance longue.",
            "Accéder aux ressources numériques et au suivi de la plateforme.",
            "Progresser sans perturber la semaine de travail.",
        ],
        concept:
            "Formule complète et intensive qui combine simultanément apprentissage structuré, pratique guidée (format Club d'Anglais) et ressources numériques. Disponible au Centre Poincaré et en visioconférence, le samedi et le dimanche de 10h00 à 14h00.",
        activities: [
            "Bloc structuration & grammaire fonctionnelle",
            "Bloc pratique orale format Club",
            "Ateliers et mises en situation",
            "Accès plateforme et supports numériques",
        ],
        registerPath: "/register?path=hybrid",
    },
] as const;

export function getProgram(id: PlaProgramId) {
    return PLA_PROGRAMS.find((program) => program.id === id) || PLA_PROGRAMS[0];
}

/* ──────────────────────────── MODULES ESP ──────────────────────────────── */

export const PLA_ESP = {
    title: "Modules de spécialisation métier — ESP",
    subtitle: "English for Specific Purposes",
    intro:
        "Prime Language Academy transcende l'anglais général pour propulser professionnels et étudiants vers une expertise linguistique sectorielle sur-mesure.",
    access:
        "Accessible en Formation Régulière comme au Club d'Anglais, à partir du niveau Autonome.",
    outro:
        "Dès que les bases structurelles et l'aisance conversationnelle sont acquises, le programme bascule vers des mises en situation réelles: études de cas, simulations de négociations et rédactions professionnelles. Vous n'apprenez plus seulement à parler anglais, vous apprenez à exercer votre métier en anglais.",
    modules: [
        { id: "legal", name: "Anglais Juridique", en: "Legal English", emoji: "⚖️" },
        {
            id: "construction",
            name: "Anglais du Bâtiment, Génie Civil et Construction",
            en: "Civil Engineering & Construction English",
            emoji: "🏗️",
        },
        { id: "medical", name: "Anglais Médical & Santé", en: "Medical English", emoji: "🩺" },
        {
            id: "business",
            name: "Anglais des Affaires & Gestion Administrative",
            en: "Business English",
            emoji: "💼",
        },
        {
            id: "electro",
            name: "Anglais de l'Électronique et de l'Électrotechnique",
            en: "Electronics & Electrical Engineering English",
            emoji: "🔌",
        },
        {
            id: "hospitality",
            name: "Anglais de l'Hôtellerie, du Tourisme et de l'Aviation",
            en: "Hospitality, Tourism & Aviation",
            emoji: "✈️",
        },
        {
            id: "finance",
            name: "Anglais Financier, Bancaire & Comptable",
            en: "Finance & Accounting English",
            emoji: "📊",
        },
        {
            id: "it",
            name: "Anglais des Technologies de l'Information et Télécoms",
            en: "IT & Tech English",
            emoji: "💻",
        },
        {
            id: "oil-gas",
            name: "Anglais du Pétrole, du Gaz et des Mines",
            en: "Oil & Gas / Mining English",
            emoji: "⛏️",
        },
    ],
} as const;

/* ──────────────────────────── GRILLE TARIFAIRE ─────────────────────────── */

export type PlaPlan = {
    id: string;
    program: PlaProgramId;
    mode: PlaModeId;
    label: string;
    freq: string;
    shortFreq: string;
    sessions: number;
    price: number;
    top: boolean;
};

export const PLA_ALL_PLANS: readonly PlaPlan[] = [
    // Présentiel — Formation Régulière
    { id: "reg-pres-2", program: "REGULIERE", mode: "PRESENTIEL", label: "Pack 2 séances / semaine", freq: "2 séances / semaine", shortFreq: "2x/sem", sessions: 2, price: 80000, top: false },
    { id: "reg-pres-3", program: "REGULIERE", mode: "PRESENTIEL", label: "Pack 3 séances / semaine", freq: "3 séances / semaine", shortFreq: "3x/sem", sessions: 3, price: 100000, top: true },
    { id: "reg-pres-4", program: "REGULIERE", mode: "PRESENTIEL", label: "Pack 4 séances / semaine", freq: "4 séances / semaine", shortFreq: "4x/sem", sessions: 4, price: 120000, top: false },
    // En ligne — Formation Régulière
    { id: "reg-online-2", program: "REGULIERE", mode: "ONLINE", label: "Pack 2 séances / semaine", freq: "2 séances / semaine", shortFreq: "2x/sem", sessions: 2, price: 70000, top: false },
    { id: "reg-online-3", program: "REGULIERE", mode: "ONLINE", label: "Pack 3 séances / semaine", freq: "3 séances / semaine", shortFreq: "3x/sem", sessions: 3, price: 90000, top: true },
    { id: "reg-online-4", program: "REGULIERE", mode: "ONLINE", label: "Pack 4 séances / semaine", freq: "4 séances / semaine", shortFreq: "4x/sem", sessions: 4, price: 110000, top: false },
    // Présentiel — Club d'Anglais
    { id: "club-pres-2", program: "CLUB", mode: "PRESENTIEL", label: "Pack 2 présences / semaine", freq: "2 présences / semaine", shortFreq: "2x/sem", sessions: 2, price: 60000, top: false },
    { id: "club-pres-3", program: "CLUB", mode: "PRESENTIEL", label: "Pack 3 présences / semaine", freq: "3 présences / semaine", shortFreq: "3x/sem", sessions: 3, price: 80000, top: true },
    { id: "club-pres-4", program: "CLUB", mode: "PRESENTIEL", label: "Pack 4 présences / semaine", freq: "4 présences / semaine", shortFreq: "4x/sem", sessions: 4, price: 100000, top: false },
    // En ligne — Club d'Anglais
    { id: "club-online-2", program: "CLUB", mode: "ONLINE", label: "Pack 2 présences / semaine", freq: "2 présences / semaine", shortFreq: "2x/sem", sessions: 2, price: 50000, top: false },
    { id: "club-online-3", program: "CLUB", mode: "ONLINE", label: "Pack 3 présences / semaine", freq: "3 présences / semaine", shortFreq: "3x/sem", sessions: 3, price: 70000, top: true },
    { id: "club-online-4", program: "CLUB", mode: "ONLINE", label: "Pack 4 présences / semaine", freq: "4 présences / semaine", shortFreq: "4x/sem", sessions: 4, price: 90000, top: false },
    // Weekend Hybride
    { id: "weekend-hybride", program: "WEEKEND", mode: "WEEKEND", label: "4h / weekend", freq: "Samedi ou dimanche, 10h00 - 14h00", shortFreq: "4h/weekend", sessions: 1, price: 50000, top: true },
] as const;

export function plansFor(program: PlaProgramId, mode?: PlaModeId) {
    return PLA_ALL_PLANS.filter((plan) => plan.program === program && (!mode || plan.mode === mode));
}

export function getPlan(planId: string) {
    return PLA_ALL_PLANS.find((plan) => plan.id === planId);
}

/** Formules accessibles depuis le tunnel Formation (Régulière + Weekend Hybride). */
export const PLA_PLANS = [...plansFor("REGULIERE"), ...plansFor("WEEKEND")];
/** Formules accessibles depuis le tunnel English Club. */
export const PLA_CLUB_PLANS = plansFor("CLUB");
export const PLA_WEEKEND_PLAN = plansFor("WEEKEND")[0];

export const PLA_PRICING_TABLE = [
    {
        id: "presentiel",
        mode: "PRESENTIEL" as const,
        title: "Présentiel",
        subtitle: "En centre (Angré 8e Tranche & Poincaré)",
        emoji: "🏢",
        rows: [
            { program: "REGULIERE" as const, name: "Formation Régulière", plans: plansFor("REGULIERE", "PRESENTIEL") },
            { program: "CLUB" as const, name: "Club d'Anglais", plans: plansFor("CLUB", "PRESENTIEL") },
        ],
    },
    {
        id: "online",
        mode: "ONLINE" as const,
        title: "En ligne",
        subtitle: "Visioconférence, où que vous soyez",
        emoji: "💻",
        rows: [
            { program: "REGULIERE" as const, name: "Formation Régulière", plans: plansFor("REGULIERE", "ONLINE") },
            { program: "CLUB" as const, name: "Club d'Anglais", plans: plansFor("CLUB", "ONLINE") },
        ],
    },
    {
        id: "weekend",
        mode: "WEEKEND" as const,
        title: "Weekend",
        subtitle: "Samedi & dimanche, 10h00 - 14h00",
        emoji: "🎓",
        rows: [{ program: "WEEKEND" as const, name: "Weekend Hybride", plans: plansFor("WEEKEND") }],
    },
];

export const PLA_PRICING_NOTES = [
    "Offre spéciale de lancement: frais d'inscription OFFERTS (0 FCFA).",
    "Tarifs valables pour une session complète de 2 mois.",
    "Le solde total doit être réglé avant le début officiel de la formation pour verrouiller votre place. Un simple acompte ne réserve pas définitivement votre place.",
    "Transparence totale: aucun frais caché, aucune dépense surprise durant la session.",
] as const;

/* ──────────────────────────── PLANNINGS ────────────────────────────────── */

export const PLA_TIME_SLOTS = [
    { id: "v1", label: "Vague 1", time: "16h00 - 18h00", desc: "Créneau de fin d'après-midi, en centre ou en visioconférence." },
    { id: "v2", label: "Vague 2", time: "18h00 - 20h00", desc: "Créneau du soir, idéal après une journée de travail." },
] as const;

export const PLA_WEEKEND_TIME_SLOT = {
    id: "weekend",
    label: "Weekend Hybride",
    time: "10h00 - 14h00",
    desc: "Samedi et dimanche, au Centre Poincaré ou en visioconférence.",
} as const;

/** Compatibilité: la Formation Régulière du soir reste sur les deux vagues. */
export const PLA_REGULAR_TIME_SLOTS = PLA_TIME_SLOTS;

export const PLA_CENTERS = [
    {
        id: "programme-6",
        name: "Centre Programme 6",
        place: "Cocody Angré 8e Tranche",
        address: "À côté du Programme 6, à 120 m du carrefour Pain du Quotidien, ruelle longeant la cité Programme 6",
        mapUrl: "https://maps.app.goo.gl/udHU3RYt2qGDjr8C8?g_st=iwb",
        positioning: "Centre d'Angré 8e Tranche: Formation Régulière et Club d'Anglais sur deux vagues chaque soir.",
        highlight: "Régulière + Club · 16h-18h / 18h-20h",
        weekend: false,
        schedule: [
            { days: "Lundi & Mercredi", program: "Club d'Anglais", slots: ["16h00 - 18h00", "18h00 - 20h00"] },
            { days: "Mardi & Jeudi", program: "Formation Régulière", slots: ["16h00 - 18h00", "18h00 - 20h00"] },
            { days: "Vendredi", program: "Formation Régulière / Club d'Anglais", slots: ["16h00 - 18h00", "18h00 - 20h00"] },
        ],
        programs: [
            {
                name: "Formation Régulière",
                slots: ["Vague 1: 16h00 - 18h00", "Vague 2: 18h00 - 20h00"],
                schedule: "Mardi & jeudi (et vendredi selon la vague)",
                summary: "Grammaire fonctionnelle, vocabulaire, compréhension et expression orale avec la méthode ISO+.",
            },
            {
                name: "Club d'Anglais",
                slots: ["Vague 1: 16h00 - 18h00", "Vague 2: 18h00 - 20h00"],
                schedule: "Lundi & mercredi (et vendredi selon la vague)",
                summary: "English Only Environment: débats, jeux de rôle, storytelling et networking.",
            },
        ],
    },
    {
        id: "poincare",
        name: "Centre Poincaré",
        place: "Établissement Henri Poincaré",
        address: "Cocody 2 Plateaux Vallon, Abidjan",
        mapUrl: "https://maps.app.goo.gl/6hsw26QJcq55zyv69?g_st=iwb",
        positioning: "Centre principal: Formation Régulière, Club d'Anglais et Formule Weekend Hybride.",
        highlight: "Centre principal · Weekend Hybride disponible",
        weekend: true,
        schedule: [
            { days: "Lundi & Mercredi", program: "Formation Régulière", slots: ["18h00 - 20h00"] },
            { days: "Mardi & Jeudi", program: "Club d'Anglais", slots: ["18h00 - 20h00"] },
            { days: "Vendredi", program: "Formation Régulière / Club d'Anglais", slots: ["18h00 - 20h00"] },
            { days: "Samedi & Dimanche", program: "Formule Weekend Hybride", slots: ["10h00 - 14h00"] },
        ],
        programs: [
            {
                name: "Formation Régulière",
                slots: ["Vague 2: 18h00 - 20h00"],
                schedule: "Lundi & mercredi (et vendredi selon la vague)",
                summary: "Parcours complet pour développer la compréhension, la structure et l'expression active.",
            },
            {
                name: "Club d'Anglais",
                slots: ["Vague 2: 18h00 - 20h00"],
                schedule: "Mardi & jeudi (et vendredi selon la vague)",
                summary: "Pratique régulière pour maintenir le niveau, développer la fluidité et réseauter en anglais.",
            },
            {
                name: "Formule Weekend Hybride",
                slots: ["10h00 - 14h00"],
                schedule: "Samedi & dimanche",
                summary: "4 heures condensées: structuration, pratique guidée format Club et ressources numériques.",
            },
        ],
    },
] as const;

export const PLA_ONLINE_CENTER = {
    id: "online",
    name: "En ligne — Visioconférence",
    place: "Où que vous soyez",
    highlight: "Régulière + Club + Weekend Hybride",
    programs: "Formation Régulière, Club d'Anglais et Formule Weekend Hybride.",
    schedule: [
        { days: "Lundi & Mercredi", program: "Formation Régulière / Club d'Anglais", slots: ["16h00 - 18h00", "18h00 - 20h00"] },
        { days: "Mardi & Jeudi", program: "Club d'Anglais / Formation Régulière", slots: ["16h00 - 18h00", "18h00 - 20h00"] },
        { days: "Vendredi", program: "Formation Régulière / Club d'Anglais", slots: ["16h00 - 18h00", "18h00 - 20h00"] },
        { days: "Samedi & Dimanche", program: "Formule Weekend Hybride", slots: ["10h00 - 14h00"] },
    ],
} as const;

export const PLA_WEEK_RHYTHM =
    "La session se déroule principalement du lundi au samedi, avec des activités et des suivis pouvant s'étendre au dimanche selon le parcours.";

/* ──────────────────────────── CONFORT & AVANTAGES ──────────────────────── */

export const PLA_AMENITIES = [
    {
        id: "capacity",
        title: "15 places maximum par salle",
        desc: "Une attention personnalisée et une interaction idéale pour chaque apprenant en présentiel.",
        emoji: "👥",
    },
    {
        id: "comfort",
        title: "Infrastructures confortables",
        desc: "Salles sécurisées et climatisées, WiFi haut débit, grand espace de stationnement et cadre paysager.",
        emoji: "🏢",
    },
    {
        id: "breakout",
        title: "Espace Breakout",
        desc: "Un espace dédié aux rafraîchissements et à la restauration pour se détendre entre les activités.",
        emoji: "☕",
    },
    {
        id: "evening",
        title: "Soirée & en ligne",
        desc: "Apprenez l'esprit libre après le travail, chez vous ou en centre, sans perturber votre emploi du temps.",
        emoji: "🌙",
    },
] as const;

export const PLA_EARLY_ACCESS = {
    title: "Votre formation commence dès votre inscription",
    intro:
        "N'attendez pas le début des activités pour progresser. Dès la validation de votre inscription et la réservation de votre place, vous accédez immédiatement à:",
    benefits: [
        "Test de niveau initial pour évaluer précisément vos besoins.",
        "Accès immédiat à la plateforme de formation numérique.",
        "Documentation pédagogique complète offerte.",
        "Préformation et préparation en amont du programme.",
        "Séances d'accompagnement en visioconférence avec nos consultants et formateurs.",
    ],
} as const;

/* ──────────────────────────── CORPORATE / B2B ──────────────────────────── */

export const PLA_CORPORATE = {
    title: "Solutions sur-mesure: Corporate, B to B & formations privées",
    intro:
        "Pour les besoins spécifiques des organisations et des particuliers exigeants, Prime Language Academy conçoit des programmes exclusifs à Abidjan et partout en Côte d'Ivoire.",
    offers: [
        { id: "private", name: "Formations privées", desc: "Cours particuliers pour particuliers, rythme et objectifs sur-mesure." },
        { id: "b2b", name: "Formations B to B & en entreprise", desc: "Groupes, collectifs ou associations, en centre, sur site ou en visioconférence." },
    ],
    quote:
        "Ces programmes haut de gamme sont entièrement flexibles. Modalités, calendrier et tarification sont validés sur prise de rendez-vous préalable, afin d'éditer un devis adapté à vos objectifs de performance.",
} as const;

/* ──────────────────────────── FAQ ──────────────────────────────────────── */

export const PLA_FAQ = [
    {
        question: "Quelle est la différence entre la Formation Régulière et le Club d'Anglais ?",
        answer:
            "La Formation Régulière sert à apprendre, structurer et débloquer l'expression: grammaire fonctionnelle, vocabulaire, compréhension et expression. Le Club d'Anglais est un espace de pratique en English Only Environment, réservé aux profils déjà autonomes qui veulent maintenir leur niveau, réseauter et gagner en confiance.",
    },
    {
        question: "En quoi consiste la Formule Weekend Hybride ?",
        answer:
            "C'est une séance de 4 heures le samedi ou le dimanche, de 10h00 à 14h00, qui combine apprentissage structuré, pratique guidée au format Club et ressources numériques. Elle est disponible au Centre Poincaré et en visioconférence, à 50 000 FCFA la session de 2 mois.",
    },
    {
        question: "Combien coûte la formation ?",
        answer:
            "En présentiel, la Formation Régulière va de 80 000 à 120 000 FCFA la session de 2 mois selon la fréquence (2, 3 ou 4 séances par semaine), et le Club d'Anglais de 60 000 à 100 000 FCFA. En ligne, comptez 70 000 à 110 000 FCFA pour la Formation Régulière et 50 000 à 90 000 FCFA pour le Club. Les frais d'inscription sont offerts.",
    },
    {
        question: "Y a-t-il des frais d'inscription ?",
        answer:
            "Non. Les frais d'inscription sont offerts (0 FCFA) pour l'offre de lancement. Vous ne payez que votre formule, sans aucun frais caché.",
    },
    {
        question: "Comment se passe le paiement ?",
        answer:
            "Le solde total doit être réglé avant le début officiel de la formation afin de garantir et verrouiller votre place. Face à la forte demande, un simple acompte ne valide pas la réservation définitive. Les inscriptions ouvrent plusieurs semaines à l'avance pour vous permettre de solder sereinement.",
    },
    {
        question: "Puis-je me spécialiser dans mon domaine professionnel ?",
        answer:
            "Oui. À partir du niveau Autonome, les modules ESP (English for Specific Purposes) sont accessibles en Formation Régulière comme au Club: juridique, médical, business, finance, IT, pétrole et gaz, BTP, hôtellerie-tourisme-aviation, électronique.",
    },
    {
        question: "En combien de temps puis-je devenir fluent ?",
        answer:
            "Nos cycles durent 2 mois. Le parcours type: Débutant à Autonome en 2 mois, Autonome à Mastery (fluent en anglais général) en 2 mois, puis Mastery à Mastery Professionnel (fluent en anglais de spécialité) en 2 mois.",
    },
    {
        question: "Quand commencent les sessions ?",
        answer:
            "Nos formations s'organisent en 6 sessions de 2 mois par an: janvier-février, mars-avril, mai-juin, juillet-août, septembre-octobre et novembre-décembre.",
    },
    {
        question: "Puis-je rattraper une séance manquée ?",
        answer:
            "Oui. En cas d'imprévu, vous pouvez rattraper votre séance sur l'autre vague horaire de la même journée ou sur un autre créneau de la semaine, selon disponibilité.",
    },
    {
        question: "Dois-je acheter des livres ?",
        answer:
            "Non. Les supports pédagogiques sont offerts en format numérique et accessibles sur smartphone, tablette ou ordinateur.",
    },
    {
        question: "Est-ce que je reçois une attestation ?",
        answer:
            "Oui. Une attestation de formation peut être délivrée en fin de session, selon l'assiduité, la participation et l'évaluation du niveau.",
    },
    {
        question: "Puis-je accéder à la plateforme avant le début officiel ?",
        answer:
            "Oui. Dès votre inscription, vous accédez immédiatement à la plateforme, à la documentation pédagogique complète, à une préformation et à des séances d'accompagnement en visioconférence.",
    },
    {
        question: "Proposez-vous des formations en entreprise ou des cours particuliers ?",
        answer:
            "Oui. Les formations privées et les programmes B to B sont entièrement sur-mesure. Les modalités, le calendrier et la tarification sont définis lors d'un rendez-vous préalable avec un consultant, qui aboutit à un devis personnalisé.",
    },
] as const;

/* ──────────────────────────── PLANS DE TEST PAYSTACK ───────────────────── */

export const PLA_PAYSTACK_TEST_PLAN = {
    id: "paystack-live-test-1000",
    label: "Test Paystack Live",
    freq: "Test unique",
    shortFreq: "test",
    price: 1000,
    sessions: 1,
    top: false,
} as const;

export const PLA_PAYSTACK_SPLIT_TEST_PLAN = {
    id: "paystack-live-split-test-2000",
    label: "Test Paystack Live 2 fois",
    freq: "Test 2 fois",
    shortFreq: "test-2x",
    price: 2000,
    sessions: 1,
    top: false,
} as const;

/* ──────────────────────────── HELPERS ──────────────────────────────────── */

/** Anciennes formules (avant la grille 2026) conservées pour l'affichage historique. */
const LEGACY_PLAN_LABELS: Record<string, string> = {
    loisir: "Loisir (1 séance/sem) — ancienne grille",
    essentiel: "Essentiel (2 séances/sem) — ancienne grille",
    equilibre: "Équilibre (3 séances/sem) — ancienne grille",
    performance: "Performance (4 séances/sem) — ancienne grille",
    intensif: "Intensif (5 séances/sem) — ancienne grille",
    immersion: "Immersion (6 séances/sem) — ancienne grille",
};

export function planLabel(planId?: string | null) {
    if (!planId) return "Formule non renseignée";
    const plan = getPlan(planId);
    if (plan) {
        const programName = getProgram(plan.program).name;
        return plan.program === "WEEKEND" ? `${programName} (${plan.freq})` : `${programName} — ${plan.label}`;
    }
    if (planId === PLA_PAYSTACK_TEST_PLAN.id) return PLA_PAYSTACK_TEST_PLAN.label;
    if (planId === PLA_PAYSTACK_SPLIT_TEST_PLAN.id) return PLA_PAYSTACK_SPLIT_TEST_PLAN.label;
    return LEGACY_PLAN_LABELS[planId] || planId;
}

export function planSessionsPerWeek(planId?: string | null) {
    const plan = planId ? getPlan(planId) : undefined;
    if (plan) return plan.sessions;
    const legacy: Record<string, number> = { loisir: 1, essentiel: 2, equilibre: 3, performance: 4, intensif: 5, immersion: 6 };
    return (planId && legacy[planId]) || 1;
}

export function formatFcfa(amount: number) {
    return `${amount.toLocaleString("fr-FR")} FCFA`;
}
