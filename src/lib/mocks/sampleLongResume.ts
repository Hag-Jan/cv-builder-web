import { ResumeV2 } from "@/types/resume-schema-v2";

export const sampleLongResume: ResumeV2 = {
    resumeId: "sample-long-resume",
    schemaVersion: "2.0",
    templateId: "business-two-column",
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    sections: [
        {
            id: "contact-1",
            type: "contact",
            order: 0,
            name: "Alexander Hamilton",
            email: "hamilton@treasury.gov",
            phone: "+1 (555) 001-1776",
            location: "New York, NY",
            linkedin: "linkedin.com/in/ahamilton",
            github: "github.com/ahamilton",
            website: "hamilton.gov",
        },
        {
            id: "summary-1",
            type: "summary",
            order: 1,
            content: "Founding Father of the United States, chief staff aide to General George Washington, one of the interpreters and promoters of the U.S. Constitution, and the founder of the nation's financial system, the Federalist Party, the United States Coast Guard, and the New York Post newspaper.",
        },
        {
            id: "experience-1",
            type: "experience",
            order: 2,
            items: [
                {
                    id: "exp-1",
                    company: "Department of the Treasury",
                    role: "1st Secretary of the Treasury",
                    location: "Philadelphia, PA",
                    startDate: "1789-09",
                    endDate: "1795-01",
                    bullets: [
                        "Established the First Bank of the United States and the United States Mint.",
                        "Authored the Report on the Public Credit and the Report on Manufactures.",
                        "Orchestrated the assumption of state debts by the federal government.",
                        "Standardized the national currency and credit system.",
                        "Managed a staff of over 30 clerks to oversee national revenue collection.",
                    ],
                },
                {
                    id: "exp-2",
                    company: "Continental Army",
                    role: "Aide-de-Camp to George Washington",
                    location: "Various Locations",
                    startDate: "1777-03",
                    endDate: "1781-02",
                    bullets: [
                        "Handled voluminous correspondence and drafting of orders for the Commander-in-Chief.",
                        "Interpreted military intelligence and communicated with French allies.",
                        "Commended for bravery during the Battle of Monmouth and the Siege of Yorktown.",
                        "Drafted critical military reports and diplomatic communications.",
                    ],
                },
                {
                    id: "exp-3",
                    company: "New York Post",
                    role: "Founder",
                    location: "New York, NY",
                    startDate: "1801-11",
                    endDate: "1804-07",
                    bullets: [
                        "Established one of the oldest continuously published daily newspapers in the United States.",
                        "Authored numerous editorials advocating for Federalist policies and national unity.",
                        "Secured funding and organized the initial operations of the publication.",
                    ],
                },
                {
                    id: "exp-4",
                    company: "United States Army",
                    role: "Major General",
                    location: "New York, NY",
                    startDate: "1798-07",
                    endDate: "1800-06",
                    bullets: [
                        "Served as Inspector General of the United States Army during the Quasi-War with France.",
                        "Developed comprehensive military regulations and training programs.",
                        "Oversaw the mobilization and organization of defensive forces.",
                    ],
                },
            ],
        },
        {
            id: "education-1",
            type: "education",
            order: 3,
            items: [
                {
                    id: "edu-1",
                    school: "King's College (now Columbia University)",
                    degree: "Bachelor of Arts",
                    date: "1778-05",
                    honors: "Degree conferred posthumously/later due to war",
                },
            ],
        },
        {
            id: "skills-1",
            type: "skills",
            order: 4,
            categories: [
                {
                    id: "cat-1",
                    label: "Financial Systems",
                    skills: ["Banking", "National Debt Management", "Taxation", "Monetary Policy"],
                },
                {
                    id: "cat-2",
                    label: "Legal & Writing",
                    skills: ["Constitutional Law", "The Federalist Papers", "Debate", "Drafting Legislation"],
                },
                {
                    id: "cat-3",
                    label: "Military",
                    skills: ["Strategy", "Intelligence Analysis", "Artillery", "Leadership"],
                },
                {
                    id: "cat-4",
                    label: "Languages",
                    skills: ["English", "French"],
                },
                {
                    id: "cat-5",
                    label: "Soft Skills",
                    skills: ["Persuasion", "Oratory", "Political Maneuvering", "Visionary Thinking"],
                },
            ],
        },
        {
            id: "projects-1",
            type: "projects",
            order: 5,
            items: [
                {
                    id: "proj-1",
                    name: "The Federalist Papers",
                    description: "A series of 85 essays arguing for the ratification of the United States Constitution.",
                    techStack: ["Ink", "Parchment", "Logic"],
                    bullets: [
                        "Authored 51 of the 85 essays under the pseudonym 'Publius'.",
                        "Co-authored with James Madison and John Jay.",
                        "Remains a primary source for Constitutional interpretation.",
                    ],
                },
                {
                    id: "proj-2",
                    name: "Report on Manufactures",
                    description: "A landmark document advocating for industrialization and protectionist trade policies.",
                    bullets: [
                        "Proposed subsidies to industry and regulation of trade.",
                        "Envisioned the United States as a global industrial power.",
                    ],
                },
                {
                    id: "proj-3",
                    name: "First Bank of the United States",
                    description: "Created a central bank to facilitate the financial operations of the United States.",
                    bullets: [
                        "Successfully argued the constitutionality of a national bank.",
                        "Stabilized the national currency and established public credit.",
                    ],
                },
            ],
        },
        {
            id: "custom-1",
            type: "custom",
            order: 6,
            title: "Honors & Legacy",
            content: [
                "Featured on the $10 bill.",
                "Subject of the Tony Award-winning musical 'Hamilton'.",
                "Inducted into the National Rivers Hall of Fame (for Coast Guard founding).",
                "Statue located in Central Park, New York.",
                "Founding member of the Society of the Cincinnati.",
            ],
        },
    ],
};
