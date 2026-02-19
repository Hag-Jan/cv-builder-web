// ─────────────────────────────────────────────────────────
// Zod validation schemas mirroring resume-schema-v2.ts
// ─────────────────────────────────────────────────────────

import { z } from "zod";

// ── Metadata ─────────────────────────────────────────────

export const ResumeMetadataSchema = z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
});

// ── Section Schemas ──────────────────────────────────────

const baseSectionFields = {
    id: z.string().min(1),
    order: z.number().int().min(0),
};

export const ContactSectionSchema = z.object({
    ...baseSectionFields,
    type: z.literal("contact"),
    name: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
});

export const SummarySectionSchema = z.object({
    ...baseSectionFields,
    type: z.literal("summary"),
    content: z.string(),
});

export const ExperienceItemSchema = z.object({
    id: z.string().min(1),
    company: z.string(),
    role: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    bullets: z.array(z.string()),
});

export const ExperienceSectionSchema = z.object({
    ...baseSectionFields,
    type: z.literal("experience"),
    items: z.array(ExperienceItemSchema),
});

export const EducationItemSchema = z.object({
    id: z.string().min(1),
    school: z.string(),
    degree: z.string(),
    date: z.string(),
    gpa: z.string().optional(),
    honors: z.string().optional(),
});

export const EducationSectionSchema = z.object({
    ...baseSectionFields,
    type: z.literal("education"),
    items: z.array(EducationItemSchema),
});

export const SkillCategorySchema = z.object({
    id: z.string().min(1),
    label: z.string(),
    skills: z.array(z.string()),
});

export const SkillsSectionSchema = z.object({
    ...baseSectionFields,
    type: z.literal("skills"),
    categories: z.array(SkillCategorySchema),
});

export const ProjectItemSchema = z.object({
    id: z.string().min(1),
    name: z.string(),
    description: z.string().optional(),
    link: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    bullets: z.array(z.string()).optional(),
});

export const ProjectsSectionSchema = z.object({
    ...baseSectionFields,
    type: z.literal("projects"),
    items: z.array(ProjectItemSchema),
});

export const CustomSectionSchema = z.object({
    ...baseSectionFields,
    type: z.literal("custom"),
    title: z.string(),
    content: z.array(z.string()),
});

// ── Discriminated Union ──────────────────────────────────

export const ResumeSectionV2Schema = z.discriminatedUnion("type", [
    ContactSectionSchema,
    SummarySectionSchema,
    ExperienceSectionSchema,
    EducationSectionSchema,
    SkillsSectionSchema,
    ProjectsSectionSchema,
    CustomSectionSchema,
]);

// ── Root Resume Schema ───────────────────────────────────

export const ResumeV2Schema = z.object({
    resumeId: z.string(),
    schemaVersion: z.literal("2.0"),
    templateId: z.string(),
    metadata: ResumeMetadataSchema,
    sections: z.array(ResumeSectionV2Schema),
});

// ── Helper ───────────────────────────────────────────────

/**
 * Validates a raw object against the ResumeV2 schema.
 * Returns the typed result or throws a ZodError with details.
 */
export function parseResumeV2(data: unknown) {
    return ResumeV2Schema.parse(data);
}

/**
 * Safe parse — returns { success, data?, error? } without throwing.
 */
export function safeParseResumeV2(data: unknown) {
    return ResumeV2Schema.safeParse(data);
}
