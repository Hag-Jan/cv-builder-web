/**
 * Utility to parse out an optional level from a skill string entered by the user.
 * It handles the following common formats:
 * - "Skill Name - Level"
 * - "Skill Name : Level"
 * - "Skill Name | Level"
 * - "Skill Name (Level)"
 * 
 * It ignores trailing punctuation and excess whitespace.
 */

export interface ParsedSkill {
    name: string;
    level: string | null;
}

export function parseSkillLevel(rawSkill: string): ParsedSkill {
    if (!rawSkill || typeof rawSkill !== 'string') {
        return { name: '', level: null };
    }

    const trimmed = rawSkill.trim();
    if (!trimmed) {
        return { name: '', level: null };
    }

    // Pattern 1: Skill (Level)
    // Matches "Java (Expert)" or "React.js (Advanced Developer)"
    const parenMatch = trimmed.match(/^(.*?)\s*\(([^)]+)\)$/);
    if (parenMatch) {
        return {
            name: parenMatch[1].trim(),
            level: parenMatch[2].trim()
        };
    }

    // Pattern 2: Skill - Level, Skill : Level, Skill | Level
    // The separator must have spaces around it to avoid splitting things like "Node.js" or "C++"
    const separatorMatch = trimmed.match(/^(.*?)\s+[-:|]+\s+(.+)$/);
    if (separatorMatch) {
        return {
            name: separatorMatch[1].trim(),
            level: separatorMatch[2].trim()
        };
    }

    // Default: No level found, return the whole string
    return { name: trimmed, level: null };
}
