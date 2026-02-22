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

    // ── Other Sections ──
    sorted.forEach((section) => {
        if (section.type === "contact") return;

        // Summary
        if (section.type === "summary" && (section as SummarySection).content) {
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
                        <MinimalSectionTitle label="Experience" />
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
                        <div className="mb-4 last:mb-6 px-1">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[14px] font-bold text-gray-900">{item.role}</h3>
                                <time className="text-[10px] font-semibold text-gray-500 uppercase tracking-tighter min-w-fit">
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <p className="text-[12px] text-gray-500 font-medium">{item.company}</p>
                                {item.location && (
                                    <p className="text-[10px] text-gray-500">{item.location}</p>
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
                    <div className="mb-3">
                        <MinimalSectionTitle label="Education" />
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
                        <div className="mb-4 last:mb-6 px-1">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.school}</h3>
                                <time className="text-[10px] font-semibold text-gray-500 min-w-fit">
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
                    <div className="mt-10 mb-8">
                        <MinimalSectionTitle label="Skills & Expertise" />
                    </div>
                </EntryBlock>
            );

            (section as SkillsSection).categories.forEach((cat) => {
                const cleanedSkills = cat.skills.map(s => s.trim()).filter(Boolean);
                if (cleanedSkills.length === 0) return;

                blocks.push(
                    <EntryBlock key={cat.id} type="skills" id={cat.id} sectionId={section.id} sectionTitle="Skills">
                        <div className="text-[12px] text-gray-600 px-1 mb-6 last:mb-10">
                            <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-tight">{cat.label}</h3>
                            <div className="flex flex-wrap gap-x-4 leading-relaxed">
                                {cleanedSkills.map((s, sidx) => {
                                    const { name, level } = parseSkillLevel(s);
                                    return (
                                        <span key={sidx} className="flex items-center">
                                            {name}{level && <span className="text-gray-400 font-medium ml-1">({level})</span>}
                                            {sidx < cleanedSkills.length - 1 && <span className="text-gray-200 ml-4">|</span>}
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
                        <MinimalSectionTitle label="Projects" />
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
                        <div className="mb-4 last:mb-6 px-1">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.name}</h3>
                                {item.link && (
                                    <p className="text-[10px] text-gray-500">
                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                    </p>
                                )}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-tighter mb-1">
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
            const customSection = section as CustomSection;
            const isListSection = ["languages", "hobbies", "interests", "awards", "certifications"].includes(customSection.title.toLowerCase());

            blocks.push(
                <EntryBlock key={section.id} type="custom" id={section.id}>
                    <div className="mt-10 mb-8">
                        <MinimalSectionTitle label={customSection.title} />
                        {isListSection ? (
                            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-5 px-1">
                                {customSection.content.filter(Boolean).map((c, i) => (
                                    <div key={i} className="text-[12px] text-gray-700 font-semibold flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 border border-gray-300 rounded-full" />
                                        {c}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3 mt-5 px-1">
                                {customSection.content.map((c, i) => (
                                    <p key={i} className="text-[12px] text-gray-600 leading-relaxed">{c}</p>
                                ))}
                            </div>
                        )}
                    </div>
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
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 pb-2 border-b border-gray-200">
            {label}
        </h2>
    );
}
