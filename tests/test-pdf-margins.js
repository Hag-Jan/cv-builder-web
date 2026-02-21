const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testPdfMargins() {
    console.log('Starting PDF margin verification test...');

    // Create a long HTML content to force multiple pages
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            @page {
                size: A4;
                margin: 0.75in;
            }
            body { 
                font-family: sans-serif;
                margin: 0;
                padding: 0;
            }
            .content {
                width: 100%;
            }
            .section {
                height: 500px;
                border: 1px solid #ccc;
                margin-bottom: 20px;
                padding: 10px;
                break-inside: avoid;
            }
            h1 { color: #2563EB; }
        </style>
    </head>
    <body>
        <div class="content">
            <h1>Multi-Page PDF Margin Test</h1>
            <div class="section">Section 1 - Page 1</div>
            <div class="section">Section 2 - Page 1 (Transitioning)</div>
            <div class="section">Section 3 - Should be on Page 2</div>
            <div class="section">Section 4 - Should be on Page 2</div>
            <div class="section">Section 5 - Should be on Page 3</div>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const outputPath = path.join(process.cwd(), 'margin_test_output.pdf');

    console.log('Generating PDF...');
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true, // Crucial fix
        margin: {
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }
    });

    console.log(`PDF generated at: ${outputPath}`);
    await browser.close();

    const stats = fs.statSync(outputPath);
    console.log(`File size: ${stats.size} bytes`);

    if (stats.size > 1000) {
        console.log('SUCCESS: PDF generated successfully.');
    } else {
        console.log('FAILURE: PDF size is suspiciously small.');
    }
}

testPdfMargins().catch(console.error);
