import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIImproveRequest, AIImproveResponse } from "@/types/ai-types";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Simple usage tracking (in-memory for MVP - reset on restart)
const usageTracker = new Map<string, number>();
const MAX_FREE_CALLS = 10; // Increased for development/testing

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "AI API Key not configured. Please add GEMINI_API_KEY to your environment." },
                { status: 500 }
            );
        }

        // Parse request body
        const body: AIImproveRequest = await request.json();
        const { text: originalBullet, jobDescription, missingKeywords } = body;

        // Validate input
        if (!originalBullet) {
            return NextResponse.json(
                { error: "Missing bullet text to improve." },
                { status: 400 }
            );
        }

        // Simple usage tracking
        const userId = request.headers.get("x-user-id") || "anonymous";
        const currentUsage = usageTracker.get(userId) || 0;

        if (currentUsage >= MAX_FREE_CALLS) {
            return NextResponse.json(
                { error: "Usage limit reached. Upgrade for more AI optimizations." },
                { status: 403 }
            );
        }

        // Use the latest flash model for speed and quality
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 500,
            }
        });

        const prompt = `You are an elite resume strategist and STAR method expert.
Your goal is to transform a mediocre resume bullet into 3 high-impact, ATS-optimized versions.

ORIGINAL BULLET:
"${originalBullet}"

${jobDescription ? `TARGET JOB DESCRIPTION (for context):\n${jobDescription.substring(0, 1000)}` : ""}

${missingKeywords?.length ? `INTEGRATE THESE KEYWORDS (naturally):\n${missingKeywords.join(", ")}` : ""}

STRATEGY:
1. Version 1 (Metric-Focused): Emphasize quantifiable results ($, %, #).
2. Version 2 (Action-Focused): Use strong, varied action verbs (e.g., Spearheaded, Orchestrated, Optimized).
3. Version 3 (Skill-Focused): Highlight technical proficiency and domain expertise.

REQUIREMENTS:
- Strictly follow the STAR (Situation, Task, Action, Result) structure.
- Each bullet must be concise (one sentence, ~15-25 words).
- Use professional, high-energy language.
- DO NOT use placeholders like "[XX%]" or "[Metric]". Invent plausible metrics based on the context if none are provided, but keep them realistic.
- DO NOT include bullet points or quotes in the strings.

OUTPUT FORMAT:
Return ONLY a valid JSON array of exactly 3 strings.

Example:
["Spearheaded a cross-functional team to reduce deployment latency by 40% using Kubernetes and Docker.", "Optimized cloud infrastructure which resulted in a 15% reduction in monthly AWS expenditure.", "Architected a scalable microservices layer that improved system uptime to 99.9% for 50k+ active users."]`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const responseText = response.text();

        // Clean up response text to ensure it's valid JSON
        const cleanedText = responseText.replace(/```json\n?|```/g, "").trim();
        let suggestions: string[];

        try {
            suggestions = JSON.parse(cleanedText);
            if (!Array.isArray(suggestions) || suggestions.length !== 3) {
                throw new Error("Invalid suggestions format");
            }
        } catch (e) {
            console.error("AI Response Parsing Error:", responseText);
            return NextResponse.json(
                { error: "Failed to parse AI suggestions. Please try again." },
                { status: 500 }
            );
        }

        // Update usage
        usageTracker.set(userId, currentUsage + 1);
        const remainingCalls = MAX_FREE_CALLS - (currentUsage + 1);

        return NextResponse.json({
            suggestions,
            remainingCalls
        } as AIImproveResponse);

    } catch (error) {
        console.error("AI Improvement Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
