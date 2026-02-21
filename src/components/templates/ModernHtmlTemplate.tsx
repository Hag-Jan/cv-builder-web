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
                        headingLabel="Summary"
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
                        <div className="mb-5">
                            <div className="flex justify-between items-baseline">
                                <p className="text-[14px] font-bold text-gray-900">{item.role}</p>
                                <p className="text-[11px] font-semibold text-blue-500">
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                </p>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <p className="text-[12px] text-gray-500 font-medium">{item.company}</p>
                                {item.location && (
                                    <p className="text-[11px] text-gray-400 italic">{item.location}</p>
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
                        <div className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <p className="text-[13px] font-bold text-gray-900">{item.school}</p>
                                <p className="text-[11px] font-semibold text-blue-500">{item.date}</p>
                            </div>
                            <p className="text-[12px] text-gray-500">{item.degree}</p>
                            {(item.gpa || item.honors) && (
                                <p className="text-[11px] text-gray-400 italic mt-0.5">
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
                    <div className="mb-3">
                        <SectionTitle label="Skills" accent={ACCENT} />
                    </div>
                </EntryBlock>
            );

            const numCategories = (section as SkillsSection).categories.length;
            (section as SkillsSection).categories.forEach((cat, index) => {
                blocks.push(
                    <EntryBlock
                        key={cat.id}
                        type="skills"
                        id={cat.id}
                        sectionId={section.id}
                        sectionTitle="Skills"
                    >
                        <div className={`text-[12px] text-gray-600 ${index === numCategories - 1 ? 'mb-7' : 'mb-2'}`}>
                            <h3 className="text-[12px] font-bold mb-0.5" style={{ color: ACCENT }}>
                                {cat.label}
                            </h3>
                            <span>{cat.skills.filter(Boolean).join(", ")}</span>
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
                        <div className="mb-5">
                            <div className="flex justify-between items-baseline mb-1">
                                <p className="text-[13px] font-bold text-gray-900">{item.name}</p>
                                {item.link && (
                                    <p className="text-[10px] font-medium" style={{ color: ACCENT }}>
                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                    </p>
                                )}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
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
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle={(section as CustomSection).title}
                >
                    <div className="mb-3">
                        <SectionTitle label={(section as CustomSection).title} accent={ACCENT} />
                    </div>
                </EntryBlock>
            );

            const numContent = (section as CustomSection).content.length;
            (section as CustomSection).content.forEach((c, i) => {
                blocks.push(
                    <EntryBlock
                        key={`${section.id}-item-${i}`}
                        type="custom"
                        id={`${section.id}-item-${i}`}
                        sectionId={section.id}
                        sectionTitle={(section as CustomSection).title}
                    >
                        <div className={`space-y-1 ${i === numContent - 1 ? 'mb-7' : 'mb-1'}`}>
                            <p className="text-[12px] text-gray-600">{c}</p>
                        </div>
                    </EntryBlock>
                );
            });
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
