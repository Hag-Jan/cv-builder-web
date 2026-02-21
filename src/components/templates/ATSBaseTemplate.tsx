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
import { EntryBlock } from '../preview/EntryBlock';
import { ResumeHeader } from '../preview/ResumeHeader';
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
                        <div className={idx === expSection.items.length - 1 ? "mb-7" : "mb-5"}>
                            <div className="flex justify-between items-baseline mb-0.5">
                                <p className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{item.role}</p>
                                <p className="text-[11px] font-bold text-gray-600 min-w-fit">
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || 'Present')}
                                </p>
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
                        <div className={idx === eduSection.items.length - 1 ? "mb-7" : "mb-4"}>
                            <div className="flex justify-between items-baseline mb-0.5">
                                <p className="font-bold text-[13px] text-gray-900 uppercase tracking-tight">{item.school}</p>
                                <p className="text-[11px] font-bold text-gray-600 min-w-fit">{formatDate(item.date)}</p>
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
                    <div className="mb-3">
                        <h2 className="text-lg font-bold uppercase border-b border-black pb-1">Skills</h2>
                    </div>
                </EntryBlock>
            );

            const numCategories = (section as SkillsSection).categories.length;
            (section as SkillsSection).categories.forEach((category, idx) => {
                blocks.push(
                    <EntryBlock key={category.id} type="skills" id={category.id} sectionId={section.id} sectionTitle="Skills">
                        <div className={`text-sm ${idx === numCategories - 1 ? 'mb-7' : 'mb-2'}`}>
                            <h3 className="text-[13px] font-bold text-gray-900 mb-0.5">{category.label}</h3>
                            <span>{category.skills.filter(Boolean).join(', ')}</span>
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
                        <div className={idx === projSection.items.length - 1 ? "mb-7" : "mb-4"}>
                            <div className="flex justify-between items-baseline mb-1">
                                <p className="font-bold">{item.name}</p>
                                {item.link && <p className="text-xs">{item.link.replace(/^https?:\/\/(www\.)?/, '')}</p>}
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
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="mb-3">
                        <h2 className="text-lg font-bold uppercase border-b border-black pb-1">
                            {(section as CustomSection).title}
                        </h2>
                    </div>
                </EntryBlock>
            );

            const numContent = (section as CustomSection).content.length;
            (section as CustomSection).content.forEach((item, idx) => {
                blocks.push(
                    <EntryBlock key={`${section.id}-item-${idx}`} type="custom" id={`${section.id}-item-${idx}`} sectionId={section.id} sectionTitle={(section as CustomSection).title}>
                        <div className={`space-y-2 ${idx === numContent - 1 ? 'mb-7' : 'mb-2'}`}>
                            <p className="text-sm">{item}</p>
                        </div>
                    </EntryBlock>
                );
            });
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
