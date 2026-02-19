import type {
    ResumeV2 as Resume,
    ExperienceSectionV2 as ExperienceSection,
    SkillsSectionV2 as SkillsSection,
    ProjectsSectionV2 as ProjectsSection,
    CustomSectionV2 as CustomSection,
    SummarySection
} from "@/types/resume-schema-v2";
import { BulletAnalysis, ScoreDelta, ImpactFix } from "@/types/ats-types";
import { STOPWORDS } from "./stopwords";
import { normalizeKeyword, areSynonyms } from "./synonyms";

// ─── Verb & Pattern Constants ──────────────────────────────────────────────────

const WEAK_VERBS = [
    "responsible for",
    "helped",
    "worked on",
    "assisted",
    "participated in",
    "involved in",
    "handled",
];

const STRONG_VERBS = [
    "led",
    "architected",
    "spearheaded",
    "implemented",
    "optimized",
    "orchestrated",
    "designed",
    "launched",
    "scaled",
];

const PASSIVE_VOICE_PHRASES = ["assisted with", "responsible for"];

const METRIC_REGEX = /\d+%|\$\d+[kKmM]?|\d+\+?\s*(users|clients|projects|hours|months|years)/i;

// ─── Keyword Extraction ────────────────────────────────────────────────────────

/**
 * Extract keywords from job description text
 */
export function extractKeywords(text: string): string[] {
    const cleaned = text.toLowerCase().replace(/[^\w\s-]/g, " ");
    const words = cleaned.split(/\s+/).filter(word => word.length > 0);

    const phrases: string[] = [];
    for (let i = 0; i < words.length - 1; i++) {
        const twoWord = `${words[i]} ${words[i + 1]}`;
        if (looksLikeTechTerm(twoWord)) {
            phrases.push(normalizeKeyword(twoWord));
        }
        if (i < words.length - 2) {
            const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
            if (looksLikeTechTerm(threeWord)) {
                phrases.push(normalizeKeyword(threeWord));
            }
        }
    }

    const singleWords = words
        .filter(word => word.length >= 3)
        .filter(word => !STOPWORDS.has(word))
        .filter(word => looksLikeTechTerm(word))
        .map(word => normalizeKeyword(word));

    const allKeywords = [...phrases, ...singleWords];
    return Array.from(new Set(allKeywords));
}

function looksLikeTechTerm(term: string): boolean {
    if (/\d/.test(term)) return true;
    if (/\w+\.\w+/.test(term)) return true;
    if (term.toUpperCase() === term && term.length >= 2) return true;
    if (term.includes("-")) return true;
    if (/(script|sql|lang|ware|base|hub|ops|dev|tech|engine)$/.test(term)) return true;
    if (term.split(" ").length === 1 && (term.length < 3 || term.length > 20)) return false;
    return true;
}

// ─── Resume Text Extraction ────────────────────────────────────────────────────

export function extractResumeText(resume: Resume): string {
    const textParts: string[] = [];

    for (const section of resume.sections) {
        switch (section.type) {
            case "contact":
                if (section.name) textParts.push(section.name);
                if (section.email) textParts.push(section.email);
                if (section.location) textParts.push(section.location);
                if (section.linkedin) textParts.push(section.linkedin);
                if (section.github) textParts.push(section.github);
                if (section.website) textParts.push(section.website);
                break;

            case "summary":
                if ((section as SummarySection).content) textParts.push((section as SummarySection).content);
                break;

            case "experience": {
                const expSection = section as ExperienceSection;
                for (const item of expSection.items) {
                    textParts.push(item.company);
                    textParts.push(item.role);
                    if (item.location) textParts.push(item.location);
                    textParts.push(...item.bullets);
                }
                break;
            }

            case "education": {
                const eduSection = section as any; // Using any for ease of transition
                for (const item of eduSection.items) {
                    textParts.push(item.school);
                    textParts.push(item.degree);
                    if (item.gpa) textParts.push(item.gpa);
                    if (item.honors) textParts.push(item.honors);
                }
                break;
            }

            case "skills": {
                const skillsSection = section as SkillsSection;
                for (const category of skillsSection.categories) {
                    textParts.push(category.label);
                    textParts.push(...category.skills);
                }
                break;
            }

            case "projects": {
                const projectsSection = section as ProjectsSection;
                for (const item of projectsSection.items) {
                    textParts.push(item.name);
                    if (item.description) textParts.push(item.description);
                    if (item.techStack) textParts.push(...item.techStack);
                    if (item.bullets) textParts.push(...item.bullets);
                }
                break;
            }

            case "custom": {
                const customSection = section as CustomSection;
                textParts.push(customSection.title);
                textParts.push(...customSection.content);
                break;
            }
        }
    }

    return textParts.join(" ").toLowerCase();
}

