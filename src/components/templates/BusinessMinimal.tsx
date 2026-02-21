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
// Business Minimal — single column, ultra-clean, generous whitespace
// No accent colors. Pure grayscale. Only thin HR separators.
// ─────────────────────────────────────────────────────────

interface BusinessMinimalProps {
    resume: Resume;
}

export function renderBusinessMinimalBlocks(resume: Resume): React.ReactNode[] {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // ── Header Block ──
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <header className="mb-10">
                    <h1 className="text-[30px] font-bold text-gray-900 tracking-tight mb-1">
                        {contact.name}
                    </h1>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400 font-medium">
                        {contact.email && <span>{contact.email}</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.location && <span>{contact.location}</span>}
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
                </header>
            </EntryBlock>
        );
    }

    // ── Other Sections ──
    sorted.forEach((section) => {
        if (section.type === "contact") return;

        // Summary
        if (section.type === "summary" && (section as SummarySection).content) {
            blocks.push(
                <EntryBlock key={section.id} type="summary" id={section.id}>
                    <section className="mb-8">
                        <MinimalSectionTitle label="Summary" />
                        <p className="text-[13px] leading-relaxed text-gray-600 mt-3">
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
                    <section className="mb-4">
                        <MinimalSectionTitle label="Experience" />
                    </section>
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
                        <div className="mb-6 px-1">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[14px] font-bold text-gray-900">{item.role}</h3>
                                <time className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter min-w-fit">
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <p className="text-[12px] text-gray-500 font-medium">{item.company}</p>
                                {item.location && (
                                    <p className="text-[10px] text-gray-400">{item.location}</p>
                                )}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1.5 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[12px] text-gray-600 flex gap-2">
                                            <span className="text-gray-300 flex-shrink-0">•</span>
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
                    <section className="mb-4">
                        <MinimalSectionTitle label="Education" />
                    </section>
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
                        <div className="mb-4 px-1">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.school}</h3>
                                <time className="text-[10px] font-semibold text-gray-400 min-w-fit">
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
                    <section className="mb-8">
                        <MinimalSectionTitle label="Skills" />
                        <div className="space-y-2 mt-3">
                            {(section as SkillsSection).categories.map((cat) => (
                                <div key={cat.id} className="text-[12px] text-gray-600">
                                    <span className="font-bold text-gray-800 mr-2">{cat.label}:</span>
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
                    <section className="mb-4">
                        <MinimalSectionTitle label="Projects" />
                    </section>
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
                        <div className="mb-5 px-1">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.name}</h3>
                                {item.link && (
                                    <p className="text-[10px] text-gray-400">
                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                    </p>
                                )}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter mb-1">
                                    {item.techStack.join(" / ")}
                                </p>
                            )}
                            {item.description && (
                                <p className="text-[12px] text-gray-600 leading-snug mb-1">
                                    {item.description}
                                </p>
                            )}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-500 flex gap-2 italic">
                                            <span className="text-gray-300 not-italic flex-shrink-0">›</span>
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
                    <section className="mb-8">
                        <MinimalSectionTitle label={(section as CustomSection).title} />
                        <div className="space-y-1 mt-3">
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

export default function BusinessMinimal({ resume }: BusinessMinimalProps) {
    const blocks = renderBusinessMinimalBlocks(resume);

    return (
        <div
            className="max-w-3xl mx-auto bg-white px-14 py-12 text-gray-700"
            style={{ fontFamily: "Inter, Arial, sans-serif" }}
        >
            {blocks}
        </div>
    );
}

function MinimalSectionTitle({ label }: { label: string }) {
    return (
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 pb-2 border-b border-gray-200">
            {label}
        </h2>
    );
}
