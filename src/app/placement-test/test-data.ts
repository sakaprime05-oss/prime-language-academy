// ============================================================
// PLACEMENT TEST DATA — 25 points total
// ============================================================

export type QuestionType = "mcq" | "short" | "audio-record" | "long-text";

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  questionFr?: string; // French instruction for clarity
  options?: string[];
  correctAnswer?: string;
  acceptableAnswers?: string[]; // For fuzzy matching on short answers
  points: number;
}

export interface TestSection {
  id: string;
  title: string;
  icon: string;
  description?: string;
  readingPassage?: string;
  audioText?: string; // Text to be synthesized as audio
  questions: Question[];
  totalPoints: number;
}

// ============================================================
// SECTION 1 — Informations du candidat (0 pts — info only)
// ============================================================
const section1: TestSection = {
  id: "info",
  title: "Informations du candidat",
  icon: "📍",
  description: "Ces informations nous aident à personnaliser votre parcours.",
  questions: [
    {
      id: 1,
      type: "short",
      question: "Nom et Prénoms",
      points: 0,
    },
    {
      id: 2,
      type: "short",
      question: "Contact WhatsApp",
      points: 0,
    },
    {
      id: 3,
      type: "mcq",
      question: "Avez-vous déjà étudié l'anglais ?",
      options: ["Oui, un peu", "Oui, régulièrement", "Pas vraiment", "Jamais"],
      points: 0,
    },
  ],
  totalPoints: 0,
};

// ============================================================
// SECTION 2 — Compréhension écrite (3 pts)
// ============================================================
const section2: TestSection = {
  id: "reading",
  title: "Compréhension écrite",
  icon: "📘",
  description: "Lisez attentivement le texte ci-dessous puis répondez aux questions.",
  readingPassage:
    "John works in Treichville. Every morning, he wakes up at 6:00, drinks a cup of coffee and takes a taxi to work. He likes his job because he meets many people. After work, he usually goes home to spend time with his family.",
  questions: [
    {
      id: 4,
      type: "mcq",
      question: "What time does John wake up?",
      options: ["5:00", "6:00", "7:00", "8:00"],
      correctAnswer: "6:00",
      points: 1,
    },
    {
      id: 5,
      type: "mcq",
      question: "How does he go to work?",
      options: ["By bus", "By taxi", "On foot", "By train"],
      correctAnswer: "By taxi",
      points: 1,
    },
    {
      id: 6,
      type: "mcq",
      question: "Why does he like his job?",
      options: [
        "Because it is easy",
        "Because he meets many people",
        "Because he travels",
        "Because he works from home",
      ],
      correctAnswer: "Because he meets many people",
      points: 1,
    },
  ],
  totalPoints: 3,
};

// ============================================================
// SECTION 3 — Grammaire (8 pts)
// ============================================================
const section3: TestSection = {
  id: "grammar",
  title: "Grammaire",
  icon: "🧩",
  description: "Testez vos connaissances grammaticales en anglais.",
  questions: [
    {
      id: 7,
      type: "mcq",
      question: 'I ___ to the market yesterday.',
      options: ["go", "went", "gone"],
      correctAnswer: "went",
      points: 1,
    },
    {
      id: 8,
      type: "mcq",
      question: 'She ___ English very well.',
      options: ["speak", "speaks", "speaking"],
      correctAnswer: "speaks",
      points: 1,
    },
    {
      id: 9,
      type: "mcq",
      question: 'They ___ in Abidjan since 2019.',
      options: ["live", "lived", "have lived"],
      correctAnswer: "have lived",
      points: 1,
    },
    {
      id: 10,
      type: "mcq",
      question: 'He is ___ than his brother.',
      options: ["tall", "taller", "tallest"],
      correctAnswer: "taller",
      points: 1,
    },
    {
      id: 11,
      type: "short",
      question: 'Corrigez la phrase : "He don\'t like rice."',
      questionFr: "Écrivez la phrase corrigée en anglais.",
      correctAnswer: "He doesn't like rice.",
      acceptableAnswers: [
        "he doesn't like rice",
        "he doesn't like rice.",
        "he does not like rice",
        "he does not like rice.",
      ],
      points: 1,
    },
    {
      id: 12,
      type: "short",
      question: 'Mettez au futur : "We start the meeting at 9."',
      questionFr: "Réécrivez la phrase au futur.",
      correctAnswer: "We will start the meeting at 9.",
      acceptableAnswers: [
        "we will start the meeting at 9",
        "we will start the meeting at 9.",
        "we'll start the meeting at 9",
        "we'll start the meeting at 9.",
        "we are going to start the meeting at 9",
        "we are going to start the meeting at 9.",
      ],
      points: 1,
    },
    {
      id: 13,
      type: "short",
      question: 'Faites une question : "You are a teacher."',
      questionFr: "Transformez cette phrase en question.",
      correctAnswer: "Are you a teacher?",
      acceptableAnswers: [
        "are you a teacher",
        "are you a teacher?",
      ],
      points: 1,
    },
    {
      id: 14,
      type: "short",
      question: 'Mettez au passé : "She buys fruit."',
      questionFr: "Réécrivez la phrase au passé simple.",
      correctAnswer: "She bought fruit.",
      acceptableAnswers: [
        "she bought fruit",
        "she bought fruit.",
        "she bought fruits",
        "she bought fruits.",
      ],
      points: 1,
    },
  ],
  totalPoints: 8,
};

