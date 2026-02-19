import { NextRequest, NextResponse } from 'next/server';
import { getTemplate } from '@/lib/pdf/templateEngine';
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

    const resume = renderCache.get(id);
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
            body { 
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
            }
            .resume-container {
                width: 100%;
                background: white;
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
