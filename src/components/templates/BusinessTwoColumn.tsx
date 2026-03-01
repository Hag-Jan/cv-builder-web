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

const DEFAULT_ACCENT = "#1E3A5F";
const DEFAULT_FONT = "Inter, Arial, sans-serif";

interface BusinessTwoColumnProps {
    resume: Resume;
}

function TwoColSectionTitle({
    label,
    accent,
    size = "M",
    isUpper = true
}: {
    label: string;
    accent: string;
    size?: "L" | "M" | "S";
    isUpper?: boolean;
}) {
    const fontSize = size === "L" ? "text-base" : size === "S" ? "text-xs" : "text-sm";
    return (
        <h2
            className={`${fontSize} font-black tracking-widest pb-3 mb-1 border-b-2 ${isUpper ? "uppercase" : ""}`}
            style={{
                borderColor: `${accent}20`,
                color: accent
            }}
        >
            {label}
        </h2>
    );
}

function renderSection(section: any, accent: string, size: any, caseMode: any) {
    const isUpper = caseMode === "upper";

    if (section.type === "experience") {
        return (
            <EntryBlock key={section.id} type="entry" id={section.id}>
                <TwoColSectionTitle label="Experience" accent={accent} size={size} isUpper={isUpper} />
                <div className="mt-6 space-y-6">
                    {section.items.map((item: any) => (
                        <div key={item.id}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-black text-gray-800">{item.role}</h3>
                                <time className="text-[11px] font-bold text-gray-400 truncate ml-4">
                                    {formatDate(item.startDate)} — {formatDate(item.endDate || "Present")}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-3">
                                <p className="text-[12px] font-bold" style={{ color: accent }}>{item.company}</p>
                                <span className="text-[11px] font-bold text-gray-400">{item.location}</span>
                            </div>
                            <ul className="space-y-1.5 list-none">
                                {item.bullets.map((b: string, i: number) => (
                                    <li key={i} className="text-[12px] text-gray-600 leading-relaxed flex gap-2">
                                        <span className="text-[14px] leading-none mt-0.5" style={{ color: accent }}>•</span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </EntryBlock>
        );
    }

    if (section.type === "education") {
        return (
            <EntryBlock key={section.id} type="entry" id={section.id}>
                <TwoColSectionTitle label="Education" accent={accent} size={size} isUpper={isUpper} />
                <div className="mt-6 space-y-5">
                    {section.items.map((item: any) => (
                        <div key={item.id}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-black text-gray-800">{item.school}</h3>
                                <time className="text-[11px] font-bold text-gray-400">{formatDate(item.date)}</time>
                            </div>
                            <p className="text-[12px] font-bold text-gray-500">{item.degree}</p>
                            {item.gpa && <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-wider">GPA: {item.gpa}</p>}
                        </div>
                    ))}
                </div>
            </EntryBlock>
        );
    }

    if (section.type === "projects") {
        return (
            <EntryBlock key={section.id} type="projects" id={section.id}>
                <TwoColSectionTitle label="Projects" accent={accent} size={size} isUpper={isUpper} />
                <div className="mt-6 space-y-6">
                    {section.items.map((item: any) => (
                        <div key={item.id}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-sm font-black text-gray-800">{item.name}</h3>
                                {item.link && <span className="text-[11px] font-bold opacity-60 ml-4 truncate font-mono">{item.link.replace(/^https?:\/\//, '')}</span>}
                            </div>
                            <div className="flex gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                {item.techStack?.join(' • ')}
                            </div>
                            <p className="text-[12px] text-gray-600 leading-relaxed">{item.description}</p>
                            <ul className="mt-2 space-y-1">
                                {item.bullets?.map((b: string, i: number) => (
                                    <li key={i} className="text-[11px] text-gray-500 leading-relaxed flex gap-2">
                                        <span style={{ color: accent }}>›</span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </EntryBlock>
        );
    }

    if (section.type === "custom") {
        return (
            <EntryBlock key={section.id} type="custom" id={section.id}>
                <TwoColSectionTitle label={section.title} accent={accent} size="S" isUpper={isUpper} />
                <div className="mt-6 space-y-3">
                    {section.content.map((c: string, i: number) => (
                        <div key={i} className="text-[11px] font-bold text-gray-600 leading-relaxed flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: accent }}></span>
                            {c}
                        </div>
                    ))}
                </div>
            </EntryBlock>
        );
    }

    return null;
}

export function renderBusinessTwoColumnBlocks(resume: Resume): React.ReactNode[] {
    const DESIGN = resume.design || {};
    const ACCENT = DESIGN.accentColor || DEFAULT_ACCENT;
    const FONT = DESIGN.fontFamily || DEFAULT_FONT;
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const nameColor = DESIGN.applyColorToName ? ACCENT : "#111827";
    const headingSize = DESIGN.headingSize || "M";
    const headingCase = DESIGN.headingCase || "upper";

    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    // Split into Main vs Sidebar
    const mainSections = sorted.filter((s) => s.type !== "contact" && ["summary", "experience", "education", "projects"].includes(s.type));
    const sidebarSections = sorted.filter((s) => ["skills", "custom"].includes(s.type));

    const blocks: React.ReactNode[] = [];

    // 1. Header Block
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div className="flex bg-white" style={{ fontFamily: FONT }}>
                    <div className="flex-grow pt-14 pb-10 px-12">
                        <h1 className="text-6xl font-black tracking-tighter mb-4 leading-[0.85]" style={{ color: nameColor }}>
                            {contact.name}
                        </h1>
                        <p className="text-xl font-black text-gray-300 uppercase tracking-[0.25em]">
                            {(contact as any).jobTitle || "Professional Title"}
                        </p>
                    </div>
                    <div
                        className="w-[280px] pt-14 pb-10 px-8 flex flex-col justify-end gap-3 shrink-0"
                        style={{ backgroundColor: `${ACCENT}08`, borderLeft: '1px solid #f1f5f9' }}
                    >
                        {contact.email && (
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                <span className="truncate">{contact.email}</span>
                            </div>
                        )}
                        {contact.phone && (
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                {contact.phone}
                            </div>
                        )}
                        {contact.location && (
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                {contact.location}
                            </div>
                        )}
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // Prepare content for both columns
    const mainContentElements: React.ReactNode[] = [];
    mainSections.forEach(s => {
        if (s.type === "summary") {
            mainContentElements.push(
                <div key={s.id} className="mb-8">
                    <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{(s as SummarySection).content}</p>
                </div>
            );
        } else {
            const rendered = renderSection(s, ACCENT, headingSize, headingCase);
            if (rendered) mainContentElements.push(<div key={s.id} className="mb-8">{rendered}</div>);
        }
    });

    const sidebarContentElements: React.ReactNode[] = [];
    sidebarSections.forEach(s => {
        if (s.type === "skills") {
            sidebarContentElements.push(
                <div key={s.id} className="mb-8">
                    <TwoColSectionTitle label="Skills" accent={ACCENT} size="S" />
                    <div className="space-y-5 mt-6">
                        {(s as SkillsSection).categories.map(cat => (
                            <div key={cat.id}>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{cat.label}</h4>
                                <div className="space-y-3">
                                    {cat.skills.map((raw, idx) => {
                                        const { name, level } = parseSkillLevel(raw);
                                        return (
                                            <div key={idx} className="flex flex-col gap-1.5">
                                                <div className="flex justify-between text-[11px] font-bold text-gray-600">
                                                    <span>{name}</span>
                                                    {level && <span className="text-[9px] opacity-60 font-medium">{level}</span>}
                                                </div>
                                                <div className="h-1 w-full bg-white rounded-full overflow-hidden border border-gray-100 shadow-sm">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                                        style={{
                                                            backgroundColor: ACCENT,
                                                            width: level?.toLowerCase().includes('adv') ? '85%' :
                                                                level?.toLowerCase().includes('exp') ? '100%' :
                                                                    level?.toLowerCase().includes('int') ? '60%' : '35%'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else {
            const rendered = renderSection(s, ACCENT, headingSize, headingCase);
            if (rendered) sidebarContentElements.push(<div key={s.id} className="mb-8">{rendered}</div>);
        }
    });

    if (contact?.website) {
        sidebarContentElements.push(
            <div key="website" className="pt-6 border-t border-gray-100 mb-8">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Portfolio</h4>
                <a href={contact.website} className="text-[11px] font-bold text-gray-600 truncate block underline decoration-gray-200 underline-offset-4">{contact.website}</a>
            </div>
        );
    }

    // Zip items into segments
    const maxLen = Math.max(mainContentElements.length, sidebarContentElements.length);
    for (let i = 0; i < maxLen; i++) {
        const isLast = i === maxLen - 1;
        blocks.push(
            <EntryBlock key={`segment-${i}`} type="custom" id={`segment-${i}`}>
                <div className="flex bg-white" style={{ fontFamily: FONT }}>
                    <div className={`flex-grow px-12 pr-8 ${isLast ? 'pb-16' : ''}`}>
                        {mainContentElements[i] || null}
                    </div>
                    <div
                        className={`w-[280px] px-8 ${isLast ? 'pb-16' : ''} shrink-0`}
                        style={{ backgroundColor: `${ACCENT}08`, borderLeft: '1px solid #f1f5f9', minHeight: '100%' }}
                    >
                        {sidebarContentElements[i] || null}
                    </div>
                </div>
            </EntryBlock>
        );
    }

    return blocks;
}

export default function BusinessTwoColumn({ resume }: BusinessTwoColumnProps) {
    return <>{renderBusinessTwoColumnBlocks(resume)}</>;
}
