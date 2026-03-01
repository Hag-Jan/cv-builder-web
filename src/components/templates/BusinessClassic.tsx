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

// ─────────────────────────────────────────────────────────
// Business Classic — ATS-safe, single column, serif, conservative
// Max ATS safety: logical DOM order, semantic HTML, no tables.
// ─────────────────────────────────────────────────────────

interface BusinessClassicProps {
    resume: Resume;
}

const DEFAULT_ACCENT = "#000000";
const DEFAULT_FONT = "Georgia, serif";

function ClassicSectionTitle({
    label,
    accentColor,
    size = "M",
    isUpper = true
}: {
    label: string;
    accentColor?: string;
    size?: "L" | "M" | "S";
    isUpper?: boolean;
}) {
    const fontSize = size === "L" ? "text-[16px]" : size === "S" ? "text-[12px]" : "text-[14px]";

    return (
        <div className="relative flex items-center mb-3 mt-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <h2
                className={`${fontSize} font-serif font-bold px-4 tracking-[0.2em] ${isUpper ? "uppercase" : ""}`}
                style={{ color: accentColor || "#111827" }}
            >
                {label}
            </h2>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
    );
}

export function renderBusinessClassicBlocks(resume: Resume): React.ReactNode[] {
    const ACCENT = resume.design?.accentColor || DEFAULT_ACCENT;
    const DESIGN = resume.design || {};
    const FONT = DESIGN.fontFamily || DEFAULT_FONT;
    const headingSize = DESIGN.headingSize || "M";
    const headingCase = DESIGN.headingCase || "upper";

    const nameColor = DESIGN.applyColorToName ? ACCENT : "#111827";
    const jobTitleColor = DESIGN.applyColorToJobTitles ? ACCENT : "#6b7280";

    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const summary = resume.sections.find((s) => s.type === "summary") as SummarySection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // Header Area
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div className="text-center mb-10" style={{ fontFamily: FONT }}>
                    <h1
                        className="text-5xl font-serif mb-4 tracking-tight leading-none"
                        style={{ color: nameColor }}
                    >
                        {contact.name}
                    </h1>
                    <p
                        className="text-xl font-medium mb-10 tracking-[0.25em] uppercase italic opacity-60"
                        style={{ color: jobTitleColor }}
                    >
                        {(contact as any).jobTitle || "Scholar"}
                    </p>

                    <div className="flex flex-col items-center gap-6">
                        <div className="w-full flex flex-col gap-[2px]">
                            <div className="h-[2px] w-full" style={{ backgroundColor: nameColor }}></div>
                            <div className="h-[0.5px] w-full" style={{ backgroundColor: `${nameColor}40` }}></div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-y-3 gap-x-8 text-[10px] uppercase font-serif tracking-[0.15em] text-gray-500 font-bold">
                            {contact.email && <span className="flex items-center gap-2">{contact.email}</span>}
                            {contact.phone && <span className="flex items-center gap-2">{contact.phone}</span>}
                            {contact.location && <span className="flex items-center gap-2">{contact.location}</span>}
                            {contact.website && (
                                <a href={contact.website} className="underline decoration-gray-300 underline-offset-4 font-black">
                                    {contact.website.replace(/^https?:\/\/(www\.)?/, "")}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // Summary Area
    if (summary && summary.content) {
        blocks.push(
            <EntryBlock key="summary" type="summary" id="summary">
                <div className="mb-10 px-8 text-center italic text-gray-700 leading-relaxed font-serif text-[13px] relative mx-auto max-w-2xl">
                    <span className="absolute -left-4 -top-4 text-4xl text-gray-100 font-serif leading-none">“</span>
                    {summary.content}
                    <span className="absolute -right-4 -bottom-4 text-4xl text-gray-100 font-serif leading-none">”</span>
                </div>
            </EntryBlock>
        );
    }

    // Rest of sections
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
                    sectionTitle="Professional Experience"
                >
                    <div className="mb-3">
                        <ClassicSectionTitle
                            label="Professional Experience"
                            accentColor={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </div>
                </EntryBlock>
            );
            (section as ExperienceSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock
                        key={item.id}
                        type="entry"
                        id={item.id}
                        sectionId={section.id}
                        sectionTitle="Professional Experience"
                    >
                        <div style={{ marginBottom: "var(--entry-space)" }} className="last:mb-6 px-1 text-center">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold uppercase tracking-tight text-black">
                                    {item.role}
                                </h3>
                                <time className="text-[10px] font-semibold text-gray-600">
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-1.5">
                                <p className="text-[12px] font-semibold text-gray-700 italic">
                                    {item.company}
                                </p>
                                {item.location && (
                                    <p className="text-[10px] text-gray-500 shrink-0 text-right whitespace-nowrap">{item.location}</p>
                                )}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="list-disc ml-5 space-y-1 mt-1 text-left">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-800 leading-snug">
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
                    <div className="mb-3">
                        <ClassicSectionTitle
                            label="Education"
                            accentColor={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </div>
                </EntryBlock>
            );
            (section as EducationSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock
                        key={item.id}
                        type="entry"
                        id={item.id}
                        sectionId={section.id}
                        sectionTitle="Education"
                    >
                        <div style={{ marginBottom: "var(--entry-space)" }} className="last:mb-6 px-1">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12px] font-bold uppercase tracking-tight text-black">
                                    {item.school}
                                </h3>
                                <time className="text-[10px] font-semibold text-gray-600">{formatDate(item.date)}</time>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <p className="text-[12px] italic text-gray-700">{item.degree}</p>
                                {(item.gpa || item.honors) && (
                                    <p className="text-[10px] text-gray-500">
                                        {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(" | ")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Skills
        if (section.type === "skills") {
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle="Skills"
                >
                    <div className="mt-8 mb-4">
                        <ClassicSectionTitle
                            label="Skills & Expertise"
                            accentColor={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </div>
                </EntryBlock>
            );

            (section as SkillsSection).categories.forEach((cat) => {
                const cleanedSkills = cat.skills.map(s => s.trim()).filter(Boolean);
                if (cleanedSkills.length === 0) return;

                blocks.push(
                    <EntryBlock
                        key={cat.id}
                        type="skills"
                        id={cat.id}
                        sectionId={section.id}
                        sectionTitle="Skills"
                    >
                        <div style={{ marginBottom: "var(--entry-space)" }} className="text-[11px] last:mb-8 px-1">
                            <h3 className="font-bold text-black mb-1 uppercase tracking-tight">{cat.label}</h3>
                            <div className="text-gray-800 leading-relaxed italic">
                                {cleanedSkills.map((s, sidx) => {
                                    const { name, level } = parseSkillLevel(s);
                                    return (
                                        <span key={sidx}>
                                            {name}{level && <span className="text-gray-500 font-medium ml-1">({level})</span>}
                                            {sidx < cleanedSkills.length - 1 && <span className="mr-2">,</span>}
                                        </span>
                                    );
                                })}
                            </div>
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
                    <div className="mb-3">
                        <ClassicSectionTitle
                            label="Projects"
                            accentColor={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </div>
                </EntryBlock>
            );
            (section as ProjectsSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock
                        key={item.id}
                        type="entry"
                        id={item.id}
                        sectionId={section.id}
                        sectionTitle="Projects"
                    >
                        <div style={{ marginBottom: "var(--entry-space)" }} className="last:mb-6 px-1">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12px] font-bold text-black">{item.name}</h3>
                                {item.link && <p className="text-[10px] text-gray-500 font-serif lowercase italic">{item.link.replace(/^https?:\/\//, '')}</p>}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] font-semibold text-gray-600 mb-1">
                                    Tech: {item.techStack.join(", ")}
                                </p>
                            )}
                            {item.description && <p className="text-[11px] text-gray-800 leading-snug mb-1">{item.description}</p>}
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
                    <div className="mt-8 mb-4">
                        <ClassicSectionTitle
                            label={customSection.title}
                            accentColor={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </div>
                </EntryBlock>
            );

            customSection.content.forEach((c, i) => {
                blocks.push(
                    <EntryBlock
                        key={`${section.id}-item-${i}`}
                        type="custom"
                        id={`${section.id}-item-${i}`}
                        sectionId={section.id}
                        sectionTitle={customSection.title}
                    >
                        <div style={{ marginBottom: "var(--entry-space)" }} className="last:mb-8 px-1">
                            <p className="text-[11px] text-gray-800 leading-relaxed italic">{c}</p>
                        </div>
                    </EntryBlock>
                );
            });
        }
    });

    return blocks;
}

export default function BusinessClassic({ resume }: BusinessClassicProps) {
    const blocks = renderBusinessClassicBlocks(resume);

    return (
        <div
            className="max-w-3xl mx-auto bg-white px-10 py-10 text-black min-h-[1000px]"
            style={{ fontFamily: resume.design?.fontFamily || DEFAULT_FONT }}
        >
            {blocks}
        </div>
    );
}
