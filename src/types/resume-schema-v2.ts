// ─────────────────────────────────────────────────────────
// Resume Schema v2 — Foundation types for ResumeATS
// ─────────────────────────────────────────────────────────

export interface ResumeV2 {
    resumeId: string;
    schemaVersion: "2.0";
    templateId: "classic" | "modern" | "minimal" | "academic" | "creative" | "minimalist" | "executive" | "sidebar-pro" | "business-two-column" | "sidebar_pro" | "chronicle-timeline" | "nova-single" | "prism-sidebar" | "brijr-minimal" | "resumify-modern" | "universal-formal" | "resumave-clean" | "adiian-simple" | "executive-classic" | "tech-clean" | "minimal-pro";
    metadata: ResumeMetadata;
    design?: ResumeDesignSettings;
    sections: ResumeSectionV2[];
}

export interface ResumeMetadata {
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
}

// ── Global Design Settings ───────────────────────────────

export interface ResumeDesignSettings {
    // Colors
    accentColor?: string;
    applyColorToName?: boolean;
    applyColorToHeadings?: boolean;
    applyColorToJobTitles?: boolean;

    // Formatting
    fontFamily?: string;
    fontSize?: number;       // pt
    lineHeight?: number;
    pageMargins?: number;    // mm
    entrySpace?: number;     // px

    // Headings
    headingSize?: "L" | "M" | "S";
    headingCase?: "upper" | "normal";

    // Layout
    layoutCols?: "1" | "2" | "mix";
    headerAlign?: "left" | "center" | "right";
    skillsMode?: "grid" | "level" | "compact" | "bubble";

    // Meta formatting
    language?: string;
    dateFormat?: string;
    pageFormat?: "A4" | "Letter";
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
    field?: string;
    date: string;
    location?: string;
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
    date?: string;
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
