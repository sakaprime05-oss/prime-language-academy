"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function evaluateTranscriptAction(transcript: string, question: string, maxPoints: number) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing. Falling back to heuristic scoring.");
        return null; // Signals fallback
    }

    if (!transcript || transcript.trim().length === 0) return 0;

    const prompt = `
    As an expert English teacher, evaluate the following student response for a placement test.
    Question: "${question}"
    Student Response: "${transcript}"
    Max Points: ${maxPoints}

    Evaluation Criteria:
    - Grammar and Syntax
    - Vocabulary Richness
    - Relevance to the question
    - Fluency (based on the transcript)

    Return ONLY a JSON object with the following format:
    {
      "score": number, (between 0 and ${maxPoints}),
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
            return data.score;
        }
        return null;
    } catch (error) {
        console.error("AI Evaluation failed:", error);
        return null;
    }
}
