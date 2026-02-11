// Synonym dictionary for common tech abbreviations and terms
export const SYNONYMS: Record<string, string[]> = {
    "javascript": ["js", "javascript", "ecmascript"],
    "typescript": ["ts", "typescript"],
    "react": ["react", "reactjs", "react.js"],
    "node": ["node", "nodejs", "node.js"],
    "python": ["python", "py"],
    "seo": ["seo", "search engine optimization"],
    "pm": ["pm", "project management", "project manager"],
    "nlp": ["nlp", "natural language processing"],
    "ml": ["ml", "machine learning"],
    "ai": ["ai", "artificial intelligence"],
    "api": ["api", "rest api", "restful api"],
    "sql": ["sql", "structured query language"],
    "nosql": ["nosql", "no-sql"],
    "css": ["css", "cascading style sheets"],
    "html": ["html", "hypertext markup language"],
    "ui": ["ui", "user interface"],
    "ux": ["ux", "user experience"],
    "aws": ["aws", "amazon web services"],
    "gcp": ["gcp", "google cloud platform"],
    "ci": ["ci", "continuous integration"],
    "cd": ["cd", "continuous deployment", "continuous delivery"],
    "docker": ["docker", "containerization"],
    "k8s": ["k8s", "kubernetes"],
    "git": ["git", "version control"],
};

// Normalize a keyword by checking if it matches any synonym group
export function normalizeKeyword(keyword: string): string {
    const lower = keyword.toLowerCase();

    for (const [canonical, variants] of Object.entries(SYNONYMS)) {
        if (variants.includes(lower)) {
            return canonical;
        }
    }

    return lower;
}

// Check if two keywords are synonyms
export function areSynonyms(keyword1: string, keyword2: string): boolean {
    const normalized1 = normalizeKeyword(keyword1);
    const normalized2 = normalizeKeyword(keyword2);
    return normalized1 === normalized2;
}
