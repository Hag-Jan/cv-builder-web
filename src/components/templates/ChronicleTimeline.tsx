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
// The Chronicle — timeline layout with date column on left
// Highly readable, structured chronology. Great for senior roles.
// ATS-safe: single text layer, semantic HTML, logical DOM order.
// ─────────────────────────────────────────────────────────

const DEFAULT_ACCENT = "#0F766E"; // teal
const DEFAULT_FONT = "Inter, system-ui, sans-serif";

interface ChronicleTimelineProps {
    resume: Resume;
}

function ChronicleSectionTitle({
    label,
    accent,
    size = "M",
    isUpper = true,
}: {
    label: string;
    accent: string;
    size?: "L" | "M" | "S";
    isUpper?: boolean;
}) {
    const fontSize =
        size === "L" ? "text-[13px]" : size === "S" ? "text-[10px]" : "text-[11px]";
    return (
        <div className="flex items-center gap-0 mb-4 mt-8">
            {/* Date column spacer */}
            <div className="w-[80px] shrink-0" />
            {/* Ruled line + title */}
            <div className="flex-grow flex items-center gap-3">
                <div className="h-px flex-grow" style={{ backgroundColor: `${accent}30` }} />
                <h2
                    className={`${fontSize} font-black tracking-[0.18em] whitespace-nowrap ${isUpper ? "uppercase" : ""}`}
                    style={{ color: accent }}
                >
                    {label}
                </h2>
                <div className="h-px w-4" style={{ backgroundColor: `${accent}30` }} />
            </div>
        </div>
    );
}

