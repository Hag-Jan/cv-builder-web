import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResumeV2 } from "@/types/resume-schema-v2";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
    try {
        const { resume }: { resume: ResumeV2 } = await req.json();

        if (!resume) {
            return NextResponse.json({ error: "Resume data is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Build a context string from experience and education
        const experienceText = resume.sections
            .filter(s => s.type === 'experience')
            .flatMap(s => (s as any).items || [])
            .map((i: any) => `${i.role} at ${i.company}: ${i.bullets?.join(' ')}`)
            .join('\n');

        const educationText = resume.sections
            .filter(s => s.type === 'education')
            .flatMap(s => (s as any).items || [])
            .map((i: any) => `${i.degree} from ${i.school}`)
            .join('\n');

        const skillsText = resume.sections
            .filter(s => s.type === 'skills')
            .flatMap(s => (s as any).categories || [])
            .map((c: any) => `${c.label}: ${c.skills?.join(', ')}`)
            .join('\n');

        const prompt = `You are a professional resume writer. Generate a compelling, 3-4 sentence professional summary based on the following resume data.
Focus on years of experience, key achievements, and core technical skills.

EXPERIENCE:
${experienceText}

EDUCATION:
${educationText}

SKILLS:
${skillsText}

REQUIREMENTS:
- Be concise and punchy.
- Use a professional tone.
- Do not use first-person pronouns (no "I", "me", "my").
- Focus on value proposition.
- Return ONLY the summary text.`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text().trim().replace(/^"|"$/g, '');

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("Summary Generation Error:", error);
        return NextResponse.json({
            error: "Failed to generate summary",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
