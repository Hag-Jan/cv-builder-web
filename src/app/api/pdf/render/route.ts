import { NextRequest, NextResponse } from 'next/server';
import { getTemplate } from '@/lib/pdf/templateEngine';
import { ResumeV2 as Resume } from '@/types/resume-schema-v2';
import React from 'react';

// Use a simple in-memory cache for the "render" data
// In a real production app with multiple instances, you'd use Redis or similar.
// But for local/single-instance dev, this works perfectly for the goto() flow.
const renderCache = new Map<string, any>();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, resume } = body;

        if (id && resume) {
            renderCache.set(id, resume);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to cache' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !renderCache.has(id)) {
        return new NextResponse('<h1>Resume Not Found</h1><p>The render session may have expired.</p>', {
            status: 404,
            headers: { 'Content-Type': 'text/html' },
        });
    }

    const resumeRaw = renderCache.get(id) as Resume;
    const { sanitizeResumeObject } = await import('@/lib/utils/sanitizer');

    // 1. Filter out duplicate sections (common source of "duplicated text" bug)
    // We only treat specific sections as singletons.
    const singletonTypes = ['contact', 'summary', 'experience', 'education', 'skills', 'projects'];
    const seenTypes = new Set<string>();
    const seenIds = new Set<string>();

    const filteredSections = resumeRaw.sections.filter((section: any) => {
        // Prevent exact ID duplicates first
        if (seenIds.has(section.id)) return false;
        seenIds.add(section.id);

        // Then handle singleton type duplicates
        if (singletonTypes.includes(section.type)) {
            if (seenTypes.has(section.type)) return false;
            seenTypes.add(section.type);
        }
        return true;
    });

    // 2. Comprehensive Sanitization
    const resume = {
        ...sanitizeResumeObject(resumeRaw),
        sections: filteredSections.map(s => sanitizeResumeObject(s))
    };

    const { HtmlComponent } = getTemplate(resume.templateId);

    const { renderToStaticMarkup } = await import('react-dom/server');
    const htmlContent = renderToStaticMarkup(React.createElement(HtmlComponent, { resume }));

    const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            @page {
                size: A4;
                margin: 0; /* Let body handle margins for cross-page consistency */
            }

            html, body {
                margin: 0;
                padding: 0;
                width: 210mm; /* Strict A4 width */
                background: white;
            }

            body { 
                font-family: 'Inter', sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .resume-container {
                width: 210mm;
                /* Standard resume margins: ~0.75in */
                padding: 19mm; 
                min-height: 297mm;
                box-sizing: border-box;
            }

            /* Prevent sections from breaking across pages in an ugly way */
            .resume-entry-block {
                page-break-inside: avoid;
                break-inside: avoid;
                margin-bottom: 0.2rem;
            }

            @media print {
                html, body {
                    height: auto;
                    overflow: visible;
                }
                .resume-container {
                    padding: 19mm;
                }
            }
        </style>
    </head>
    <body class="bg-white">
        <div class="resume-container">
            ${htmlContent}
        </div>
    </body>
    </html>
    `;

    // Optionally cleanup after some time or after this request
    // renderCache.delete(id); // If we want to be strict, but might break if Puppeteer needs a reload

    return new NextResponse(fullHtml, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
        },
    });
}
