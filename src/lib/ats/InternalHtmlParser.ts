import * as cheerio from "cheerio";
import { AtsParser, AtsParserInput, ParsedResume } from "./types";

export class InternalHtmlParser implements AtsParser {
    engineId = "internal-html";

    async parse(input: AtsParserInput): Promise<ParsedResume> {
        if (!input.html) {
            throw new Error("InternalHtmlParser requires 'html' input.");
        }

        const $ = cheerio.load(input.html);
        const parsed: ParsedResume = {
            basics: {},
            work: [],
            education: [],
            skills: [],
            projects: []
        };

        // --- Basics ---
        // Look for the main h1 as the name
        const h1 = $("h1").first().text().trim();
        if (h1) parsed.basics!.name = h1;

        // Look for email (mailto links or regex on text)
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        $("a[href^='mailto:']").each((_, el) => {
            parsed.basics!.email = $(el).text().trim();
        });
        if (!parsed.basics!.email) {
            const bodyText = $("body").text();
            const emailMatch = bodyText.match(emailRegex);
            if (emailMatch) parsed.basics!.email = emailMatch[1];
        }

        // Phone regex (simple)
        const phoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/;
        const phoneMatch = $("body").text().match(phoneRegex);
        if (phoneMatch) parsed.basics!.phone = phoneMatch[0].trim();

        // --- Extracted Text Blocks ---
        // A naive way to extract experience is finding h2/h3 tags that sound like work and taking the content until the next h2
        // For a true implementation, this needs strong heuristics. We'll implement a basic structure here.

        let currentSection = "";

        // This is a highly simplified parser, looking for specific headings typical in our templates
        $("h2, h3, p, ul").each((_, el) => {
            const text = $(el).text().trim().toLowerCase();
            const tagName = el.tagName.toLowerCase();

            if (tagName === "h2") {
                if (text.includes("experience") || text.includes("work") || text.includes("employment")) {
                    currentSection = "work";
                } else if (text.includes("education") || text.includes("academic")) {
                    currentSection = "education";
                } else if (text.includes("skill") || text.includes("competencies")) {
                    currentSection = "skills";
                } else if (text.includes("project")) {
                    currentSection = "projects";
                } else {
                    currentSection = "";
                }
            } else if (currentSection && tagName === "h3") {
                // Represents a job title, degree, or project name in our templates
                if (currentSection === "work") {
                    parsed.work!.push({ position: $(el).text().trim(), highlights: [] });
                } else if (currentSection === "education") {
                    parsed.education!.push({ institution: $(el).text().trim() });
                } else if (currentSection === "projects") {
                    parsed.projects!.push({ name: $(el).text().trim(), highlights: [] });
                }
            } else if (currentSection && tagName === "p") {
                // Secondary info like company name, dates, descriptions
                if (currentSection === "work" && parsed.work!.length > 0) {
                    const currentJob = parsed.work![parsed.work!.length - 1];
                    if (!currentJob.company) currentJob.company = $(el).text().trim();
                } else if (currentSection === "education" && parsed.education!.length > 0) {
                    const currentEdu = parsed.education![parsed.education!.length - 1];
                    if (!currentEdu.degree) currentEdu.degree = $(el).text().trim();
                }
            } else if (currentSection && tagName === "ul" && $(el).find("li").length > 0) {
                // Bullets or Keyword lists
                if (currentSection === "work" && parsed.work!.length > 0) {
                    const currentJob = parsed.work![parsed.work!.length - 1];
                    $(el).find("li").each((_, li) => { currentJob.highlights!.push($(li).text().trim()); });
                } else if (currentSection === "projects" && parsed.projects!.length > 0) {
                    const currentProject = parsed.projects![parsed.projects!.length - 1];
                    $(el).find("li").each((_, li) => { currentProject.highlights!.push($(li).text().trim()); });
                } else if (currentSection === "skills") {
                    // Just grabbing text for now for skills
                    $(el).find("li").each((_, li) => {
                        parsed.skills!.push({ name: "Extracted", keywords: [$(li).text().trim()] });
                    });
                }
            }
        });

        return parsed;
    }
}