// ============================================================
// SECTION 4 — Compréhension orale (3 pts)
// ============================================================
const section4: TestSection = {
  id: "listening",
  title: "Compréhension orale",
  icon: "🎧",
  description:
    "Écoutez attentivement l'audio, puis répondez aux questions. Vous pouvez réécouter l'audio autant de fois que nécessaire.",
  audioText:
    "Hello, my name is Sarah. I'm calling to ask about your English classes. I would like to know the schedule and the price. Also, do you offer online lessons?",
  questions: [
    {
      id: 15,
      type: "mcq",
      question: "Why is Sarah calling?",
      options: [
        "To complain",
        "To ask about English classes",
        "To cancel a class",
        "To talk to a friend",
      ],
      correctAnswer: "To ask about English classes",
      points: 1,
    },
    {
      id: 16,
      type: "mcq",
      question: "What two things does she want to know?",
      options: [
        "Classrooms and teachers",
        "Schedule and price",
        "Books and exams",
        "Payment methods",
      ],
      correctAnswer: "Schedule and price",
      points: 1,
    },
    {
      id: 17,
      type: "mcq",
      question: "What additional service does she ask about?",
      options: [
        "Private lessons",
        "Online lessons",
        "Job opportunities",
        "Late classes",
      ],
      correctAnswer: "Online lessons",
      points: 1,
    },
  ],
  totalPoints: 3,
};

// ============================================================
// SECTION 5 — Expression orale (7 pts — audio recording)
// ============================================================
const section5: TestSection = {
  id: "speaking",
  title: "Expression orale",
  icon: "🗣️",
  description:
    "Enregistrez vos réponses audio en anglais. Cliquez sur le micro pour commencer, puis cliquez à nouveau pour arrêter.",
  questions: [
    {
      id: 18,
      type: "audio-record",
      question: "Introduce yourself in English (name, job, activities).",
      questionFr: "Présentez-vous en anglais (nom, métier, activités).",
      points: 3,
    },
    {
      id: 19,
      type: "audio-record",
      question: "Describe your daily routine.",
      questionFr: "Décrivez votre routine quotidienne.",
      points: 2,
    },
    {
      id: 20,
      type: "audio-record",
      question: "Why do you want to learn English?",
      questionFr: "Pourquoi voulez-vous apprendre l'anglais ?",
      points: 2,
    },
  ],
  totalPoints: 7,
};

// ============================================================
// SECTION 6 — Expression écrite (4 pts)
// ============================================================
const section6: TestSection = {
  id: "writing",
  title: "Expression écrite",
  icon: "✍️",
  description: "Rédigez votre réponse en anglais. Essayez d'écrire des phrases complètes et variées.",
  questions: [
    {
      id: 21,
      type: "long-text",
      question:
        "Describe your weekend in 3–4 sentences. (For advanced learners: Describe a problem at work and how you solved it.)",
      questionFr:
        "Décrivez votre week-end en 3–4 phrases. (Niveau avancé : décrivez un problème au travail et comment vous l'avez résolu.)",
      points: 4,
    },
  ],
  totalPoints: 4,
};

// ============================================================
// EXPORT ALL SECTIONS
// ============================================================
export const testSections: TestSection[] = [
  section1,
  section2,
  section3,
  section4,
  section5,
  section6,
];

export const TOTAL_TEST_POINTS = 25;

// ============================================================
// SCORING FUNCTIONS
// ============================================================

/**
 * Normalizes a string for comparison: lowercase, trim, remove extra spaces, remove trailing punctuation.
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/, "")
    .trim();
}

/**
 * Check if a short answer matches any of the acceptable answers.
 */
export function scoreShortAnswer(userAnswer: string, question: Question): number {
  if (!userAnswer || !question.acceptableAnswers) return 0;

  const normalizedUser = normalize(userAnswer);

  for (const acceptable of question.acceptableAnswers) {
    if (normalize(acceptable) === normalizedUser) {
      return question.points;
    }
  }

  // Partial credit: check if the key transformation is present
  if (question.correctAnswer) {
    const correctNorm = normalize(question.correctAnswer);
    // If the user's answer contains at least 70% of the correct answer's words
    const correctWords = correctNorm.split(" ");
    const userWords = normalizedUser.split(" ");
    const matchCount = correctWords.filter((w) => userWords.includes(w)).length;
    if (matchCount / correctWords.length >= 0.7) {
      return question.points; // full credit for close enough
    }
  }

  return 0;
}

