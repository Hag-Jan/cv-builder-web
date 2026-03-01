// "use client";

// import React from "react";
// import { getTemplate } from "@/lib/pdf/templateEngine";
// import { ResumeV2 as Resume } from "@/types/resume-schema-v2";

// interface LiveMiniPreviewProps {
//     templateId: Resume["templateId"];
//     resumeData?: Resume | null;
// }

// // ─────────────────────────────────────────────────────────
// // RICH PLACEHOLDER — Dense realistic data that fills an
// // entire A4 page. Same profile used across all templates
// // so cards look full like FlowCV / resume.io previews.
// // ─────────────────────────────────────────────────────────
// const PLACEHOLDER_RESUME: Resume = {
//     resumeId: "placeholder",
//     schemaVersion: "2.0",
//     templateId: "modern",
//     design: {
//         fontFamily: "Inter, sans-serif",
//         headingSize: "M",
//         fontSize: 10,
//         accentColor: "#2563EB",
//         layoutCols: "1",
//         entrySpace: 12,
//     },
//     metadata: {
//         createdAt: "2024-01-01T00:00:00.000Z",
//         updatedAt: "2024-01-01T00:00:00.000Z",
//     },
//     sections: [
//         {
//             id: "contact-1",
//             type: "contact",
//             order: 0,
//             name: "Alex Morgan",
//             email: "alex.morgan@email.com",
//             phone: "(415) 555-0192",
//             location: "San Francisco, CA",
//             linkedin: "linkedin.com/in/alexmorgan",
//             github: "github.com/alexmorgan",
//         },
//         {
//             id: "summary-1",
//             type: "summary",
//             order: 1,
//             content:
//                 "Senior Software Engineer with 8+ years building scalable web applications and distributed systems. Led teams of 6–10 engineers at Series B and public-company scale. Deep expertise in React, TypeScript, Node.js, and AWS. Passionate about developer experience, system reliability, and mentoring junior engineers.",
//         },
//         {
//             id: "experience-1",
//             type: "experience",
//             order: 2,
//             items: [
//                 {
//                     id: "exp-1",
//                     role: "Senior Software Engineer",
//                     company: "Stripe",
//                     location: "San Francisco, CA",
//                     startDate: "2021-03",
//                     endDate: "Present",
//                     bullets: [
//                         "Led a team of 6 engineers to rebuild the payments dashboard in React + TypeScript, reducing load time by 62% and increasing NPS by 18 points.",
//                         "Architected a microservices layer on AWS Lambda processing 40M+ daily transactions with 99.99% uptime.",
//                         "Implemented automated testing infrastructure (Jest + Playwright) increasing coverage from 34% to 91%.",
//                         "Mentored 4 junior engineers; 2 promoted to mid-level within 12 months.",
//                     ],
//                 },
//                 {
//                     id: "exp-2",
//                     role: "Software Engineer II",
//                     company: "Airbnb",
//                     location: "San Francisco, CA",
//                     startDate: "2018-06",
//                     endDate: "2021-02",
//                     bullets: [
//                         "Built core features for the host dashboard used by 4M+ hosts globally using React, GraphQL, and Ruby on Rails.",
//                         "Reduced API response times by 45% through database query optimization and Redis caching.",
//                         "Shipped the Superhost recognition feature end-to-end, driving a 23% increase in host retention.",
//                     ],
//                 },
//                 {
//                     id: "exp-3",
//                     role: "Software Engineer",
//                     company: "Twilio",
//                     location: "San Francisco, CA",
//                     startDate: "2016-08",
//                     endDate: "2018-05",
//                     bullets: [
//                         "Developed REST APIs handling 10M+ daily SMS and voice requests in Node.js and Python.",
//                         "Redesigned the developer console, improving new user activation rates by 31%.",
//                     ],
//                 },
//             ],
//         },
//         {
//             id: "education-1",
//             type: "education",
//             order: 3,
//             items: [
//                 {
//                     id: "edu-1",
//                     school: "University of California, Berkeley",
//                     degree: "B.S. Computer Science",
//                     date: "2016-05",
//                     gpa: "3.8",
//                     honors: "Magna Cum Laude",
//                 },
//             ],
//         },
//         {
//             id: "skills-1",
//             type: "skills",
//             order: 4,
//             categories: [
//                 {
//                     id: "cat-1",
//                     label: "Languages & Frameworks",
//                     skills: ["TypeScript", "React", "Next.js", "Node.js", "Python", "GraphQL", "Ruby on Rails"],
//                 },
//                 {
//                     id: "cat-2",
//                     label: "Tools & DevOps",
//                     skills: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Datadog", "PostgreSQL"],
//                 },
//                 {
//                     id: "cat-3",
//                     label: "Practices",
//                     skills: ["System Design", "Agile/Scrum", "TDD", "Code Review", "Technical Leadership"],
//                 },
//             ],
//         },
//         {
//             id: "projects-1",
//             type: "projects",
//             order: 5,
//             items: [
//                 {
//                     id: "proj-1",
//                     name: "OpenMetrics — Open Source APM Tool",
//                     description:
//                         "Lightweight application performance monitoring tool with real-time dashboards. 2,400+ GitHub stars, used by 300+ companies.",
//                     link: "github.com/alexmorgan/openmetrics",
//                     techStack: ["TypeScript", "React", "ClickHouse", "Kafka"],
//                     bullets: [],
//                 },
//                 {
//                     id: "proj-2",
//                     name: "ResumeAI — AI Resume Optimizer",
//                     description:
//                         "SaaS product using LLMs to optimize resumes for ATS systems. 1,200 active users, $4K MRR within 3 months of launch.",
//                     link: "resumeai.io",
//                     techStack: ["Next.js", "OpenAI API", "Stripe", "Firebase"],
//                     bullets: [],
//                 },
//             ],
//         },
//     ],
// };

