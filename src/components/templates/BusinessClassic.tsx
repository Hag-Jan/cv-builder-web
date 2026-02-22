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
                <ResumeHeader
                    name={contact.name}
                    email={contact.email}
                    phone={contact.phone}
                    location={contact.location}
                    linkedin={contact.linkedin}
                    github={contact.github}
                    website={contact.website}
                    align="center"
                    fontFamily='Georgia, "Times New Roman", serif'
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
                    sectionTitle="Professional Summary"
                >
                    <ResumeSummary
                        content={(section as SummarySection).content}
                        fontFamily='Georgia, "Times New Roman", serif'
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
                    sectionTitle="Professional Experience"
                >
                    <div className="mb-3">
                        <ClassicSectionTitle label="Professional Experience" />
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
                        <div className="mb-4 last:mb-6 px-1">
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
                    <div className="mb-3">
                        <ClassicSectionTitle label="Education" />
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
                    <div className="mt-8 mb-4">
                        <ClassicSectionTitle label="Skills & Expertise" />
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
                        <div className="text-[11px] mb-3 last:mb-8 px-1">
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
                        <ClassicSectionTitle label="Projects" />
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
                        <div className="mb-4 last:mb-6 px-1">
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
                        <ClassicSectionTitle label={customSection.title} />
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
                        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-8 px-1">
                            {customSection.content.filter(Boolean).map((c, i) => (
                                <div key={i} className="text-[11px] text-gray-800 font-bold flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-sm italic" />
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
                            <div className="mb-3 last:mb-8 px-1">
                                <p className="text-[11px] text-gray-800 leading-relaxed italic">
                                    {c}
                                </p>
                            </div>
                        </EntryBlock>
                    );
                });
            }
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
