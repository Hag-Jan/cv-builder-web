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

const DEFAULT_ACCENT = "#3b82f6";
const DEFAULT_FONT = "Inter, sans-serif";

interface ResumaveCleanProps {
    resume: Resume;
}

function GridSectionHeading({ label, accent }: { label: string; accent: string }) {
    return (
        <h2
            className="text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
            style={{ color: accent }}
        >
            <span className="w-1 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
            {label}
        </h2>
    );
}

export function renderResumaveCleanBlocks(resume: Resume): React.ReactNode[] {
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
                <div className="pt-10 pb-6 px-10 bg-white" style={{ fontFamily: FONT }}>
                    <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
                                {contact.name}
                            </h1>
                            <p className="text-base font-semibold text-slate-500">
                                {(contact as any).jobTitle || "Professional Title"}
                            </p>
                        </div>
                        <div className="text-right space-y-0.5">
                            {contact.email && <div className="text-[12px] text-slate-600 font-medium">{contact.email}</div>}
                            {contact.phone && <div className="text-[12px] text-slate-500">{contact.phone}</div>}
                            {contact.location && <div className="text-[12px] text-slate-500">{contact.location}</div>}
                            {contact.website && <div className="text-[12px] text-blue-500 font-bold">{contact.website.replace(/^https?:\/\//, '')}</div>}
                        </div>
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
                    <div className="px-10 py-3 bg-white" style={{ fontFamily: FONT }}>
                        <GridSectionHeading label="About Me" accent={ACCENT} />
                        <p className="text-[12.5px] text-slate-600 leading-relaxed font-normal">
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
                        <div className="px-10 py-3 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <GridSectionHeading label="Work History" accent={ACCENT} />}
                            <div className="relative pl-5 border-l-2 border-slate-100">
                                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-white border-2 border-slate-300" />
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-[14.5px] font-bold text-slate-900">{item.role}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 uppercase tracking-tighter tabular-nums">
                                        {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                    </span>
                                </div>
                                <div className="text-[12.5px] font-bold text-slate-700 mb-2">{item.company}</div>
                                <ul className="space-y-1 list-none">
                                    {item.bullets.map((bullet, idx) => (
                                        <li key={idx} className="text-[12.5px] text-slate-600 leading-relaxed flex gap-2">
                                            <span className="text-slate-300 mt-0.5">•</span>
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
                        <div className="px-10 py-3 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <GridSectionHeading label="Education" accent={ACCENT} />}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-[14px] font-bold text-slate-900">{item.school}</h3>
                                    <p className="text-[12.5px] text-slate-600 py-0.5">{item.degree}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10.5px] font-bold text-slate-400">{formatDate(item.date)}</span>
                                    {item.gpa && <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">GPA: {item.gpa}</div>}
                                </div>
                            </div>
                        </div>
                    </EntryBlock>
                );
            });
        }

        if (section.type === "skills") {
            blocks.push(
                <EntryBlock key={section.id} type="skills" id={section.id}>
                    <div className="px-10 py-3 bg-white" style={{ fontFamily: FONT }}>
                        <GridSectionHeading label="Key Skills" accent={ACCENT} />
                        <div className="flex flex-wrap gap-1.5">
                            {(section as SkillsSection).categories.flatMap(cat => cat.skills).map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100 shadow-sm"
                                >
                                    {skill}
                                </span>
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
                        <div className="px-10 py-3 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <GridSectionHeading label="Projects" accent={ACCENT} />}
                            <div className="p-3.5 rounded-lg bg-slate-50/50 border border-slate-100">
                                <h3 className="text-[14px] font-bold text-slate-900 mb-0.5">{item.name}</h3>
                                <p className="text-[12px] text-slate-600 mb-2 line-clamp-2">{item.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {item.techStack?.slice(0, 4).map((tech, idx) => (
                                        <span key={idx} className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                            #{tech}
                                        </span>
                                    ))}
                                </div>
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
                    <div className="px-10 py-3 bg-white" style={{ fontFamily: FONT }}>
                        <GridSectionHeading label={custom.title} accent={ACCENT} />
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 list-none">
                            {custom.content.map((c, i) => (
                                <li key={i} className="text-[12px] text-slate-600 flex gap-2">
                                    <span className="text-slate-300">•</span>
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

export default function ResumaveClean({ resume }: ResumaveCleanProps) {
    return <div className="bg-white min-h-full pb-10 shadow-sm rounded-sm overflow-hidden">{renderResumaveCleanBlocks(resume)}</div>;
}
