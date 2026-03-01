import React from "react";
import type {
    ResumeV2 as Resume,
    ContactSectionV2 as ContactSection,
    ExperienceSectionV2 as ExperienceSection,
    EducationSectionV2 as EducationSection,
    SkillsSectionV2 as SkillsSection,
    ProjectsSectionV2 as ProjectsSection,
    CustomSectionV2 as CustomSection,
    SummarySection,
} from "@/types/resume-schema-v2";
import { formatDate } from "@/lib/utils/date-formatter";
import { EntryBlock } from "../preview/EntryBlock";
import { parseSkillLevel } from "@/lib/utils/skill-parser";

/**
 * EXAMPLE DATA FOR PREVIEW/TESTING (Realistic, no lorem ipsum):
 * Name: "Alex Chen"
 * Contact: "alex.chen@email.com | (415) 555-0198 | San Francisco, CA | github.com/alexc | linkedin.com/in/alexchen"
 * Summary: "Senior Front-End Engineer specializing in React and Next.js. Passionate about building accessible, highly performant web applications and mentoring junior developers. Core contributor to several open-source UI libraries."
 * Experience: "Senior Software Engineer at WebFlow (2020-Present) - Architected a new component system that reduced load times by 35% and improved Lighthouse scores to 99 across the board."
 * Projects: "React UI kit (Open Source) - A highly accessible component library with 5k+ stars on GitHub. Built with React, TypeScript, and TailwindCSS."
 * Education: "B.S. Computer Science, UC Berkeley (2016) - GPA: 3.8"
 * Skills: "TypeScript, React, Next.js, Node.js, GraphQL, Tailwind CSS, Jest, Cypress, CI/CD"
 */

const DEFAULT_ACCENT = "#2563EB"; // Blue
const DEFAULT_FONT = "system-ui, -apple-system, sans-serif";

interface TechCleanProps {
    resume: Resume;
}

function SectionHeading({ label, color }: { label: string; color: string }) {
    return (
        <h2
            className="text-[13px] font-bold uppercase tracking-wider mb-3 mt-5"
            style={{ color: color }}
        >
            {label}
        </h2>
    );
}

