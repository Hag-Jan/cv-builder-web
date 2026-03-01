"use client";

import React, { useState } from "react";

interface ContentAccordionProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultExpanded?: boolean;
}

export function ContentAccordion({ id, title, icon, children, defaultExpanded = false }: ContentAccordionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-lg border transition shadow-sm
      ${isExpanded ? 'border-gray-200 dark:border-slate-700 p-4' : 'border-gray-200 dark:border-slate-800 p-4 opacity-80 hover:opacity-100 hover:border-gray-300 dark:hover:border-slate-600'}`}
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center group cursor-pointer"
            >
                <h3 className="font-semibold text-lg flex items-center gap-3 text-slate-800 dark:text-slate-200">
                    <span className="text-green-500 flex items-center justify-center">
                        {icon}
                    </span>
                    {title}
                </h3>
                <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition">
                    <svg
                        className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            {/* Expanded Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
                    }`}
            >
                {children}
            </div>
        </div>
    );
}
