"use client";

import React from "react";
import { useResume } from "@/contexts/ResumeContext";
import { AVAILABLE_TEMPLATES } from "@/lib/pdf/templateEngine";

export default function TemplateSelect() {
    const { resume, updateTemplate } = useResume();

    if (!resume) return null;

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="template-select" className="text-sm font-medium text-gray-700">
                Template:
            </label>
            <select
                id="template-select"
                value={resume.templateId}
                onChange={(e) => updateTemplate(e.target.value as any)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
            >
                {AVAILABLE_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                        {tpl.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
