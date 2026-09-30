"use server";

import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

let cachedModel: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

// Le test de placement comporte un petit nombre de questions orales.
// On laisse de la marge pour les reprises (micro coupé, re-enregistrement)
// tout en empêchant l'abus de l'API Gemini depuis l'extérieur.
const AI_GRADER_LIMIT = 20;
const AI_GRADER_WINDOW_MS = 15 * 60 * 1000;

function getModel() {
    if (!process.env.GEMINI_API_KEY) return null;
    if (!cachedModel) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        cachedModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
    return cachedModel;
}

async function getClientIp() {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0].trim();
    return headerList.get("x-real-ip") || "unknown";
}

export async function evaluateTranscriptAction(transcript: string, question: string, maxPoints: number) {
    const model = getModel();
    if (!model) {
        console.warn("GEMINI_API_KEY is missing. Falling back to heuristic scoring.");
        return null; // Signals fallback
    }

    const safeTranscript = transcript.trim().slice(0, 4000);
    const safeQuestion = question.trim().slice(0, 1000);
    const safeMaxPoints = Math.max(0, Math.min(Number(maxPoints) || 0, 100));

    if (!safeTranscript) return 0;

    // L'action est appelée depuis la page publique du test de placement :
    // pas de session à exiger, mais un quota par IP est indispensable
    // (sinon l'action est un proxy Gemini gratuit et ouvert).
    const ip = await getClientIp();
    const limited = rateLimit(rateLimitKey("ai-grader-ip", ip), AI_GRADER_LIMIT, AI_GRADER_WINDOW_MS);
    if (!limited.ok) {
        console.warn(`AI grader rate limit reached for ${ip}. Falling back to heuristic scoring.`);
        return null; // Bascule sur la notation heuristique côté client
    }

    const prompt = `
    As an expert English teacher, evaluate the following student response for a placement test.
    Question: "${safeQuestion}"
    Student Response: "${safeTranscript}"
    Max Points: ${safeMaxPoints}

    Evaluation Criteria:
    - Grammar and Syntax
    - Vocabulary Richness
    - Relevance to the question
    - Fluency (based on the transcript)

    Return ONLY a JSON object with the following format:
    {
      "score": number, (between 0 and ${safeMaxPoints}),
      "feedback": "short feedback in French"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response (sometimes models wrap it in markdown blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            const score = Number(data.score);
            if (!Number.isFinite(score)) return null;
            return Math.max(0, Math.min(score, safeMaxPoints));
        }
        return null;
    } catch (error) {
        console.error("AI Evaluation failed:", error);
        return null;
    }
}
