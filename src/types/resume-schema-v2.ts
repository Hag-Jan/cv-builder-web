// ─────────────────────────────────────────────────────────
// Resume Schema v2 — Foundation types for ResumeATS
// ─────────────────────────────────────────────────────────

export interface ResumeV2 {
    resumeId: string;
    schemaVersion: "2.0";
    templateId: string;
    metadata: ResumeMetadata;
    sections: ResumeSectionV2[];
}

export interface ResumeMetadata {
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
}

// ── Section Union ────────────────────────────────────────

export type ResumeSectionV2 =
    | ContactSectionV2
    | SummarySection
    | ExperienceSectionV2
    | EducationSectionV2
    | SkillsSectionV2
    | ProjectsSectionV2
    | CustomSectionV2;

export type SectionTypeV2 =
    | "contact"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "custom";

interface BaseSectionV2 {
    id: string;
    type: SectionTypeV2;
    order: number;
}

// ── Contact ──────────────────────────────────────────────

export interface ContactSectionV2 extends BaseSectionV2 {
    type: "contact";
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
}

// ── Summary (NEW in v2) ──────────────────────────────────

export interface SummarySection extends BaseSectionV2 {
    type: "summary";
    content: string;
}

// ── Experience ───────────────────────────────────────────

export interface ExperienceSectionV2 extends BaseSectionV2 {
    type: "experience";
    items: ExperienceItemV2[];
}

export interface ExperienceItemV2 {
    id: string;
    company: string;
    role: string;
    location?: string;
    startDate: string; // YYYY-MM
    endDate?: string;  // YYYY-MM or "Present"
    bullets: string[];
}

// ── Education ────────────────────────────────────────────

export interface EducationSectionV2 extends BaseSectionV2 {
    type: "education";
    items: EducationItemV2[];
}

export interface EducationItemV2 {
    id: string;
    school: string;
    degree: string;
    date: string;
    gpa?: string;
    honors?: string;
}

// ── Skills ───────────────────────────────────────────────

export interface SkillsSectionV2 extends BaseSectionV2 {
    type: "skills";
    categories: SkillCategoryV2[];
}

export interface SkillCategoryV2 {
    id: string;
    label: string;
    skills: string[];
}

// ── Projects ─────────────────────────────────────────────

export interface ProjectsSectionV2 extends BaseSectionV2 {
    type: "projects";
    items: ProjectItemV2[];
}

export interface ProjectItemV2 {
    id: string;
    name: string;
    description?: string;
    link?: string;
    techStack?: string[];
    bullets?: string[];
}

// ── Custom ───────────────────────────────────────────────

export interface CustomSectionV2 extends BaseSectionV2 {
    type: "custom";
    title: string;
    content: string[];
}