export function renderTechCleanBlocks(resume: Resume): React.ReactNode[] {
    const DESIGN = resume.design || {};
    const ACCENT = DESIGN.accentColor || DEFAULT_ACCENT;
    const nameColor = DESIGN.applyColorToName ? ACCENT : "#0f172a";
    const headingColor = DESIGN.applyColorToHeadings ? ACCENT : "#334155";
    const FONT = DESIGN.fontFamily || DEFAULT_FONT;

    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const summary = resume.sections.find((s) => s.type === "summary") as SummarySection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    const blocks: React.ReactNode[] = [];

    // Header Area
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div style={{ fontFamily: FONT }} className="mb-6">
                    <h1
                        className="text-[32px] font-extrabold tracking-tight mb-2"
                        style={{ color: nameColor }}
                    >
                        {contact.name}
                    </h1>

                    <div className="flex flex-wrap items-center text-[11px] font-medium text-slate-600 gap-x-3 gap-y-1.5">
                        {contact.email && (
                            <a href={`mailto:${contact.email}`} className="hover:text-slate-900 transition-colors">
                                {contact.email}
                            </a>
                        )}
                        {contact.email && contact.phone && <span className="text-slate-300">•</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.phone && contact.location && <span className="text-slate-300">•</span>}
                        {contact.location && <span>{contact.location}</span>}
                        {contact.location && contact.linkedin && <span className="text-slate-300">•</span>}
                        {contact.linkedin && (
                            <a href={contact.linkedin} className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                                LinkedIn
                            </a>
                        )}
                        {contact.linkedin && contact.website && <span className="text-slate-300">•</span>}
                        {contact.website && (
                            <a href={contact.website} className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                                GitHub/Portfolio
                            </a>
                        )}
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // Summary Area
    if (summary && summary.content) {
        blocks.push(
            <EntryBlock key="summary" type="summary" id="summary">
                <div className="mb-6" style={{ fontFamily: FONT }}>
                    <p className="text-[12px] leading-relaxed text-slate-700">
                        {summary.content}
                    </p>
                </div>
            </EntryBlock>
        );
    }

    // Processing other sections
    sorted.forEach((section) => {
        if (section.type === "contact" || section.type === "summary") return;

        // Experience
        if (section.type === "experience" && (section as ExperienceSection).items.length > 0) {
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle="Experience"
                >
                    <div style={{ fontFamily: FONT }}>
                        <SectionHeading label="Experience" color={headingColor} />
                    </div>
                </EntryBlock>
            );

            (section as ExperienceSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Experience">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                                <div>
                                    <span className="text-[14px] font-bold text-slate-900 mr-2">{item.role}</span>
                                    <span className="text-[13px] font-medium text-slate-700">at {item.company}</span>
                                </div>
                                <time className="text-[11px] font-semibold text-slate-500 shrink-0">
                                    {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1.5 mt-2">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[12px] text-slate-700 leading-relaxed flex items-start gap-2">
                                            <span className="text-slate-400 mt-[5px] text-[8px] shrink-0">▶</span>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Projects
        if (section.type === "projects" && (section as ProjectsSection).items.length > 0) {
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle="Projects"
                >
                    <div style={{ fontFamily: FONT }}>
                        <SectionHeading label="Projects" color={headingColor} />
                    </div>
                </EntryBlock>
            );

            (section as ProjectsSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="projects" id={item.id} sectionId={section.id} sectionTitle="Projects">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                                    {item.name}
                                    {item.link && (
                                        <a href={item.link} className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-slate-700 border border-slate-200 rounded px-1.5 py-0.5 transition-colors">
                                            Source ↗
                                        </a>
                                    )}
                                </h3>
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {item.techStack.map((tech, idx) => (
                                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {item.description && (
                                <p className="text-[12px] text-slate-700 leading-relaxed mb-2">
                                    {item.description}
                                </p>
                            )}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1.5">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[12px] text-slate-700 leading-relaxed flex items-start gap-2">
                                            <span className="text-slate-400 mt-[5px] text-[8px] shrink-0">▶</span>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Skills
        if (section.type === "skills" && (section as SkillsSection).categories.length > 0) {
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle="Technical Skills"
                >
                    <div style={{ fontFamily: FONT }}>
                        <SectionHeading label="Technical Skills" color={headingColor} />
                    </div>
                </EntryBlock>
            );

            const skillsSection = section as SkillsSection;
            blocks.push(
                <EntryBlock key={skillsSection.id} type="skills" id={skillsSection.id} sectionId={section.id} sectionTitle="Technical Skills">
                    <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-6">
                        {skillsSection.categories.map((cat, i) => {
                            const cleanedSkills = cat.skills.map(s => s.trim()).filter(Boolean);
                            if (cleanedSkills.length === 0) return null;

                            return (
                                <div key={i} className="mb-2">
                                    <span className="text-[12px] font-bold text-slate-800 mr-2 block mb-1">{cat.label}</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {cleanedSkills.map((s, skillIdx) => {
                                            const { name, level } = parseSkillLevel(s);
                                            return (
                                                <span key={skillIdx} className="text-[11px] font-medium px-2 py-1 bg-white border border-slate-200 text-slate-700 rounded-md shadow-sm flex items-center gap-1.5">
                                                    {name}
                                                    {level && (
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase" style={{ color: ACCENT }}>
                                                            {level}
                                                        </span>
                                                    )}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </EntryBlock>
            );
        }

        // Education
        if (section.type === "education" && (section as EducationSection).items.length > 0) {
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle="Education"
                >
                    <div style={{ fontFamily: FONT }}>
                        <SectionHeading label="Education" color={headingColor} />
                    </div>
                </EntryBlock>
            );

            (section as EducationSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Education">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-3 last:mb-6">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-slate-900">{item.school}</h3>
                                <time className="text-[11px] font-semibold text-slate-500 shrink-0">
                                    {formatDate(item.date)}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <p className="text-[12px] text-slate-700">{item.degree}</p>
                                {item.gpa && (
                                    <p className="text-[11px] font-medium text-slate-500">GPA: {item.gpa}</p>
                                )}
                            </div>
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Custom
        if (section.type === "custom") {
            const customSection = section as CustomSection;
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle={customSection.title}
                >
                    <div style={{ fontFamily: FONT }}>
                        <SectionHeading label={customSection.title} color={headingColor} />
                    </div>
                </EntryBlock>
            );

            blocks.push(
                <EntryBlock key={`${section.id}-content`} type="custom" id={`${section.id}-content`} sectionId={section.id} sectionTitle={customSection.title}>
                    <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-6">
                        <ul className="space-y-1.5">
                            {customSection.content.filter(Boolean).map((c, i) => (
                                <li key={i} className="text-[12px] text-slate-700 leading-relaxed flex items-start gap-2">
                                    <span className="text-slate-400 mt-[5px] text-[8px] shrink-0">▶</span>
                                    <span>{c}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </EntryBlock>
            );
        }
    });

    return blocks;
}

export default function TechClean({ resume }: TechCleanProps) {
    return (
        <div className="bg-white px-10 py-10 min-h-full">
            {renderTechCleanBlocks(resume)}
        </div>
    );
}
