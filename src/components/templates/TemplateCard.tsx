"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiveMiniPreview } from "./LiveMiniPreview";
import { TemplateMeta } from "@/data/templates";

// Import example JSONs statically for fast client-side injection
import softwareEngineerExample from "@/data/examples/software-engineer.json";
import productManagerExample from "@/data/examples/product-manager.json";
import marketingSpecialistExample from "@/data/examples/marketing-specialist.json";
import dataScientistExample from "@/data/examples/data-scientist.json";
import projectManagerExample from "@/data/examples/project-manager.json";

const EXAMPLES: Record<string, any> = {
    "software-engineer-example": softwareEngineerExample,
    "product-manager-example": productManagerExample,
    "marketing-specialist-example": marketingSpecialistExample,
    "data-scientist-example": dataScientistExample,
    "project-manager-example": projectManagerExample,
};

interface TemplateCardProps {
    template: TemplateMeta;
}

export const TemplateCard = ({ template }: TemplateCardProps) => {
    const router = useRouter();
    const isExample = template.category === "example";

    // Check if we have specific mock data for this template
    const resumeData = isExample ? EXAMPLES[template.id] : null;

    // For non-example templates, just use the template ID for routing
    // For examples, the design is controlled inside their specific JSON
    const previewTemplateId = isExample ? (resumeData?.templateId || "modern") : template.id;

    const handleUseTemplate = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isExample && resumeData) {
            e.preventDefault();
            // Storing the full JSON object in sessionStorage just like the AI generator does
            const sessionKey = `example_${template.id}`;
            sessionStorage.setItem(sessionKey, JSON.stringify(resumeData));
            router.push(`/editor?load=${sessionKey}`);
        }
    };

    return (
        <div className="group flex flex-col transition-all duration-300">
            {/* Visual Preview Area - The "Card" part */}
            <Link
                href={`/editor?template=${template.id}`}
                onClick={handleUseTemplate}
                className="aspect-[1/1.41] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 border border-slate-100 mb-6 relative block"
            >
                <div className="w-full h-full transform transition-transform duration-700 group-hover:scale-[1.03]">
                    <LiveMiniPreview templateId={previewTemplateId} resumeData={resumeData} />
                </div>
            </Link>

            {/* Content Area - Detailed titles and descriptions */}
            <div className="px-1 text-left">
                <h3 className="text-[19px] font-extrabold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                    {template.name}
                </h3>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {template.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                        {template.layout === 'single-column' ? 'Single Column' : 'Two Column'}
                    </span>
                    {template.isAtsSafe && (
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded">
                            ATS Ready
                        </span>
                    )}
                </div>

                <Link
                    href={`/editor?template=${template.id}`}
                    onClick={handleUseTemplate}
                    className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm group/btn hover:gap-3 transition-all underline decoration-emerald-200 underline-offset-4 hover:decoration-emerald-500"
                >
                    Use this template
                    <span className="material-symbols-outlined text-lg leading-none">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
};
