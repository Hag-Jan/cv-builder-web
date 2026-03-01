import React from 'react';
import { ResumeV2 } from "@/types/resume-schema-v2";
import ExecutiveClassic from '@/components/templates/ExecutiveClassic';
import TechClean from '@/components/templates/TechClean';
import MinimalPro from '@/components/templates/MinimalPro';
import BusinessModern from '@/components/templates/BusinessModern';

export async function renderTemplateToHtml(resume: ResumeV2, templateId: string): Promise<string> {
    const template = templatesByString(templateId);

    // Dynamically import react-dom/server to prevent Next.js from throwing build errors
    // about importing react-dom/server in the App Router.
    const ReactDOMServer = await import("react-dom/server");

    // We render the component statically (this strips all react event hooks, leaving raw HTML)
    const element = React.createElement(template, { resume });
    const htmlString = ReactDOMServer.renderToStaticMarkup(element);

    return htmlString;
}

function templatesByString(id: string) {
    switch (id) {
        case 'executive-classic': return ExecutiveClassic;
        case 'tech-clean': return TechClean;
        case 'minimal-pro': return MinimalPro;
        case 'business-modern': return BusinessModern;
        default: return ExecutiveClassic;
    }
}
