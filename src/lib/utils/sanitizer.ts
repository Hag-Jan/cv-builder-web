/**
 * Sanitizes resume data by removing corrupted/junk text patterns.
 * Strips HTML, control characters, and known garbage strings.
 */
export function sanitizeText(text: string | null | undefined): string {
    if (!text) return "";

    // 1. Strip HTML tags
    let cleaned = text.replace(/<[^>]*>?/gm, "");

    // 2. Remove non-printable ASCII/Unicode control chars
    cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F\uFFFD\u200B-\u200D\uFEFF]/g, "");

    // 3. Remove known "garbage" patterns reported by users
    // (e.g., "nmsmnmsdnsd", "iwdiwijwdi", "skknds ks")
    cleaned = cleaned.replace(/(nmsmnmsdnsd|iwdiwijwdi|skknds ks|gan mskm|skknds)/gi, "");

    // 4. Regex for semi-random noise: 5+ lowercase chars followed by space and another 5+ lowercase chars
    // Heuristic: If it looks like noise (low vowel count), strip it.
    cleaned = cleaned.replace(/\b[a-z]{6,}\s+[a-z]{6,}\b/g, (match) => {
        const vowels = (match.match(/[aeiou]/gi) || []).length;
        if (vowels / match.length < 0.2) return "";
        return match;
    });

    return cleaned.trim();
}

/**
 * Recursively sanitizes all string values in an object.
 */
export function sanitizeResumeObject(obj: any): any {
    if (typeof obj === "string") return sanitizeText(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeResumeObject);
    if (obj !== null && typeof obj === "object") {
        const newObj: any = {};
        for (const key in obj) {
            newObj[key] = sanitizeResumeObject(obj[key]);
        }
        return newObj;
    }
    return obj;
}
