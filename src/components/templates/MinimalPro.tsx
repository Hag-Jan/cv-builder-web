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

/**
 * EXAMPLE DATA FOR PREVIEW/TESTING (Realistic, no lorem ipsum):
 * Name: "Elena Rodriguez"
 * Contact: "elena.design@email.com | (212) 555-0123 | Brooklyn, NY | elenarodriguez.design"
 * Summary: "Product Designer with 8 years of experience creating intuitive, user-centered digital experiences for fintech and healthcare SaaS. Adept at distilling complex workflows into elegant, accessible interfaces."
 * Experience: "Lead Product Designer at FinLife (2019-Present) - Spearheaded the redesign of the core dashboard interface, resulting in a 25% increase in user engagement and securing a Webby Award nomination."
 * Projects: "HealthTrack Mobile App - End-to-end design of a patient monitoring app. Conducted 40+ user interviews and delivered high-fidelity prototypes."
 * Education: "BFA in Interaction Design, Parsons School of Design (2014)"
 * Skills: "UX Research, Wireframing, Rapid Prototyping, Figma, Design Systems, HTML/CSS, Usability Testing"
 */

const DEFAULT_FONT = "Helvetica, Arial, sans-serif";

interface MinimalProProps {
    resume: Resume;
}

function SectionHeading({ label }: { label: string }) {
    return (
        <div className="mb-4 mt-6">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-900 mb-2">
                {label}
            </h2>
            <div className="border-t border-slate-200 w-full" />
        </div>
    );
}

export function renderMinimalProBlocks(resume: Resume): React.ReactNode[] {
    const DESIGN = resume.design || {};
    const FONT = DESIGN.fontFamily || DEFAULT_FONT;

    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const summary = resume.sections.find((s) => s.type === "summary") as SummarySection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    const blocks: React.ReactNode[] = [];

    // Header Area
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div style={{ fontFamily: FONT }} className="mb-8 text-center mt-4">
                    <h1 className="text-[28px] font-normal tracking-tight text-slate-900 mb-3">
                        {contact.name}
                    </h1>

                    <div className="flex flex-wrap justify-center items-center text-[10.5px] font-normal text-slate-500 gap-x-2 gap-y-1">
                        {contact.email && <span>{contact.email}</span>}
                        {contact.email && contact.phone && <span className="text-slate-300">|</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.phone && contact.location && <span className="text-slate-300">|</span>}
                        {contact.location && <span>{contact.location}</span>}
                        {contact.location && contact.linkedin && <span className="text-slate-300">|</span>}
                        {contact.linkedin && <span>{contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                        {contact.linkedin && contact.website && <span className="text-slate-300">|</span>}
                        {contact.website && <span>{contact.website.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // Summary Area
    if (summary && summary.content) {
        blocks.push(
            <EntryBlock key="summary" type="summary" id="summary">
                <div className="mb-6" style={{ fontFamily: FONT }}>
                    <p className="text-[11.5px] leading-relaxed text-slate-600 text-justify">
                        {summary.content}
                    </p>
                </div>
            </EntryBlock>
        );
    }

    // Processing other sections
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
                        <SectionHeading label="Experience" />
                    </div>
                </EntryBlock>
            );

            (section as ExperienceSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Experience">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-5 last:mb-6">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12.5px] font-bold text-slate-900">{item.role}</h3>
                                <time className="text-[10.5px] font-medium text-slate-500 shrink-0">
                                    {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <p className="text-[11.5px] text-slate-700">{item.company}</p>
                                {item.location && (
                                    <p className="text-[10.5px] text-slate-400 shrink-0">{item.location}</p>
                                )}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1 mt-1 pl-3 list-disc">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11.5px] text-slate-600 leading-relaxed pl-1">
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
                        <SectionHeading label="Projects" />
                    </div>
                </EntryBlock>
            );

            (section as ProjectsSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="projects" id={item.id} sectionId={section.id} sectionTitle="Projects">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-5 last:mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-[12.5px] font-bold text-slate-900">
                                    {item.name}
                                </h3>
                                {item.link && (
                                    <a href={item.link} className="text-[10px] text-slate-400 hover:text-slate-800 transition-colors">
                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                    </a>
                                )}
                            </div>
                            {item.description && (
                                <p className="text-[11.5px] text-slate-600 leading-relaxed mb-1.5">
                                    {item.description}
                                </p>
                            )}
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] font-medium text-slate-500 mb-1.5">
                                    {item.techStack.join(" • ")}
                                </p>
                            )}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1 mt-1 pl-3 list-disc">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11.5px] text-slate-600 leading-relaxed pl-1">
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

        // Skills
        if (section.type === "skills" && (section as SkillsSection).categories.length > 0) {
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle="Skills"
                >
                    <div style={{ fontFamily: FONT }}>
                        <SectionHeading label="Skills" />
                    </div>
                </EntryBlock>
            );

            const skillsSection = section as SkillsSection;
            blocks.push(
                <EntryBlock key={skillsSection.id} type="skills" id={skillsSection.id} sectionId={section.id} sectionTitle="Skills">
                    <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-6">
                        {skillsSection.categories.map((cat, i) => {
                            const cleanedSkills = cat.skills.map(s => s.trim()).filter(Boolean);
                            if (cleanedSkills.length === 0) return null;

                            return (
                                <div key={i} className="mb-1.5 leading-relaxed">
                                    <span className="text-[11.5px] font-bold text-slate-900 mr-2">{cat.label}:</span>
                                    <span className="text-[11.5px] text-slate-600">
                                        {cleanedSkills.map(s => parseSkillLevel(s).name).join(", ")}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </EntryBlock>
            );
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
                        <SectionHeading label="Education" />
                    </div>
                </EntryBlock>
            );

            (section as EducationSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Education">
                        <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[12.5px] font-bold text-slate-900">{item.school}</h3>
                                <time className="text-[10.5px] font-medium text-slate-500 shrink-0">
                                    {formatDate(item.date)}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <p className="text-[11.5px] text-slate-700">{item.degree}</p>
                                {item.gpa && (
                                    <p className="text-[10.5px] font-medium text-slate-500">GPA: {item.gpa}</p>
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
            blocks.push(
                <EntryBlock
                    key={`${section.id}-header`}
                    type="header"
                    id={`${section.id}-header`}
                    sectionId={section.id}
                    sectionTitle={customSection.title}
                >
                    <div style={{ fontFamily: FONT }}>
                        <SectionHeading label={customSection.title} />
                    </div>
                </EntryBlock>
            );

            blocks.push(
                <EntryBlock key={`${section.id}-content`} type="custom" id={`${section.id}-content`} sectionId={section.id} sectionTitle={customSection.title}>
                    <div style={{ fontFamily: FONT, marginBottom: "var(--entry-space)" }} className="mb-6">
                        <ul className="space-y-1.5 pl-3 list-disc">
                            {customSection.content.filter(Boolean).map((c, i) => (
                                <li key={i} className="text-[11.5px] text-slate-600 leading-relaxed pl-1">
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>
                </EntryBlock>
            );
        }
    });

    return blocks;
}

export default function MinimalPro({ resume }: MinimalProProps) {
    return (
        <div className="bg-white px-12 py-10 min-h-full">
            {renderMinimalProBlocks(resume)}
        </div>
    );
}
