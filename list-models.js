const https = require('https');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/GEMINI_API_KEY\s*=\s*["']?([^"'\n]+)["']?/);
const apiKey = match ? match[1].trim() : '';

console.log("Extracted Key Length:", apiKey.length);
console.log("First 5 chars:", apiKey.substring(0, 5));
if (!apiKey) {
    console.log("Raw .env fragment:", envContent.substring(0, 50));
    console.error("API Key not found in .env.local");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("Error:", json.error);
            } else {
                console.log("Available Models:");
                json.models.forEach(m => console.log(m.name));
            }
        } catch (e) {
            console.error("Parse error:", e);
            console.log("Raw:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e);
});