// ─── Keyword Matching ──────────────────────────────────────────────────────────

export function matchKeywords(
    resumeText: string,
    jobKeywords: string[]
): { matched: string[]; missing: string[] } {
    const matched: string[] = [];
    const missing: string[] = [];

    for (const keyword of jobKeywords) {
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

// ─── Bullet Analysis ───────────────────────────────────────────────────────────

/**
 * Extract all experience bullets and summary from the resume
 */
export function extractBullets(resume: Resume): string[] {
    const bullets: string[] = [];
    for (const section of resume.sections) {
        if (section.type === "experience") {
            const expSection = section as ExperienceSection;
            for (const item of expSection.items) {
                bullets.push(...item.bullets);
            }
        } else if (section.type === "summary") {
            bullets.push((section as SummarySection).content);
        } else if (section.type === "projects") {
            const projectsSection = section as ProjectsSection;
            for (const item of projectsSection.items) {
                if (item.bullets) bullets.push(...item.bullets);
            }
        }
    }
    return bullets;
}

/**
 * Analyze a single bullet point for verb quality, metrics, and passive voice
 */
export function analyzeBullet(bullet: string): BulletAnalysis {
    const lower = bullet.toLowerCase().trim();

    // Weak verb check
    let hasWeakVerb = false;
    let weakVerb: string | undefined;
    for (const wv of WEAK_VERBS) {
        if (lower.includes(wv)) {
            hasWeakVerb = true;
            weakVerb = wv;
            break;
        }
    }

    // Strong verb check (must START with a strong verb)
    let hasStrongVerb = false;
    let strongVerb: string | undefined;
    const firstWord = lower.split(/\s+/)[0];
    for (const sv of STRONG_VERBS) {
        if (firstWord === sv) {
            hasStrongVerb = true;
            strongVerb = sv;
            break;
        }
    }

    // Metric check
    const hasMetric = METRIC_REGEX.test(bullet);

    // Passive voice check
    let hasPassiveVoice = false;
    for (const pv of PASSIVE_VOICE_PHRASES) {
        if (lower.includes(pv)) {
            hasPassiveVoice = true;
            break;
        }
    }

    return { text: bullet, hasMetric, hasWeakVerb, hasStrongVerb, hasPassiveVoice, weakVerb, strongVerb };
}

/**
 * Analyze all bullets in the resume
 */
export function analyzeBullets(resume: Resume): BulletAnalysis[] {
    const bullets = extractBullets(resume);
    return bullets.filter(b => b.trim().length > 0).map(analyzeBullet);
}

// ─── Score Calculation ─────────────────────────────────────────────────────────

/**
 * Calculate the base keyword score as a percentage
 */
export function calculateScore(matched: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((matched / total) * 100);
}

/**
 * Calculate the enhanced deterministic score with delta breakdown.
 * Base = keyword alignment. Bonuses & penalties from bullet quality.
 */
export function calculateDeterministicScore(
    matched: number,
    total: number,
    bulletAnalysis: BulletAnalysis[]
): { finalScore: number; delta: ScoreDelta } {
    const bulletCount = bulletAnalysis.length || 1; // avoid division by zero

    // Base keyword alignment (0-100, weighted 60%)
    const keywordAlignmentScore = total > 0 ? Math.round((matched / total) * 100) : 0;

    // Metrics bonus: up to +15% based on fraction of bullets with metrics
    const bulletsWithMetrics = bulletAnalysis.filter(b => b.hasMetric).length;
    const metricsBonus = Math.round((bulletsWithMetrics / bulletCount) * 15);

    // Strong verbs bonus: up to +10% based on fraction of bullets starting with strong verbs
    const bulletsWithStrongVerbs = bulletAnalysis.filter(b => b.hasStrongVerb).length;
    const strongVerbsBonus = Math.round((bulletsWithStrongVerbs / bulletCount) * 10);

    // Weak verbs penalty: up to -10% based on fraction of bullets with weak verbs
    const bulletsWithWeakVerbs = bulletAnalysis.filter(b => b.hasWeakVerb).length;
    const weakVerbsPenalty = Math.round((bulletsWithWeakVerbs / bulletCount) * 10);

    // Passive voice penalty: up to -5%
    const bulletsWithPassive = bulletAnalysis.filter(b => b.hasPassiveVoice).length;
    const passiveVoicePenalty = Math.round((bulletsWithPassive / bulletCount) * 5);

    // simpleScore: base + bonuses - penalties, clamped
    const simpleScore = keywordAlignmentScore + metricsBonus + strongVerbsBonus - weakVerbsPenalty - passiveVoicePenalty;
    const finalScore = Math.max(0, Math.min(100, simpleScore));

    return {
        finalScore,
        delta: {
            keywordAlignmentScore,
            metricsBonus,
            strongVerbsBonus,
            weakVerbsPenalty,
            passiveVoicePenalty,
        },
    };
}

// ─── Top 3 Impact Fixes ────────────────────────────────────────────────────────

/**
 * Generate the top 3 most impactful fixes, prioritized:
 * 1. Missing required keywords
 * 2. Bullets without metrics
 * 3. Weak verbs
 */
export function getTopImpactFixes(
    missingKeywords: string[],
    bulletAnalysis: BulletAnalysis[]
): ImpactFix[] {
    const fixes: ImpactFix[] = [];

    // Priority 1: Missing keywords (highest impact)
    if (missingKeywords.length > 0) {
        const topMissing = missingKeywords.slice(0, 3).join(", ");
        fixes.push({
            type: "missing_keyword",
            priority: 1,
            description: `Add missing keywords: ${topMissing}. Integrate them naturally into your experience bullets.`,
        });
    }

    // Priority 2: Bullets without metrics
    const bulletsNoMetrics = bulletAnalysis.filter(b => !b.hasMetric);
    if (bulletsNoMetrics.length > 0) {
        const example = bulletsNoMetrics[0].text.substring(0, 60);
        fixes.push({
            type: "no_metric",
            priority: 2,
            description: `${bulletsNoMetrics.length} bullet(s) lack quantifiable metrics. Add numbers, percentages, or dollar amounts.`,
            bullet: example + (bulletsNoMetrics[0].text.length > 60 ? "..." : ""),
        });
    }

    // Priority 3: Weak verbs
    const bulletsWeakVerbs = bulletAnalysis.filter(b => b.hasWeakVerb);
    if (bulletsWeakVerbs.length > 0) {
        const verb = bulletsWeakVerbs[0].weakVerb || "weak verb";
        fixes.push({
            type: "weak_verb",
            priority: 3,
            description: `${bulletsWeakVerbs.length} bullet(s) use weak language ("${verb}"). Replace with strong action verbs like "Led", "Architected", "Implemented".`,
            bullet: bulletsWeakVerbs[0].text.substring(0, 60) + (bulletsWeakVerbs[0].text.length > 60 ? "..." : ""),
        });
    }

    return fixes.slice(0, 3);
}

// ─── Warnings ──────────────────────────────────────────────────────────────────

export function detectWarnings(resume: Resume, matchedKeywords: string[]): string[] {
    const warnings: string[] = [];

    const experienceSections = resume.sections.filter(s => s.type === "experience") as ExperienceSection[];
    const dateFormats = new Set<string>();

    for (const section of experienceSections) {
        for (const item of section.items) {
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

    const skillsSections = resume.sections.filter(s => s.type === "skills") as SkillsSection[];
    const totalSkills = skillsSections.reduce((sum, section) => {
        return sum + section.categories.reduce((catSum, cat) => catSum + cat.skills.length, 0);
    }, 0);

    if (totalSkills < 5) {
        warnings.push(`Only ${totalSkills} skills listed. Consider adding more relevant skills (recommended: 8-15 skills).`);
    }

    const resumeText = extractResumeText(resume);
    for (const keyword of matchedKeywords) {
        const count = (resumeText.match(new RegExp(keyword, "gi")) || []).length;
        if (count > 5) {
            warnings.push(`Keyword "${keyword}" appears ${count} times. Avoid excessive repetition (keyword stuffing).`);
        }
    }

    return warnings;
}
