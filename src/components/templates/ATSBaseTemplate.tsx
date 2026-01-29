import React from 'react';
import type { Resume, ContactSection, ExperienceSection, EducationSection, SkillsSection, CustomSection } from '@/types/resume-schema-v1';

interface ATSBaseTemplateProps {
    resume: Resume;
}

/**
 * ATS-safe resume template
 * 
 * Design Principles:
 * - Linear top-to-bottom layout
 * - Semantic HTML only
 * - No tables, grids, multi-column, or absolute positioning
 * - No icons, images, or decorative elements
 * - Plain text with strategic spacing
 */
export default function ATSBaseTemplate({ resume }: ATSBaseTemplateProps) {
    // Extract sections by type
    const contactSection = resume.sections.find(s => s.type === 'contact') as ContactSection | undefined;
    const experienceSection = resume.sections.find(s => s.type === 'experience') as ExperienceSection | undefined;
    const educationSection = resume.sections.find(s => s.type === 'education') as EducationSection | undefined;
    const skillsSection = resume.sections.find(s => s.type === 'skills') as SkillsSection | undefined;
    const customSections = resume.sections.filter(s => s.type === 'custom') as CustomSection[];

    // Sort sections by order
    const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 text-black">
            {/* Contact Information */}
            {contactSection && (
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">{contactSection.name}</h1>
                    <div className="space-y-1">
                        <p className="text-sm">{contactSection.email}</p>
                        {contactSection.phone && <p className="text-sm">{contactSection.phone}</p>}
                        {contactSection.location && <p className="text-sm">{contactSection.location}</p>}
                        {contactSection.portfolio && <p className="text-sm">{contactSection.portfolio}</p>}
                    </div>
                </div>
            )}

            {/* Render sections in order */}
            {sortedSections.map((section) => {
                // Skip contact section as it's already rendered
                if (section.type === 'contact') return null;

                return (
                    <div key={section.id} className="mb-6">
                        {/* Experience Section */}
                        {section.type === 'experience' && (
                            <>
                                <h2 className="text-lg font-bold mb-3 uppercase border-b border-black pb-1">Experience</h2>
                                <div className="space-y-4">
                                    {(section as ExperienceSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="mb-1">
                                                <p className="font-bold">{item.role}</p>
                                                <p>{item.company}</p>
                                                <p className="text-sm">
                                                    {item.startDate} - {item.endDate || 'Present'}
                                                </p>
                                            </div>
                                            {item.bullets && item.bullets.length > 0 && (
                                                <ul className="list-disc ml-5 space-y-1">
                                                    {item.bullets.map((bullet, idx) => (
                                                        <li key={idx} className="text-sm">{bullet}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Education Section */}
                        {section.type === 'education' && (
                            <>
                                <h2 className="text-lg font-bold mb-3 uppercase border-b border-black pb-1">Education</h2>
                                <div className="space-y-3">
                                    {(section as EducationSection).items.map((item) => (
                                        <div key={item.id}>
                                            <p className="font-bold">{item.school}</p>
                                            <p>{item.degree}</p>
                                            <p className="text-sm">{item.date}</p>
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
                                        <div key={category.id}>
                                            <p className="font-bold">{category.label}:</p>
                                            <p className="text-sm">{category.skills.join(', ')}</p>
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
