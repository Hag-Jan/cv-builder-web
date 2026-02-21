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

// ─────────────────────────────────────────────────────────
// Business Modern — single column, sans-serif, navy accent
// Clean section dividers, no heavy borders.
// ATS-safe: logical DOM order, semantic HTML, CSS only.
// ─────────────────────────────────────────────────────────

const ACCENT = "#0F4C81"; // deep business navy

interface BusinessModernProps {
    resume: Resume;
}

export function renderBusinessModernBlocks(resume: Resume): React.ReactNode[] {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // ── Header Block ──
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <header className="mb-8">
                    <h1
                        className="text-[28px] font-extrabold tracking-tight mb-1"
                        style={{ color: ACCENT }}
                    >
                        {contact.name}
                    </h1>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium">
                        {contact.email && <span>{contact.email}</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.location && <span>{contact.location}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400 mt-0.5">
                        {contact.linkedin && (
                            <span>{contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        )}
                        {contact.github && (
                            <span>{contact.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        )}
                        {contact.website && (
                            <span>{contact.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        )}
                    </div>
                    {/* Thin accent rule under header */}
                    <div className="mt-4 h-[3px] rounded-full" style={{ backgroundColor: ACCENT }} />
                </header>
            </EntryBlock>
        );
    }

    // ── Sections ──
    sorted.forEach((section) => {
        if (section.type === "contact") return;

        // Summary
        if (section.type === "summary" && (section as SummarySection).content) {
            blocks.push(
                <EntryBlock key={section.id} type="summary" id={section.id}>
                    <section className="mb-7">
                        <ModernSectionTitle label="Summary" accent={ACCENT} />
                        <p className="text-[12px] leading-relaxed text-gray-600 mt-2">
                            {(section as SummarySection).content}
                        </p>
                    </section>
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
                    <ModernSectionTitle label="Experience" accent={ACCENT} />
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
                        <div className="mb-5 last:mb-7">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.role}</h3>
                                <time
                                    className="text-[10px] font-semibold min-w-fit"
                                    style={{ color: ACCENT }}
                                >
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <p className="text-[12px] text-gray-500 font-medium">{item.company}</p>
                                {item.location && (
                                    <p className="text-[10px] text-gray-400 italic">{item.location}</p>
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
                    <ModernSectionTitle label="Education" accent={ACCENT} />
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
                        <div className="mb-3 last:mb-7">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.school}</h3>
                                <time
                                    className="text-[10px] font-semibold min-w-fit"
                                    style={{ color: ACCENT }}
                                >
                                    {formatDate(item.date)}
                                </time>
                            </div>
                            <p className="text-[12px] text-gray-500">{item.degree}</p>
                            {(item.gpa || item.honors) && (
                                <p className="text-[10px] text-gray-400 italic mt-0.5">
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
                    key={section.id}
                    type="skills"
                    id={section.id}
                    sectionId={section.id}
                    sectionTitle="Skills"
                >
                    <section className="mb-7">
                        <ModernSectionTitle label="Skills" accent={ACCENT} />
                        <div className="space-y-2 mt-2">
                            {(section as SkillsSection).categories.map((cat) => (
                                <div key={cat.id} className="text-[12px] text-gray-600">
                                    <h3
                                        className="text-[11px] font-bold mb-0.5"
                                        style={{ color: ACCENT }}
                                    >
                                        {cat.label}
                                    </h3>
                                    <span>{cat.skills.filter(Boolean).join(", ")}</span>
                                </div>
                            ))}
                        </div>
                    </section>
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
                    <ModernSectionTitle label="Projects" accent={ACCENT} />
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
                        <div className="mb-4 last:mb-7">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12px] font-bold text-gray-900">{item.name}</h3>
                                {item.link && (
                                    <p className="text-[10px] font-medium" style={{ color: ACCENT }}>
                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                    </p>
                                )}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] text-gray-400 uppercase tracking-tight mb-1">
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
            blocks.push(
                <EntryBlock key={section.id} type="custom" id={section.id}>
                    <section className="mb-7">
                        <ModernSectionTitle label={(section as CustomSection).title} accent={ACCENT} />
                        <div className="space-y-1 mt-2">
                            {(section as CustomSection).content.map((c, i) => (
                                <p key={i} className="text-[12px] text-gray-600">{c}</p>
                            ))}
                        </div>
                    </section>
                </EntryBlock>
            );
        }
    });

    return blocks;
}

export default function BusinessModern({ resume }: BusinessModernProps) {
    const blocks = renderBusinessModernBlocks(resume);

    return (
        <div
            className="max-w-3xl mx-auto bg-white px-10 py-10 text-gray-800"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
            {blocks}
        </div>
    );
}

function ModernSectionTitle({ label, accent }: { label: string; accent: string }) {
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
