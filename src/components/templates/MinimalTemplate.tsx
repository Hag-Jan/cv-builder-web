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

const DEFAULT_ACCENT = "#000000";
const DEFAULT_FONT = "system-ui, Arial, sans-serif";

interface MinimalTemplateProps {
    resume: Resume;
}

function SectionHeading({ label }: { label: string }) {
    return (
        <div className="mb-6 mt-8">
            <h2
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-black"
                style={{ fontVariant: "small-caps" }}
            >
                {label}
            </h2>
        </div>
    );
}

export function renderMinimalBlocks(resume: Resume): React.ReactNode[] {
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
                <div style={{ fontFamily: FONT }} className="mb-10 text-center">
                    <h1 className="text-3xl font-light uppercase tracking-[0.3em] text-black mb-4">
                        {contact.name}
                    </h1>
                    <div className="flex flex-wrap justify-center items-center text-[10px] text-gray-500 uppercase tracking-widest gap-x-2">
                        {contact.email && <span>{contact.email}</span>}
                        {contact.phone && (
                            <>
                                <span className="text-gray-300">·</span>
                                <span>{contact.phone}</span>
                            </>
                        )}
                        {contact.location && (
                            <>
                                <span className="text-gray-300">·</span>
                                <span>{contact.location}</span>
                            </>
                        )}
                        {contact.linkedin && (
                            <>
                                <span className="text-gray-300">·</span>
                                <span>{contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                            </>
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
                <div className="mb-10" style={{ fontFamily: FONT }}>
                    <SectionHeading label="Summary" />
                    <p className="text-[11px] leading-relaxed text-gray-700">
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
                        <SectionHeading label="Experience" />
                    </div>
                </EntryBlock>
            );

            (section as ExperienceSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Experience">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-6 last:mb-10">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12px] font-bold text-black uppercase tracking-wide">{item.role}</h3>
                                <time className="text-[10px] text-gray-500 uppercase tracking-widest shrink-0">
                                    {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <p className="text-[11px] text-gray-500 mb-2">{item.company}</p>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1.5 mt-2">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-700 leading-relaxed flex items-start">
                                            <span className="mr-3 text-gray-300 mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />
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
                        <SectionHeading label="Education" />
                    </div>
                </EntryBlock>
            );

            (section as EducationSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Education">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-6 last:mb-10">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12px] font-bold text-black uppercase tracking-wide">{item.school}</h3>
                                <time className="text-[10px] text-gray-500 uppercase tracking-widest shrink-0">
                                    {formatDate(item.date)}
                                </time>
                            </div>
                            <p className="text-[11px] text-gray-600">{item.degree}</p>
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
                    <div style={{ fontFamily: FONT }}>
                        <SectionHeading label="Skills" />
                    </div>
                </EntryBlock>
            );

            const skillsSection = section as SkillsSection;
            const allSkills = skillsSection.categories.flatMap(cat => cat.skills.map(s => s.trim()).filter(Boolean));

            blocks.push(
                <EntryBlock key={skillsSection.id} type="skills" id={skillsSection.id} sectionId={section.id} sectionTitle="Skills">
                    <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-10 text-[11px] leading-relaxed text-gray-700">
                        {allSkills.join(", ")}
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
                    <div style={{ fontFamily: FONT }}>
                        <SectionHeading label="Projects" />
                    </div>
                </EntryBlock>
            );

            (section as ProjectsSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="projects" id={item.id} sectionId={section.id} sectionTitle="Projects">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-6 last:mb-10">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-[12px] font-bold text-black uppercase tracking-wide">{item.name}</h3>
                                {item.date && (
                                    <time className="text-[10px] text-gray-500 uppercase tracking-widest shrink-0">{formatDate(item.date)}</time>
                                )}
                            </div>
                            {item.description && (
                                <p className="text-[11px] text-gray-700 leading-relaxed">{item.description}</p>
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
                    <div style={{ fontFamily: FONT }}>
                        <SectionHeading label={customSection.title} />
                    </div>
                </EntryBlock>
            );

            blocks.push(
                <EntryBlock key={`${section.id}-content`} type="custom" id={`${section.id}-content`} sectionId={section.id} sectionTitle={customSection.title}>
                    <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-10">
                        <ul className="space-y-1.5">
                            {customSection.content.filter(Boolean).map((c, i) => (
                                <li key={i} className="text-[11px] text-gray-700 leading-relaxed flex items-start">
                                    <span className="mr-3 text-gray-300 mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />
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

export default function MinimalTemplate({ resume }: MinimalTemplateProps) {
    return (
        <div className="bg-white px-10 py-10 min-h-full">
            {renderMinimalBlocks(resume)}
        </div>
    );
}
