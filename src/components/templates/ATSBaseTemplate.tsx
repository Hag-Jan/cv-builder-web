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

export function renderATSBaseBlocks(resume: Resume): React.ReactNode[] {
    const contactSection = resume.sections.find(s => s.type === 'contact') as ContactSection | undefined;
    const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // 1. Contact Info Block
    if (contactSection) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <ResumeHeader
                    name={contactSection.name}
                    email={contactSection.email}
                    phone={contactSection.phone}
                    location={contactSection.location}
                    linkedin={contactSection.linkedin}
                    github={contactSection.github}
                    website={contactSection.website}
                    align="center"
                    fontFamily='Georgia, "Times New Roman", serif'
                />
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
                    <ResumeSummary
                        content={(section as SummarySection).content}
                        fontFamily='Georgia, "Times New Roman", serif'
                    />
                </EntryBlock>
            );
        }

        // Experience
        if (section.type === 'experience' && (section as ExperienceSection).items.length > 0) {
            const expSection = section as ExperienceSection;
            // Header block
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <h2 className="text-[15px] font-bold mb-3 uppercase border-b border-gray-300 pb-0.5 tracking-wide">Professional Experience</h2>
                </EntryBlock>
            );
            // Item blocks
            expSection.items.forEach((item, idx) => {
                blocks.push(
                    <EntryBlock
                        key={item.id}
                        type="entry"
                        id={item.id}
                        sectionId={section.id}
                        sectionTitle="Professional Experience"
                    >
                        <div className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{item.role}</h3>
                                <time className="text-[11px] font-bold text-gray-500 min-w-fit">
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || 'Present')}
                                </time>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <p className="text-sm font-semibold text-gray-700">{item.company}</p>
                                {item.location && <p className="text-[11px] text-gray-500 italic font-medium">{item.location}</p>}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="list-disc ml-4 space-y-1.5 prose prose-sm max-w-none">
                                    {item.bullets.map((bullet, bidx) => (
                                        <li key={bidx} className="text-[13px] text-gray-800 leading-snug pl-1">{bullet}</li>
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
                    <h2 className="text-[15px] font-bold mb-3 uppercase border-b border-gray-300 pb-0.5 tracking-wide">Education</h2>
                </EntryBlock>
            );
            eduSection.items.forEach((item, idx) => {
                blocks.push(
                    <EntryBlock
                        key={item.id}
                        type="entry"
                        id={item.id}
                        sectionId={section.id}
                        sectionTitle="Education"
                    >
                        <div className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="font-bold text-[13px] text-gray-900 uppercase tracking-tight">{item.school}</h3>
                                <time className="text-[11px] font-bold text-gray-500 min-w-fit">{formatDate(item.date)}</time>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <p className="text-sm font-medium text-gray-700 italic">{item.degree}</p>
                                {(item.gpa || item.honors) && (
                                    <p className="text-[11px] text-gray-500 font-medium">
                                        {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(' | ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Skills
        if (section.type === 'skills') {
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="mt-6 mb-3">
                        <h2 className="text-[15px] font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wide">Skills & Expertise</h2>
                    </div>
                </EntryBlock>
            );

            (section as SkillsSection).categories.forEach((category) => {
                const cleanedSkills = category.skills
                    .map(s => s.trim())
                    .filter(Boolean);

                if (cleanedSkills.length === 0) return;

                blocks.push(
                    <EntryBlock key={category.id} type="skills" id={category.id} sectionId={section.id} sectionTitle="Skills">
                        <div className="text-sm mb-3 last:mb-6">
                            <h3 className="text-[13px] font-bold text-gray-900 mb-1">{category.label}</h3>
                            <div className="text-gray-800 leading-relaxed">
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
        if (section.type === 'projects') {
            const projSection = section as ProjectsSection;
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <h2 key={`${section.id}-header`} className="text-lg font-bold mb-3 uppercase border-b border-black pb-1">Projects</h2>
                </EntryBlock>
            );
            projSection.items.forEach((item, idx) => {
                blocks.push(
                    <EntryBlock
                        key={item.id}
                        type="entry"
                        id={item.id}
                        sectionId={section.id}
                        sectionTitle="Projects"
                    >
                        <div className="mb-4 last:mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                                {item.link && <p className="text-xs text-gray-500">{item.link.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-xs font-semibold text-gray-700 mb-1">
                                    Tech: {item.techStack.join(', ')}
                                </p>
                            )}
                            {item.description && <p className="text-sm leading-snug mb-1">{item.description}</p>}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="list-disc ml-5 space-y-0.5">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-xs">{b}</li>
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
                    <div className="mt-6 mb-3">
                        <h2 className="text-[15px] font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wide">
                            {customSection.title}
                        </h2>
                    </div>
                </EntryBlock>
            );

            if (isListSection) {
                blocks.push(
                    <EntryBlock key={`${section.id}-content`} type="custom" id={`${section.id}-content`} sectionId={section.id} sectionTitle={customSection.title}>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
                            {customSection.content.filter(Boolean).map((item, idx) => (
                                <div key={idx} className="text-sm text-gray-800 font-medium flex items-center gap-2">
                                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
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
                            <div className="space-y-2 mb-3 last:mb-6">
                                <p className="text-sm text-gray-800 leading-relaxed">{item}</p>
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

    return (
        <div className="max-w-3xl mx-auto bg-white p-10 text-black leading-normal" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {blocks}
        </div>
    );
}
