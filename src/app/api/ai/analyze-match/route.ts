import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractResumeText } from "@/lib/ats/ats-analyzer";
import { ResumeV2 } from "@/types/resume-schema-v2";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
    try {
        const { resume, jobDescription }: { resume: ResumeV2, jobDescription: string } = await req.json();

        if (!resume || !jobDescription) {
            return NextResponse.json({ error: "Resume and Job Description are required" }, { status: 400 });
        }

        const resumeText = extractResumeText(resume);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `Analyze the match between this resume and the job description.
Return a JSON object with:
1. "score": A match percentage (0-100).
2. "missingKeywords": A list of important technical or soft skills mentioned in the job description but missing from the resume.
3. "recommendations": Top 3 actionable suggestions to improve the match.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return only valid JSON.`;

        const result = await model.generateContent(prompt);
        const responseData = JSON.parse(result.response.text());

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Match Analyzer Error:", error);
        return NextResponse.json({
            error: "Failed to analyze match",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
