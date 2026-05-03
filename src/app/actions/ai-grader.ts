"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

let cachedModel: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

function getModel() {
    if (!process.env.GEMINI_API_KEY) return null;
    if (!cachedModel) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        cachedModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
    return cachedModel;
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
