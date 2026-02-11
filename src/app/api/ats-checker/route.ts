import { NextRequest, NextResponse } from "next/server";
import { ATSAnalysisRequest, ATSAnalysisResponse } from "@/types/ats-types";
import {
    extractKeywords,
    extractResumeText,
    matchKeywords,
    calculateScore,
    detectWarnings,
} from "@/lib/ats/ats-analyzer";

export async function POST(request: NextRequest) {
    try {
        const body: ATSAnalysisRequest = await request.json();
        const { resume, jobDescription } = body;

        // Validate inputs
        if (!resume) {
            return NextResponse.json(
                { error: "Resume data is required" },
                { status: 400 }
            );
        }

        if (!jobDescription || jobDescription.trim().length === 0) {
            return NextResponse.json(
                { error: "Job description is required" },
                { status: 400 }
            );
        }

        // Extract keywords from job description
        const jobKeywords = extractKeywords(jobDescription);

        // If no meaningful keywords found
        if (jobKeywords.length === 0) {
            return NextResponse.json(
                {
                    error: "No meaningful keywords found in job description. Please provide a more detailed job description.",
                },
                { status: 400 }
            );
        }

        // Extract text from resume
        const resumeText = extractResumeText(resume);

        // Match keywords
        const { matched, missing } = matchKeywords(resumeText, jobKeywords);

        // Calculate score
        const score = calculateScore(matched.length, jobKeywords.length);

        // Detect warnings
        const warnings = detectWarnings(resume, matched);

        // Build response
        const response: ATSAnalysisResponse = {
            score,
            matchedKeywords: matched,
            missingKeywords: missing,
            warnings,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("ATS Checker error:", error);
        return NextResponse.json(
            { error: "Internal server error during ATS analysis" },
            { status: 500 }
        );
    }
}
