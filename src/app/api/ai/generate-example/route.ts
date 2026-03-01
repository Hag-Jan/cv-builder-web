import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResumeV2 } from "@/types/resume-schema-v2";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "AI API Key not configured. Please add GEMINI_API_KEY to your environment." },
                { status: 500 }
            );
        }

        const body = await req.json();
        const role: string = body?.role?.trim();
        const templateId: string = body?.templateId || "professional-classic";

        if (!role) {
            return NextResponse.json(
                { error: "A job role is required to generate a resume example." },
                { status: 400 }
            );
        }

        if (role.length > 120) {
            return NextResponse.json(
                { error: "Role description is too long. Please limit to 120 characters." },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 3000,
                responseMimeType: "application/json",
            },
        });

        const today = new Date().toISOString().slice(0, 10);

        const prompt = `You are an elite executive resume strategist producing a gold-standard ATS resume example for the role: "${role}".

STRICT RULES — violating any of these is a failure:
1. ALL experience bullets MUST start with a strong past-tense action verb followed immediately by a measurable outcome (e.g., "Reduced", "Scaled", "Delivered"). Format: [Action verb] [what] by [specific metric], enabling [business outcome].
2. Use executive-level vocabulary. Zero tolerance for generic filler phrases like "responsible for", "worked on", "helped with", "assisted", "collaborated on".
3. Every metric must be realistic and specific: percentages, dollar amounts, headcount, time savings, NPS scores, ARR, etc. Do NOT use placeholders like [XX%].
4. Summary must be 3 sentences: sentence 1 = career identity + years of experience, sentence 2 = signature achievement with metric, sentence 3 = core expertise domains.
5. Skills must be grouped into 4–5 labelled categories (e.g., "Leadership", "Technical Stack", "Methodologies", "Tools"). No vague or single-word skills.
6. ATS-safe output: no tables, no graphics, no special characters beyond standard punctuation.
7. The resume must have exactly 2–3 experience entries, and each must have 3–5 bullets.
8. Include exactly 1 education entry.
9. The output must be ONLY valid JSON matching the schema below — no markdown fences, no commentary.

SCHEMA (ResumeV2 — follow exactly):
{
  "resumeId": "string (generate a short unique slug, e.g. 'vp-sales-example-01')",
  "schemaVersion": "2.0",
  "templateId": "${templateId}",
  "metadata": { "createdAt": "${today}T00:00:00Z", "updatedAt": "${today}T00:00:00Z" },
  "sections": [
    {
      "id": "contact-1", "type": "contact", "order": 0,
      "name": "string (realistic full name fitting the role)",
      "email": "string (professional email)",
      "phone": "+1 (555) XXX-XXXX",
      "location": "City, ST",
      "linkedin": "linkedin.com/in/handle",
      "github": "github.com/handle (only if technical role, else omit)",
      "website": "string (only if relevant, else omit)"
    },
    {
      "id": "summary-1", "type": "summary", "order": 1,
      "content": "string (3 sentences, executive tone, no first-person pronouns)"
    },
    {
      "id": "experience-1", "type": "experience", "order": 2,
      "items": [
        {
          "id": "exp-1",
          "company": "string (realistic company name)",
          "role": "string (realistic senior job title)",
          "location": "City, ST",
          "startDate": "YYYY-MM",
          "endDate": "YYYY-MM or Present",
          "bullets": ["string (3–5 bullets, each starting with action verb + specific metric)"]
        }
      ]
    },
    {
      "id": "skills-1", "type": "skills", "order": 3,
      "categories": [
        { "id": "cat-1", "label": "string", "skills": ["skill1", "skill2"] }
      ]
    },
    {
      "id": "education-1", "type": "education", "order": 4,
      "items": [
        {
          "id": "edu-1",
          "school": "string",
          "degree": "string",
          "date": "YYYY-MM"
        }
      ]
    }
  ]
}

Generate a highly polished, realistic resume example for: "${role}". Return only the JSON object.`;

        const result = await model.generateContent(prompt);
        const rawText = result.response.text().trim();

        // Strip any accidental markdown fences
        const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

        let resume: ResumeV2;
        try {
            resume = JSON.parse(cleaned);
        } catch {
            console.error("JSON parse error. Raw response:", rawText.substring(0, 500));
            return NextResponse.json(
                { error: "AI returned malformed JSON. Please try again." },
                { status: 500 }
            );
        }

        // Basic structural validation
        if (
            resume.schemaVersion !== "2.0" ||
            !Array.isArray(resume.sections) ||
            resume.sections.length < 4
        ) {
            return NextResponse.json(
                { error: "Generated resume failed schema validation. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ resume });

    } catch (error) {
        console.error("Generate Example Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