// /**
//  * Renders an actual live template component scaled down as a thumbnail.
//  * Used on the /templates marketing page to show realistic previews.
//  */
// export const LiveMiniPreview = ({ templateId, resumeData }: LiveMiniPreviewProps) => {
//     // Use provided data (for example templates) or rich placeholder with correct templateId
//     const dataToRender: Resume = resumeData || { ...PLACEHOLDER_RESUME, templateId };

//     const template = getTemplate(templateId) || getTemplate("classic");

//     if (!template) {
//         return (
//             <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
//                 Preview Not Available
//             </div>
//         );
//     }

//     const { HtmlComponent } = template;

//     return (
//         <div className="w-full h-full relative overflow-hidden bg-white">
//             {/*
//               Scale an A4 canvas (794×1123px) down to fit inside the card.
//               The card has aspect-ratio 1/1.41 (same as A4).
//               We use a CSS container approach: the inner div is fixed at 794px wide,
//               then scaled down using transform-origin: top left.
//               Scale = card_width / 794. At ~370px card width: 370/794 ≈ 0.466
//             */}
//             <div
//                 style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "794px",
//                     height: "1123px",
//                     transformOrigin: "top left",
//                     transform: "scale(var(--mini-scale, 0.45))",
//                     pointerEvents: "none",
//                     overflow: "hidden",
//                     backgroundColor: "#fff",
//                 }}
//             >
//                 <HtmlComponent resume={dataToRender} />
//             </div>

//             {/*
//               Responsive scale via CSS custom property.
//               We target common breakpoints for a 3-column grid layout.
//               lg (1024px+): ~370px column → 370/794 = 0.466
//               md (768px):   ~340px column → 340/794 = 0.428
//               sm (640px):   ~280px column → 280/794 = 0.353
//               xs (mobile):  ~320px column → 320/794 = 0.403
//             */}
//             <style>{`
//                 .mini-preview-root { --mini-scale: 0.466; }
//                 @media (max-width: 1280px) { .mini-preview-root { --mini-scale: 0.44; } }
//                 @media (max-width: 1024px) { .mini-preview-root { --mini-scale: 0.43; } }
//                 @media (max-width: 768px)  { .mini-preview-root { --mini-scale: 0.40; } }
//                 @media (max-width: 640px)  { .mini-preview-root { --mini-scale: 0.46; } }
//             `}</style>
//         </div>
//     );
// };


"use client";

import React from "react";
import { getTemplate } from "@/lib/pdf/templateEngine";
import { ResumeV2 as Resume } from "@/types/resume-schema-v2";

interface LiveMiniPreviewProps {
    templateId: Resume["templateId"];
    resumeData?: Resume | null;
}

