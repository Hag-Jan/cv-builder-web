import { NextRequest, NextResponse } from "next/server";
import { ATSAnalysisRequest, ATSAnalysisResponse } from "@/types/ats-types";
import {
    extractKeywords,
    extractResumeText,
    matchKeywords,
    calculateDeterministicScore,
    detectWarnings,
    analyzeBullets,
    getTopImpactFixes,
} from "@/lib/ats/ats-analyzer";

export async function POST(request: NextRequest) {
    try {
        const body: ATSAnalysisRequest = await request.json();
        const { resume, jobDescription } = body;

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

        // Analyze bullets deterministically
        const bulletAnalysis = analyzeBullets(resume);

        // Calculate enhanced deterministic score
        const { finalScore, delta } = calculateDeterministicScore(
            matched.length,
            jobKeywords.length,
            bulletAnalysis
        );

        // Generate Top 3 Impact Fixes
        const topImpactFixes = getTopImpactFixes(missing, bulletAnalysis);

        // Detect warnings
        const warnings = detectWarnings(resume, matched);

        // Build response
        const response: ATSAnalysisResponse = {
            score: finalScore,
            matchedKeywords: matched,
            missingKeywords: missing,
            warnings,
            bulletAnalysis,
            scoreDelta: delta,
            topImpactFixes,
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
