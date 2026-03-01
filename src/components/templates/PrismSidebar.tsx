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
import { EntryBlock } from "../preview/EntryBlock";
import { parseSkillLevel } from "@/lib/utils/skill-parser";

// ─────────────────────────────────────────────────────────
// The Prism — two-column with dark coloured sidebar
// Main content flows right; sidebar holds contact, skills, custom.
// ATS-safe: full text layer preserved, logical reading order in DOM.
// ─────────────────────────────────────────────────────────

const DEFAULT_ACCENT = "#1a3456";
const DEFAULT_FONT = "Inter, system-ui, sans-serif";

interface PrismSidebarProps {
    resume: Resume;
}

function PrismSideTitle({ label }: { label: string }) {
    return (
        <h2 className="text-[9px] font-black uppercase tracking-[0.22em] text-white/50 mb-3 mt-6 first:mt-0">
            {label}
        </h2>
    );
}

function PrismMainTitle({
    label,
    accent,
    size = "M",
    isUpper = true,
}: {
    label: string;
    accent: string;
    size?: "L" | "M" | "S";
    isUpper?: boolean;
}) {
    const fontSize =
        size === "L" ? "text-[13px]" : size === "S" ? "text-[10px]" : "text-[11px]";
    return (
        <div className="flex items-center gap-2 mb-3 mt-6 first:mt-0">
            <h2
                className={`${fontSize} font-black tracking-[0.16em] ${isUpper ? "uppercase" : ""}`}
                style={{ color: accent }}
            >
                {label}
            </h2>
            <div className="flex-grow h-px bg-gray-100" />
        </div>
    );
}

