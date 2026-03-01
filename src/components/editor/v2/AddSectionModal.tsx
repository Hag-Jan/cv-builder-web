"use client";

import React from "react";
import { useResume } from "@/contexts/ResumeContext";
import { SectionTypeV2 } from "@/types/resume-schema-v2";

interface AddSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SECTION_TYPES = [
    { type: "contact", title: "Profile", icon: "person", desc: "Basic contact information and a brief summary of your professional background." },
    { type: "education", title: "Education", icon: "school", desc: "Academic history, including degrees, schools, and dates of attendance." },
    { type: "experience", title: "Professional Experience", icon: "work", desc: "Work history including job titles, company names, and key achievements." },
    { type: "skills", title: "Skills", icon: "bolt", desc: "Technical abilities, soft skills, and relevant tool proficiencies." },
    { type: "projects", title: "Projects", icon: "assignment", desc: "Key initiatives or specific tasks you've led or contributed to." },
    { type: "custom", title: "Custom", icon: "extension", desc: "Create a custom section tailored to your specific needs.", isCustom: true }
] as const;

export function AddSectionModal({ isOpen, onClose }: AddSectionModalProps) {
    const { addSection } = useResume();

    if (!isOpen) return null;

    const handleAdd = (type: SectionTypeV2) => {
        addSection(type);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-slate-950 overflow-y-auto">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10 shrink-0">
                <div className="max-w-[1280px] mx-auto px-6 py-8 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Add content</h2>
                        <div className="hidden sm:flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">Quick start:</span>
                            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500 text-green-600 dark:text-green-400 text-sm font-semibold hover:bg-green-50 dark:hover:bg-green-500/10 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <span>Import Resume</span>
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-100 items-center justify-center rounded-full dark:bg-slate-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            {/* Grid */}
            <main className="max-w-[1280px] mx-auto p-6 md:p-12 pb-24 flex-1 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SECTION_TYPES.map((s) => (
                        <div
                            key={s.type}
                            onClick={() => handleAdd(s.type as SectionTypeV2)}
                            className={`bg-white dark:bg-slate-900 p-6 rounded-xl hover:shadow-md transition-all cursor-pointer group flex flex-col items-start ${(s as any).isCustom
                                    ? 'border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-green-500'
                                    : 'border border-gray-200 dark:border-slate-800 hover:border-green-500/50'
                                }`}
                        >
                            <span className="text-slate-700 dark:text-slate-300 mb-4 block group-hover:text-green-500 transition-colors">
                                {/* SVG Switch based on type to avoid Material Icons dependency */}
                                {s.icon === "person" && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                                {s.icon === "school" && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>}
                                {s.icon === "work" && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                {s.icon === "bolt" && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                {s.icon === "assignment" && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                                {s.icon === "extension" && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{s.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
