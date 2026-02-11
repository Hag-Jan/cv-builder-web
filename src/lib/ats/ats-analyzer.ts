import { Resume, ExperienceSection, SkillsSection, ProjectsSection, CustomSection } from "@/types/resume-schema-v1";
import { STOPWORDS } from "./stopwords";
import { normalizeKeyword, areSynonyms } from "./synonyms";

/**
 * Extract keywords from job description text
 */
export function extractKeywords(text: string): string[] {
    // 1. Lowercase and remove special characters (keep spaces and hyphens)
    const cleaned = text.toLowerCase().replace(/[^\w\s-]/g, " ");

    // 2. Split into words
    const words = cleaned.split(/\s+/).filter(word => word.length > 0);

    // 3. Extract multi-word phrases (2-3 words max)
    const phrases: string[] = [];
    for (let i = 0; i < words.length - 1; i++) {
        // Two-word phrases
        const twoWord = `${words[i]} ${words[i + 1]}`;
        if (looksLikeTechTerm(twoWord)) {
            phrases.push(normalizeKeyword(twoWord));
        }

        // Three-word phrases
        if (i < words.length - 2) {
            const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
            if (looksLikeTechTerm(threeWord)) {
                phrases.push(normalizeKeyword(threeWord));
            }
        }
    }

    // 4. Filter single words - remove stopwords and short words
    const singleWords = words
        .filter(word => word.length >= 3)
        .filter(word => !STOPWORDS.has(word))
        .filter(word => looksLikeTechTerm(word))
        .map(word => normalizeKeyword(word));

    // 5. Combine and deduplicate
    const allKeywords = [...phrases, ...singleWords];
    const unique = Array.from(new Set(allKeywords));

    return unique;
}

/**
 * Heuristic to determine if a term looks like a technical skill/keyword
 */
function looksLikeTechTerm(term: string): boolean {
    // Contains numbers (e.g., "python3", "c++")
    if (/\d/.test(term)) return true;

    // Contains special patterns (e.g., "react.js", "node.js")
    if (/\w+\.\w+/.test(term)) return true;

    // All caps (e.g., "SQL", "API")
    if (term.toUpperCase() === term && term.length >= 2) return true;

    // Contains dash (e.g., "full-stack", "front-end")
    if (term.includes("-")) return true;

    // Common tech suffixes
    if (/(script|sql|lang|ware|base|hub|ops|dev|tech|engine)$/.test(term)) return true;

    // Length constraint for single words (meaningful keywords are usually 3-20 chars)
    if (term.split(" ").length === 1 && (term.length < 3 || term.length > 20)) return false;

    return true;
}

/**
 * Extract all searchable text from resume
 */
export function extractResumeText(resume: Resume): string {
    const textParts: string[] = [];

    for (const section of resume.sections) {
        switch (section.type) {
            case "contact":
                if (section.name) textParts.push(section.name);
                break;

            case "experience":
                const expSection = section as ExperienceSection;
                for (const item of expSection.items) {
                    textParts.push(item.company);
                    textParts.push(item.role);
                    textParts.push(...item.bullets);
                }
                break;

            case "education":
                const eduSection = section;
                for (const item of eduSection.items) {
                    textParts.push(item.school);
                    textParts.push(item.degree);
                }
                break;

            case "skills":
                const skillsSection = section as SkillsSection;
                for (const category of skillsSection.categories) {
                    textParts.push(category.label);
                    textParts.push(...category.skills);
                }
                break;

            case "projects":
                const projectsSection = section as ProjectsSection;
                for (const item of projectsSection.items) {
                    textParts.push(item.name);
                    if (item.description) textParts.push(item.description);
                }
                break;

            case "custom":
                const customSection = section as CustomSection;
                textParts.push(customSection.title);
                textParts.push(...customSection.content);
                break;
        }
    }

    return textParts.join(" ").toLowerCase();
}

/**
 * Match job keywords against resume text
 */
export function matchKeywords(
    resumeText: string,
    jobKeywords: string[]
): { matched: string[]; missing: string[] } {
    const matched: string[] = [];
    const missing: string[] = [];

    for (const keyword of jobKeywords) {
        // Check if keyword appears in resume text (with synonym support)
        const isMatch = resumeText.includes(keyword) ||
            jobKeywords.some(k => k !== keyword && areSynonyms(k, keyword) && resumeText.includes(k));

        if (isMatch) {
            matched.push(keyword);
        } else {
            missing.push(keyword);
        }
    }

    return { matched, missing };
}

/**
 * Calculate ATS score as percentage
 */
export function calculateScore(matched: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((matched / total) * 100);
}

/**
 * Detect common ATS warnings
 */
export function detectWarnings(resume: Resume, matchedKeywords: string[]): string[] {
    const warnings: string[] = [];

    // 1. Check for date format inconsistencies in experience
    const experienceSections = resume.sections.filter(s => s.type === "experience") as ExperienceSection[];
    const dateFormats = new Set<string>();

    for (const section of experienceSections) {
        for (const item of section.items) {
            // Detect format patterns
            if (item.startDate) {
                if (/^\d{4}-\d{2}$/.test(item.startDate)) dateFormats.add("YYYY-MM");
                else if (/^\d{4}$/.test(item.startDate)) dateFormats.add("YYYY");
                else dateFormats.add("other");
            }
            if (item.endDate && item.endDate !== "Present") {
                if (/^\d{4}-\d{2}$/.test(item.endDate)) dateFormats.add("YYYY-MM");
                else if (/^\d{4}$/.test(item.endDate)) dateFormats.add("YYYY");
                else dateFormats.add("other");
            }
        }
    }

    if (dateFormats.size > 1) {
        warnings.push("Inconsistent date formats detected in Experience section. Use consistent format (e.g., YYYY-MM) for better ATS compatibility.");
    }

    // 2. Check for too few skills
    const skillsSections = resume.sections.filter(s => s.type === "skills") as SkillsSection[];
    const totalSkills = skillsSections.reduce((sum, section) => {
        return sum + section.categories.reduce((catSum, cat) => catSum + cat.skills.length, 0);
    }, 0);

    if (totalSkills < 5) {
        warnings.push(`Only ${totalSkills} skills listed. Consider adding more relevant skills (recommended: 8-15 skills).`);
    }

    // 3. Check for keyword stuffing (same keyword repeated many times)
    const resumeText = extractResumeText(resume);
    for (const keyword of matchedKeywords) {
        const count = (resumeText.match(new RegExp(keyword, "gi")) || []).length;
        if (count > 5) {
            warnings.push(`Keyword "${keyword}" appears ${count} times. Avoid excessive repetition (keyword stuffing).`);
        }
    }

    return warnings;
}
