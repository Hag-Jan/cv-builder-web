"use client";

import React from "react";
import { listTemplates, getTemplate } from "@/lib/pdf/templateEngine";
import { ResumeV2 } from "@/types/resume-schema-v2";

interface TemplatePickerProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

// ─────────────────────────────────────────────────────────
// Rich shared resume — dense enough to fill an A4 page.
// templateId is swapped per card so each shows its own style.
// ─────────────────────────────────────────────────────────
const BASE_RESUME_SECTIONS: ResumeV2["sections"] = [
    {
        id: "c", type: "contact", order: 0,
        name: "Alex Morgan", email: "alex@email.com",
        phone: "(415) 555-0192", location: "San Francisco, CA",
        linkedin: "linkedin.com/in/alexmorgan",
    } as any,
    {
        id: "s", type: "summary", order: 1,
        content: "Senior Software Engineer with 8+ years building scalable web applications. Led teams of 6–10 engineers at Series B and public-company scale. Deep expertise in React, TypeScript, Node.js, and AWS.",
    } as any,
    {
        id: "e", type: "experience", order: 2,
        items: [
            {
                id: "e1", role: "Senior Software Engineer", company: "Stripe",
                location: "San Francisco, CA", startDate: "2021-03", endDate: "Present",
                bullets: [
                    "Led team of 6 to rebuild payments dashboard in React + TypeScript, reducing load time by 62%.",
                    "Architected AWS Lambda microservices processing 40M+ daily transactions at 99.99% uptime.",
                    "Increased test coverage from 34% to 91% using Jest + Playwright.",
                    "Mentored 4 junior engineers; 2 promoted within 12 months.",
                ],
            },
            {
                id: "e2", role: "Software Engineer II", company: "Airbnb",
                location: "San Francisco, CA", startDate: "2018-06", endDate: "2021-02",
                bullets: [
                    "Built host dashboard features used by 4M+ hosts globally with React and GraphQL.",
                    "Reduced API response times by 45% through query optimization and Redis caching.",
                    "Shipped Superhost recognition feature, driving 23% increase in host retention.",
                ],
            },
            {
                id: "e3", role: "Software Engineer", company: "Twilio",
                location: "San Francisco, CA", startDate: "2016-08", endDate: "2018-05",
                bullets: [
                    "Built REST APIs handling 10M+ daily SMS/voice requests in Node.js and Python.",
                    "Redesigned developer console, improving activation rates by 31%.",
                ],
            },
        ],
    } as any,
    {
        id: "edu", type: "education", order: 3,
        items: [{
            id: "edu1", school: "UC Berkeley", degree: "B.S. Computer Science",
            date: "2016-05", gpa: "3.8", honors: "Magna Cum Laude",
        }],
    } as any,
    {
        id: "sk", type: "skills", order: 4,
        categories: [
            { id: "sk1", label: "Languages & Frameworks", skills: ["TypeScript", "React", "Next.js", "Node.js", "Python", "GraphQL"] },
            { id: "sk2", label: "Tools & DevOps", skills: ["AWS", "Docker", "Kubernetes", "PostgreSQL", "GitHub Actions", "Datadog"] },
            { id: "sk3", label: "Practices", skills: ["System Design", "Agile", "TDD", "Code Review", "Technical Leadership"] },
        ],
    } as any,
    {
        id: "pr", type: "projects", order: 5,
        items: [
            {
                id: "pr1", name: "OpenMetrics — Open Source APM Tool",
                description: "Lightweight APM with real-time dashboards. 2,400+ GitHub stars, used by 300+ companies.",
                link: "github.com/alexmorgan/openmetrics",
                techStack: ["TypeScript", "React", "ClickHouse"],
            },
            {
                id: "pr2", name: "ResumeAI — AI Resume Optimizer",
                description: "SaaS using LLMs to optimize resumes for ATS. 1,200 users, $4K MRR in 3 months.",
                link: "resumeai.io",
                techStack: ["Next.js", "OpenAI API", "Stripe"],
            },
        ],
    } as any,
];

