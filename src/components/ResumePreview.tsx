"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getTemplate } from "@/lib/pdf/templateEngine";
import ZoomControls from "@/components/ZoomControls";
import { ResumeV2 as Resume } from "@/types/resume-schema-v2";
import { PaginatedPreview } from "@/components/preview/PaginatedPreview";

interface ResumePreviewProps {
    resume: Resume;
}

/**
 * ResumePreview
 *
 * Hosts the live resume preview with zoom controls and a Paginated / Continuous
 * view toggle. Scaling and page layout are fully delegated to PaginatedPreview.
 *
 * Deliberately kept thin — no overflow measurements, no debouncing.
 * PaginatedPreview handles its own deferred layout recalculation.
 */
const ResumePreview = React.memo(function ResumePreview({ resume }: ResumePreviewProps) {
    const [zoom, setZoom] = useState(1);
    const [viewMode, setViewMode] = useState<"paginated" | "continuous">("paginated");

    // ── Persist settings across page refresh ──────────────────────────────
    useEffect(() => {
        const savedZoom = localStorage.getItem("resume_zoom");
        const savedViewMode = localStorage.getItem("resume_viewMode");
        if (savedZoom) setZoom(parseFloat(savedZoom));
        if (savedViewMode === "paginated" || savedViewMode === "continuous") {
            setViewMode(savedViewMode);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("resume_zoom", zoom.toString());
        localStorage.setItem("resume_viewMode", viewMode);
    }, [zoom, viewMode]);

    // ── Sanitize resume data ───────────────────────────────────────────────
    // Runs synchronously on every resume change —  PaginatedPreview debounces
    // the expensive repagination pass internally, so this is safe.
    const sanitizedResume = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { sanitizeResumeObject } = require("@/lib/utils/sanitizer");
        return sanitizeResumeObject(resume);
    }, [resume]);

    const template = getTemplate(sanitizedResume.templateId);

    // ── Empty-state guard ─────────────────────────────────────────────────
    const hasContent = sanitizedResume?.sections?.some((section: any) => {
        if (section.type === "contact") return section.name || section.email;
        if (section.type === "experience") return section.items?.length > 0;
        if (section.type === "education") return section.items?.length > 0;
        if (section.type === "skills") return section.categories?.length > 0;
        if (section.type === "projects") return section.items?.length > 0;
        if (section.type === "custom") return section.content?.length > 0;
        return false;
    });

    const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
    const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
    const handleFitToScreen = () => setZoom(1);

    if (!hasContent) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
                <p className="text-lg">Start filling your resume to see preview</p>
            </div>
        );
    }

    // Background colour: keep gray if template background is white (white-on-white is invisible)
    const bgColor =
        template?.theme?.colors?.background && template.theme.colors.background !== "#FFFFFF"
            ? template.theme.colors.background
            : "#F3F4F6";

    return (
        <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: bgColor }}>
            {/* ── Toolbar ──────────────────────────────────────────────── */}
            <div className="flex-shrink-0 pt-3 px-4 pb-3 z-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between gap-4">
                <ZoomControls
                    zoom={zoom}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onFitToScreen={handleFitToScreen}
                />

                {/* View mode toggle */}
                <div className="flex items-center bg-gray-100 rounded-md p-1 border border-gray-200">
                    <button
                        onClick={() => setViewMode("paginated")}
                        className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${viewMode === "paginated"
                                ? "bg-white text-blue-700 shadow-sm pointer-events-none"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Paginated
                    </button>
                    <button
                        onClick={() => setViewMode("continuous")}
                        className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${viewMode === "continuous"
                                ? "bg-white text-blue-700 shadow-sm pointer-events-none"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Continuous
                    </button>
                </div>
            </div>

            {/* ── Scrollable preview area ──────────────────────────────── */}
            {/*
             * overflow-auto here + CSS zoom inside PaginatedPreview means
             * scrollbars accurately reflect the zoomed content size.
             * No extra wrapper divs — PaginatedPreview owns its own padding.
             */}
            <div className="flex-1 overflow-auto custom-scrollbar" style={{ backgroundColor: bgColor }}>
                <PaginatedPreview
                    resume={sanitizedResume}
                    templateId={sanitizedResume.templateId}
                    forceContinuous={viewMode === "continuous"}
                    zoom={zoom}
                />
            </div>

            {/* Scrollbar styling */}
            {/* @ts-ignore — JSX style pragma */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.08); }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.25);
                    border-radius: 5px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.4); background-clip: content-box; }
            `}</style>
        </div>
    );
});

export default ResumePreview;
