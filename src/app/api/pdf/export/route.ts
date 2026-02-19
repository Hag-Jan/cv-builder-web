import { NextRequest, NextResponse } from 'next/server';
import { generatePdfWithPuppeteer } from '@/lib/pdf/pdf-service';
import { ResumeV2 } from '@/types/resume-schema-v2';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { resume, paper = 'A4' } = body;

        if (!resume) {
            return NextResponse.json({ error: 'Missing resume data' }, { status: 400 });
        }

        const options = { paperSize: paper as 'A4' | 'Letter' };

        console.log(`Generating PDF for resumeId: ${resume.resumeId}, paper: ${paper}`);
        const pdfBuffer = await generatePdfWithPuppeteer(resume, options);
        console.log(`PDF Generated. Size: ${pdfBuffer.length} bytes`);

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="ResumeATS.pdf"`,
                'Content-Length': pdfBuffer.length.toString(),
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        });
    } catch (error) {
        console.error('PDF Export Error:', error);
        return NextResponse.json({
            error: 'Failed to generate PDF',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