export function renderChronicleTimelineBlocks(resume: Resume): React.ReactNode[] {
    const DESIGN = resume.design || {};
    const ACCENT = DESIGN.accentColor || DEFAULT_ACCENT;
    const FONT = DESIGN.fontFamily || DEFAULT_FONT;
    const nameColor = DESIGN.applyColorToName ? ACCENT : "#111827";
    const headingColor = DESIGN.applyColorToHeadings ? ACCENT : ACCENT;
    const jobTitleColor = DESIGN.applyColorToJobTitles ? ACCENT : "#6B7280";
    const headingSize = DESIGN.headingSize || "M";
    const headingCase = DESIGN.headingCase || "upper";
    const isUpper = headingCase === "upper";

    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const summary = resume.sections.find((s) => s.type === "summary") as SummarySection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // ── Header ─────────────────────────────────────────────
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div style={{ fontFamily: FONT }}>
                    {/* Name row */}
                    <div className="flex items-baseline gap-6 mb-3">
                        <div className="w-[80px] shrink-0 flex flex-col items-end">
                            {/* Vertical accent line stub */}
                            <div
                                className="w-[2px] h-10 rounded-full"
                                style={{ backgroundColor: ACCENT }}
                            />
                        </div>
                        <div className="flex-grow">
                            <h1
                                className="text-[30px] font-black tracking-tight leading-none mb-1"
                                style={{ color: nameColor }}
                            >
                                {contact.name}
                            </h1>
                            {(contact as any).jobTitle && (
                                <p
                                    className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                                    style={{ color: jobTitleColor }}
                                >
                                    {(contact as any).jobTitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Contact row */}
                    <div className="flex items-center gap-0 mb-2">
                        <div className="w-[80px] shrink-0" />
                        <div className="flex-grow flex flex-wrap gap-x-5 gap-y-1 border-t border-dashed pt-3" style={{ borderColor: `${ACCENT}22` }}>
                            {contact.email && (
                                <span className="text-[10px] text-gray-500 font-medium">{contact.email}</span>
                            )}
                            {contact.phone && (
                                <span className="text-[10px] text-gray-500 font-medium">{contact.phone}</span>
                            )}
                            {contact.location && (
                                <span className="text-[10px] text-gray-500 font-medium">{contact.location}</span>
                            )}
                            {(contact as any).linkedin && (
                                <span className="text-[10px] text-gray-500 font-medium">{(contact as any).linkedin}</span>
                            )}
                            {(contact as any).website && (
                                <span className="text-[10px] text-gray-500 font-medium">{(contact as any).website}</span>
                            )}
                        </div>
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // ── Summary ─────────────────────────────────────────────
    if (summary && summary.content) {
        blocks.push(
            <EntryBlock key="summary" type="summary" id="summary">
                <div style={{ fontFamily: FONT }}>
                    <ChronicleSectionTitle label="Summary" accent={headingColor} size={headingSize} isUpper={isUpper} />
                    <div className="flex gap-0">
                        <div className="w-[80px] shrink-0" />
                        <p className="flex-grow text-[12px] text-gray-600 leading-[1.75] mb-4">{summary.content}</p>
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // ── Other sections ──────────────────────────────────────
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
                        <ChronicleSectionTitle label="Experience" accent={headingColor} size={headingSize} isUpper={isUpper} />
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
                        <div className="flex gap-0 mb-5 last:mb-8" style={{ fontFamily: FONT }}>
                            {/* Date column */}
                            <div className="w-[80px] shrink-0 flex flex-col items-end pr-4 pt-0.5">
                                <time
                                    className="text-[9px] font-black uppercase tracking-widest text-right leading-snug"
                                    style={{ color: ACCENT }}
                                >
                                    {formatDate(item.startDate)}
                                    <br />
                                    <span className="text-gray-300">–</span>
                                    <br />
                                    {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            {/* Content */}
                            <div className="flex-grow border-l-2 pl-4" style={{ borderColor: `${ACCENT}25` }}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-[13px] font-bold text-gray-900">{item.role}</h3>
                                    {item.location && (
                                        <p className="text-[10px] text-gray-400 italic shrink-0 ml-3">{item.location}</p>
                                    )}
                                </div>
                                <p className="text-[11px] font-semibold mb-2" style={{ color: headingColor }}>
                                    {item.company}
                                </p>
                                {item.bullets && item.bullets.length > 0 && (
                                    <ul className="space-y-1">
                                        {item.bullets.map((b, i) => (
                                            <li key={i} className="text-[11.5px] text-gray-600 flex gap-2 leading-snug">
                                                <span className="shrink-0 mt-[4px] w-1 h-1 rounded-full" style={{ backgroundColor: ACCENT }} />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
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
                        <ChronicleSectionTitle label="Education" accent={headingColor} size={headingSize} isUpper={isUpper} />
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
                        <div className="flex gap-0 mb-4 last:mb-8" style={{ fontFamily: FONT }}>
                            {/* Date column */}
                            <div className="w-[80px] shrink-0 flex flex-col items-end pr-4 pt-0.5">
                                <time
                                    className="text-[9px] font-black uppercase tracking-widest text-right"
                                    style={{ color: ACCENT }}
                                >
                                    {formatDate(item.date)}
                                </time>
                            </div>
                            {/* Content */}
                            <div className="flex-grow border-l-2 pl-4" style={{ borderColor: `${ACCENT}25` }}>
                                <h3 className="text-[13px] font-bold text-gray-900 mb-0.5">{item.school}</h3>
                                <p className="text-[11px] text-gray-500 font-medium">{item.degree}</p>
                                {(item.gpa || item.honors) && (
                                    <p className="text-[10px] text-gray-400 italic mt-0.5">
                                        {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(" · ")}
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
                    <div style={{ fontFamily: FONT }}>
                        <ChronicleSectionTitle label="Skills" accent={headingColor} size={headingSize} isUpper={isUpper} />
                    </div>
                </EntryBlock>
            );
            (section as SkillsSection).categories.forEach((cat) => {
                const cleanedSkills = cat.skills.map((s) => s.trim()).filter(Boolean);
                if (!cleanedSkills.length) return;
                blocks.push(
                    <EntryBlock
                        key={cat.id}
                        type="skills"
                        id={cat.id}
                        sectionId={section.id}
                        sectionTitle="Skills"
                    >
                        <div className="flex gap-0 mb-4 last:mb-8" style={{ fontFamily: FONT }}>
                            <div className="w-[80px] shrink-0 flex items-start justify-end pr-4">
                                {cat.label && (
                                    <p className="text-[9px] font-black uppercase tracking-widest text-right leading-snug text-gray-400 mt-0.5">
                                        {cat.label}
                                    </p>
                                )}
                            </div>
                            <div className="flex-grow border-l-2 pl-4 flex flex-wrap gap-1.5" style={{ borderColor: `${ACCENT}25` }}>
                                {cleanedSkills.map((rawSkill, i) => {
                                    const { name, level } = parseSkillLevel(rawSkill);
                                    return (
                                        <span
                                            key={i}
                                            className="text-[11px] font-medium text-gray-700 px-2.5 py-0.5 rounded border border-gray-200 bg-gray-50"
                                        >
                                            {name}
                                            {level && (
                                                <span className="ml-1 text-[9px] uppercase font-bold" style={{ color: ACCENT }}>
                                                    {level}
                                                </span>
                                            )}
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
                    <div style={{ fontFamily: FONT }}>
                        <ChronicleSectionTitle label="Projects" accent={headingColor} size={headingSize} isUpper={isUpper} />
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
                        <div className="flex gap-0 mb-4 last:mb-8" style={{ fontFamily: FONT }}>
                            <div className="w-[80px] shrink-0 pr-4" />
                            <div className="flex-grow border-l-2 pl-4" style={{ borderColor: `${ACCENT}25` }}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-[13px] font-bold text-gray-900">{item.name}</h3>
                                    {item.link && (
                                        <p className="text-[10px] font-medium ml-3 shrink-0" style={{ color: headingColor }}>
                                            {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                        </p>
                                    )}
                                </div>
                                {item.techStack && item.techStack.length > 0 && (
                                    <p className="text-[10px] text-gray-400 uppercase tracking-tight mb-1">
                                        {item.techStack.join(" · ")}
                                    </p>
                                )}
                                {item.description && (
                                    <p className="text-[11.5px] text-gray-600 leading-snug">{item.description}</p>
                                )}
                                {item.bullets && item.bullets.length > 0 && (
                                    <ul className="space-y-1 mt-1">
                                        {item.bullets.map((b, i) => (
                                            <li key={i} className="text-[11px] text-gray-600 flex gap-2 leading-snug">
                                                <span className="shrink-0 mt-[3px] w-1 h-1 rounded-full" style={{ backgroundColor: ACCENT }} />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
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
            const isListSection = ["languages", "hobbies", "interests", "awards", "certifications"].includes(
                customSection.title.toLowerCase()
            );
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle={customSection.title}
                >
                    <div style={{ fontFamily: FONT }}>
                        <ChronicleSectionTitle label={customSection.title} accent={headingColor} size={headingSize} isUpper={isUpper} />
                    </div>
                </EntryBlock>
            );

            if (isListSection) {
                blocks.push(
                    <EntryBlock
                        key={`${section.id}-content`}
                        type="custom"
                        id={`${section.id}-content`}
                        sectionId={section.id}
                        sectionTitle={customSection.title}
                    >
                        <div className="flex gap-0 mb-6" style={{ fontFamily: FONT }}>
                            <div className="w-[80px] shrink-0 pr-4" />
                            <div className="flex-grow border-l-2 pl-4 flex flex-wrap gap-1.5" style={{ borderColor: `${ACCENT}25` }}>
                                {customSection.content.filter(Boolean).map((c, i) => (
                                    <span key={i} className="text-[11px] font-medium text-gray-700 px-2.5 py-0.5 rounded border border-gray-200 bg-gray-50">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </EntryBlock>
                );
            } else {
                customSection.content.forEach((item, idx) => {
                    blocks.push(
                        <EntryBlock
                            key={`${section.id}-item-${idx}`}
                            type="custom"
                            id={`${section.id}-item-${idx}`}
                            sectionId={section.id}
                            sectionTitle={customSection.title}
                        >
                            <div className="flex gap-0 mb-3 last:mb-8" style={{ fontFamily: FONT }}>
                                <div className="w-[80px] shrink-0 pr-4" />
                                <div className="flex-grow border-l-2 pl-4" style={{ borderColor: `${ACCENT}25` }}>
                                    <p className="text-[12px] text-gray-600 leading-relaxed">{item}</p>
                                </div>
                            </div>
                        </EntryBlock>
                    );
                });
            }
        }
    });

    return blocks;
}

export default function ChronicleTimeline({ resume }: ChronicleTimelineProps) {
    const blocks = renderChronicleTimelineBlocks(resume);
    return (
        <div
            className="max-w-3xl mx-auto bg-white px-10 py-10 text-gray-800"
            style={{ fontFamily: resume.design?.fontFamily || DEFAULT_FONT }}
        >
            {blocks}
        </div>
    );
}
