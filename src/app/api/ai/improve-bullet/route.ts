import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

interface ImproveBulletRequest {
    bulletId: string;
    originalBullet: string;
    targetKeywords: string[];
    jobTitle: string;
}

interface ImproveBulletResponse {
    bulletId: string;
    improvedBullet: string;
    keywordsIntegrated: string[];
    actionVerb: string;
    hasMetric: boolean;
}

function buildPrompt(originalBullet: string, targetKeywords: string[], jobTitle: string): string {
    return `
You are an expert resume writer using the STAR method (Situation, Task, Action, Result).

Rewrite the following resume bullet for a "${jobTitle}" role.

Original Bullet:
"${originalBullet}"

Target Keywords (integrate 1-2 naturally, do NOT keyword stuff):
${targetKeywords.join(", ")}

Requirements:
1. Use STAR structure with emphasis on measurable impact.
2. Start with a strong action verb.
3. Integrate 1-2 target keywords naturally.
4. Do NOT fabricate metrics or experience.
5. Do NOT copy wording from job descriptions.
6. If already strong, improve clarity without changing meaning.
7. Return ONLY the improved bullet text.
8. Plain text only. No symbols, no quotes, no explanations.
`;
}

export async function POST(req: NextRequest) {
    try {
        const AI_ENABLED = false; // Force disable AI

        if (!AI_ENABLED) {
            return NextResponse.json(
                { error: "AI optimization temporarily unavailable. Deterministic optimization is active." },
                { status: 503 } // Service Unavailable
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("Missing Gemini API Key");
            return NextResponse.json(
                { error: "Missing API Configuration" },
                { status: 500 }
            );
        }

        /* 
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 256,
            }
        });
        */

        const body: ImproveBulletRequest = await req.json();
        const { bulletId, originalBullet, targetKeywords, jobTitle } = body;

        if (!bulletId || !originalBullet || !targetKeywords || !jobTitle) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // const prompt = buildPrompt(originalBullet, targetKeywords, jobTitle);
        // const result = await model.generateContent(prompt);
        // const response = await result.response;
        // const responseText = response.text();
        //
        // let improvedBullet = responseText.trim();
        // improvedBullet = improvedBullet.replace(/^["']|["']$/g, "").replace(/\*\*/g, "").replace(/^\* /, "");

        // Mock response for now if we ever re-enable this code block without AI
        const improvedBullet = originalBullet;

        const actionVerb = improvedBullet.split(" ")[0];

        const metricRegex = /\d+%|\$\d+[kKmM]?|\d+\+? (users|clients|projects|hours|months|years)/;
        const hasMetric = metricRegex.test(improvedBullet);

        const normalizedBullet = improvedBullet.toLowerCase();
        const keywordsIntegrated = targetKeywords.filter((keyword) =>
            normalizedBullet.includes(keyword.toLowerCase())
        );

        const responseData: ImproveBulletResponse = {
            bulletId,
            improvedBullet,
            keywordsIntegrated,
            actionVerb,
            hasMetric,
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Gemini Error:", JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
