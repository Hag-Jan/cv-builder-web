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

const DEFAULT_ACCENT = "#2563eb";
const DEFAULT_FONT = "Inter, sans-serif";

interface BrijrMinimalProps {
    resume: Resume;
}

function SectionTitle({ label, accent }: { label: string; accent: string }) {
    return (
        <h2
            className="text-[10px] font-bold uppercase tracking-wider mb-2.5 border-b pb-1"
            style={{ borderColor: `${accent}15`, color: accent }}
        >
            {label}
        </h2>
    );
}

export function renderBrijrMinimalBlocks(resume: Resume): React.ReactNode[] {
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
                <div className="pt-8 pb-5 px-12 bg-white" style={{ fontFamily: FONT }}>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
                        {contact.name}
                    </h1>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[12.5px] text-slate-500 font-medium">
                        {contact.location && <span>{contact.location}</span>}
                        {contact.location && contact.email && <span className="text-slate-200">|</span>}
                        {contact.email && <a href={`mailto:${contact.email}`} className="hover:text-slate-900">{contact.email}</a>}
                        {contact.email && contact.phone && <span className="text-slate-200">|</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.phone && contact.website && <span className="text-slate-200">|</span>}
                        {contact.website && <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 truncate max-w-[180px]">{contact.website.replace(/^https?:\/\//, '')}</a>}
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
                        <SectionTitle label="Profile" accent={ACCENT} />
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
                        <div className="px-12 py-1.5 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <SectionTitle label="Experience" accent={ACCENT} />}
                            <div>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-[13px] font-bold text-slate-900">{item.role}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                                        {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline mb-1.5">
                                    <span className="text-[11.5px] font-semibold" style={{ color: ACCENT }}>{item.company}</span>
                                    {item.location && <span className="text-[10px] font-medium text-slate-400">{item.location}</span>}
                                </div>
                                <ul className="space-y-1 list-none">
                                    {item.bullets.map((bullet, idx) => (
                                        <li key={idx} className="text-[12.5px] text-slate-600 leading-relaxed flex gap-2">
                                            <span className="text-slate-300 mt-1.5 w-1 h-1 rounded-full bg-slate-200 shrink-0" />
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
                        <div className="px-12 py-1.5 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <SectionTitle label="Education" accent={ACCENT} />}
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-slate-900">{item.school}</h3>
                                <span className="text-[10px] font-bold text-slate-400">{formatDate(item.date)}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[12px] font-medium text-slate-600">{item.degree}</span>
                                {item.gpa && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">GPA: {item.gpa}</span>}
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
                        <SectionTitle label="Skills" accent={ACCENT} />
                        <div className="grid grid-cols-1 gap-y-2.5">
                            {(section as SkillsSection).categories.map((category) => (
                                <div key={category.id} className="flex gap-4 items-baseline">
                                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest w-20 shrink-0">{category.label}</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {category.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="text-[10.5px] font-medium px-2 py-0.5 rounded border border-slate-100 text-slate-600 bg-slate-50/50"
                                            >
                                                {skill}
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
                        <div className="px-12 py-1.5 bg-white" style={{ fontFamily: FONT }}>
                            {index === 0 && <SectionTitle label="Projects" accent={ACCENT} />}
                            <div>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-[13px] font-bold text-slate-900">{item.name}</h3>
                                    {item.link && (
                                        <a href={item.link} className="text-[9px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-tight transition-colors">
                                            Link ↗
                                        </a>
                                    )}
                                </div>
                                <p className="text-[12px] text-slate-600 mb-1.5 leading-relaxed">{item.description}</p>
                                <div className="flex flex-wrap gap-x-2 gap-y-1">
                                    {item.techStack?.map((tech, idx) => (
                                        <span key={idx} className="text-[9.5px] font-bold text-slate-400 tracking-tight">
                                            {tech}{idx < item.techStack!.length - 1 ? ' •' : ''}
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
                    <div className="px-12 py-1.5 bg-white" style={{ fontFamily: FONT }}>
                        <SectionTitle label={custom.title} accent={ACCENT} />
                        <ul className="space-y-1 list-none">
                            {custom.content.map((c, i) => (
                                <li key={i} className="text-[12.5px] text-slate-600 leading-relaxed flex gap-2">
                                    <span className="text-slate-300 mt-1.5 w-1 h-1 rounded-full bg-slate-200 shrink-0" />
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

export default function BrijrMinimal({ resume }: BrijrMinimalProps) {
    return <div className="bg-white min-h-full pb-8">{renderBrijrMinimalBlocks(resume)}</div>;
}

