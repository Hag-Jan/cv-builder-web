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

const DEFAULT_ACCENT = "#111827";
const DEFAULT_FONT = "Inter, sans-serif";

interface ResumifyModernProps {
    resume: Resume;
}

function SectionHeading({ label, accent }: { label: string; accent: string }) {
    return (
        <div className="flex items-center gap-4 mb-3">
            <h2
                className="text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
                style={{ color: accent }}
            >
                {label}
            </h2>
            <div className="h-[1px] w-full bg-slate-100" />
        </div>
    );
}

export function renderResumifyModernBlocks(resume: Resume): React.ReactNode[] {
    const DESIGN = resume.design || {};
    const ACCENT = DESIGN.accentColor || DEFAULT_ACCENT;
    const FONT = DESIGN.fontFamily || DEFAULT_FONT;

    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    const blocks: React.ReactNode[] = [];

    // Header Block
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div className="pt-10 pb-6 px-12 bg-white flex flex-col items-center text-center" style={{ fontFamily: FONT }}>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
                        {contact.name}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[12px] text-slate-500 font-medium">
                        {contact.email && (
                            <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                                <span style={{ color: ACCENT }}>✉</span> {contact.email}
                            </a>
                        )}
                        {contact.phone && (
                            <span className="flex items-center gap-1.5">
                                <span style={{ color: ACCENT }}>📞</span> {contact.phone}
                            </span>
                        )}
                        {contact.location && (
                            <span className="flex items-center gap-1.5">
                                <span style={{ color: ACCENT }}>📍</span> {contact.location}
                            </span>
                        )}
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
                    <div className="px-12 py-2 bg-white" style={{ fontFamily: FONT }}>
                        <SectionHeading label="Profile" accent={ACCENT} />
                        <p className="text-[12.5px] text-slate-600 leading-relaxed font-normal text-justify">
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
                        <div className="px-12 py-2 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <SectionHeading label="Experience" accent={ACCENT} />}
                            <div>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-[14.5px] font-bold text-slate-900">{item.company}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 tabular-nums uppercase tracking-wider">
                                        {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-[12.5px] font-semibold italic text-slate-600">{item.role}</span>
                                    {item.location && <span className="text-[10.5px] font-medium text-slate-400">{item.location}</span>}
                                </div>
                                <ul className="space-y-1 list-none">
                                    {item.bullets.map((bullet, idx) => (
                                        <li key={idx} className="text-[12.5px] text-slate-600 leading-relaxed flex gap-2.5">
                                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${ACCENT}20` }} />
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
                        <div className="px-12 py-2 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <SectionHeading label="Education" accent={ACCENT} />}
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[14px] font-bold text-slate-900">{item.school}</h3>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{formatDate(item.date)}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[12.5px] font-medium text-slate-600 italic">{item.degree}</span>
                                {item.gpa && <span className="text-[10.5px] font-bold text-slate-500">GPA: {item.gpa}</span>}
                            </div>
                        </div>
                    </EntryBlock>
                );
            });
        }

        if (section.type === "skills") {
            blocks.push(
                <EntryBlock key={section.id} type="skills" id={section.id}>
                    <div className="px-12 py-2 bg-white" style={{ fontFamily: FONT }}>
                        <SectionHeading label="Skills" accent={ACCENT} />
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                            {(section as SkillsSection).categories.map((category) => (
                                <div key={category.id}>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{category.label}</h4>
                                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                                        {category.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="text-[12.5px] text-slate-600 inline-flex items-center"
                                            >
                                                {skill}{idx < category.skills.length - 1 && <span className="ml-2 text-slate-200">•</span>}
                                            </span>
                                        ))}
                                    </div>
                                </div>
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
                        <div className="px-12 py-2 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <SectionHeading label="Projects" accent={ACCENT} />}
                            <div>
                                <div className="flex justify-between items-baseline mb-1.5">
                                    <h3 className="text-[14px] font-bold text-slate-900">{item.name}</h3>
                                    {item.link && (
                                        <a href={item.link} className="text-[9px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors underline underline-offset-4 decoration-slate-100">
                                            Link ↗
                                        </a>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-1.5">
                                    {item.techStack?.map((tech, idx) => (
                                        <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-[12px] text-slate-600 leading-relaxed mb-1.5">{item.description}</p>
                            </div>
                        </div>
                    </EntryBlock>
                );
            });
        }

        if (section.type === "custom") {
            const custom = section as CustomSection;
            blocks.push(
                <EntryBlock key={section.id} type="custom" id={section.id}>
                    <div className="px-12 py-2 bg-white" style={{ fontFamily: FONT }}>
                        <SectionHeading label={custom.title} accent={ACCENT} />
                        <ul className="space-y-1.5 list-none">
                            {custom.content.map((c, i) => (
                                <li key={i} className="text-[12.5px] text-slate-600 leading-relaxed flex gap-2.5">
                                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${ACCENT}20` }} />
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

export default function ResumifyModern({ resume }: ResumifyModernProps) {
    return <div className="bg-white min-h-full pb-8">{renderResumifyModernBlocks(resume)}</div>;
}

