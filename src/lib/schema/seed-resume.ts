// ─────────────────────────────────────────────────────────
// Seed resume for development & visual testing
// ─────────────────────────────────────────────────────────

import type { ResumeV2 } from "@/types/resume-schema-v2";

export const SEED_RESUME: ResumeV2 = {
    resumeId: "seed-dev-001",
    schemaVersion: "2.0",
    templateId: "classic",
    metadata: {
        createdAt: "2026-01-15T10:00:00Z",
        updatedAt: "2026-02-18T12:00:00Z",
    },
    sections: [
        {
            id: "summary",
            type: "summary",
            order: 0,
            content:
                "Results-driven software engineer with 4+ years of experience building scalable web applications. Passionate about clean architecture, developer tooling, and shipping user-facing products that solve real problems.",
        },
        {
            id: "contact",
            type: "contact",
            order: 1,
            name: "Alex Chen",
            email: "alex.chen@example.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            linkedin: "linkedin.com/in/alexchen",
            github: "github.com/alexchen",
            website: "alexchen.dev",
        },
        {
            id: "experience",
            type: "experience",
            order: 2,
            items: [
                {
                    id: "exp-1",
                    company: "Stripe",
                    role: "Senior Software Engineer",
                    location: "San Francisco, CA",
                    startDate: "2024-03",
                    endDate: "Present",
                    bullets: [
                        "Led migration of payment processing pipeline to event-driven architecture, reducing latency by 40%",
                        "Designed and implemented real-time fraud detection system handling 50K+ transactions/minute",
                        "Mentored 3 junior engineers through structured onboarding program",
                    ],
                },
                {
                    id: "exp-2",
                    company: "Vercel",
                    role: "Software Engineer",
                    location: "Remote",
                    startDate: "2022-06",
                    endDate: "2024-02",
                    bullets: [
                        "Built Next.js middleware features used by 100K+ developers",
                        "Optimized edge function cold starts by 60% through V8 isolate pooling",
                        "Contributed to open-source Next.js framework with 15+ merged PRs",
                    ],
                },
            ],
        },
        {
            id: "education",
            type: "education",
            order: 3,
            items: [
                {
                    id: "edu-1",
                    school: "UC Berkeley",
                    degree: "B.S. Computer Science",
                    date: "2022",
                    gpa: "3.8",
                    honors: "Magna Cum Laude",
                },
            ],
        },
        {
            id: "skills",
            type: "skills",
            order: 4,
            categories: [
                {
                    id: "skill-1",
                    label: "Languages",
                    skills: ["TypeScript", "Python", "Go", "SQL"],
                },
                {
                    id: "skill-2",
                    label: "Frameworks",
                    skills: ["React", "Next.js", "Node.js", "FastAPI"],
                },
                {
                    id: "skill-3",
                    label: "Infrastructure",
                    skills: ["AWS", "Docker", "Kubernetes", "PostgreSQL", "Redis"],
                },
            ],
        },
        {
            id: "projects",
            type: "projects",
            order: 5,
            items: [
                {
                    id: "proj-1",
                    name: "DevDash",
                    description:
                        "Real-time developer analytics dashboard tracking CI/CD metrics across GitHub repositories",
                    link: "github.com/alexchen/devdash",
                    techStack: ["Next.js", "D3.js", "PostgreSQL", "GitHub API"],
                    bullets: [
                        "Aggregates build times, test coverage, and deploy frequency into unified dashboard",
                        "Serves 500+ daily active users across 12 engineering teams",
                    ],
                },
            ],
        },
    ],
};

/**
 * Returns a fresh copy of the seed resume (avoids mutation).
 */
export function getSeedResume(): ResumeV2 {
    return JSON.parse(JSON.stringify(SEED_RESUME));
}