function getPreviewResume(templateId: string): ResumeV2 {
    return {
        resumeId: "picker-preview",
        schemaVersion: "2.0",
        templateId: templateId as ResumeV2["templateId"],
        metadata: { createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" },
        design: { fontSize: 10, entrySpace: 10, accentColor: "#2563EB" },
        sections: BASE_RESUME_SECTIONS,
    };
}

const ATS_SAFE = new Set([
    "classic", "modern", "minimal", "executive-classic",
    "tech-clean", "minimal-pro", "resumify-modern",
    "universal-formal", "brijr-minimal", "business-minimal",
    "adiian-simple", "academic", "minimalist",
]);

// ─────────────────────────────────────────────────────────
// MiniPreview — renders live template scaled to 140px wide
// scale = 140 / 794 = 0.176
// ─────────────────────────────────────────────────────────
function MiniPreview({ templateId }: { templateId: string }) {
    const template = React.useMemo(() => {
        try { return getTemplate(templateId); } catch { return null; }
    }, [templateId]);

    const resume = React.useMemo(() => getPreviewResume(templateId), [templateId]);

    if (!template?.HtmlComponent) {
        return <div className="w-full h-full bg-slate-50 dark:bg-slate-800" />;
    }

    const { HtmlComponent } = template;

    return (
        <div className="w-full h-full overflow-hidden relative bg-white">
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "794px",
                height: "1123px",
                transformOrigin: "top left",
                transform: "scale(0.176)",
                pointerEvents: "none",
                overflow: "hidden",
            }}>
                <HtmlComponent resume={resume} />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// TemplatePicker — horizontal scrollable row of live cards
// ─────────────────────────────────────────────────────────
export function TemplatePicker({ selectedId, onSelect }: TemplatePickerProps) {
    const templates = listTemplates();

    return (
        <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Select Template
            </h3>

            <div
                className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {templates.map((template) => {
                    const isSelected = selectedId === template.id;
                    const isAts = ATS_SAFE.has(template.id);

                    return (
                        <button
                            key={template.id}
                            onClick={() => onSelect(template.id)}
                            className={`
                                flex-shrink-0 w-[130px] text-left transition-all duration-150
                                ${isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"}
                            `}
                        >
                            {/* Live preview thumbnail */}
                            <div className={`
                                relative overflow-hidden rounded-lg border-2 mb-2
                                transition-all duration-150
                                ${isSelected
                                    ? "border-green-500 ring-2 ring-green-500/20 shadow-lg"
                                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500"
                                }
                            `}
                                style={{ aspectRatio: "1 / 1.414" }}
                            >
                                <MiniPreview templateId={template.id} />

                                {/* ATS badge top-left */}
                                {isAts && (
                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-500 text-white text-[7px] font-black rounded-full uppercase tracking-tight flex items-center gap-0.5 shadow-sm">
                                        <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        ATS
                                    </div>
                                )}

                                {/* Selected overlay */}
                                {isSelected && (
                                    <div className="absolute inset-0 bg-green-500/5 flex items-end justify-end p-1.5">
                                        <div className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Template name */}
                            <p className={`text-[10.5px] font-semibold truncate leading-tight ${isSelected
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}>
                                {template.label}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}



// "use client";

// import React from "react";
// import { listTemplates } from "@/lib/pdf/templateEngine";
// import { ResumeV2 } from "@/types/resume-schema-v2";

// interface TemplatePickerProps {
//     selectedId: string;
//     onSelect: (id: ResumeV2["templateId"]) => void;
// }

// export function TemplatePicker({ selectedId, onSelect }: TemplatePickerProps) {
//     const templates = listTemplates();

//     return (
//         <div className="space-y-4">
//             <div className="flex items-center justify-between">
//                 <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
//                     Select Template
//                 </h3>
//             </div>

//             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
//                 {templates.map((template) => {
//                     const isSelected = selectedId === template.id;
//                     const isAtsReady = ["classic", "modern", "minimal", "executive-classic"].includes(template.id);

//                     return (
//                         <button
//                             key={template.id}
//                             onClick={() => onSelect(template.id as ResumeV2["templateId"])}
//                             className={`flex-shrink-0 w-48 group text-left transition-all duration-200 ${isSelected ? "scale-[1.02]" : "hover:scale-[1.02]"
//                                 }`}
//                         >
//                             <div
//                                 className={`relative aspect-[1/1.41] rounded-xl border-2 overflow-hidden mb-3 transition-all ${isSelected
//                                         ? "border-green-500 ring-4 ring-green-500/10 shadow-lg shadow-green-500/5"
//                                         : "border-slate-200 dark:border-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-700 bg-white dark:bg-slate-900"
//                                     }`}
//                             >
//                                 {/* Mini Preview Skeleton */}
//                                 <div className="p-3 h-full flex flex-col gap-1.5 opacity-40 dark:opacity-20 pointer-events-none">
//                                     <div className="h-2 w-1/2 bg-slate-400 rounded-full mb-1" />
//                                     <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
//                                     <div className="h-1 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-full" />
//                                     <div className="mt-2 h-1.5 w-1/3 bg-slate-300 dark:bg-slate-700 rounded-full" />
//                                     <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
//                                     <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
//                                     <div className="h-1 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full" />
//                                 </div>

//                                 {isAtsReady && (
//                                     <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-[8px] font-black rounded-full uppercase tracking-tighter shadow-sm flex items-center gap-0.5">
//                                         <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                                         </svg>
//                                         ATS Ready
//                                     </div>
//                                 )}

//                                 {isSelected && (
//                                     <div className="absolute inset-0 bg-green-500/5 flex items-center justify-center">
//                                         <div className="bg-green-500 text-white p-1.5 rounded-full shadow-xl">
//                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                                             </svg>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="px-1">
//                                 <h4 className={`text-sm font-bold truncate ${isSelected ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-slate-100"
//                                     }`}>
//                                     {template.label}
//                                 </h4>
//                                 <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
//                                     {template.description}
//                                 </p>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }
