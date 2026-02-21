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
// Business Classic — ATS-safe, single column, serif, conservative
// Max ATS safety: logical DOM order, semantic HTML, no tables.
// ─────────────────────────────────────────────────────────

interface BusinessClassicProps {
    resume: Resume;
}

export function renderBusinessClassicBlocks(resume: Resume): React.ReactNode[] {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // ── Header Block ──
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <header className="mb-8 text-center">
                    <h1 className="text-[26px] font-bold uppercase tracking-widest mb-1">
                        {contact.name}
                    </h1>
                    <div
                        className="border-t-2 border-b-2 border-black py-1.5 my-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[11px] font-medium"
                    >
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
                <EntryBlock
                    key={section.id}
                    type="summary"
                    id={section.id}
                    sectionId={section.id}
                    sectionTitle="Professional Summary"
                >
                    <section className="mb-6">
                        <ClassicSectionTitle label="Professional Summary" />
                        <p className="text-[12px] leading-relaxed text-gray-800 mt-2">
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
                    sectionTitle="Professional Experience"
                >
                    <section className="mb-2">
                        <ClassicSectionTitle label="Professional Experience" />
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
                        sectionTitle="Professional Experience"
                    >
                        <div className="mb-5 px-1">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[13px] font-bold uppercase tracking-tight text-black">
                                    {item.role}
                                </h3>
                                <time className="text-[10px] font-semibold text-gray-600 min-w-fit">
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-1.5">
                                <p className="text-[12px] font-semibold text-gray-700 italic">
                                    {item.company}
                                </p>
                                {item.location && (
                                    <p className="text-[10px] text-gray-500">{item.location}</p>
                                )}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="list-disc ml-5 space-y-1 mt-1">
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
                    <section className="mb-2">
                        <ClassicSectionTitle label="Education" />
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
                        <div className="mb-3 px-1">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[12px] font-bold uppercase tracking-tight text-black">
                                    {item.school}
                                </h3>
                                <time className="text-[10px] font-semibold text-gray-600 min-w-fit">
                                    {formatDate(item.date)}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <p className="text-[12px] italic text-gray-700">{item.degree}</p>
                                {(item.gpa || item.honors) && (
                                    <p className="text-[10px] text-gray-500">
                                        {[item.gpa && `GPA: ${item.gpa}`, item.honors]
                                            .filter(Boolean)
                                            .join(" | ")}
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
                    <section className="mb-2">
                        <ClassicSectionTitle label="Skills" />
                    </section>
                </EntryBlock>
            );

            const numCategories = (section as SkillsSection).categories.length;
            (section as SkillsSection).categories.forEach((cat, idx) => {
                blocks.push(
                    <EntryBlock
                        key={cat.id}
                        type="skills"
                        id={cat.id}
                        sectionId={section.id}
                        sectionTitle="Skills"
                    >
                        <div className={`text-[11px] ${idx === numCategories - 1 ? 'mb-6' : 'mb-1.5'}`}>
                            <h3 className="font-bold text-black inline mr-2">{cat.label}:</h3>
                            <span className="text-gray-800">{cat.skills.filter(Boolean).join(", ")}</span>
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
                    <section className="mb-2">
                        <ClassicSectionTitle label="Projects" />
                    </section>
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
                        <div className="mb-4 px-1">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12px] font-bold text-black">{item.name}</h3>
                                {item.link && (
                                    <p className="text-[10px] text-gray-500">
                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                    </p>
                                )}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] font-semibold text-gray-600 mb-1">
                                    Tech: {item.techStack.join(", ")}
                                </p>
                            )}
                            {item.description && (
                                <p className="text-[11px] text-gray-800 leading-snug mb-1">
                                    {item.description}
                                </p>
                            )}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="list-disc ml-5 space-y-0.5">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-800">
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
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle={(section as CustomSection).title}
                >
                    <section className="mb-2">
                        <ClassicSectionTitle label={(section as CustomSection).title} />
                    </section>
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
                        <div className={`space-y-1 mt-1 ${i === numContent - 1 ? 'mb-6' : 'mb-1'}`}>
                            <p className="text-[11px] text-gray-800">
                                {c}
                            </p>
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
            className="max-w-3xl mx-auto bg-white px-10 py-10 text-black"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
            {blocks}
        </div>
    );
}

function ClassicSectionTitle({ label }: { label: string }) {
    return (
        <h2 className="text-[13px] font-bold uppercase tracking-normal border-b border-black pb-0.5 mb-1">
            {label}
        </h2>
    );
}
