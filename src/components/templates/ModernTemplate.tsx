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

const DEFAULT_ACCENT = "#2563EB";
const DEFAULT_FONT = "system-ui, Arial, sans-serif";

interface ModernTemplateProps {
    resume: Resume;
}

function SectionHeading({ label, accent, color }: { label: string; accent: string; color: string }) {
    return (
        <div className="mb-4">
            <h2
                className="text-sm font-bold uppercase tracking-wider pl-3 border-l-4"
                style={{ color, borderLeftColor: accent }}
            >
                {label}
            </h2>
        </div>
    );
}

export function renderModernBlocks(resume: Resume): React.ReactNode[] {
    const DESIGN = resume.design || {};
    const ACCENT = DESIGN.accentColor || DEFAULT_ACCENT;
    const nameColor = DESIGN.applyColorToName ? ACCENT : "#111827";
    const headingColor = DESIGN.applyColorToHeadings ? ACCENT : "#111827";
    const FONT = DESIGN.fontFamily || DEFAULT_FONT;

    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const summary = resume.sections.find((s) => s.type === "summary") as SummarySection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    const blocks: React.ReactNode[] = [];

    // Header Area
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div style={{ fontFamily: FONT }} className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-1" style={{ color: nameColor }}>
                            {contact.name}
                        </h1>
                    </div>
                    <div className="flex flex-col items-end text-[10.5px] text-gray-600 space-y-0.5">
                        {contact.email && <span>{contact.email}</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.location && <span>{contact.location}</span>}
                        {contact.linkedin && <span>{contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
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
                    <SectionHeading label="Summary" accent={ACCENT} color={headingColor} />
                    <p className="text-[11px] leading-relaxed text-gray-800">
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
                    <div style={{ fontFamily: FONT }} className="mt-4">
                        <SectionHeading label="Experience" accent={ACCENT} color={headingColor} />
                    </div>
                </EntryBlock>
            );

            (section as ExperienceSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Experience">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-5 last:mb-6">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.role}</h3>
                                <time className="text-[11px] font-bold text-gray-600 shrink-0">
                                    {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <p className="text-[12px] font-semibold text-gray-700 italic mb-2">{item.company}</p>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="list-disc pl-5 space-y-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-800 leading-relaxed pl-1">
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </EntryBlock>
                );
            });
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
                    <div style={{ fontFamily: FONT }} className="mt-4">
                        <SectionHeading label="Education" accent={ACCENT} color={headingColor} />
                    </div>
                </EntryBlock>
            );

            (section as EducationSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Education">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.school}</h3>
                                <time className="text-[11px] font-bold text-gray-600 shrink-0">
                                    {formatDate(item.date)}
                                </time>
                            </div>
                            <p className="text-[11.5px] text-gray-800">{item.degree}</p>
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
                    sectionTitle="Skills"
                >
                    <div style={{ fontFamily: FONT }} className="mt-4">
                        <SectionHeading label="Skills" accent={ACCENT} color={headingColor} />
                    </div>
                </EntryBlock>
            );

            const skillsSection = section as SkillsSection;
            blocks.push(
                <EntryBlock key={skillsSection.id} type="skills" id={skillsSection.id} sectionId={section.id} sectionTitle="Skills">
                    <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-6">
                        {skillsSection.categories.map((cat, i) => {
                            const cleanedSkills = cat.skills.map(s => s.trim()).filter(Boolean);
                            if (cleanedSkills.length === 0) return null;

                            return (
                                <div key={i} className="mb-3">
                                    <p className="text-[11px] font-bold text-gray-900 mb-1.5">{cat.label}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {cleanedSkills.map((skill, si) => (
                                            <span
                                                key={si}
                                                className="px-2 py-0.5 rounded text-[10px] font-medium"
                                                style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </EntryBlock>
            );
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
                    <div style={{ fontFamily: FONT }} className="mt-4">
                        <SectionHeading label="Projects" accent={ACCENT} color={headingColor} />
                    </div>
                </EntryBlock>
            );

            (section as ProjectsSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="projects" id={item.id} sectionId={section.id} sectionTitle="Projects">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-5 last:mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.name}</h3>
                                {item.date && (
                                    <time className="text-[11px] font-bold text-gray-600 shrink-0">{formatDate(item.date)}</time>
                                )}
                            </div>
                            {item.description && (
                                <p className="text-[11px] text-gray-800 mb-1.5">{item.description}</p>
                            )}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="list-disc pl-5 space-y-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-800 leading-relaxed pl-1">
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            )}
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
                    <div style={{ fontFamily: FONT }} className="mt-4">
                        <SectionHeading label={customSection.title} accent={ACCENT} color={headingColor} />
                    </div>
                </EntryBlock>
            );

            blocks.push(
                <EntryBlock key={`${section.id}-content`} type="custom" id={`${section.id}-content`} sectionId={section.id} sectionTitle={customSection.title}>
                    <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-6">
                        <ul className="list-disc pl-5 space-y-1">
                            {customSection.content.filter(Boolean).map((c, i) => (
                                <li key={i} className="text-[11px] text-gray-800 leading-relaxed pl-1">
                                    {c}
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

export default function ModernTemplate({ resume }: ModernTemplateProps) {
    return (
        <div className="bg-white px-10 py-10 min-h-full">
            {renderModernBlocks(resume)}
        </div>
    );
}
