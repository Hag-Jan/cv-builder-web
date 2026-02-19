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

interface ATSBaseTemplateProps {
    resume: Resume;
}

/**
 * ATS-safe resume template — Updated for ResumeV2
 * 
 * Design Principles:
 * - Linear top-to-bottom layout
 * - Semantic HTML only
 * - Plain text with strategic spacing
 * - Includes new v2 fields (Summary, LinkedIn, GitHub, Tech Stack)
 */
export default function ATSBaseTemplate({ resume }: ATSBaseTemplateProps) {
    const contactSection = resume.sections.find(s => s.type === 'contact') as ContactSection | undefined;
    const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);

    return (
        <div className="max-w-3xl mx-auto bg-white p-10 text-black leading-normal" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {/* Contact Information */}
            {contactSection && (
                <div className="mb-8 text-center border-b-2 border-black pb-4">
                    <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight">{contactSection.name}</h1>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-medium">
                        {contactSection.email && (
                            <a href={`mailto:${contactSection.email}`} className="hover:text-blue-600 border-b border-transparent hover:border-blue-600 transition-all">
                                {contactSection.email}
                            </a>
                        )}
                        {contactSection.phone && <span>{contactSection.phone}</span>}
                        {contactSection.location && <span>{contactSection.location}</span>}
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-2 text-gray-600">
                        {contactSection.linkedin && (
                            <a href={ensureUrlScheme(contactSection.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 border-b border-transparent hover:border-blue-600 transition-all">
                                {contactSection.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                        )}
                        {contactSection.github && (
                            <a href={ensureUrlScheme(contactSection.github)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 border-b border-transparent hover:border-blue-600 transition-all">
                                {contactSection.github.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                        )}
                        {contactSection.website && (
                            <a href={ensureUrlScheme(contactSection.website)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 border-b border-transparent hover:border-blue-600 transition-all">
                                {contactSection.website.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Render sections in order */}
            {sortedSections.map((section) => {
                if (section.type === 'contact') return null;

                return (
                    <div key={section.id} className="mb-7">
                        {/* Summary Section */}
                        {section.type === 'summary' && (section as SummarySection).content && (
                            <>
                                <h2 className="text-[15px] font-bold mb-2 uppercase border-b border-gray-300 pb-0.5 tracking-wide">Professional Summary</h2>
                                <p className="text-sm leading-relaxed text-gray-800">{(section as SummarySection).content}</p>
                            </>
                        )}

                        {/* Experience Section */}
                        {section.type === 'experience' && (section as ExperienceSection).items.length > 0 && (
                            <>
                                <h2 className="text-[15px] font-bold mb-3 uppercase border-b border-gray-300 pb-0.5 tracking-wide">Professional Experience</h2>
                                <div className="space-y-5">
                                    {(section as ExperienceSection).items.map((item) => (
                                        <div key={item.id}>
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
                                                    {item.bullets.map((bullet, idx) => (
                                                        <li key={idx} className="text-[13px] text-gray-800 leading-snug pl-1">{bullet}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Education Section */}
                        {section.type === 'education' && (section as EducationSection).items.length > 0 && (
                            <>
                                <h2 className="text-[15px] font-bold mb-3 uppercase border-b border-gray-300 pb-0.5 tracking-wide">Education</h2>
                                <div className="space-y-4">
                                    {(section as EducationSection).items.map((item) => (
                                        <div key={item.id}>
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
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Skills Section */}
                        {section.type === 'skills' && (
                            <>
                                <h2 className="text-lg font-bold mb-3 uppercase border-b border-black pb-1">Skills</h2>
                                <div className="space-y-2">
                                    {(section as SkillsSection).categories.map((category) => (
                                        <div key={category.id} className="text-sm">
                                            <h3 className="text-[13px] font-bold text-gray-900 mb-0.5">{category.label}</h3>
                                            <span>{category.skills.join(', ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Projects Section */}
                        {section.type === 'projects' && (
                            <>
                                <h2 className="text-lg font-bold mb-3 uppercase border-b border-black pb-1">Projects</h2>
                                <div className="space-y-4">
                                    {(section as ProjectsSection).items.map((item) => (
                                        <div key={item.id}>
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
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Custom Section */}
                        {section.type === 'custom' && (
                            <>
                                <h2 className="text-lg font-bold mb-3 uppercase border-b border-black pb-1">
                                    {(section as CustomSection).title}
                                </h2>
                                <div className="space-y-2">
                                    {(section as CustomSection).content.map((item, idx) => (
                                        <p key={idx} className="text-sm">{item}</p>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