// ─────────────────────────────────────────────────────────
// Rich placeholder — 3 jobs, 3 skill categories, 2 projects.
// Dense enough to fill an A4 page completely.
// ─────────────────────────────────────────────────────────
const PLACEHOLDER_RESUME: Resume = {
    resumeId: "placeholder",
    schemaVersion: "2.0",
    templateId: "modern",
    design: {
        fontFamily: "Inter, sans-serif",
        headingSize: "M",
        fontSize: 10,
        accentColor: "#2563EB",
        layoutCols: "1",
        entrySpace: 12,
    },
    metadata: {
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
    },
    sections: [
        {
            id: "contact-1", type: "contact", order: 0,
            name: "Alex Morgan", email: "alex.morgan@email.com",
            phone: "(415) 555-0192", location: "San Francisco, CA",
            linkedin: "linkedin.com/in/alexmorgan",
            github: "github.com/alexmorgan",
        },
        {
            id: "summary-1", type: "summary", order: 1,
            content: "Senior Software Engineer with 8+ years building scalable web applications and distributed systems. Led teams of 6–10 engineers at Series B and public-company scale. Deep expertise in React, TypeScript, Node.js, and AWS. Passionate about developer experience, system reliability, and mentoring junior engineers.",
        },
        {
            id: "experience-1", type: "experience", order: 2,
            items: [
                {
                    id: "exp-1", role: "Senior Software Engineer", company: "Stripe",
                    location: "San Francisco, CA", startDate: "2021-03", endDate: "Present",
                    bullets: [
                        "Led team of 6 to rebuild payments dashboard in React + TypeScript, reducing load time by 62% and increasing NPS by 18 points.",
                        "Architected AWS Lambda microservices processing 40M+ daily transactions with 99.99% uptime.",
                        "Increased test coverage from 34% to 91% using Jest + Playwright automated testing infrastructure.",
                        "Mentored 4 junior engineers through structured 1:1s; 2 promoted to mid-level within 12 months.",
                    ],
                },
                {
                    id: "exp-2", role: "Software Engineer II", company: "Airbnb",
                    location: "San Francisco, CA", startDate: "2018-06", endDate: "2021-02",
                    bullets: [
                        "Built core host dashboard features used by 4M+ hosts globally using React, GraphQL, and Ruby on Rails.",
                        "Reduced API response times by 45% through database query optimization and Redis caching strategies.",
                        "Shipped Superhost recognition feature end-to-end, driving a 23% increase in host retention.",
                    ],
                },
                {
                    id: "exp-3", role: "Software Engineer", company: "Twilio",
                    location: "San Francisco, CA", startDate: "2016-08", endDate: "2018-05",
                    bullets: [
                        "Developed REST APIs handling 10M+ daily SMS and voice requests in Node.js and Python.",
                        "Redesigned the developer console, improving new user activation rates by 31%.",
                    ],
                },
            ],
        },
        {
            id: "education-1", type: "education", order: 3,
            items: [{
                id: "edu-1", school: "University of California, Berkeley",
                degree: "B.S. Computer Science", date: "2016-05",
                gpa: "3.8", honors: "Magna Cum Laude",
            }],
        },
        {
            id: "skills-1", type: "skills", order: 4,
            categories: [
                { id: "cat-1", label: "Languages & Frameworks", skills: ["TypeScript", "React", "Next.js", "Node.js", "Python", "GraphQL", "Ruby on Rails"] },
                { id: "cat-2", label: "Tools & DevOps", skills: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Datadog", "PostgreSQL"] },
                { id: "cat-3", label: "Practices", skills: ["System Design", "Agile/Scrum", "TDD", "Code Review", "Technical Leadership"] },
            ],
        },
        {
            id: "projects-1", type: "projects", order: 5,
            items: [
                {
                    id: "proj-1", name: "OpenMetrics — Open Source APM Tool",
                    description: "Lightweight APM tool with real-time dashboards. 2,400+ GitHub stars, used by 300+ companies.",
                    link: "github.com/alexmorgan/openmetrics",
                    techStack: ["TypeScript", "React", "ClickHouse", "Kafka"],
                    bullets: [],
                },
                {
                    id: "proj-2", name: "ResumeAI — AI Resume Optimizer",
                    description: "SaaS using LLMs to optimize resumes for ATS systems. 1,200 active users, $4K MRR in 3 months.",
                    link: "resumeai.io",
                    techStack: ["Next.js", "OpenAI API", "Stripe", "Firebase"],
                    bullets: [],
                },
            ],
        },
    ],
};

export const LiveMiniPreview = ({ templateId, resumeData }: LiveMiniPreviewProps) => {
    const dataToRender: Resume = resumeData || { ...PLACEHOLDER_RESUME, templateId };
    const template = getTemplate(templateId) || getTemplate("classic");

    if (!template) {
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                Preview Not Available
            </div>
        );
    }

    const { HtmlComponent } = template;

    // The card is aspect-ratio 1/1.41 (A4 proportions).
    // At a ~370px wide card: scale = 370 / 794 ≈ 0.466
    // We use CSS custom property so it's responsive.
    return (
        <div className="live-mini-root w-full h-full relative overflow-hidden bg-white">
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "794px",
                    height: "1123px",
                    transformOrigin: "top left",
                    // Default scale for ~370px card width
                    transform: "scale(0.466)",
                    pointerEvents: "none",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                }}
            >
                <HtmlComponent resume={dataToRender} />
            </div>

            <style>{`
                @media (min-width: 1280px) {
                    .live-mini-root > div { transform: scale(0.466) !important; }
                }
                @media (max-width: 1280px) {
                    .live-mini-root > div { transform: scale(0.44) !important; }
                }
                @media (max-width: 1024px) {
                    .live-mini-root > div { transform: scale(0.43) !important; }
                }
                @media (max-width: 768px) {
                    .live-mini-root > div { transform: scale(0.40) !important; }
                }
                @media (max-width: 640px) {
                    .live-mini-root > div { transform: scale(0.46) !important; }
                }
            `}</style>
        </div>
    );
};