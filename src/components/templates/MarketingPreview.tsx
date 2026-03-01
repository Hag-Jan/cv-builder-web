"use client";

import React from "react";

interface MarketingPreviewProps {
    templateId: string;
}

/**
 * A lightweight, non-interactive skeleton preview of a resume template.
 * Designed for the marketing/templates pages to avoid loading the full heavy engine.
 */
export const MarketingPreview = ({ templateId }: MarketingPreviewProps) => {
    const isTwoColumn = templateId.includes("two-column") || templateId === "business-two-column";

    // Choose an accent color based on template ID
    const getAccentColor = (id: string) => {
        if (id.includes("modern") || id.includes("impact")) return "bg-blue-500";
        if (id.includes("creative") || id.includes("minimal")) return "bg-emerald-500";
        if (id.includes("formal") || id.includes("classic")) return "bg-slate-700";
        if (id.includes("adiian") || id.includes("bold")) return "bg-indigo-600";
        if (id.includes("resumave") || id.includes("clean")) return "bg-rose-500";
        if (id.includes("software")) return "bg-blue-600";
        if (id.includes("product")) return "bg-orange-500";
        if (id.includes("marketing")) return "bg-pink-500";
        return "bg-slate-900";
    };

    const accentClass = getAccentColor(templateId);

    // Variation based on role
    const isTechnical = templateId.includes("software") || templateId.includes("data");
    const isManagerial = templateId.includes("manager") || templateId.includes("executive");
    const isCreative = templateId.includes("marketing") || templateId.includes("creative");

    return (
        <div className="w-full h-full bg-white p-6 flex flex-col gap-4 shadow-inner relative overflow-hidden">
            {/* Design Watermark / Background Element */}
            {isCreative && (
                <div className={`absolute top-0 right-0 w-32 h-32 ${accentClass} opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2`}></div>
            )}

            {/* Header Area */}
            <div className={`flex justify-between items-start mb-4 ${templateId.includes("formal") ? "flex-col items-center text-center" : ""}`}>
                <div className={`space-y-2 flex-1 ${templateId.includes("formal") ? "w-full flex flex-col items-center" : ""}`}>
                    <div className={`h-3 ${templateId.includes("formal") ? "w-1/2" : "w-2/3"} ${accentClass} rounded-sm`}></div>
                    <div className="flex gap-2">
                        <div className="w-16 h-1.5 bg-slate-300 rounded-sm"></div>
                        <div className="w-16 h-1.5 bg-slate-200 rounded-sm"></div>
                        <div className="w-16 h-1.5 bg-slate-200 rounded-sm"></div>
                    </div>
                </div>
                {!templateId.includes("formal") && (
                    <div className={`w-10 h-10 ${accentClass} opacity-10 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black text-slate-400`}>
                        {templateId.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-slate-100 mb-2"></div>

            <div className={`flex gap-6 flex-1 ${isTwoColumn ? "flex-row" : "flex-col"}`}>
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Summary */}
                    <div className="space-y-2">
                        <div className={`w-16 h-2 ${accentClass} opacity-20 rounded`}></div>
                        <div className="space-y-1">
                            <div className="w-full h-1 bg-slate-100 rounded"></div>
                            <div className="w-full h-1 bg-slate-100 rounded"></div>
                            <div className="w-4/5 h-1 bg-slate-100 rounded"></div>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="space-y-4">
                        <div className={`w-24 h-2 ${accentClass} opacity-20 rounded`}></div>

                        {/* Job 1 */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <div className="w-1/2 h-1.5 bg-slate-600 rounded"></div>
                                <div className="w-1/4 h-1.5 bg-slate-200 rounded"></div>
                            </div>
                            <div className="w-1/3 h-1 bg-slate-300 rounded"></div>
                            <div className="space-y-1 pl-2 border-l-2 border-slate-50">
                                <div className="w-full h-1 bg-slate-100 rounded"></div>
                                <div className="w-full h-1 bg-slate-100 rounded"></div>
                            </div>
                        </div>

                        {/* Job 2 */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <div className="w-2/5 h-1.5 bg-slate-600 rounded"></div>
                                <div className="w-1/4 h-1.5 bg-slate-200 rounded"></div>
                            </div>
                            <div className="w-1/4 h-1 bg-slate-300 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Sidebar if Two Column or for Technical skills */}
                {(isTwoColumn || isTechnical) && (
                    <div className={`${isTwoColumn ? "w-1/3" : "w-full"} space-y-6 ${isTwoColumn ? "border-l border-slate-50 pl-6" : ""}`}>
                        {/* Skills / Categories */}
                        <div className="space-y-4">
                            <div className={`w-16 h-2 ${accentClass} opacity-20 rounded`}></div>
                            <div className="flex flex-wrap gap-2">
                                {Array.from({ length: isTechnical ? 8 : 4 }).map((_, i) => (
                                    <div key={i} className={`h-3 w-${Math.random() > 0.5 ? "12" : "16"} bg-slate-50 border border-slate-100 rounded-sm`}></div>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="space-y-3">
                            <div className={`w-20 h-2 ${accentClass} opacity-20 rounded`}></div>
                            <div className="space-y-1.5">
                                <div className="w-full h-1.5 bg-slate-400 rounded"></div>
                                <div className="w-2/3 h-1 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Accent Bar */}
            <div className={`absolute bottom-0 left-0 w-full h-1 ${accentClass} opacity-50`}></div>
        </div>
    );
};
