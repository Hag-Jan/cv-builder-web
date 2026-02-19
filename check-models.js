const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function listModels() {
    try {
        // Read .env.local
        const envPath = path.resolve(process.cwd(), '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        let apiKey = '';
        for (const line of lines) {
            if (line.trim().startsWith('#')) continue;
            const match = line.match(/GEMINI_API_KEY\s*=\s*["']?([^"'\n]+)["']?/);
            if (match) {
                apiKey = match[1].trim();
                break;
            }
        }

        if (!apiKey) {
            console.error("API Key not found in .env.local");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Just to initialize

        // There isn't a direct listModels method on the client usually, 
        // but we can try to use the API directly via fetch if SDK doesn't expose it easily in this version.
        // Actually, SDK usually requires a model to be selected. 
        // Let's try the fetch approach again but with better error handling.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
        } else if (data.models) {
            console.log("=== Available Models ===");
            data.models.forEach(m => {
                console.log(`- ${m.name}`);
                console.log(`  Supported generation methods: ${m.supportedGenerationMethods.join(', ')}`);
            });
        } else {
            console.log("Unexpected response:", data);
        }

    } catch (error) {
        console.error("Script Error:", error);
    }
}

listModels();
