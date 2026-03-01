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
import { EntryBlock } from "../preview/EntryBlock";
import { parseSkillLevel } from "@/lib/utils/skill-parser";

// ─────────────────────────────────────────────────────────
// Modern HTML Template — sans-serif + blue accent colors
// Clearly different from Classic (serif + black borders).
// ─────────────────────────────────────────────────────────

interface ModernHtmlTemplateProps {
    resume: Resume;
}

const DEFAULT_ACCENT = "#2563EB"; // blue-600
const DEFAULT_FONT = "Inter, system-ui, sans-serif";

export function renderModernHtmlBlocks(resume: Resume): React.ReactNode[] {
    const ACCENT = resume.design?.accentColor || DEFAULT_ACCENT;
    const DESIGN = resume.design || {};

    const nameColor = "#FFFFFF"; // Name is white on accent background
    const FONT = DESIGN.fontFamily || DEFAULT_FONT;
    const ALIGN = DESIGN.headerAlign || 'left';
    const headingSize = DESIGN.headingSize || "M";
    const headingCase = DESIGN.headingCase || "upper";

    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
    const blocks: React.ReactNode[] = [];

    // Header Area
    if (contact) {
        blocks.push(
            <EntryBlock key="contact" type="contact" id="contact">
                <div className="flex items-end justify-between pt-16 pb-12 relative overflow-hidden" style={{ fontFamily: FONT }}>
                    {/* Background Accent Bar (Visual only) */}
                    <div
                        className="absolute left-0 top-0 w-16 h-full opacity-10"
                        style={{ backgroundColor: ACCENT }}
                    ></div>

                    <div className="pl-24 pr-10 flex-grow">
                        <h1
                            className="text-6xl font-black tracking-tighter leading-[0.8]"
                            style={{ color: DESIGN.applyColorToName ? ACCENT : "#111827" }}
                        >
                            {contact.name}
                        </h1>
                        <p className="text-xl font-bold mt-4 uppercase tracking-widest text-gray-300">
                            {(contact as any).jobTitle || "Creative Professional"}
                        </p>

                        <div className={`flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-black uppercase tracking-widest text-gray-500 mt-8 ${ALIGN === 'center' ? 'justify-center' : ALIGN === 'right' ? 'justify-end' : ''}`}>
                            {contact.email && (
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                    {contact.email}
                                </span>
                            )}
                            {contact.phone && (
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                    {contact.phone}
                                </span>
                            )}
                            {contact.location && (
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                    {contact.location}
                                </span>
                            )}
                            {contact.website && (
                                <a href={ensureUrlScheme(contact.website)} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                    {contact.website.replace(/^https?:\/\/(www\.)?/, "")}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Signature Side Bar (Metadata) */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-16 hidden sm:flex flex-col items-center justify-center gap-12"
                        style={{ backgroundColor: ACCENT }}
                    >
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xs">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="h-32 w-px bg-white/20"></div>
                        <div className="rotate-90 whitespace-nowrap text-[10px] font-black tracking-[0.5em] text-white/40 uppercase origin-center">
                            Curriculum Vitae
                        </div>
                    </div>
                </div>
            </EntryBlock>
        );
    }

    // Summary (Moved to a prominent spot in Creative style)
    if (resume.sections.find(s => s.type === "summary")) {
        const summarySection = resume.sections.find(s => s.type === "summary") as SummarySection;
        if (summarySection.content) {
            blocks.push(
                <EntryBlock key="summary" type="summary" id="summary">
                    <div className="pl-24 pr-10 mb-10">
                        <p className="text-[13px] text-gray-500 leading-[1.8] font-medium italic border-l-4 pl-6" style={{ borderColor: `${ACCENT}20` }}>
                            {summarySection.content}
                        </p>
                    </div>
                </EntryBlock>
            );
        }
    }

    // ── Other Sections ──
    sorted.forEach((section) => {
        if (section.type === "contact" || section.type === "summary") return;

        // Experience
        if (section.type === "experience" && (section as ExperienceSection).items.length > 0) {
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="pl-24 pr-10 mb-3">
                        <SectionTitle
                            label="Experience"
                            accent={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </div>
                </EntryBlock>
            );
            (section as ExperienceSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Experience">
                        <div className="pl-24 pr-10 mb-6 last:mb-8">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[15px] font-black text-gray-900 uppercase tracking-tight">{item.role}</h3>
                                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: ACCENT }}>
                                    {formatDate(item.startDate)} – {formatDate(item.endDate || "Present")}
                                </p>
                            </div>
                            <div className="flex justify-between items-baseline mb-3">
                                <p className="text-[13px] text-gray-500 font-bold uppercase tracking-wide">{item.company}</p>
                                {item.location && (
                                    <p className="text-[11px] text-gray-400 font-medium italic shrink-0 text-right whitespace-nowrap">{item.location}</p>
                                )}
                            </div>
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1.5 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[12px] text-gray-600 flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ACCENT }}></span>
                                            <span className="leading-relaxed">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Education
        if (section.type === "education" && (section as EducationSection).items.length > 0) {
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="pl-24 pr-10 mb-3">
                        <SectionTitle
                            label="Education"
                            accent={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </div>
                </EntryBlock>
            );
            (section as EducationSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="entry" id={item.id} sectionId={section.id} sectionTitle="Education">
                        <div className="pl-24 pr-10 mb-6 last:mb-8">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-tight">{item.school}</h3>
                                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: ACCENT }}>{item.date}</p>
                            </div>
                            <p className="text-[13px] text-gray-500 font-bold">{item.degree}</p>
                            {(item.gpa || item.honors) && (
                                <p className="text-[11px] text-gray-400 italic mt-1 font-medium">
                                    {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(" | ")}
                                </p>
                            )}
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Skills
        if (section.type === "skills") {
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="pl-24 pr-10 mt-8 mb-4">
                        <SectionTitle
                            label="Skills & Expertise"
                            accent={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </div>
                </EntryBlock>
            );

            (section as SkillsSection).categories.forEach((cat) => {
                const cleanedSkills = cat.skills.map(s => s.trim()).filter(Boolean);
                if (cleanedSkills.length === 0) return;

                blocks.push(
                    <EntryBlock key={cat.id} type="skills" id={cat.id} sectionId={section.id} sectionTitle="Skills">
                        <div className="pl-24 pr-10 mb-6 last:mb-10">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>
                                {cat.label}
                            </h3>
                            <div className="flex flex-wrap gap-2 leading-relaxed">
                                {cleanedSkills.map((s, sidx) => {
                                    const { name, level } = parseSkillLevel(s);
                                    return (
                                        <span key={sidx} className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[11px] font-bold text-gray-700 flex items-center gap-2">
                                            {name}{level && <span className="text-[9px] text-gray-400 italic uppercase">({level})</span>}
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
        if (section.type === "projects" && (section as ProjectsSection).items.length > 0) {
            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="pl-24 pr-10 mb-3">
                        <SectionTitle
                            label="Projects"
                            accent={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </div>
                </EntryBlock>
            );
            (section as ProjectsSection).items.forEach((item) => {
                blocks.push(
                    <EntryBlock key={item.id} type="projects" id={item.id} sectionId={section.id} sectionTitle="Projects">
                        <div className="pl-24 pr-10 mb-6 last:mb-8">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-tight">{item.name}</h3>
                                {item.link && (
                                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: ACCENT }}>
                                        {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                                    </p>
                                )}
                            </div>
                            {item.techStack && item.techStack.length > 0 && (
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 overflow-hidden">
                                    {item.techStack.join(" // ")}
                                </p>
                            )}
                            {item.description && (
                                <p className="text-[12px] text-gray-600 leading-relaxed font-medium mb-3 italic">{item.description}</p>
                            )}
                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="space-y-1 pl-1">
                                    {item.bullets.map((b, i) => (
                                        <li key={i} className="text-[11px] text-gray-500 flex gap-3 italic">
                                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 opacity-40" style={{ backgroundColor: ACCENT }}></span>
                                            <span className="leading-snug">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </EntryBlock>
                );
            });
        }

        // Custom
        if (section.type === "custom") {
            const customSection = section as CustomSection;
            const isListSection = ["languages", "hobbies", "interests", "awards", "certifications"].includes(customSection.title.toLowerCase());

            blocks.push(
                <EntryBlock key={`${section.id}-header`} type="header" id={`${section.id}-header`}>
                    <div className="pl-24 pr-10 mt-8 mb-4">
                        <SectionTitle
                            label={customSection.title}
                            accent={ACCENT}
                            size={headingSize}
                            isUpper={headingCase === "upper"}
                        />
                    </div>
                </EntryBlock>
            );

            if (isListSection) {
                blocks.push(
                    <EntryBlock key={`${section.id}-content`} type="custom" id={`${section.id}-content`} sectionId={section.id} sectionTitle={customSection.title}>
                        <div className="pl-24 pr-10 flex flex-wrap gap-x-10 gap-y-4 mb-10">
                            {customSection.content.filter(Boolean).map((c, i) => (
                                <div key={i} className="text-[12px] text-gray-700 font-black uppercase tracking-widest flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }}></span>
                                    {c}
                                </div>
                            ))}
                        </div>
                    </EntryBlock>
                );
            } else {
                customSection.content.forEach((c, i) => {
                    blocks.push(
                        <EntryBlock key={`${section.id}-item-${i}`} type="custom" id={`${section.id}-item-${i}`} sectionId={section.id} sectionTitle={customSection.title}>
                            <div className="pl-24 pr-10 mb-4 last:mb-10">
                                <p className="text-[12px] text-gray-700 leading-relaxed font-medium border-l-2 pl-4 py-1" style={{ borderColor: `${ACCENT}40` }}>{c}</p>
                            </div>
                        </EntryBlock>
                    );
                });
            }
        }
    });

    return blocks;
}

export default function ModernHtmlTemplate({ resume }: ModernHtmlTemplateProps) {
    const blocks = renderModernHtmlBlocks(resume);

    return (
        <div
            className="max-w-3xl mx-auto bg-white min-h-[1000px] text-gray-800"
            style={{ fontFamily: resume.design?.fontFamily || DEFAULT_FONT }}
        >
            {blocks}
        </div>
    );
}

function SectionTitle({
    label,
    accent,
    size = "M",
    isUpper = true
}: {
    label: string;
    accent: string;
    size?: "L" | "M" | "S";
    isUpper?: boolean;
}) {
    const fontSize = size === "L" ? "text-base" : size === "S" ? "text-xs" : "text-sm";

    return (
        <div className="mb-4 mt-6">
            <h2
                className={`${fontSize} font-black inline-block px-4 py-1.5 rounded-lg tracking-widest ${isUpper ? "uppercase" : ""}`}
                style={{
                    backgroundColor: `${accent}15`, // 15 = roughly 8% opacity in hex
                    color: accent
                }}
            >
                {label}
            </h2>
        </div>
    );
}
