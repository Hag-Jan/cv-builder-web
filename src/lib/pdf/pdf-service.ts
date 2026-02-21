import puppeteer from 'puppeteer';
import { ResumeV2 } from '@/types/resume-schema-v2';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'debug-pdf.log');

function logStep(step: string) {
    const message = `[${new Date().toISOString()}] ${step}\n`;
    fs.appendFileSync(LOG_FILE, message);
    console.log(step);
}

export interface ExportOptions {
    paperSize: 'A4' | 'Letter';
}

/**
 * Generates a professional PDF using Puppeteer via a dedicated render endpoint.
 * Follows strict user requirements for browser initialization and page navigation.
 */
export async function generatePdfWithPuppeteer(resume: ResumeV2, options: ExportOptions): Promise<Buffer> {
    const renderId = uuidv4();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    logStep(`2a) generatePdfWithPuppeteer started. RenderID: ${renderId}`);

    // 1. Warm up the render cache by sending the data to the render API
    try {
        logStep(`2b) Warming up render cache at ${baseUrl}/api/pdf/render`);
        const cacheRes = await fetch(`${baseUrl}/api/pdf/render`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: renderId, resume }),
        });
        logStep(`2c) Cache warm-up status: ${cacheRes.status}`);
    } catch (e) {
        logStep(`ERROR: Failed to warm up render cache: ${e}`);
        console.error("Failed to warm up render cache:", e);
        // Fallback to old behavior if fetch fails during build/SSR
    }

    // 2. Launch Puppeteer with requested settings
    logStep('3) Launching Puppeteer...');
    const browser = await puppeteer.launch({
        headless: "new" as any, // "new" is the current standard for headless
        // explicit args to avoid sandboxing issues in some envs
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
    });

    try {
        const page = await browser.newPage();

        // 3. Navigate to the FULL URL as requested
        const renderUrl = `${baseUrl}/api/pdf/render?id=${renderId}`;
        logStep(`4) Navigating to render URL: ${renderUrl}`);

        await page.goto(renderUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        const content = await page.content();
        logStep(`4b) Page loaded. HTML length: ${content.length}`);

        // 4. Generate the PDF with requested format and background printing
        // We use preferCSSPageSize: true and set margin: 0px here because
        // we'll handle margins and sizing via @page CSS in the template
        // for better multi-page reliability.
        logStep('5) Generating PDF...');
        const pdfBuffer = await page.pdf({
            format: (options.paperSize || 'A4') as any,
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        });

        logStep(`5b) PDF generated. Buffer length: ${pdfBuffer.length}`);

        return Buffer.from(pdfBuffer);
    } catch (e) {
        logStep(`ERROR in Puppeteer: ${e}`);
        throw e;
    } finally {
        await browser.close();
        logStep('5c) Browser closed.');
    }
}
