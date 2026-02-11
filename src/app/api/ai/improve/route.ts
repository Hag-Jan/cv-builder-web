import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIImproveRequest, AIImproveResponse } from "@/types/ai-types";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Temporary in-memory usage tracking for MVP (will reset on server restart)
const usageTracker = new Map<string, number>();
const MAX_FREE_CALLS = 3;

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body: AIImproveRequest = await request.json();
        const { text, jobDescription, missingKeywords } = body;

        // Validate input
        if (!text || !jobDescription) {
            return NextResponse.json(
                { error: "Missing required fields: text and jobDescription" },
                { status: 400 }
            );
        }

        // Simple usage tracking (in-memory for MVP)
        const userId = request.headers.get("x-user-id") || "anonymous";
        const currentUsage = usageTracker.get(userId) || 0;

        if (currentUsage >= MAX_FREE_CALLS) {
            return NextResponse.json(
                { error: "Free usage limit reached (3 calls). Upgrade to premium for unlimited access." },
                { status: 403 }
            );
        }

        // Prepare AI prompt with STAR method  
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are an expert resume writer specializing in ATS optimization and the STAR method.

TASK: Improve this resume bullet point by:
1. Following the STAR method (Situation, Task, Action, Result)
2. Adding measurable impact with specific numbers or percentages
3. Naturally incorporating these missing keywords: ${missingKeywords.join(", ")}
4. Using strong action verbs
5. Keeping each suggestion under 25 words
6. Making the bullet ATS-friendly

ORIGINAL BULLET:
"${text}"

JOB DESCRIPTION CONTEXT:
${jobDescription.substring(0, 500)}...

REQUIREMENTS:
- Generate exactly 3 diverse improved versions
- Each must include at least 2-3 of the missing keywords naturally
- Include quantifiable metrics (numbers, percentages, etc.)
- Use different action verbs for variety
- Format as a simple JSON array of strings
- Do not include bullet points (•) in the output

Return ONLY a valid JSON array with exactly 3 strings, nothing else. Example format:
["suggestion 1", "suggestion 2", "suggestion 3"]`;

        const result = await model.generateContent(prompt);
        const response = result.response;

        // Add safety checks
        if (!response) {
            console.error("No response from Gemini API");
            return NextResponse.json(
                { error: "Failed to get response from AI model" },
                { status: 500 }
            );
        }

        const responseText = response.text();
        console.log("Gemini response:", responseText);

        // Parse JSON response
        let suggestions: string[];
        try {
            // Clean up the response (remove markdown code blocks if present)
            const cleanedText = responseText
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();

            suggestions = JSON.parse(cleanedText);

            // Validate we got exactly 3 suggestions
            if (!Array.isArray(suggestions) || suggestions.length !== 3) {
                console.error("Invalid suggestions array:", suggestions);
                throw new Error("Invalid number of suggestions");
            }
        } catch (parseError) {
            console.error("Failed to parse AI response:", responseText, parseError);
            return NextResponse.json(
                { error: "Failed to generate valid suggestions. Please try again." },
                { status: 500 }
            );
        }

        // Increment usage count (in-memory)
        usageTracker.set(userId, currentUsage + 1);
        const remainingCalls = MAX_FREE_CALLS - (currentUsage + 1);

        // Return suggestions
        const responseData: AIImproveResponse = {
            suggestions,
            remainingCalls,
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error("AI Improve API error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}
