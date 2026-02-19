import React from "react";
import type {
    ResumeV2 as Resume,
    ContactSectionV2 as ContactSection,
    ExperienceSectionV2 as ExperienceSection,
    EducationSectionV2 as EducationSection,
    SkillsSectionV2 as SkillsSection,
    ProjectsSectionV2 as ProjectsSection,
    CustomSectionV2 as CustomSection,
    SummarySection
} from "@/types/resume-schema-v2";

// ─────────────────────────────────────────────────────────
// Minimal HTML Template — Updated for ResumeV2
// Clean, borderless, generous whitespace.
// ─────────────────────────────────────────────────────────

interface MinimalHtmlTemplateProps {
    resume: Resume;
}

export default function MinimalHtmlTemplate({ resume }: MinimalHtmlTemplateProps) {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    return (
        <div className="max-w-3xl mx-auto bg-white px-12 py-10 text-gray-700" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
            {/* Contact */}
            {contact && (
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{contact.name}</h1>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400 font-medium">
                        <span>{contact.email}</span>
                        {contact.phone && <span>• {contact.phone}</span>}
                        {contact.location && <span>• {contact.location}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400 mt-1">
                        {contact.linkedin && <span>linkedin.com/in/{contact.linkedin.split('/').pop()}</span>}
                        {contact.github && <span>github.com/{contact.github.split('/').pop()}</span>}
                        {contact.website && <span>{contact.website.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    </div>
                </div>
            )}

            {sorted.map((section) => {
                if (section.type === "contact") return null;

                return (
                    <div key={section.id} className="mb-6">
                        {/* Summary */}
                        {section.type === "summary" && (
                            <div className="mb-4">
                                <p className="text-[13px] leading-relaxed text-gray-600">{(section as SummarySection).content}</p>
                            </div>
                        )}

                        {/* Experience */}
                        {section.type === "experience" && (
                            <>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 pb-1 border-b border-gray-100">
                                    Professional Experience
                                </h2>
                                <div className="space-y-5">
                                    {(section as ExperienceSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline">
                                                <p className="text-[14px] font-bold text-gray-900">{item.role}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                    {item.startDate} – {item.endDate || "Present"}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-baseline mb-2">
                                                <p className="text-[12px] text-gray-500 font-medium">{item.company}</p>
                                                {item.location && <p className="text-[10px] text-gray-400">{item.location}</p>}
                                            </div>
                                            {item.bullets && item.bullets.length > 0 && (
                                                <ul className="space-y-1 pl-1">
                                                    {item.bullets.map((b, i) => (
                                                        <li key={i} className="text-[12px] text-gray-600 flex gap-2">
                                                            <span className="text-gray-300">•</span>
                                                            <span className="leading-snug">{b}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Education */}
                        {section.type === "education" && (
                            <>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 pb-1 border-b border-gray-100">
                                    Education
                                </h2>
                                <div className="space-y-4">
                                    {(section as EducationSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline">
                                                <p className="text-[13px] font-bold text-gray-900">{item.school}</p>
                                                <p className="text-[10px] font-bold text-gray-400">{item.date}</p>
                                            </div>
                                            <p className="text-[12px] text-gray-500">{item.degree}</p>
                                            {(item.gpa || item.honors) && (
                                                <p className="text-[11px] text-gray-400 mt-1 italic">
                                                    {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(' | ')}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Skills */}
                        {section.type === "skills" && (
                            <>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 pb-1 border-b border-gray-100">
                                    Expertise
                                </h2>
                                <div className="grid grid-cols-1 gap-y-2">
                                    {(section as SkillsSection).categories.map((cat) => (
                                        <div key={cat.id} className="text-[12px] text-gray-600">
                                            <span className="font-bold text-gray-800 mr-2">{cat.label}</span>
                                            <span>{cat.skills.join(", ")}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Projects */}
                        {section.type === "projects" && (section as ProjectsSection).items.length > 0 && (
                            <>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 pb-1 border-b border-gray-100">
                                    Featured Projects
                                </h2>
                                <div className="space-y-5">
                                    {(section as ProjectsSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <p className="text-[13px] font-bold text-gray-900">{item.name}</p>
                                                {item.link && <p className="text-[10px] text-blue-500 font-medium">{item.link.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                                            </div>
                                            {item.techStack && item.techStack.length > 0 && (
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">
                                                    {item.techStack.join(" / ")}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className="text-[12px] text-gray-600 leading-snug mb-2">{item.description}</p>
                                            )}
                                            {item.bullets && item.bullets.length > 0 && (
                                                <ul className="space-y-0.5 pl-1">
                                                    {item.bullets.map((b, i) => (
                                                        <li key={i} className="text-[11px] text-gray-500 flex gap-2 italic">
                                                            <span className="text-gray-300">›</span>
                                                            <span>{b}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Custom */}
                        {section.type === "custom" && (
                            <>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 pb-1 border-b border-gray-100">
                                    {(section as CustomSection).title}
                                </h2>
                                <div className="space-y-1">
                                    {(section as CustomSection).content.map((c, i) => (
                                        <p key={i} className="text-[12px] text-gray-600">{c}</p>
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
