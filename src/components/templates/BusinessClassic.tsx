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
// Business Classic — ATS-safe, single column, serif, conservative
// Max ATS safety: logical DOM order, semantic HTML, no tables.
// ─────────────────────────────────────────────────────────

interface BusinessClassicProps {
    resume: Resume;
}

export default function BusinessClassic({ resume }: BusinessClassicProps) {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    return (
        <div
            className="max-w-3xl mx-auto bg-white px-10 py-10 text-black"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
            {/* ── Header ── */}
            {contact && (
                <header className="mb-8 text-center">
                    <h1 className="text-[26px] font-bold uppercase tracking-widest mb-1">
                        {contact.name}
                    </h1>
                    <div
                        className="border-t-2 border-b-2 border-black py-1.5 my-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[11px] font-medium"
                    >
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
                    <section key={section.id} className="mb-6">
                        {/* Summary */}
                        {section.type === "summary" && (section as SummarySection).content && (
                            <>
                                <ClassicSectionTitle label="Professional Summary" />
                                <p className="text-[12px] leading-relaxed text-gray-800 mt-2">
                                    {(section as SummarySection).content}
                                </p>
                            </>
                        )}

                        {/* Experience */}
                        {section.type === "experience" && (section as ExperienceSection).items.length > 0 && (
                            <>
                                <ClassicSectionTitle label="Professional Experience" />
                                <div className="space-y-5 mt-2">
                                    {(section as ExperienceSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-[13px] font-bold uppercase tracking-tight text-black">
                                                    {item.role}
                                                </h3>
                                                <time className="text-[10px] font-semibold text-gray-600 min-w-fit">
                                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                                </time>
                                            </div>
                                            <div className="flex justify-between items-baseline mb-1.5">
                                                <p className="text-[12px] font-semibold text-gray-700 italic">
                                                    {item.company}
                                                </p>
                                                {item.location && (
                                                    <p className="text-[10px] text-gray-500">{item.location}</p>
                                                )}
                                            </div>
                                            {item.bullets && item.bullets.length > 0 && (
                                                <ul className="list-disc ml-5 space-y-1 mt-1">
                                                    {item.bullets.map((b, i) => (
                                                        <li key={i} className="text-[11px] text-gray-800 leading-snug">
                                                            {b}
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
                                <ClassicSectionTitle label="Education" />
                                <div className="space-y-3 mt-2">
                                    {(section as EducationSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-[12px] font-bold uppercase tracking-tight text-black">
                                                    {item.school}
                                                </h3>
                                                <time className="text-[10px] font-semibold text-gray-600 min-w-fit">
                                                    {formatDate(item.date)}
                                                </time>
                                            </div>
                                            <div className="flex justify-between items-baseline">
                                                <p className="text-[12px] italic text-gray-700">{item.degree}</p>
                                                {(item.gpa || item.honors) && (
                                                    <p className="text-[10px] text-gray-500">
                                                        {[item.gpa && `GPA: ${item.gpa}`, item.honors]
                                                            .filter(Boolean)
                                                            .join(" | ")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Skills */}
                        {section.type === "skills" && (
                            <>
                                <ClassicSectionTitle label="Skills" />
                                <div className="space-y-1.5 mt-2">
                                    {(section as SkillsSection).categories.map((cat) => (
                                        <div key={cat.id} className="text-[11px]">
                                            <h3 className="font-bold text-black inline mr-2">{cat.label}:</h3>
                                            <span className="text-gray-800">{cat.skills.join(", ")}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Projects */}
                        {section.type === "projects" && (section as ProjectsSection).items.length > 0 && (
                            <>
                                <ClassicSectionTitle label="Projects" />
                                <div className="space-y-4 mt-2">
                                    {(section as ProjectsSection).items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="text-[12px] font-bold text-black">{item.name}</h3>
                                                {item.link && (
                                                    <p className="text-[10px] text-gray-500">
                                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                                    </p>
                                                )}
                                            </div>
                                            {item.techStack && item.techStack.length > 0 && (
                                                <p className="text-[10px] font-semibold text-gray-600 mb-1">
                                                    Tech: {item.techStack.join(", ")}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className="text-[11px] text-gray-800 leading-snug mb-1">
                                                    {item.description}
                                                </p>
                                            )}
                                            {item.bullets && item.bullets.length > 0 && (
                                                <ul className="list-disc ml-5 space-y-0.5">
                                                    {item.bullets.map((b, i) => (
                                                        <li key={i} className="text-[11px] text-gray-800">
                                                            {b}
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
                                <ClassicSectionTitle label={(section as CustomSection).title} />
                                <div className="space-y-1 mt-2">
                                    {(section as CustomSection).content.map((c, i) => (
                                        <p key={i} className="text-[11px] text-gray-800">
                                            {c}
                                        </p>
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

function ClassicSectionTitle({ label }: { label: string }) {
    return (
        <h2 className="text-[13px] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1">
            {label}
        </h2>
    );
}
