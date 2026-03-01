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

const DEFAULT_ACCENT = "#1a1a1a";
const DEFAULT_FONT = "Georgia, serif";

interface ClassicTemplateProps {
    resume: Resume;
}

function SectionHeading({ label }: { label: string }) {
    return (
        <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black mb-1">
                {label}
            </h2>
            <hr className="border-black border-t-[1px]" />
        </div>
    );
}

export function renderClassicBlocks(resume: Resume): React.ReactNode[] {
    const DESIGN = resume.design || {};
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
                    <h1 className="text-4xl font-black text-black mb-2">
                        {contact.name}
                    </h1>
                    <hr className="border-black border-t-[1px] mb-3" />
                    <div className="flex flex-wrap items-center text-[11px] text-black gap-x-4 gap-y-1">
                        {contact.email && <span>{contact.email}</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.location && <span>{contact.location}</span>}
                        {contact.linkedin && <span>{contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                        {contact.website && <span>{contact.website.replace(/^https?:\/\/(www\.)?/, '')}</span>}
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
                    <SectionHeading label="Summary" />
                    <p className="text-[11px] leading-relaxed text-black">
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
                        <SectionHeading label="Experience" />
                    </div>
                </EntryBlock>
            );

            (section as ExperienceSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Experience">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-5 last:mb-6">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12px] font-bold text-black">{item.role}</h3>
                                <time className="text-[10px] text-black shrink-0">
                                    {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <p className="text-[11px] italic text-black mb-2">{item.company}</p>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="list-disc pl-5 space-y-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-black leading-relaxed pl-1">
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
                        <SectionHeading label="Education" />
                    </div>
                </EntryBlock>
            );

            (section as EducationSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Education">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12px] font-bold text-black">{item.school}</h3>
                                <time className="text-[10px] text-black shrink-0">
                                    {formatDate(item.date)}
                                </time>
                            </div>
                            <p className="text-[11px] text-black">{item.degree}</p>
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
                        <SectionHeading label="Skills" />
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
                                <div key={i} className="mb-1">
                                    <span className="text-[11px] font-bold text-black">{cat.label}: </span>
                                    <span className="text-[11px] text-black">
                                        {cleanedSkills.join(", ")}
                                    </span>
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
                        <SectionHeading label="Projects" />
                    </div>
                </EntryBlock>
            );

            (section as ProjectsSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Projects">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-5 last:mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-[12px] font-bold text-black">{item.name}</h3>
                                {item.date && (
                                    <time className="text-[10px] text-black shrink-0">{formatDate(item.date)}</time>
                                )}
                            </div>
                            {item.description && (
                                <p className="text-[11px] text-black mb-1">{item.description}</p>
                            )}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="list-disc pl-5 space-y-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-black leading-relaxed pl-1">
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
                        <SectionHeading label={customSection.title} />
                    </div>
                </EntryBlock>
            );

            blocks.push(
                <EntryBlock key={`${section.id}-content`} type="custom" id={`${section.id}-content`} sectionId={section.id} sectionTitle={customSection.title}>
                    <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-6">
                        <ul className="list-disc pl-5 space-y-1">
                            {customSection.content.filter(Boolean).map((c, i) => (
                                <li key={i} className="text-[11px] text-black leading-relaxed pl-1">
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

export default function ClassicTemplate({ resume }: ClassicTemplateProps) {
    return (
        <div className="bg-white px-10 py-10 min-h-full">
            {renderClassicBlocks(resume)}
        </div>
    );
}
