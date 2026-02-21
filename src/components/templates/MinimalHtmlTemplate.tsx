import React from "react";
import type {
    ResumeV2 as Resume,
    ContactSectionV2 as ContactSection,
    ExperienceSectionV2 as ExperienceSection,
    EducationSectionV2 as EducationSection,
    SkillsSectionV2 as SkillsSection,
    ProjectsSectionV2 as ProjectsSection,
    CustomSectionV2 as CustomSection,
    SummarySection
} from "@/types/resume-schema-v2";
import { EntryBlock } from "../preview/EntryBlock";
import { ResumeHeader } from "../preview/ResumeHeader";
import { ResumeSummary } from "../preview/ResumeSummary";

// ─────────────────────────────────────────────────────────
// Minimal HTML Template — Updated for ResumeV2
// Clean, borderless, generous whitespace.
// ─────────────────────────────────────────────────────────

interface MinimalHtmlTemplateProps {
    resume: Resume;
}

export function renderMinimalHtmlBlocks(resume: Resume): React.ReactNode[] {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // Contact
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
                    align="left"
                    fontFamily="Inter, Arial, sans-serif"
                />
            </EntryBlock>
        );
    }

    sorted.forEach((section) => {
        if (section.type === "contact") return;

        // Summary
        if (section.type === "summary") {
            blocks.push(
                <EntryBlock key={section.id} type="summary" id={section.id}>
                    <ResumeSummary
                        content={(section as SummarySection).content}
                        fontFamily="Inter, Arial, sans-serif"
                    />
                </EntryBlock>
            );
        }

        // Experience
        if (section.type === "experience") {
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="mb-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pb-1 border-b border-gray-100">
                            Professional Experience
                        </h2>
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
                        <div className="mb-5">
                            <div className="flex justify-between items-baseline">
                                <p className="text-[14px] font-bold text-gray-900">{item.role}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                    {item.startDate} – {item.endDate || "Present"}
                                </p>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <p className="text-[12px] text-gray-500 font-medium">{item.company}</p>
                                {item.location && <p className="text-[10px] text-gray-400">{item.location}</p>}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[12px] text-gray-600 flex gap-2">
                                            <span className="text-gray-300">•</span>
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
        if (section.type === "education") {
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="mb-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pb-1 border-b border-gray-100">
                            Education
                        </h2>
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
                                <p className="text-[10px] font-bold text-gray-400">{item.date}</p>
                            </div>
                            <p className="text-[12px] text-gray-500">{item.degree}</p>
                            {(item.gpa || item.honors) && (
                                <p className="text-[11px] text-gray-400 mt-1 italic">
                                    {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(' | ')}
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
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="mb-3">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pb-1 border-b border-gray-100">
                            Expertise
                        </h2>
                    </div>
                </EntryBlock>
            );

            const numCategories = (section as SkillsSection).categories.length;
            (section as SkillsSection).categories.forEach((cat, idx) => {
                blocks.push(
                    <EntryBlock key={cat.id} type="skills" id={cat.id} sectionId={section.id} sectionTitle="Expertise">
                        <div className={`text-[12px] text-gray-600 ${idx === numCategories - 1 ? 'mb-6' : 'mb-2'}`}>
                            <span className="font-bold text-gray-800 mr-2">{cat.label}</span>
                            <span>{cat.skills.filter(Boolean).join(", ")}</span>
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Projects
        if (section.type === "projects" && (section as ProjectsSection).items.length > 0) {
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="mb-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pb-1 border-b border-gray-100">
                            Featured Projects
                        </h2>
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
                        sectionTitle="Featured Projects"
                    >
                        <div className="mb-5">
                            <div className="flex justify-between items-baseline mb-1">
                                <p className="text-[13px] font-bold text-gray-900">{item.name}</p>
                                {item.link && <p className="text-[10px] text-blue-500 font-medium">{item.link.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">
                                    {item.techStack.join(" / ")}
                                </p>
                            )}
                            {item.description && (
                                <p className="text-[12px] text-gray-600 leading-snug mb-2">{item.description}</p>
                            )}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-0.5 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-500 flex gap-2 italic">
                                            <span className="text-gray-300">›</span>
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
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="mb-3">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pb-1 border-b border-gray-100">
                            {(section as CustomSection).title}
                        </h2>
                    </div>
                </EntryBlock>
            );

            const numContent = (section as CustomSection).content.length;
            (section as CustomSection).content.forEach((c, i) => {
                blocks.push(
                    <EntryBlock key={`${section.id}-item-${i}`} type="custom" id={`${section.id}-item-${i}`} sectionId={section.id} sectionTitle={(section as CustomSection).title}>
                        <div className={`space-y-1 ${i === numContent - 1 ? 'mb-6' : 'mb-2'}`}>
                            <p className="text-[12px] text-gray-600">{c}</p>
                        </div>
                    </EntryBlock>
                );
            });
        }
    });

    return blocks;
}

export default function MinimalHtmlTemplate({ resume }: MinimalHtmlTemplateProps) {
    const blocks = renderMinimalHtmlBlocks(resume);

    return (
        <div className="max-w-3xl mx-auto bg-white px-12 py-10 text-gray-700" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
            {blocks}
        </div>
    );
}
