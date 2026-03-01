import { ParsedResume } from "./types";
import { ResumeV2 } from "@/types/resume-schema-v2";

/**
 * Normalizes strings for robust ATS comparison (lowercasing, trimming whitespace, removing weird chars)
 */
export function normalizeStr(str: string): string {
    return str.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Very basic subset comparison logic between canonical JSON and parsed JSON.
 * Ideal for generating the AtsReport.
 */
export function generateAtsReport(canonical: ResumeV2, parsed: ParsedResume) {
    const report = {
        coverageScore: 0,
        sectionCoverage: { work: 0, education: 0, skills: 0, projects: 0 },
        warnings: [] as string[],
        diff: { missingFields: [] as Array<{ path: string; expected: any }>, mismatchedSections: [] as any[] },
    };

    let totalPoints = 0;
    let earnedPoints = 0;

    // Check Basics
    const trackPoint = (expected: string | undefined, actual: string | undefined, pathName: string) => {
        if (!expected) return; // Not required/not in canonical
        totalPoints += 1;
        if (actual && normalizeStr(actual).includes(normalizeStr(expected))) {
            earnedPoints += 1;
        } else {
            report.diff.missingFields.push({ path: pathName, expected });
            report.warnings.push(`Expected field [${pathName}] was not detected cleanly.`);
        }
    };

    const contact = canonical.sections.find(s => s.type === "contact") as any;
    if (contact) {
        trackPoint(contact.name, parsed.basics?.name, "basics.name");
        trackPoint(contact.email, parsed.basics?.email, "basics.email");
        if (contact.phone) trackPoint(contact.phone, parsed.basics?.phone, "basics.phone");
    }

    // Check Work
    const workSection = canonical.sections.find(s => s.type === "experience") as any;
    if (workSection && workSection.items.length > 0) {
        let workTotal = 0;
        let workEarned = 0;
        const parsedWorkString = JSON.stringify(parsed.work).toLowerCase(); // basic raw string search

        workSection.items.forEach((item: any, idx: number) => {
            workTotal += 1;
            if (parsedWorkString.includes(normalizeStr(item.company))) workEarned += 1;
            else report.warnings.push(`Company [${item.company}] was not detected.`);

            workTotal += 1;
            if (parsedWorkString.includes(normalizeStr(item.role))) workEarned += 1;
            else report.warnings.push(`Job title [${item.role}] was not detected.`);

            item.bullets.forEach((b: string) => {
                workTotal += 1;
                // It's hard to match exact whole bullets due to missing chars, so we check for significant words
                const keywords = b.split(" ").filter(w => w.length > 5);
                if (keywords.length > 0 && parsedWorkString.includes(normalizeStr(keywords[0]))) workEarned += 1;
            });
        });

        report.sectionCoverage.work = workEarned / workTotal;
        totalPoints += workTotal;
        earnedPoints += workEarned;
    }

    // Combine for final score
    report.coverageScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;

    return report;
}
