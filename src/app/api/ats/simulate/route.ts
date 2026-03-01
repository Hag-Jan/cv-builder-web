import { NextResponse } from 'next/server';
import { ResumeV2 } from "@/types/resume-schema-v2";
import { InternalHtmlParser } from "@/lib/ats/InternalHtmlParser";
import { generateAtsReport } from "@/lib/ats/utils";
import { renderTemplateToHtml } from "@/lib/render/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { resume, templateId, engineId } = body;

        if (!resume || !templateId) {
            return NextResponse.json(
                { error: "Missing 'resume' or 'templateId' in request body." },
                { status: 400 }
            );
        }

        // 1. Render HTML on the server
        const htmlContext = await renderTemplateToHtml(resume as ResumeV2, templateId);

        // 2. Select the ATS parser engine (Internal HTML for now, can be swapped)
        const parser = new InternalHtmlParser();

        // 3. Parse the rendered HTML
        const parsedResume = await parser.parse({ html: htmlContext });

        // 4. Generate diff and score
        const report = generateAtsReport(resume, parsedResume) as any;

        // Attach the raw parsed resume for deep debugging
        report.parsedResume = parsedResume;

        return NextResponse.json(report, { status: 200 });

    } catch (error: any) {
        console.error("[ATS Simulation Error]:", error);
        return NextResponse.json(
            { error: "Internal Server Error during ATS simulation.", details: error.message },
            { status: 500 }
        );
    }
}
