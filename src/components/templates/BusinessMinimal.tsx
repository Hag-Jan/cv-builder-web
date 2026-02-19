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

// ─────────────────────────────────────────────────────────
// Business Minimal — single column, ultra-clean, generous whitespace
// No accent colors. Pure grayscale. Only thin HR separators.
// ─────────────────────────────────────────────────────────

interface BusinessMinimalProps {
    resume: Resume;
}

export default function BusinessMinimal({ resume }: BusinessMinimalProps) {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    return (
        <div
            className="max-w-3xl mx-auto bg-white px-14 py-12 text-gray-700"
            style={{ fontFamily: "Inter, Arial, sans-serif" }}
        >
            {/* ── Header ── */}
            {contact && (
                <header className="mb-10">
                    <h1 className="text-[30px] font-bold text-gray-900 tracking-tight mb-1">
                        {contact.name}
                    </h1>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400 font-medium">
                        {contact.email && <span>{contact.email}</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.location && <span>{contact.location}</span>}
                        {contact.linkedin && (
                            <span>{contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        )}
                        {contact.github && (
                            <span>{contact.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        )}
                        {contact.website && (
                            <span>{contact.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        )}
                    </div>
                </header>
            )}

            {/* ── Sections ── */}
            {sorted.map((section) => {
                if (section.type === "contact") return null;

                return (
                    <section key={section.id} className="mb-8">
                        {/* Summary */}
                        {section.type === "summary" && (section as SummarySection).content && (
                            <>
                                <MinimalSectionTitle label="Summary" />
                                <p className="text-[13px] leading-relaxed text-gray-600 mt-3">
                                    {(section as SummarySection).content}
                                </p>
                            </>
                        )}

                        {/* Experience */}
                        {section.type === "experience" && (section as ExperienceSection).items.length > 0 && (
                            <>
                                <MinimalSectionTitle label="Experience" />
                                <div className="space-y-6 mt-3">
                                    {(section as ExperienceSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-[14px] font-bold text-gray-900">{item.role}</h3>
                                                <time className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter min-w-fit">
                                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                                </time>
                                            </div>
                                            <div className="flex justify-between items-baseline mb-2">
                                                <p className="text-[12px] text-gray-500 font-medium">{item.company}</p>
                                                {item.location && (
                                                    <p className="text-[10px] text-gray-400">{item.location}</p>
                                                )}
                                            </div>
                                            {item.bullets && item.bullets.length > 0 && (
                                                <ul className="space-y-1.5 pl-1">
                                                    {item.bullets.map((b, i) => (
                                                        <li key={i} className="text-[12px] text-gray-600 flex gap-2">
                                                            <span className="text-gray-300 flex-shrink-0">•</span>
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
                        {section.type === "education" && (section as EducationSection).items.length > 0 && (
                            <>
                                <MinimalSectionTitle label="Education" />
                                <div className="space-y-4 mt-3">
                                    {(section as EducationSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-[13px] font-bold text-gray-900">{item.school}</h3>
                                                <time className="text-[10px] font-semibold text-gray-400 min-w-fit">
                                                    {formatDate(item.date)}
                                                </time>
                                            </div>
                                            <p className="text-[12px] text-gray-500">{item.degree}</p>
                                            {(item.gpa || item.honors) && (
                                                <p className="text-[10px] text-gray-400 italic mt-0.5">
                                                    {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(" | ")}
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
                                <MinimalSectionTitle label="Skills" />
                                <div className="space-y-2 mt-3">
                                    {(section as SkillsSection).categories.map((cat) => (
                                        <div key={cat.id} className="text-[12px] text-gray-600">
                                            <span className="font-bold text-gray-800 mr-2">{cat.label}:</span>
                                            <span>{cat.skills.join(", ")}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Projects */}
                        {section.type === "projects" && (section as ProjectsSection).items.length > 0 && (
                            <>
                                <MinimalSectionTitle label="Projects" />
                                <div className="space-y-5 mt-3">
                                    {(section as ProjectsSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="text-[13px] font-bold text-gray-900">{item.name}</h3>
                                                {item.link && (
                                                    <p className="text-[10px] text-gray-400">
                                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                                    </p>
                                                )}
                                            </div>
                                            {item.techStack && item.techStack.length > 0 && (
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter mb-1">
                                                    {item.techStack.join(" / ")}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className="text-[12px] text-gray-600 leading-snug mb-1">
                                                    {item.description}
                                                </p>
                                            )}
                                            {item.bullets && item.bullets.length > 0 && (
                                                <ul className="space-y-1 pl-1">
                                                    {item.bullets.map((b, i) => (
                                                        <li key={i} className="text-[11px] text-gray-500 flex gap-2 italic">
                                                            <span className="text-gray-300 not-italic flex-shrink-0">›</span>
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
                                <MinimalSectionTitle label={(section as CustomSection).title} />
                                <div className="space-y-1 mt-3">
                                    {(section as CustomSection).content.map((c, i) => (
                                        <p key={i} className="text-[12px] text-gray-600">{c}</p>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>
                );
            })}
        </div>
    );
}

function MinimalSectionTitle({ label }: { label: string }) {
    return (
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 pb-2 border-b border-gray-200">
            {label}
        </h2>
    );
}
