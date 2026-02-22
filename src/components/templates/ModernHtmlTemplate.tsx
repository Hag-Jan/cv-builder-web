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
import { formatDate, ensureUrlScheme } from "@/lib/utils/date-formatter";
import { EntryBlock } from "../preview/EntryBlock";
import { parseSkillLevel } from "@/lib/utils/skill-parser";
import { ResumeHeader } from "../preview/ResumeHeader";
import { ResumeSummary } from "../preview/ResumeSummary";

// ─────────────────────────────────────────────────────────
// Modern HTML Template — sans-serif + blue accent colors
// Clearly different from Classic (serif + black borders).
// ─────────────────────────────────────────────────────────

interface ModernHtmlTemplateProps {
    resume: Resume;
}

const ACCENT = "#2563EB"; // blue-600

export function renderModernHtmlBlocks(resume: Resume): React.ReactNode[] {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // ── Header Block ──
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <ResumeHeader
                    name={contact.name}
                    email={contact.email}
                    phone={contact.phone}
                    location={contact.location}
                    linkedin={contact.linkedin}
                    github={contact.github}
                    website={contact.website}
                    accentColor={ACCENT}
                    align="left"
                    fontFamily="Inter, system-ui, sans-serif"
                />
            </EntryBlock>
        );
    }

    // ── Other Sections ──
    sorted.forEach((section) => {
        if (section.type === "contact") return;

        // Summary
        if (section.type === "summary" && (section as SummarySection).content) {
            blocks.push(
                <EntryBlock
                    key={section.id}
                    type="summary"
                    id={section.id}
                    sectionId={section.id}
                    sectionTitle="Summary"
                >
                    <ResumeSummary
                        content={(section as SummarySection).content}
                        accentColor={ACCENT}
                        fontFamily="Inter, system-ui, sans-serif"
                    />
                </EntryBlock>
            );
        }

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
                        <SectionTitle label="Experience" accent={ACCENT} />
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
                        <div className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[14px] font-bold text-gray-900">{item.role}</h3>
                                <p className="text-[11px] font-semibold text-blue-500">
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                </p>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <p className="text-[12px] text-gray-500 font-medium">{item.company}</p>
                                {item.location && (
                                    <p className="text-[11px] text-gray-500 italic">{item.location}</p>
                                )}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[12px] text-gray-600 flex gap-2">
                                            <span style={{ color: ACCENT }}>›</span>
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
                        <SectionTitle label="Education" accent={ACCENT} />
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
                        <div className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.school}</h3>
                                <p className="text-[11px] font-semibold text-blue-500">{item.date}</p>
                            </div>
                            <p className="text-[12px] text-gray-500">{item.degree}</p>
                            {(item.gpa || item.honors) && (
                                <p className="text-[11px] text-gray-500 italic mt-0.5">
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
                    <div className="mt-8 mb-4">
                        <SectionTitle label="Skills & Expertise" accent={ACCENT} />
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
                        <div className="mb-4 last:mb-8">
                            <h3 className="text-[13px] font-bold mb-2" style={{ color: ACCENT }}>
                                {cat.label}
                            </h3>
                            <div className="flex flex-wrap gap-x-2 leading-relaxed">
                                {cleanedSkills.map((s, sidx) => {
                                    const { name, level } = parseSkillLevel(s);
                                    return (
                                        <span key={sidx} className="text-[12px] text-gray-700 flex items-center">
                                            {name}{level && <span className="text-gray-400 italic ml-1">({level})</span>}
                                            {sidx < cleanedSkills.length - 1 && <span className="text-gray-300 ml-2">/</span>}
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
                        <SectionTitle label="Projects" accent={ACCENT} />
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
                        <div className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.name}</h3>
                                {item.link && (
                                    <p className="text-[10px] font-medium" style={{ color: ACCENT }}>
                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                    </p>
                                )}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight mb-1">
                                    {item.techStack.join(" / ")}
                                </p>
                            )}
                            {item.description && (
                                <p className="text-[12px] text-gray-600 leading-snug mb-2">{item.description}</p>
                            )}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-0.5 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-500 flex gap-2">
                                            <span style={{ color: ACCENT }}>›</span>
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
                    <div className="mt-8 mb-4">
                        <SectionTitle label={customSection.title} accent={ACCENT} />
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
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                            {customSection.content.filter(Boolean).map((c, i) => (
                                <div key={i} className="text-[12px] text-gray-700 font-medium flex items-center gap-2">
                                    <span style={{ color: ACCENT }}>•</span>
                                    {c}
                                </div>
                            ))}
                        </div>
                    </EntryBlock>
                );
            } else {
                customSection.content.forEach((c, i) => {
                    blocks.push(
                        <EntryBlock
                            key={`${section.id}-item-${i}`}
                            type="custom"
                            id={`${section.id}-item-${i}`}
                            sectionId={section.id}
                            sectionTitle={customSection.title}
                        >
                            <div className="mb-3 last:mb-8">
                                <p className="text-[12px] text-gray-700 leading-relaxed">{c}</p>
                            </div>
                        </EntryBlock>
                    );
                });
            }
        }
    });

    return blocks;
}

export default function ModernHtmlTemplate({ resume }: ModernHtmlTemplateProps) {
    const blocks = renderModernHtmlBlocks(resume);

    return (
        <div
            className="max-w-3xl mx-auto bg-white px-10 py-10 text-gray-800"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
            {blocks}
        </div>
    );
}

// Shared section title component: blue left-border accent + uppercase label
function SectionTitle({ label, accent }: { label: string; accent: string }) {
    return (
        <div
            className="flex items-center gap-2 mb-1"
            style={{ borderLeft: `3px solid ${accent}`, paddingLeft: "8px" }}
        >
            <h2
                className="text-[11px] font-extrabold uppercase tracking-[0.18em]"
                style={{ color: accent }}
            >
                {label}
            </h2>
        </div>
    );
}
