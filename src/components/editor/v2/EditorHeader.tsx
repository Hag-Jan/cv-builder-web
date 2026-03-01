"use client";

import React from "react";
import Link from "next/link";
import type { ResumeV2 } from "@/types/resume-schema-v2";
import ExportPdfButton from "@/components/ExportPdfButton";
import AutosaveIndicator from "@/components/editor/AutosaveIndicator";

// Custom icons or generic SVG fallbacks can be used if Material Icons aren't fully set up globally, 
// but since the original html used them, we'll stick to semantic SVGs or standard Tailwind approaches 
// tailored for the React project. The project already seems to use some generic icons anyway.

interface EditorHeaderProps {
    resume: ResumeV2 | null;
    onPreviewClick?: () => void;
    onOptimizeClick?: () => void;
    atsScore?: number;
}

export function EditorHeader({ resume, onPreviewClick, onOptimizeClick, atsScore = 75 }: EditorHeaderProps) {
    const contactSection = resume?.sections?.find(s => s.type === "contact") as import("@/types/resume-schema-v2").ContactSectionV2 | undefined;
    const resumeName = contactSection?.name || "Untitled Resume";

    return (
        <nav className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0 z-20">
            {/* Brand & Breadcrumbs */}
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 text-green-500 font-bold text-xl tracking-tight">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5z" />
                    </svg>
                    <span>ResumeATS</span>
                </Link>
                <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 dark:text-slate-400">Resumes /</span>
                    <span className="font-medium cursor-pointer hover:underline decoration-green-500 text-slate-800 dark:text-slate-200">
                        {resumeName}
                    </span>
                    <div className="ml-2 border-l border-gray-200 dark:border-slate-700 pl-3">
                        <AutosaveIndicator />
                    </div>
                </div>
            </div>

            {/* Actions & Tools */}
            <div className="flex items-center gap-4">

                {/* Quick Style Tools */}
                <div className="hidden md:flex bg-gray-50 dark:bg-slate-900/50 rounded-md p-1 border border-gray-200 dark:border-slate-700 text-gray-400">
                    <button className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-gray-200 transition" title="Change Template">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                    <button className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-gray-200 transition" title="Colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                    </button>
                    <button className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-gray-200 transition" title="Fonts">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-8m0 0l4 8m-4-8v12" /></svg>
                    </button>
                </div>

                {/* ATS Score */}
                <button
                    onClick={onOptimizeClick}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors cursor-pointer group"
                >
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        <svg className="transform -rotate-90 w-6 h-6" viewBox="0 0 36 36">
                            <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                            <path className="text-green-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${atsScore}, 100`} strokeWidth="4"></path>
                        </svg>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200">ATS: {atsScore}%</span>
                </button>

                {/* Preview Button (Mobile Context) */}
                <button
                    onClick={onPreviewClick}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <span className="hidden sm:inline">Preview</span>
                </button>

                {/* Download PDF replaces the standard primary button */}
                {resume && (
                    <div className="hidden sm:block">
                        {/* We wrap ExportPdfButton to match the styling of the new mockups or just use it directly */}
                        <div className="[&>button]:bg-green-500 [&>button]:hover:bg-green-600 [&>button]:text-white [&>button]:px-5 [&>button]:py-2 [&>button]:rounded-md [&>button]:text-sm [&>button]:font-bold [&>button]:shadow-sm [&>button]:transition [&>button]:flex [&>button]:items-center [&>button]:gap-2">
                            <ExportPdfButton resume={resume} />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