/**
 * Score MCQ: simple direct comparison.
 */
export function scoreMCQ(userAnswer: string, question: Question): number {
  if (!userAnswer || !question.correctAnswer) return 0;
  return normalize(userAnswer) === normalize(question.correctAnswer) ? question.points : 0;
}

/**
 * Score audio recording based on transcript quality and duration.
 * Heuristic combines effort (duration) and content (transcript analysis).
 */
export function scoreAudioRecording(durationSeconds: number, maxPoints: number, transcript: string): number {
  if (durationSeconds <= 0 || !transcript || transcript.trim().length === 0) return 0;

  const words = transcript.trim().split(/\s+/);
  const wordCount = words.length;

  // 1. Effort Score (based on duration) - 40% of max points
  let effortScore = 0;
  if (durationSeconds >= 30) effortScore = maxPoints * 0.4;
  else if (durationSeconds >= 15) effortScore = maxPoints * 0.3;
  else if (durationSeconds >= 5) effortScore = maxPoints * 0.2;
  else effortScore = maxPoints * 0.1;

  // 2. Content Score (based on word count and vocabulary) - 60% of max points
  let contentScore = 0;
  
  // Complexity indicators
  const advancedKeywords = [
    "because", "however", "therefore", "although", "consequently",
    "especially", "actually", "basically", "usually", "frequently",
    "experience", "opportunity", "management", "development", "challenge"
  ];
  
  const hasComplexity = words.some(w => advancedKeywords.includes(w.toLowerCase()));
  
  if (wordCount >= 40) contentScore = maxPoints * 0.6;
  else if (wordCount >= 20) contentScore = maxPoints * 0.4;
  else if (wordCount >= 10) contentScore = maxPoints * 0.2;
  else contentScore = maxPoints * 0.1;

  if (hasComplexity) contentScore += (maxPoints * 0.1);

  const finalScore = Math.min(Math.round(effortScore + contentScore), maxPoints);
  return finalScore;
}

/**
 * Score written expression based on text analysis (heuristic).
 * Criteria:
 * - Word count (minimum 15 words for any points)
 * - Sentence structure (at least 2 sentences)
 * - Basic English word detection
 */
export function scoreWrittenExpression(text: string, maxPoints: number): number {
  if (!text || text.trim().length === 0) return 0;

  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Common English words to check if the text is actually in English
  const englishIndicators = [
    "i", "the", "a", "an", "is", "am", "are", "was", "were", "my", "your",
    "he", "she", "it", "we", "they", "have", "has", "do", "does", "did",
    "will", "would", "can", "could", "this", "that", "and", "but", "or",
    "in", "on", "at", "to", "for", "with", "from", "by", "not", "like",
    "go", "went", "work", "home", "day", "time", "morning", "weekend",
  ];

  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ""));
  const englishWordCount = lowerWords.filter((w) => englishIndicators.includes(w)).length;
  const englishRatio = wordCount > 0 ? englishWordCount / wordCount : 0;

  let score = 0;

  // Word count scoring (up to 2 points)
  if (wordCount >= 30) score += 2;
  else if (wordCount >= 15) score += 1;

  // Sentence variety (up to 1 point)
  if (sentenceCount >= 3) score += 1;
  else if (sentenceCount >= 2) score += 0.5;

  // English content (up to 1 point)
  if (englishRatio >= 0.3) score += 1;
  else if (englishRatio >= 0.15) score += 0.5;

  return Math.min(Math.round(score), maxPoints);
}

/**
 * Get recommended level based on total score.
 */
export function getRecommendedLevel(totalScore: number): {
  level: string;
  description: string;
  color: string;
} {
  if (totalScore <= 10) {
    return {
      level: "Débutant",
      description:
        "Vous êtes au début de votre apprentissage. Notre Formation Régulière vous aidera à construire des bases solides en grammaire, vocabulaire et compréhension.",
      color: "emerald",
    };
  } else if (totalScore <= 17) {
    return {
      level: "Intermédiaire",
      description:
        "Vous avez des bases en anglais et pouvez communiquer dans des situations simples. Notre programme vous aidera à gagner en fluidité et en confiance.",
      color: "amber",
    };
  } else {
    return {
      level: "Avancé",
      description:
        "Vous maîtrisez bien l'anglais ! Notre programme vous perfectionnera et vous préparera à des échanges professionnels et académiques de haut niveau.",
      color: "violet",
    };
  }
}
