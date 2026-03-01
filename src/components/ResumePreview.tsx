"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getTemplate } from "@/lib/pdf/templateEngine";
import ZoomControls from "@/components/ZoomControls";
import { ResumeV2 as Resume } from "@/types/resume-schema-v2";
import { PaginatedPreview } from "@/components/preview/PaginatedPreview";
import { sanitizeResumeObject } from "@/lib/utils/sanitizer";

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
        // Just return the same preview but empty, no special "Start filling" state to match Stitch
        return (
            <div className="h-full flex flex-col overflow-hidden w-full relative">
                <div className="flex-1 overflow-auto custom-scrollbar flex justify-center p-8">
                    <PaginatedPreview
                        resume={sanitizedResume}
                        templateId={sanitizedResume.templateId}
                        forceContinuous={viewMode === "continuous"}
                        zoom={zoom}
                    />
                </div>
            </div>
        );
    }

    // Background colour: keep gray if template background is white (white-on-white is invisible)
    const bgColor =
        template?.theme?.colors?.background && template.theme.colors.background !== "#FFFFFF"
            ? template.theme.colors.background
            : "#F3F4F6";

    return (
        <div className="h-full flex flex-col overflow-hidden w-full relative shadow-2xl">
            {/* ── Scrollable preview area ──────────────────────────────── */}
            <div className="flex-1 overflow-auto custom-scrollbar flex justify-center pb-8">
                <PaginatedPreview
                    resume={sanitizedResume}
                    templateId={sanitizedResume.templateId}
                    forceContinuous={viewMode === "continuous"}
                    zoom={zoom}
                />
            </div>

            {/* ── Floating Controls ──────────────────────────────────────────────── */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 z-50">
                <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button onClick={() => setViewMode(viewMode === "paginated" ? "continuous" : "paginated")} className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${viewMode === "paginated" ? "text-green-500" : "text-gray-600"}`} title={`Toggle View (Currently: ${viewMode})`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
            </div>
        </div>
    );
});

export default ResumePreview;
