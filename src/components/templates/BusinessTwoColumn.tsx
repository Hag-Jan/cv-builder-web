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
// Business Two Column — 65/35 grid layout
// DOM order: main column first (ATS reads left→right, top→bottom)
// Visual sidebar via CSS Grid only — no floats, no tables.
// Main: Summary, Experience, Education, Projects
// Sidebar: Contact, Skills, Custom
// ─────────────────────────────────────────────────────────

const ACCENT = "#1E3A5F"; // dark navy

interface BusinessTwoColumnProps {
    resume: Resume;
}

export function renderBusinessTwoColumnBlocks(resume: Resume): React.ReactNode[] {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // ── Header Block ──
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <header className="px-14 py-8 mb-4 border-b-2 border-gray-400">
                    <ResumeHeader
                        name={contact.name}
                        email={contact.email}
                        phone={contact.phone}
                        location={contact.location}
                        linkedin={contact.linkedin}
                        github={contact.github}
                        website={contact.website}
                        accentColor="#111827"
                        titleColor="text-gray-900"
                        contactColor="text-gray-900"
                        separatorColor="text-gray-400"
                        borderColor="border-gray-400"
                        align="left"
                        fontFamily="Inter, Arial, sans-serif"
                    />
                </header>
            </EntryBlock>
        );
    }

    // ── Main Content Blocks ──
    const mainTypes = ["summary", "experience", "education", "projects"];
    const mainSections = sorted.filter((s) => s.type !== "contact" && mainTypes.includes(s.type));

    mainSections.forEach((section) => {
        // Summary
        if (section.type === "summary" && (section as SummarySection).content) {
            blocks.push(
                <EntryBlock key={section.id} type="summary" id={section.id}>
                    <section className="px-14 pb-4">
                        <ResumeSummary
                            content={(section as SummarySection).content}
                            accentColor={ACCENT}
                            fontFamily="Inter, Arial, sans-serif"
                        />
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
                    <div className="px-8 pt-4 pb-2 mb-3">
                        <TwoColSectionTitle label="Experience" accent={ACCENT} />
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
                        <div className="px-8 py-2 mb-3 last:mb-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[13px] font-bold text-gray-900">{item.role}</h3>
                                <time className="text-[10px] font-semibold text-gray-500 min-w-fit">
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-1.5">
                                <p className="text-[11px] font-medium text-gray-600">{item.company}</p>
                                {item.location && (
                                    <p className="text-[10px] text-gray-500 italic">{item.location}</p>
                                )}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-700 flex gap-2">
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
                    <div className="px-8 pt-4 pb-2 mb-3">
                        <TwoColSectionTitle label="Education" accent={ACCENT} />
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
                        <div className="px-8 py-2 mb-2 last:mb-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[12px] font-bold text-gray-900">{item.school}</h3>
                                <time className="text-[10px] font-semibold text-gray-500 min-w-fit">
                                    {formatDate(item.date)}
                                </time>
                            </div>
                            <p className="text-[11px] text-gray-600">{item.degree}</p>
                            {(item.gpa || item.honors) && (
                                <p className="text-[10px] text-gray-500 italic">
                                    {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(" | ")}
                                </p>
                            )}
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
                    <div className="px-8 pt-4 pb-2 mb-3">
                        <TwoColSectionTitle label="Projects" accent={ACCENT} />
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
                        <div className="px-8 py-2 mb-3 last:mb-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12px] font-bold text-gray-900">{item.name}</h3>
                                {item.link && (
                                    <p className="text-[10px]" style={{ color: ACCENT }}>
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
                                <p className="text-[11px] text-gray-600 leading-snug mb-1">{item.description}</p>
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
    });

    // ── Sidebar Content Blocks ──
    const sidebarTypes = ["skills", "custom"];
    const sidebarSections = sorted.filter((s) => sidebarTypes.includes(s.type));

    sidebarSections.forEach((section) => {
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
                    <section className="px-14 pt-8 pb-4 bg-white">
                        <TwoColSectionTitle label="Skills & Expertise" accent={ACCENT} />
                    </section>
                </EntryBlock>
            );

            (section as SkillsSection).categories.forEach((cat) => {
                const cleanedSkills = cat.skills.map(s => s.trim()).filter(Boolean);
                if (cleanedSkills.length === 0) return;

                blocks.push(
                    <EntryBlock key={cat.id} type="skills" id={cat.id} sectionId={section.id} sectionTitle="Skills">
                        <div className="px-14 py-2 mb-4 last:mb-8 bg-white">
                            <h3 className="text-[11px] font-bold uppercase tracking-tight text-gray-900 mb-1">
                                {cat.label}
                            </h3>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 leading-relaxed">
                                {cleanedSkills.map((s, sidx) => {
                                    const { name, level } = parseSkillLevel(s);
                                    return (
                                        <span key={sidx} className="text-[11px] text-gray-600 flex items-center">
                                            {name}{level && <span className="text-gray-400 font-medium ml-1 italic">({level})</span>}
                                            {sidx < cleanedSkills.length - 1 && <span className="text-gray-300 ml-3">/</span>}
                                        </span>
                                    );
                                })}
                            </div>
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
                    <section className="px-14 pt-8 pb-4 bg-white">
                        <TwoColSectionTitle label={customSection.title} accent={ACCENT} />
                    </section>
                </EntryBlock>
            );

            if (isListSection) {
                blocks.push(
                    <EntryBlock key={`${section.id}-content`} type="custom" id={`${section.id}-content`} sectionId={section.id} sectionTitle={customSection.title}>
                        <div className="px-14 py-2 mb-8 bg-white flex flex-wrap gap-x-6 gap-y-2">
                            {customSection.content.filter(Boolean).map((c, i) => (
                                <div key={i} className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
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
                        <EntryBlock key={`${section.id}-item-${i}`} type="custom" id={`${section.id}-item-${i}`} sectionId={section.id} sectionTitle={customSection.title}>
                            <div className="px-14 py-2 mb-4 last:mb-8 bg-white">
                                <p className="text-[11px] text-gray-600 leading-relaxed italic">{c}</p>
                            </div>
                        </EntryBlock>
                    );
                });
            }
        }
    });

    return blocks;
}

export default function BusinessTwoColumn({ resume }: BusinessTwoColumnProps) {
    const blocks = renderBusinessTwoColumnBlocks(resume);

    return (
        <div
            className="max-w-4xl mx-auto bg-white text-gray-800"
            style={{ fontFamily: "Inter, Arial, sans-serif" }}
        >
            {blocks}
        </div>
    );
}

function TwoColSectionTitle({ label, accent }: { label: string; accent: string }) {
    return (
        <h2
            className="text-[11px] font-extrabold uppercase tracking-[0.15em] pb-0.5 mb-1"
            style={{ borderBottom: `2px solid ${accent}`, color: accent }}
        >
            {label}
        </h2>
    );
}
