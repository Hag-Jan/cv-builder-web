// ─────────────────────────────────────────────────────────
// Migration: Resume v1 → v2
// Pure function — no side effects, safe to call on every load.
// ─────────────────────────────────────────────────────────

import type { Resume } from "@/types/resume-schema-v1";
import type {
    ResumeV2,
    ResumeSectionV2,
    ContactSectionV2,
    ExperienceSectionV2,
    EducationSectionV2,
    SkillsSectionV2,
    ProjectsSectionV2,
    CustomSectionV2,
    SummarySection,
} from "@/types/resume-schema-v2";

/**
 * Migrates a v1 resume to v2 format.
 *
 * Changes:
 * - schemaVersion "1.0" → "2.0"
 * - Contact: `portfolio` → `website`, adds linkedin/github stubs
 * - Experience items: adds optional `location`
 * - Education items: adds optional `gpa`, `honors`
 * - Project items: adds optional `techStack`, `bullets`
 * - Injects a SummarySection at order 0 (shifts others +1)
 */
export function migrateV1toV2(old: Resume): ResumeV2 {
    // Determine the highest existing order so we can insert summary at 0
    const migratedSections: ResumeSectionV2[] = old.sections.map((section) => {
        switch (section.type) {
            case "contact": {
                const v1 = section as Resume["sections"][number] & { type: "contact"; portfolio?: string };
                const v2Contact: ContactSectionV2 = {
                    id: v1.id,
                    type: "contact",
                    order: v1.order + 1, // shift for summary at 0
                    name: v1.name,
                    email: v1.email,
                    phone: v1.phone,
                    location: v1.location,
                    website: v1.portfolio,
                    linkedin: undefined,
                    github: undefined,
                };
                return v2Contact;
            }

            case "experience": {
                const v1 = section as Resume["sections"][number] & { type: "experience" };
                const v2Exp: ExperienceSectionV2 = {
                    id: v1.id,
                    type: "experience",
                    order: v1.order + 1,
                    items: v1.items.map((item) => ({
                        ...item,
                        location: undefined,
                    })),
                };
                return v2Exp;
            }

            case "education": {
                const v1 = section as Resume["sections"][number] & { type: "education" };
                const v2Edu: EducationSectionV2 = {
                    id: v1.id,
                    type: "education",
                    order: v1.order + 1,
                    items: v1.items.map((item) => ({
                        ...item,
                        gpa: undefined,
                        honors: undefined,
                    })),
                };
                return v2Edu;
            }

            case "skills": {
                const v1 = section as Resume["sections"][number] & { type: "skills" };
                const v2Skills: SkillsSectionV2 = {
                    id: v1.id,
                    type: "skills",
                    order: v1.order + 1,
                    categories: v1.categories.map((cat) => ({ ...cat })),
                };
                return v2Skills;
            }

            case "projects": {
                const v1 = section as Resume["sections"][number] & { type: "projects" };
                const v2Projects: ProjectsSectionV2 = {
                    id: v1.id,
                    type: "projects",
                    order: v1.order + 1,
                    items: v1.items.map((item) => ({
                        ...item,
                        techStack: undefined,
                        bullets: undefined,
                    })),
                };
                return v2Projects;
            }

            case "custom": {
                const v1 = section as Resume["sections"][number] & { type: "custom" };
                const v2Custom: CustomSectionV2 = {
                    id: v1.id,
                    type: "custom",
                    order: v1.order + 1,
                    title: v1.title,
                    content: [...v1.content],
                };
                return v2Custom;
            }

            default: {
                // Exhaustive — all v1 types are handled above.
                // Fallback for safety: shift order and cast.
                const fallback = section as { id: string; type: string; order: number };
                return {
                    id: fallback.id,
                    type: fallback.type as any,
                    order: fallback.order + 1,
                } as ResumeSectionV2;
            }
        }
    });

    // Insert an empty summary section at order 0
    const summarySection: SummarySection = {
        id: "summary",
        type: "summary",
        order: 0,
        content: "",
    };

    return {
        resumeId: old.resumeId,
        schemaVersion: "2.0",
        templateId: old.templateId,
        metadata: { ...old.metadata },
        sections: [summarySection, ...migratedSections],
    };
}

/**
 * Detects whether a raw object is a v1 resume.
 */
export function isV1Resume(data: unknown): data is Resume {
    return (
        typeof data === "object" &&
        data !== null &&
        "schemaVersion" in data &&
        (data as Record<string, unknown>).schemaVersion === "1.0"
    );
}
