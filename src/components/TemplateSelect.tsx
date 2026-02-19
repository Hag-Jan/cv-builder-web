"use client";

import React from "react";
import { useResume } from "@/contexts/ResumeContext";
import { listTemplates } from "@/lib/pdf/templateEngine";
import TemplatePreviewCard from "@/components/TemplatePreviewCard";

/**
 * Template picker — grid of TemplatePreviewCards sourced from the registry.
 * Replaces the old bare <select>.
 */
export default function TemplateSelect() {
    const { resume, updateTemplate } = useResume();
    const templates = listTemplates();

    if (!resume) return null;

    return (
        <div className="flex gap-2">
            {templates.map((config) => (
                <TemplatePreviewCard
                    key={config.id}
                    config={config}
                    isSelected={resume.templateId === config.id}
                    onSelect={() => updateTemplate(config.id as any)}
                />
            ))}
        </div>
    );
}
