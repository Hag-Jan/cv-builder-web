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

const DEFAULT_ACCENT = "#2D3436";
const DEFAULT_FONT = "Georgia, serif";

interface UniversalFormalProps {
    resume: Resume;
}

function SectionLabel({ label, accent }: { label: string; accent: string }) {
    return (
        <h2
            className="text-[11px] font-bold border-b mb-3 mt-1.5 uppercase tracking-[0.1em]"
            style={{ color: accent, borderColor: "#e2e8f0" }}
        >
            {label}
        </h2>
    );
}

export function renderUniversalFormalBlocks(resume: Resume): React.ReactNode[] {
    const DESIGN = resume.design || {};
    const ACCENT = DESIGN.accentColor || DEFAULT_ACCENT;
    const FONT = "serif"; // Explicitly formal

    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    const blocks: React.ReactNode[] = [];

    // Header Block
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div className="pt-8 pb-4 px-12 bg-white text-center" style={{ fontFamily: FONT }}>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                        {contact.name}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 text-[11px] text-slate-700">
                        {contact.location && <span>{contact.location}</span>}
                        {contact.location && (contact.phone || contact.email) && <span>•</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {(contact.phone || contact.location) && contact.email && <span>•</span>}
                        {contact.email && <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>}
                        {contact.linkedin && <span>•</span>}
                        {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>}
                        {contact.website && <span>•</span>}
                        {contact.website && <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>}
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // Process sorted sections
    sorted.forEach((section) => {
        if (section.type === "contact") return;

        if (section.type === "summary") {
            blocks.push(
                <EntryBlock key={section.id} type="summary" id={section.id}>
                    <div className="px-12 py-1.5 bg-white" style={{ fontFamily: FONT }}>
                        <SectionLabel label="PROFESSIONAL SUMMARY" accent={ACCENT} />
                        <p className="text-[12px] text-slate-800 leading-[1.6] text-justify italic">
                            {(section as SummarySection).content}
                        </p>
                    </div>
                </EntryBlock>
            );
        }

        if (section.type === "experience") {
            const exp = section as ExperienceSection;
            exp.items.forEach((item, index) => {
                blocks.push(
                    <EntryBlock key={`${section.id}-${item.id}`} type="entry" id={item.id}>
                        <div className="px-12 py-1.5 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <SectionLabel label="PROFESSIONAL EXPERIENCE" accent={ACCENT} />}
                            <div className="flex justify-between font-bold text-slate-900 text-[13px] mb-0.5">
                                <span>{item.company}</span>
                                <span className="tabular-nums uppercase text-[11px]">
                                    {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                </span>
                            </div>
                            <div className="flex justify-between italic text-slate-700 text-[12.5px] mb-1.5 font-medium">
                                <span>{item.role}</span>
                                {item.location && <span>{item.location}</span>}
                            </div>
                            <ul className="space-y-0.5 list-disc ml-4">
                                {item.bullets.map((bullet, idx) => (
                                    <li key={idx} className="text-[12px] text-slate-800 leading-normal pl-1">
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </EntryBlock>
                );
            });
        }

        if (section.type === "education") {
            const edu = section as EducationSection;
            edu.items.forEach((item, index) => {
                blocks.push(
                    <EntryBlock key={`${section.id}-${item.id}`} type="entry" id={item.id}>
                        <div className="px-12 py-1.5 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <SectionLabel label="EDUCATION" accent={ACCENT} />}
                            <div className="flex justify-between font-bold text-slate-900 text-[12.5px] mb-0.5">
                                <span>{item.school}</span>
                                <span className="text-[11px] uppercase">{formatDate(item.date)}</span>
                            </div>
                            <div className="flex justify-between text-[12px] text-slate-700">
                                <span className="italic">{item.degree}</span>
                                {item.gpa && <span className="font-bold">GPA: {item.gpa}</span>}
                            </div>
                        </div>
                    </EntryBlock>
                );
            });
        }

        if (section.type === "skills") {
            blocks.push(
                <EntryBlock key={section.id} type="skills" id={section.id}>
                    <div className="px-12 py-1.5 bg-white" style={{ fontFamily: FONT }}>
                        <SectionLabel label="SKILLS & EXPERTISE" accent={ACCENT} />
                        <div className="space-y-1">
                            {(section as SkillsSection).categories.map((category) => (
                                <p key={category.id} className="text-[12px] leading-relaxed">
                                    <strong className="text-slate-900 font-bold uppercase mr-2 text-[10.5px]">{category.label}:</strong>
                                    <span className="text-slate-800">{category.skills.join(', ')}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                </EntryBlock>
            );
        }

        if (section.type === "projects") {
            const proj = section as ProjectsSection;
            proj.items.forEach((item, index) => {
                blocks.push(
                    <EntryBlock key={`${section.id}-${item.id}`} type="projects" id={item.id}>
                        <div className="px-12 py-1.5 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <SectionLabel label="PROJECTS" accent={ACCENT} />}
                            <p className="text-[12.5px] leading-relaxed">
                                <strong className="text-slate-900 font-bold">{item.name}</strong>
                                {item.techStack && <span className="text-slate-500 ml-2 text-[11px]">({item.techStack.join(', ')})</span>}
                                {item.link && <a href={item.link} className="ml-2 text-blue-800 underline text-[10px]">Link</a>}
                            </p>
                            <p className="text-[12px] text-slate-700 leading-snug mt-1">{item.description}</p>
                        </div>
                    </EntryBlock>
                );
            });
        }

        if (section.type === "custom") {
            const custom = section as CustomSection;
            blocks.push(
                <EntryBlock key={section.id} type="custom" id={section.id}>
                    <div className="px-12 py-1.5 bg-white" style={{ fontFamily: FONT }}>
                        <SectionLabel label={custom.title.toUpperCase()} accent={ACCENT} />
                        <ul className="space-y-0.5 list-disc ml-4">
                            {custom.content.map((c, i) => (
                                <li key={i} className="text-[12px] text-slate-800 leading-snug pl-1">
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

export default function UniversalFormal({ resume }: UniversalFormalProps) {
    return <div className="bg-white min-h-full pb-8">{renderUniversalFormalBlocks(resume)}</div>;
}

