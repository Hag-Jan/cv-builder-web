import React from 'react';
import type {
    ResumeV2 as Resume,
    ContactSectionV2 as ContactSection,
    ExperienceSectionV2 as ExperienceSection,
    EducationSectionV2 as EducationSection,
    SkillsSectionV2 as SkillsSection,
    ProjectsSectionV2 as ProjectsSection,
    CustomSectionV2 as CustomSection,
    SummarySection
} from '@/types/resume-schema-v2';
import { formatDate, ensureUrlScheme } from '@/lib/utils/date-formatter';
import { EntryBlock } from "../preview/EntryBlock";
import { parseSkillLevel } from "@/lib/utils/skill-parser";
import { ResumeHeader } from "../preview/ResumeHeader";
import { ResumeSummary } from '../preview/ResumeSummary';

interface ATSBaseTemplateProps {
    resume: Resume;
}

const DEFAULT_ACCENT = "#111827";
const DEFAULT_FONT = 'Inter, -apple-system, sans-serif';

function MinimalistSectionTitle({
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
    const fontSize = size === "L" ? "text-lg" : size === "S" ? "text-xs" : "text-sm";
    return (
        <div className="flex items-center gap-4 border-b border-gray-100 pb-2 mb-4 mt-6">
            <h2
                className={`${fontSize} font-black tracking-tight ${isUpper ? "uppercase" : ""}`}
                style={{ color: accent }}
            >
                {label}
            </h2>
            <div className="h-[1px] flex-grow bg-gray-50"></div>
        </div>
    );
}

export function renderATSBaseBlocks(resume: Resume): React.ReactNode[] {
    const ACCENT = resume.design?.accentColor || DEFAULT_ACCENT;
    const DESIGN = resume.design || {};

    const nameColor = DESIGN.applyColorToName ? ACCENT : "#111827";
    const headingColor = DESIGN.applyColorToHeadings ? ACCENT : "#111827";
    const jobTitleColor = DESIGN.applyColorToJobTitles ? ACCENT : "#111827";

    const FONT = DESIGN.fontFamily || DEFAULT_FONT;
    const ALIGN = DESIGN.headerAlign || 'center';
    const headingSize = DESIGN.headingSize || "M";
    const headingCase = DESIGN.headingCase || "upper";

    const contactSection = resume.sections.find(s => s.type === 'contact') as ContactSection | undefined;
    const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // 1. Header Area (Minimalist)
    if (contactSection) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div className="px-14 py-16 bg-white" style={{ fontFamily: FONT }}>
                    <div className="flex flex-col gap-6">
                        <h1
                            className="text-[64px] font-black tracking-tighter leading-[0.75] max-w-2xl"
                            style={{ color: nameColor }}
                        >
                            {contactSection.name}
                        </h1>

                        <div className="flex items-center gap-6">
                            <div
                                className="px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shrink-0"
                                style={{ backgroundColor: ACCENT, color: '#fff' }}
                            >
                                {(contactSection as any).jobTitle || "Professional"}
                            </div>
                            <div className="h-[2px] flex-grow opacity-10" style={{ backgroundColor: ACCENT }}></div>
                        </div>

                        <div className="flex flex-wrap gap-x-10 gap-y-3 mt-4 text-[10px] items-center font-black text-gray-400 uppercase tracking-[0.15em]">
                            {contactSection.email && (
                                <span className="flex items-center gap-3">
                                    <span style={{ color: ACCENT }}>E</span> {contactSection.email}
                                </span>
                            )}
                            {contactSection.phone && (
                                <span className="flex items-center gap-3">
                                    <span style={{ color: ACCENT }}>T</span> {contactSection.phone}
                                </span>
                            )}
                            {contactSection.location && (
                                <span className="flex items-center gap-3">
                                    <span style={{ color: ACCENT }}>L</span> {contactSection.location}
                                </span>
                            )}
                            {contactSection.website && (
                                <a href={contactSection.website} className="text-black border-b-2 border-gray-100 pb-1">
                                    {contactSection.website.replace(/^https?:\/\/(www\.)?/, "")}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // 2. Main Sections
    sortedSections.forEach((section) => {
        if (section.type === 'contact') return;

        // Summary
        if (section.type === 'summary' && (section as SummarySection).content) {
            blocks.push(
                <EntryBlock key={section.id} type="summary" id={section.id}>
                    <section className="px-14 pb-4">
                        <ResumeSummary
                            content={(section as SummarySection).content}
                            accentColor={nameColor}
                            fontFamily={FONT}
                        />
                    </section>
                </EntryBlock>
            );
        }

        // Experience
        if (section.type === 'experience' && (section as ExperienceSection).items.length > 0) {
            const expSection = section as ExperienceSection;
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="px-14">
                        <MinimalistSectionTitle label="Experience" accent={headingColor} size={headingSize} isUpper={headingCase === "upper"} />
                    </div>
                </EntryBlock>
            );
            expSection.items.forEach((item) => {
                blocks.push(
                    <EntryBlock
                        key={item.id}
                        type="entry"
                        id={item.id}
                        sectionId={section.id}
                        sectionTitle="Experience"
                    >
                        <div className="px-14 mb-6 last:mb-0">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-lg font-black text-gray-900 tracking-tight">{item.role}</h3>
                                <time className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    {formatDate(item.startDate)} — {formatDate(item.endDate || 'Present')}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-4">
                                <p className="text-[15px] font-bold" style={{ color: ACCENT }}>{item.company}</p>
                                {item.location && <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{item.location}</p>}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-3">
                                    {item.bullets.map((bullet, bidx) => (
                                        <li key={bidx} className="text-[14px] text-gray-600 leading-relaxed flex gap-4">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-2 shrink-0" />
                                            {bullet}
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
        if (section.type === 'education' && (section as EducationSection).items.length > 0) {
            const eduSection = section as EducationSection;
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="px-14">
                        <MinimalistSectionTitle label="Education" accent={headingColor} size={headingSize} isUpper={headingCase === "upper"} />
                    </div>
                </EntryBlock>
            );
            eduSection.items.forEach((item) => {
                blocks.push(
                    <EntryBlock
                        key={item.id}
                        type="entry"
                        id={item.id}
                        sectionId={section.id}
                        sectionTitle="Education"
                    >
                        <div className="px-14 mb-5">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-[16px] font-black text-gray-900 tracking-tight">{item.school}</h3>
                                <time className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{formatDate(item.date)}</time>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <p className="text-[14px] font-bold text-gray-500 italic">{item.degree}</p>
                                {(item.gpa || item.honors) && (
                                    <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">
                                        {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(' • ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Skills (Minimalist Pills)
        if (section.type === 'skills') {
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="px-14">
                        <MinimalistSectionTitle label="Expertise" accent={headingColor} size={headingSize} isUpper={headingCase === "upper"} />
                    </div>
                </EntryBlock>
            );

            (section as SkillsSection).categories.forEach((category) => {
                const cleanedSkills = category.skills.map(s => s.trim()).filter(Boolean);
                if (cleanedSkills.length === 0) return;

                blocks.push(
                    <EntryBlock key={category.id} type="skills" id={category.id} sectionId={section.id} sectionTitle="Skills">
                        <div className="px-14 mb-6">
                            <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">{category.label}</h3>
                            <div className="flex flex-wrap gap-2">
                                {cleanedSkills.map((s, sidx) => {
                                    const { name, level } = parseSkillLevel(s);
                                    return (
                                        <div key={sidx} className="bg-gray-50 px-3 py-1.5 rounded-sm border border-gray-100 flex items-center gap-2">
                                            <span className="text-[12px] font-bold text-gray-700">{name}</span>
                                            {level && <span className="text-[10px] font-black text-gray-300 uppercase">{level}</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Projects
        if (section.type === 'projects' && (section as ProjectsSection).items.length > 0) {
            const projSection = section as ProjectsSection;
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="px-14">
                        <MinimalistSectionTitle label="Projects" accent={headingColor} size={headingSize} isUpper={headingCase === "upper"} />
                    </div>
                </EntryBlock>
            );
            projSection.items.forEach((item) => {
                blocks.push(
                    <EntryBlock
                        key={item.id}
                        type="projects"
                        id={item.id}
                        sectionId={section.id}
                        sectionTitle="Projects"
                    >
                        <div className="px-14 mb-8">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-lg font-black text-gray-900 tracking-tight">{item.name}</h3>
                                {item.link && (
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                        {item.link.replace(/^https?:\/\/(www\.)?/, '')}
                                    </p>
                                )}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">
                                    {item.techStack.join(' • ')}
                                </p>
                            )}
                            {item.description && <p className="text-[14px] text-gray-600 leading-relaxed mb-4">{item.description}</p>}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-3">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[14px] text-gray-600 leading-relaxed flex gap-4">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-2 shrink-0" />
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
        if (section.type === 'custom') {
            const customSection = section as CustomSection;
            const isListSection = ["languages", "hobbies", "interests", "awards", "certifications"].includes(customSection.title.toLowerCase());

            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="px-14">
                        <MinimalistSectionTitle label={customSection.title} accent={headingColor} size={headingSize} isUpper={headingCase === "upper"} />
                    </div>
                </EntryBlock>
            );

            if (isListSection) {
                blocks.push(
                    <EntryBlock key={`${section.id}-content`} type="custom" id={`${section.id}-content`} sectionId={section.id} sectionTitle={customSection.title}>
                        <div className="px-14 flex flex-wrap gap-x-10 gap-y-4 mb-10">
                            {customSection.content.filter(Boolean).map((item, idx) => (
                                <div key={idx} className="text-[12px] text-gray-700 font-black uppercase tracking-widest flex items-center gap-3">
                                    <span style={{ color: ACCENT }}>■</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </EntryBlock>
                );
            } else {
                customSection.content.forEach((item, idx) => {
                    blocks.push(
                        <EntryBlock key={`${section.id}-item-${idx}`} type="custom" id={`${section.id}-item-${idx}`} sectionId={section.id} sectionTitle={customSection.title}>
                            <div className="px-14 mb-4 last:mb-10">
                                <p className="text-[14px] text-gray-700 leading-relaxed font-medium border-l-2 pl-6 py-1" style={{ borderColor: `${ACCENT}20` }}>{item}</p>
                            </div>
                        </EntryBlock>
                    );
                });
            }
        }
    });

    return blocks;
}

export default function ATSBaseTemplate({ resume }: ATSBaseTemplateProps) {
    const blocks = renderATSBaseBlocks(resume);
    const FONT = resume.design?.fontFamily || 'Georgia, "Times New Roman", serif';

    return (
        <div className="max-w-3xl mx-auto bg-white p-10 text-black leading-normal" style={{ fontFamily: FONT }}>
            {blocks}
        </div>
    );
}
