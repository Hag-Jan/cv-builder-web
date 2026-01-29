export interface Resume {
    resumeId: string;
    schemaVersion: "1.0";
    templateId: "classic" | "modern";
    metadata: ResumeMetadata;
    sections: ResumeSection[];
}

export interface ResumeMetadata {
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
}

export type ResumeSection =
    | ContactSection
    | ExperienceSection
    | EducationSection
    | SkillsSection
    | ProjectsSection
    | CustomSection;

interface BaseSection {
    id: string;
    type: SectionType;
    order: number;
}

export type SectionType =
    | "contact"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "custom";

export interface ContactSection extends BaseSection {
    type: "contact";
    name: string;
    email: string;
    phone?: string;
    location?: string;
    portfolio?: string;
}

export interface ExperienceSection extends BaseSection {
    type: "experience";
    items: ExperienceItem[];
}

export interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    startDate: string; // YYYY-MM
    endDate?: string; // YYYY-MM or "Present"
    bullets: string[];
}

export interface EducationSection extends BaseSection {
    type: "education";
    items: EducationItem[];
}

export interface EducationItem {
    id: string;
    school: string;
    degree: string;
    date: string;
}

export interface SkillsSection extends BaseSection {
    type: "skills";
    categories: SkillCategory[];
}

export interface SkillCategory {
    id: string;
    label: string;
    skills: string[];
}

export interface ProjectsSection extends BaseSection {
    type: "projects";
    items: ProjectItem[];
}

export interface ProjectItem {
    id: string;
    name: string;
    description?: string;
    link?: string;
}

export interface CustomSection extends BaseSection {
    type: "custom";
    title: string;
    content: string[];
}
