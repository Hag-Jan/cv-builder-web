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
// Business Two Column — 65/35 grid layout
// DOM order: main column first (ATS reads left→right, top→bottom)
// Visual sidebar via CSS Grid only — no floats, no tables.
// Main: Summary, Experience, Education, Projects
// Sidebar: Contact, Skills, Custom
// ─────────────────────────────────────────────────────────

const ACCENT = "#1E3A5F"; // dark navy

interface BusinessTwoColumnProps {
    resume: Resume;
}

export default function BusinessTwoColumn({ resume }: BusinessTwoColumnProps) {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    const mainTypes = ["summary", "experience", "education", "projects"];
    const sidebarTypes = ["skills", "custom"];

    const mainSections = sorted.filter((s) => s.type !== "contact" && mainTypes.includes(s.type));
    const sidebarSections = sorted.filter((s) => sidebarTypes.includes(s.type));

    return (
        <div
            className="max-w-4xl mx-auto bg-white text-gray-800"
            style={{ fontFamily: "Inter, Arial, sans-serif" }}
        >
            {/* ── Full-width Header ── */}
            {contact && (
                <header
                    className="px-8 py-6"
                    style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
                >
                    <h1 className="text-[24px] font-extrabold tracking-tight mb-1">{contact.name}</h1>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] opacity-90 font-medium mt-1">
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

            {/* ── Two-Column Body ── */}
            {/* NOTE: DOM order is main first, sidebar second for ATS. */}
            {/* CSS Grid places them side-by-side visually. */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "65% 35%",
                    gridTemplateAreas: '"main sidebar"',
                    alignItems: "start",
                }}
            >
                {/* ── Main Column ── */}
                <main style={{ gridArea: "main" }} className="px-8 py-6 space-y-6">
                    {mainSections.map((section) => (
                        <section key={section.id}>
                            {/* Summary */}
                            {section.type === "summary" && (section as SummarySection).content && (
                                <>
                                    <TwoColSectionTitle label="Summary" accent={ACCENT} />
                                    <p className="text-[12px] leading-relaxed text-gray-600 mt-2">
                                        {(section as SummarySection).content}
                                    </p>
                                </>
                            )}

                            {/* Experience */}
                            {section.type === "experience" && (section as ExperienceSection).items.length > 0 && (
                                <>
                                    <TwoColSectionTitle label="Experience" accent={ACCENT} />
                                    <div className="space-y-5 mt-2">
                                        {(section as ExperienceSection).items.map((item) => (
                                            <div key={item.id}>
                                                <div className="flex justify-between items-baseline">
                                                    <h3 className="text-[13px] font-bold text-gray-900">{item.role}</h3>
                                                    <time className="text-[10px] font-semibold text-gray-500 min-w-fit">
                                                        {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                                    </time>
                                                </div>
                                                <div className="flex justify-between items-baseline mb-1.5">
                                                    <p className="text-[11px] font-medium text-gray-600">{item.company}</p>
                                                    {item.location && (
                                                        <p className="text-[10px] text-gray-400 italic">{item.location}</p>
                                                    )}
                                                </div>
                                                {item.bullets && item.bullets.length > 0 && (
                                                    <ul className="space-y-1 pl-1">
                                                        {item.bullets.map((b, i) => (
                                                            <li key={i} className="text-[11px] text-gray-700 flex gap-2">
                                                                <span style={{ color: ACCENT, flexShrink: 0 }}>›</span>
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
                                    <TwoColSectionTitle label="Education" accent={ACCENT} />
                                    <div className="space-y-3 mt-2">
                                        {(section as EducationSection).items.map((item) => (
                                            <div key={item.id}>
                                                <div className="flex justify-between items-baseline">
                                                    <h3 className="text-[12px] font-bold text-gray-900">{item.school}</h3>
                                                    <time className="text-[10px] font-semibold text-gray-500 min-w-fit">
                                                        {formatDate(item.date)}
                                                    </time>
                                                </div>
                                                <p className="text-[11px] text-gray-600">{item.degree}</p>
                                                {(item.gpa || item.honors) && (
                                                    <p className="text-[10px] text-gray-400 italic">
                                                        {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(" | ")}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Projects */}
                            {section.type === "projects" && (section as ProjectsSection).items.length > 0 && (
                                <>
                                    <TwoColSectionTitle label="Projects" accent={ACCENT} />
                                    <div className="space-y-4 mt-2">
                                        {(section as ProjectsSection).items.map((item) => (
                                            <div key={item.id}>
                                                <div className="flex justify-between items-baseline mb-0.5">
                                                    <h3 className="text-[12px] font-bold text-gray-900">{item.name}</h3>
                                                    {item.link && (
                                                        <p className="text-[10px]" style={{ color: ACCENT }}>
                                                            {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                                        </p>
                                                    )}
                                                </div>
                                                {item.techStack && item.techStack.length > 0 && (
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-tight mb-1">
                                                        {item.techStack.join(" / ")}
                                                    </p>
                                                )}
                                                {item.description && (
                                                    <p className="text-[11px] text-gray-600 leading-snug mb-1">{item.description}</p>
                                                )}
                                                {item.bullets && item.bullets.length > 0 && (
                                                    <ul className="space-y-0.5 pl-1">
                                                        {item.bullets.map((b, i) => (
                                                            <li key={i} className="text-[11px] text-gray-600 flex gap-2">
                                                                <span style={{ color: ACCENT, flexShrink: 0 }}>›</span>
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
                        </section>
                    ))}
                </main>

                {/* ── Sidebar Column ── */}
                <aside
                    style={{ gridArea: "sidebar", backgroundColor: "#F1F5F9" }}
                    className="px-5 py-6 space-y-5"
                >
                    {sidebarSections.map((section) => (
                        <section key={section.id}>
                            {/* Skills */}
                            {section.type === "skills" && (
                                <>
                                    <TwoColSectionTitle label="Skills" accent={ACCENT} />
                                    <div className="space-y-2 mt-2">
                                        {(section as SkillsSection).categories.map((cat) => (
                                            <div key={cat.id}>
                                                <h3 className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
                                                    {cat.label}
                                                </h3>
                                                <p className="text-[11px] text-gray-600">{cat.skills.join(", ")}</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Custom */}
                            {section.type === "custom" && (
                                <>
                                    <TwoColSectionTitle label={(section as CustomSection).title} accent={ACCENT} />
                                    <div className="space-y-1 mt-2">
                                        {(section as CustomSection).content.map((c, i) => (
                                            <p key={i} className="text-[11px] text-gray-600">{c}</p>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>
                    ))}
                </aside>
            </div>
        </div>
    );
}

function TwoColSectionTitle({ label, accent }: { label: string; accent: string }) {
    return (
        <h2
            className="text-[11px] font-extrabold uppercase tracking-[0.15em] pb-0.5 mb-1"
            style={{ borderBottom: `2px solid ${accent}`, color: accent }}
        >
            {label}
        </h2>
    );
}
