import { ResumeV2 as Resume } from "@/types/resume-schema-v2";
import { extractResumeText, extractKeywords, matchKeywords, calculateScore } from "@/lib/ats/ats-analyzer";

/**
 * Interface for AI Bullet improvement suggestions.
 */
export interface BulletImprovementResult {
    suggestions: string[];
    remainingCalls: number;
}

/**
 * Fetches 3 improved versions of a resume bullet point.
 */
export async function getBulletImprovements(
    bulletText: string,
    jobDescription?: string,
    missingKeywords: string[] = []
): Promise<BulletImprovementResult> {
    const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text: bulletText,
            jobDescription,
            missingKeywords
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get AI suggestions");
    }

    return await response.json();
}

/**
 * Generates a professional summary based on the full resume state.
 */
export async function generateAisummary(resume: Resume): Promise<string> {
    const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate summary");
    }

    const { summary } = await response.json();
    return summary;
}

/**
 * Analyzes the match between a resume and job description.
 */
export interface MatchAnalysis {
    score: number;
    missingKeywords: string[];
    recommendations: string[];
}

export async function analyzeJobMatch(resume: Resume, jobDescription: string): Promise<MatchAnalysis> {
    const response = await fetch("/api/ai/analyze-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze match");
    }

    return await response.json();
}

/**
 * Helper to update a single bullet in the resume state.
 */
export function applyImprovedBullet(
    resume: Resume,
    sectionId: string,
    itemId: string,
    bulletIndex: number,
    newText: string
): Resume {
    const updatedResume: Resume = JSON.parse(JSON.stringify(resume));
    const section = updatedResume.sections.find((s) => s.id === sectionId);

    if (section?.type === "experience") {
        const item = (section as any).items.find((i: any) => i.id === itemId);
        if (item && item.bullets) {
            item.bullets[bulletIndex] = newText.trim();
        }
    } else if (section?.type === "projects") {
        const item = (section as any).items.find((i: any) => i.id === itemId);
        if (item && item.bullets) {
            item.bullets[bulletIndex] = newText.trim();
        }
    }

    return updatedResume;
}
