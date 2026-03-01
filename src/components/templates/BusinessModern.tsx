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
import { ResumeHeader } from "../preview/ResumeHeader";
import { ResumeSummary } from "../preview/ResumeSummary";
import AutosaveIndicator from "@/components/editor/AutosaveIndicator"; // Added this import

// ─────────────────────────────────────────────────────────
// Business Modern — single column, sans-serif, navy accent
// Clean section dividers, no heavy borders.
// ATS-safe: logical DOM order, semantic HTML, CSS only.
// ─────────────────────────────────────────────────────────

const DEFAULT_ACCENT = "#0F4C81"; // deep business navy
const DEFAULT_FONT = "Inter, system-ui, sans-serif";

interface BusinessModernProps {
    resume: Resume;
}

export function renderBusinessModernBlocks(resume: Resume): React.ReactNode[] {
    const ACCENT = resume.design?.accentColor || DEFAULT_ACCENT;
    const DESIGN = resume.design || {};

    const nameColor = DESIGN.applyColorToName ? ACCENT : "#111827";
    const headingColor = DESIGN.applyColorToHeadings ? ACCENT : "#111827";
    const jobTitleColor = DESIGN.applyColorToJobTitles ? ACCENT : "#4b5563";
    const FONT = DESIGN.fontFamily || DEFAULT_FONT;
    const ALIGN = DESIGN.headerAlign || 'left';
    const headingSize = DESIGN.headingSize || "M";
    const headingCase = DESIGN.headingCase || "upper";

    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const summary = resume.sections.find((s) => s.type === "summary") as SummarySection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // Header Area
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div className="flex justify-between items-center mb-12 gap-8" style={{ fontFamily: FONT }}>
                    <div className="flex-grow">
                        <h1
                            className="text-5xl font-black tracking-tighter leading-[0.8] mb-4"
                            style={{ color: nameColor }}
                        >
                            {contact.name}
                        </h1>
                        <p
                            className="text-lg font-black uppercase tracking-[0.3em] opacity-40"
                            style={{ color: jobTitleColor }}
                        >
                            {(contact as any).jobTitle || "Executive"}
                        </p>
                    </div>

                    <div className="flex gap-8 items-center h-24 shrink-0">
                        <div className="w-[3px] h-full rounded-full" style={{ backgroundColor: ACCENT }}></div>
                        <div className="flex flex-col justify-center gap-3 text-right">
                            {contact.email && (
                                <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center justify-end gap-3 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                                    {contact.email}
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                </div>
                            )}
                            {contact.phone && (
                                <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center justify-end gap-3 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                                    {contact.phone}
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                </div>
                            )}
                            {contact.location && (
                                <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center justify-end gap-3 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                                    {contact.location}
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // Summary
    if (summary && summary.content) {
        blocks.push(
            <EntryBlock key="summary" type="summary" id="summary">
                <div className="mb-10 relative">
                    <div className="absolute left-0 top-0 w-16 h-1 rounded-full" style={{ backgroundColor: `${ACCENT}20` }}></div>
                    <div className="pt-6 text-[13px] text-gray-600 leading-[1.8] font-bold tracking-tight max-w-[90%]">
                        {summary.content}
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // Rest of sections
    sorted.forEach((section) => {
        if (section.type === "contact" || section.type === "summary") return;
        // ... existing section logic ...

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
                    <div className="mb-3">
                        <ModernSectionTitle
                            label="Experience"
                            accent={headingColor}
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
                        sectionTitle="Experience"
                    >
                        <div style={{ marginBottom: "var(--entry-space)" }} className="last:mb-6">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[13px] font-bold" style={{ color: jobTitleColor }}>{item.role}</h3>
                                <time
                                    className="text-[10px] font-semibold min-w-fit shrink-0 whitespace-nowrap text-right"
                                    style={{ color: ACCENT }}
                                >
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <p className="text-[12px] text-gray-500 font-medium">{item.company}</p>
                                {item.location && (
                                    <p className="text-[10px] text-gray-500 italic shrink-0 text-right whitespace-nowrap">{item.location}</p>
                                )}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[12px] text-gray-700 flex gap-2">
                                            <span style={{ color: ACCENT, flexShrink: 0 }}>›</span>
                                            <span className="leading-snug">{b}</span>
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
                        <ModernSectionTitle
                            label="Education"
                            accent={headingColor}
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
                        <div style={{ marginBottom: "var(--entry-space)" }} className="last:mb-6">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[13px] font-bold" style={{ color: headingColor }}>{item.school}</h3>
                                <time
                                    className="text-[10px] font-semibold min-w-fit shrink-0 whitespace-nowrap text-right"
                                    style={{ color: ACCENT }}
                                >
                                    {formatDate(item.date)}
                                </time>
                            </div>
                            <p className="text-[12px] text-gray-500">{item.degree}</p>
                            {(item.gpa || item.honors) && (
                                <p className="text-[10px] text-gray-500 italic mt-0.5">
                                    {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(" | ")}
                                </p>
                            )}
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
                    <section className="mt-8 mb-4 px-1">
                        <ModernSectionTitle
                            label="Skills & Expertise"
                            accent={headingColor}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </section>
                </EntryBlock>
            );

            (section as SkillsSection).categories.forEach((cat) => {
                const cleanedSkills = cat.skills.map(s => s.trim()).filter(Boolean);
                if (cleanedSkills.length === 0) return;

                blocks.push(
                    <EntryBlock key={cat.id} type="skills" id={cat.id} sectionId={section.id} sectionTitle="Skills">
                        <div style={{ marginBottom: "var(--entry-space)" }} className="text-[12px] text-gray-600 px-1 last:mb-10">
                            <h3
                                className="text-[12px] font-bold mb-2 uppercase tracking-tight"
                                style={{ color: headingColor }}
                            >
                                {cat.label}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {cleanedSkills.map((rawSkill, i) => {
                                    const { name, level } = parseSkillLevel(rawSkill);
                                    return (
                                        <div
                                            key={i}
                                            className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full flex items-center gap-2"
                                        >
                                            <span className="font-bold text-gray-900">{name}</span>
                                            {level && (
                                                <span
                                                    className="text-[8px] uppercase font-black px-1.5 py-0.5 rounded-sm"
                                                    style={{ backgroundColor: ACCENT, color: "#fff" }}
                                                >
                                                    {level}
                                                </span>
                                            )}
                                        </div>
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
                        <ModernSectionTitle
                            label="Projects"
                            accent={ACCENT}
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
                        type="projects"
                        id={item.id}
                        sectionId={section.id}
                        sectionTitle="Projects"
                    >
                        <div style={{ marginBottom: "var(--entry-space)" }} className="last:mb-6">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12px] font-bold text-gray-900">{item.name}</h3>
                                {item.link && (
                                    <p className="text-[10px] font-medium" style={{ color: ACCENT }}>
                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                    </p>
                                )}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] text-gray-500 uppercase tracking-tight mb-1">
                                    {item.techStack.join(" / ")}
                                </p>
                            )}
                            {item.description && (
                                <p className="text-[12px] text-gray-600 leading-snug mb-1">{item.description}</p>
                            )}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-0.5 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-600 flex gap-2">
                                            <span style={{ color: ACCENT, flexShrink: 0 }}>›</span>
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

        // Custom
        if (section.type === "custom") {
            const customSection = section as CustomSection;
            const isListSection = ["languages", "hobbies", "interests", "awards", "certifications"].includes(customSection.title.toLowerCase());

            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle={customSection.title}
                >
                    <section className="mt-8 mb-4 px-1">
                        <ModernSectionTitle
                            label={customSection.title}
                            accent={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </section>
                </EntryBlock>
            );

            if (isListSection) {
                blocks.push(
                    <EntryBlock key={`${section.id}-content`} type="custom" id={`${section.id}-content`} sectionId={section.id} sectionTitle={customSection.title}>
                        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4 px-1 pb-6">
                            {customSection.content.filter(Boolean).map((c, i) => (
                                <div key={i} className="text-[12px] text-gray-700 font-semibold flex items-center gap-2">
                                    <span style={{ color: ACCENT }}>■</span>
                                    {c}
                                </div>
                            ))}
                        </div>
                    </EntryBlock>
                );
            } else {
                customSection.content.forEach((item, idx) => {
                    blocks.push(
                        <EntryBlock key={`${section.id}-item-${idx}`} type="custom" id={`${section.id}-item-${idx}`} sectionId={section.id} sectionTitle={customSection.title}>
                            <div className="px-1 mb-4 last:mb-6">
                                <p className="text-[12px] text-gray-700 leading-relaxed font-medium">{item}</p>
                            </div>
                        </EntryBlock>
                    );
                });
            }
        }
    });

    return blocks;
}

export default function BusinessModern({ resume }: BusinessModernProps) {
    const blocks = renderBusinessModernBlocks(resume);

    return (
        <div
            className="max-w-3xl mx-auto bg-white px-10 py-10 text-gray-800"
            style={{ fontFamily: resume.design?.fontFamily || DEFAULT_FONT }}
        >
            {blocks}
        </div>
    );
}

function ModernSectionTitle({
    label,
    accent,
    size = "M",
    isUpper = true
}: {
    label: string;
    accent: string;
    size?: "L" | "M" | "S";
    isUpper?: boolean;
}) {
    const fontSize = size === "L" ? "text-sm" : size === "S" ? "text-[10px]" : "text-xs";

    return (
        <div className="flex items-center gap-3 mb-3 mt-6">
            <div
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: accent }}
            ></div>
            <h2
                className={`${fontSize} font-black tracking-[0.15em] ${isUpper ? "uppercase" : ""}`}
                style={{ color: "#111827" }}
            >
                {label}
            </h2>
            <div className="flex-grow border-t border-gray-100"></div>
        </div>
    );
}