export function renderPrismSidebarBlocks(resume: Resume): React.ReactNode[] {
    const DESIGN = resume.design || {};
    const ACCENT = DESIGN.accentColor || DEFAULT_ACCENT;
    const FONT = DESIGN.fontFamily || DEFAULT_FONT;
    const nameColor = DESIGN.applyColorToName ? ACCENT : "#FFFFFF";
    const headingColor = DESIGN.applyColorToHeadings ? ACCENT : ACCENT;
    const headingSize = DESIGN.headingSize || "M";
    const headingCase = DESIGN.headingCase || "upper";
    const isUpper = headingCase === "upper";

    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const summary = resume.sections.find((s) => s.type === "summary") as SummarySection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    const sidebarSections = sorted.filter((s) =>
        ["skills", "custom"].includes(s.type)
    );
    const mainSections = sorted.filter(
        (s) => !["contact", "summary", "skills", "custom"].includes(s.type)
    );
    const blocks: React.ReactNode[] = [];

    // ── Header block (full width) ───────────────────────────
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                {/* Two-column layout rendered inline — both columns appear in the DOM */}
                <div className="flex" style={{ fontFamily: FONT }}>
                    {/* Sidebar column in header */}
                    <div
                        className="w-[220px] shrink-0 px-7 py-8"
                        style={{ backgroundColor: ACCENT }}
                    >
                        {/* Initials circle */}
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white/80 text-xl font-black"
                            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                        >
                            {contact.name
                                .split(" ")
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <PrismSideTitle label="Contact" />
                        {contact.email && (
                            <p className="text-[10px] text-white/80 font-medium break-all mb-1.5">{contact.email}</p>
                        )}
                        {contact.phone && (
                            <p className="text-[10px] text-white/80 font-medium mb-1.5">{contact.phone}</p>
                        )}
                        {contact.location && (
                            <p className="text-[10px] text-white/80 font-medium mb-1.5">{contact.location}</p>
                        )}
                        {(contact as any).linkedin && (
                            <p className="text-[10px] text-white/70 font-medium mb-1.5">{(contact as any).linkedin}</p>
                        )}
                        {(contact as any).website && (
                            <p className="text-[10px] text-white/70 font-medium">{(contact as any).website}</p>
                        )}
                    </div>
                    {/* Main column in header */}
                    <div className="flex-grow px-8 py-8 flex flex-col justify-center">
                        <h1
                            className="text-[30px] font-black tracking-tight leading-none mb-2"
                            style={{ color: ACCENT }}
                        >
                            {contact.name}
                        </h1>
                        {(contact as any).jobTitle && (
                            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
                                {(contact as any).jobTitle}
                            </p>
                        )}
                        {summary && summary.content && (
                            <p className="text-[12px] text-gray-500 leading-[1.7]">{summary.content}</p>
                        )}
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // ── Body: zip sidebar + main content into paired rows ───
    // Build sidebar content elements
    const sideElements: React.ReactNode[] = [];
    sidebarSections.forEach((section) => {
        if (section.type === "skills") {
            const skillsSec = section as SkillsSection;
            sideElements.push(
                <div key={section.id}>
                    <PrismSideTitle label="Skills" />
                    <div className="space-y-4">
                        {skillsSec.categories.map((cat) => {
                            const cleaned = cat.skills.map((s) => s.trim()).filter(Boolean);
                            if (!cleaned.length) return null;
                            return (
                                <div key={cat.id}>
                                    {cat.label && cat.label !== "Skills" && (
                                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40 mb-1.5">
                                            {cat.label}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-1">
                                        {cleaned.map((rawSkill, i) => {
                                            const { name, level } = parseSkillLevel(rawSkill);
                                            return (
                                                <span
                                                    key={i}
                                                    className="text-[10px] font-medium text-white/80 px-2 py-0.5 rounded"
                                                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                                                >
                                                    {name}
                                                    {level && (
                                                        <span className="ml-1 text-[8px] text-white/50">{level}</span>
                                                    )}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (section.type === "custom") {
            const customSection = section as CustomSection;
            sideElements.push(
                <div key={section.id}>
                    <PrismSideTitle label={customSection.title} />
                    <div className="space-y-1">
                        {customSection.content.filter(Boolean).map((c, i) => (
                            <p key={i} className="text-[11px] text-white/75 font-medium leading-snug">
                                {c}
                            </p>
                        ))}
                    </div>
                </div>
            );
        }
    });

    // Build main content elements
    const mainElements: React.ReactNode[] = [];
    mainSections.forEach((section) => {
        if (section.type === "experience") {
            const expSec = section as ExperienceSection;
            if (!expSec.items.length) return;
            mainElements.push(
                <div key={section.id}>
                    <PrismMainTitle label="Experience" accent={headingColor} size={headingSize} isUpper={isUpper} />
                    <div className="space-y-5">
                        {expSec.items.map((item) => (
                            <div key={item.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-[13px] font-bold text-gray-900">{item.role}</h3>
                                    <time className="text-[10px] text-gray-400 font-semibold shrink-0 ml-3 whitespace-nowrap">
                                        {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                    </time>
                                </div>
                                <p className="text-[11px] font-semibold mb-1.5" style={{ color: headingColor }}>
                                    {item.company}
                                    {item.location && <span className="text-gray-400 font-normal ml-2">· {item.location}</span>}
                                </p>
                                {item.bullets && item.bullets.length > 0 && (
                                    <ul className="space-y-1">
                                        {item.bullets.map((b, i) => (
                                            <li key={i} className="text-[11.5px] text-gray-600 flex gap-2 leading-snug">
                                                <span className="shrink-0 mt-[4px] w-1 h-1 rounded-full" style={{ backgroundColor: headingColor }} />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section.type === "education") {
            const eduSec = section as EducationSection;
            if (!eduSec.items.length) return;
            mainElements.push(
                <div key={section.id}>
                    <PrismMainTitle label="Education" accent={headingColor} size={headingSize} isUpper={isUpper} />
                    <div className="space-y-4">
                        {eduSec.items.map((item) => (
                            <div key={item.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-[13px] font-bold text-gray-900">{item.school}</h3>
                                    <time className="text-[10px] text-gray-400 font-semibold shrink-0 ml-3 whitespace-nowrap">
                                        {formatDate(item.date)}
                                    </time>
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium">{item.degree}</p>
                                {(item.gpa || item.honors) && (
                                    <p className="text-[10px] text-gray-400 italic mt-0.5">
                                        {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(" · ")}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section.type === "projects") {
            const projSec = section as ProjectsSection;
            if (!projSec.items.length) return;
            mainElements.push(
                <div key={section.id}>
                    <PrismMainTitle label="Projects" accent={headingColor} size={headingSize} isUpper={isUpper} />
                    <div className="space-y-4">
                        {projSec.items.map((item) => (
                            <div key={item.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-[13px] font-bold text-gray-900">{item.name}</h3>
                                    {item.link && (
                                        <p className="text-[10px] font-medium ml-3 shrink-0" style={{ color: headingColor }}>
                                            {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                        </p>
                                    )}
                                </div>
                                {item.techStack && item.techStack.length > 0 && (
                                    <p className="text-[10px] text-gray-400 uppercase tracking-tight mb-1">
                                        {item.techStack.join(" · ")}
                                    </p>
                                )}
                                {item.description && (
                                    <p className="text-[11.5px] text-gray-600 leading-snug">{item.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    });

    // Zip into row segments
    const maxLen = Math.max(mainElements.length, sideElements.length);
    for (let i = 0; i < maxLen; i++) {
        const isLast = i === maxLen - 1;
        blocks.push(
            <EntryBlock key={`seg-${i}`} type="custom" id={`seg-${i}`}>
                <div className="flex" style={{ fontFamily: FONT }}>
                    {/* Sidebar */}
                    <div
                        className={`w-[220px] shrink-0 px-7 py-5 ${isLast ? "pb-10" : ""}`}
                        style={{ backgroundColor: ACCENT }}
                    >
                        <div className="text-white">{sideElements[i] || null}</div>
                    </div>
                    {/* Main */}
                    <div className={`flex-grow px-8 py-5 ${isLast ? "pb-10" : ""}`}>
                        {mainElements[i] || null}
                    </div>
                </div>
            </EntryBlock>
        );
    }

    return blocks;
}

export default function PrismSidebar({ resume }: PrismSidebarProps) {
    return (
        <div
            className="max-w-3xl mx-auto bg-white text-gray-800 overflow-hidden"
            style={{ fontFamily: resume.design?.fontFamily || DEFAULT_FONT }}
        >
            {renderPrismSidebarBlocks(resume)}
        </div>
    );
}
