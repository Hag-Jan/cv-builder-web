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
import { formatDate, ensureUrlScheme } from "@/lib/utils/date-formatter";

// ─────────────────────────────────────────────────────────
// Modern HTML Template — sans-serif + blue accent colors
// Clearly different from Classic (serif + black borders).
// ─────────────────────────────────────────────────────────

interface ModernHtmlTemplateProps {
    resume: Resume;
}

const ACCENT = "#2563EB"; // blue-600

export default function ModernHtmlTemplate({ resume }: ModernHtmlTemplateProps) {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    return (
        <div
            className="max-w-3xl mx-auto bg-white px-10 py-10 text-gray-800"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
            {/* ── Header ── */}
            {contact && (
                <div className="mb-8 pb-6" style={{ borderBottom: `3px solid ${ACCENT}` }}>
                    <h1
                        className="text-3xl font-extrabold tracking-tight mb-1"
                        style={{ color: ACCENT }}
                    >
                        {contact.name}
                    </h1>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-gray-500 font-medium mt-1">
                        {contact.email && (
                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600 transition-colors">
                                {contact.email}
                            </a>
                        )}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.location && <span>{contact.location}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400 mt-1">
                        {contact.linkedin && (
                            <a
                                href={ensureUrlScheme(contact.linkedin)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                {contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                            </a>
                        )}
                        {contact.github && (
                            <a
                                href={ensureUrlScheme(contact.github)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                {contact.github.replace(/^https?:\/\/(www\.)?/, "")}
                            </a>
                        )}
                        {contact.website && (
                            <a
                                href={ensureUrlScheme(contact.website)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                {contact.website.replace(/^https?:\/\/(www\.)?/, "")}
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* ── Sections ── */}
            {sorted.map((section) => {
                if (section.type === "contact") return null;

                return (
                    <div key={section.id} className="mb-7">
                        {/* Summary */}
                        {section.type === "summary" && (section as SummarySection).content && (
                            <>
                                <SectionTitle label="Summary" accent={ACCENT} />
                                <p className="text-[13px] leading-relaxed text-gray-600 mt-2">
                                    {(section as SummarySection).content}
                                </p>
                            </>
                        )}

                        {/* Experience */}
                        {section.type === "experience" && (section as ExperienceSection).items.length > 0 && (
                            <>
                                <SectionTitle label="Experience" accent={ACCENT} />
                                <div className="space-y-5 mt-3">
                                    {(section as ExperienceSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline">
                                                <p className="text-[14px] font-bold text-gray-900">{item.role}</p>
                                                <p className="text-[11px] font-semibold text-blue-500">
                                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-baseline mb-2">
                                                <p className="text-[12px] text-gray-500 font-medium">{item.company}</p>
                                                {item.location && (
                                                    <p className="text-[11px] text-gray-400 italic">{item.location}</p>
                                                )}
                                            </div>
                                            {item.bullets && item.bullets.length > 0 && (
                                                <ul className="space-y-1 pl-1">
                                                    {item.bullets.map((b, i) => (
                                                        <li key={i} className="text-[12px] text-gray-600 flex gap-2">
                                                            <span style={{ color: ACCENT }}>›</span>
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
                                <SectionTitle label="Education" accent={ACCENT} />
                                <div className="space-y-4 mt-3">
                                    {(section as EducationSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline">
                                                <p className="text-[13px] font-bold text-gray-900">{item.school}</p>
                                                <p className="text-[11px] font-semibold text-blue-500">{item.date}</p>
                                            </div>
                                            <p className="text-[12px] text-gray-500">{item.degree}</p>
                                            {(item.gpa || item.honors) && (
                                                <p className="text-[11px] text-gray-400 italic mt-0.5">
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
                                <SectionTitle label="Skills" accent={ACCENT} />
                                <div className="grid grid-cols-1 gap-y-2 mt-3">
                                    {(section as SkillsSection).categories.map((cat) => (
                                        <div key={cat.id} className="text-[12px] text-gray-600">
                                            <h3 className="text-[12px] font-bold mb-0.5" style={{ color: ACCENT }}>
                                                {cat.label}
                                            </h3>
                                            <span>{cat.skills.join(", ")}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Projects */}
                        {section.type === "projects" && (section as ProjectsSection).items.length > 0 && (
                            <>
                                <SectionTitle label="Projects" accent={ACCENT} />
                                <div className="space-y-5 mt-3">
                                    {(section as ProjectsSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <p className="text-[13px] font-bold text-gray-900">{item.name}</p>
                                                {item.link && (
                                                    <p className="text-[10px] font-medium" style={{ color: ACCENT }}>
                                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                                    </p>
                                                )}
                                            </div>
                                            {item.techStack && item.techStack.length > 0 && (
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
                                                    {item.techStack.join(" / ")}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className="text-[12px] text-gray-600 leading-snug mb-2">{item.description}</p>
                                            )}
                                            {item.bullets && item.bullets.length > 0 && (
                                                <ul className="space-y-0.5 pl-1">
                                                    {item.bullets.map((b, i) => (
                                                        <li key={i} className="text-[11px] text-gray-500 flex gap-2">
                                                            <span style={{ color: ACCENT }}>›</span>
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
                                <SectionTitle label={(section as CustomSection).title} accent={ACCENT} />
                                <div className="space-y-1 mt-3">
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

// Shared section title component: blue left-border accent + uppercase label
function SectionTitle({ label, accent }: { label: string; accent: string }) {
    return (
        <div
            className="flex items-center gap-2 mb-1"
            style={{ borderLeft: `3px solid ${accent}`, paddingLeft: "8px" }}
        >
            <h2
                className="text-[11px] font-extrabold uppercase tracking-[0.18em]"
                style={{ color: accent }}
            >
                {label}
            </h2>
        </div>
    );
}
