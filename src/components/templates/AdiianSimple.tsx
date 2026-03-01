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

const DEFAULT_ACCENT = "#4f46e5";
const DEFAULT_FONT = "Inter, sans-serif";

interface AdiianSimpleProps {
    resume: Resume;
}

function SimpleHeading({ label, accent }: { label: string; accent: string }) {
    return (
        <h2
            className="text-[11px] font-black uppercase tracking-[0.2em] mb-3"
            style={{ color: accent }}
        >
            {label}
        </h2>
    );
}

export function renderAdiianSimpleBlocks(resume: Resume): React.ReactNode[] {
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
                    <div className="border-l-[6px] pl-6" style={{ borderColor: ACCENT }}>
                        <h1 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter uppercase">
                            {contact.name}
                        </h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                            {contact.email && <span>{contact.email}</span>}
                            {contact.phone && <span>{contact.phone}</span>}
                            {contact.location && <span>{contact.location}</span>}
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
                        <SimpleHeading label="Profile" accent={ACCENT} />
                        <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
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
                            {index === 0 && <SimpleHeading label="Experience" accent={ACCENT} />}
                            <div className={index === 0 ? "" : "pt-1"}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{item.role}</h3>
                                    <span className="text-[10px] font-black text-slate-400 tabular-nums bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                        {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                    </span>
                                </div>
                                <div className="text-[12px] font-black text-slate-500 mb-3 uppercase tracking-widest">{item.company}</div>
                                <ul className="space-y-1.5 list-none border-l border-slate-100 ml-0.5 pl-5">
                                    {item.bullets.map((bullet, idx) => (
                                        <li key={idx} className="text-[12.5px] text-slate-600 leading-relaxed relative">
                                            <div className="absolute -left-[23px] top-[7px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
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
                            {index === 0 && <SimpleHeading label="Education" accent={ACCENT} />}
                            <div className="border-l border-slate-100 ml-0.5 pl-5">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{item.school}</h3>
                                    <span className="text-[10px] font-black text-slate-400">{formatDate(item.date)}</span>
                                </div>
                                <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{item.degree}</div>
                                {item.gpa && <div className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter">GPA: {item.gpa}</div>}
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
                        <SimpleHeading label="Skills" accent={ACCENT} />
                        <div className="flex flex-wrap gap-3">
                            {(section as SkillsSection).categories.map((category) => (
                                <div key={category.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex-1 min-w-[140px]">
                                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2">{category.label}</h4>
                                    <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
                                        {category.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="text-[11px] font-bold text-slate-700 whitespace-nowrap"
                                            >
                                                {skill}{idx < category.skills.length - 1 ? ' /' : ''}
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
                        <div className="px-10 py-3 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <SimpleHeading label="Projects" accent={ACCENT} />}
                            <div className="group border-l border-slate-100 ml-0.5 pl-5">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                                    {item.link && (
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">
                                            Link ↗
                                        </span>
                                    )}
                                </div>
                                <p className="text-[12.5px] text-slate-600 mb-1.5 leading-relaxed">{item.description}</p>
                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                    {item.techStack?.map((tech, idx) => (
                                        <span key={idx} className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            {tech}
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
                        <SimpleHeading label={custom.title} accent={ACCENT} />
                        <div className="grid grid-cols-1 gap-1.5 border-l border-slate-100 ml-0.5 pl-5">
                            {custom.content.map((c, i) => (
                                <div key={i} className="text-[12.5px] text-slate-700 font-medium leading-relaxed">
                                    {c}
                                </div>
                            ))}
                        </div>
                    </div>
                </EntryBlock>
            );
        }
    });

    return blocks;
}

export default function AdiianSimple({ resume }: AdiianSimpleProps) {
    return <div className="bg-white min-h-full pb-10">{renderAdiianSimpleBlocks(resume)}</div>;
}
