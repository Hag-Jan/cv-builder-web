"use client";

import React, { useState, useRef, useEffect, useMemo, useLayoutEffect } from "react";
import { getTemplate } from "@/lib/pdf/templateEngine";
import ZoomControls from "@/components/ZoomControls";
import { ResumeV2 as Resume } from "@/types/resume-schema-v2";

interface ResumePreviewProps {
    resume: Resume;
}

import { PaginatedPreview } from "@/components/preview/PaginatedPreview";

/**
 * ResumePreview Component
 * 
 * Renders a live preview of the resume using PaginatedPreview
 * Styled to look like A4 paper with shadow, zoom controls, and scrollable container
 */

export default function ResumePreview({ resume }: ResumePreviewProps) {
    const [zoom, setZoom] = useState(1);
    const [viewMode, setViewMode] = useState<"paginated" | "continuous">("paginated");

    // Persist zoom and viewMode state
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

    // Refs and State for layout-aware scaling (Option A)
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [isOverflowing, setIsOverflowing] = useState(false);

    // Deep sanitize to prevent dirty text inputs and hidden control characters
    const sanitizedResume = useMemo(() => {
        const sanitizeStr = (str: string | null | undefined) => {
            if (!str) return str;
            // Trim and remove non-printable ASCII chars, strip hard HTML
            let cleaned = str
                .replace(/<[^>]*>?/gm, "")
                .replace(/[\x00-\x1F\x7F-\x9F\uFFFD]/g, "")
                .trim();

            // Remove common copy-paste repeating junk texts from corrupted PDFs
            cleaned = cleaned.replace(/(nmsmnmsdnsd|iwdiwijwdi|skknds ks)+/gi, "");
            // Limit string length to prevent massive garbage strings crashing PDF
            return cleaned.length > 5000 ? cleaned.substring(0, 5000) + "..." : cleaned;
        };

        const s = (obj: any): any => {
            if (typeof obj === "string") return sanitizeStr(obj);
            if (Array.isArray(obj)) return obj.map(s);
            if (obj !== null && typeof obj === "object") {
                const newObj: any = {};
                for (const key in obj) {
                    newObj[key] = s(obj[key]);
                }
                return newObj;
            }
            return obj;
        };

        return s(resume);
    }, [resume]);

    const template = getTemplate(sanitizedResume.templateId);

    // Track unscaled content height and apply bounds with debounce
    useLayoutEffect(() => {
        if (!contentRef.current) return;
        let timeoutId: NodeJS.Timeout;
        let animationFrameId: number;

        const measure = () => {
            if (contentRef.current) {
                setContentHeight(contentRef.current.scrollHeight);
            }
        };

        const observer = new ResizeObserver((entries) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                animationFrameId = requestAnimationFrame(measure);
            }, 100);
        });

        observer.observe(contentRef.current);
        // Force an initial measurement immediately
        animationFrameId = requestAnimationFrame(measure);

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
            cancelAnimationFrame(animationFrameId);
        };
    }, [sanitizedResume, viewMode]);

    // Simple overflow detection 
    useEffect(() => {
        if (!containerRef.current || !contentRef.current) return;
        const { clientHeight } = containerRef.current;
        const scaledHeight = contentHeight * zoom;
        if (scaledHeight > clientHeight + 40 && viewMode === "continuous") {
            setIsOverflowing(true);
        } else {
            setIsOverflowing(false);
        }
    }, [contentHeight, zoom, viewMode]);

    const hasContent = sanitizedResume.sections.some((section: any) => {
        if (section.type === "contact") return section.name || section.email;
        if (section.type === "experience") return section.items?.length > 0;
        if (section.type === "education") return section.items?.length > 0;
        if (section.type === "skills") return section.categories?.length > 0;
        if (section.type === "projects") return section.items?.length > 0;
        if (section.type === "custom") return section.content?.length > 0;
        return false;
    });

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
    const handleFitToScreen = () => setZoom(1);

    if (!hasContent) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
                <p className="text-lg">Start filling your resume to see preview</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-100 overflow-hidden">
            {/* Zoom Controls & Overflow Warning Toolbar */}
            <div className="flex-shrink-0 pt-4 px-4 z-20 bg-white border-b border-gray-200 pb-4 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <ZoomControls
                        zoom={zoom}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onFitToScreen={handleFitToScreen}
                    />

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-md p-1 border border-gray-200">
                        <button
                            onClick={() => setViewMode("paginated")}
                            className={`px-3 py-1.5 text-xs font-bold rounded shadow-sm transition-colors ${viewMode === "paginated"
                                ? "bg-white text-blue-700 pointer-events-none"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Paginated
                        </button>
                        <button
                            onClick={() => setViewMode("continuous")}
                            className={`px-3 py-1.5 text-xs font-bold rounded shadow-sm transition-colors ${viewMode === "continuous"
                                ? "bg-white text-blue-700 pointer-events-none"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Continuous
                        </button>
                    </div>
                </div>

                {isOverflowing && viewMode === "continuous" && (
                    <div className="text-xs font-semibold text-amber-600 bg-amber-50 py-2 px-3 rounded flex items-center gap-2 max-w-sm mx-auto w-full">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Content exceeds 1 page length. Switch to Paginated view to verify cuts.
                    </div>
                )}
            </div>

            {/* Scrollable Preview Area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto bg-gray-100 p-4 lg:p-12 custom-scrollbar relative"
                style={{
                    backgroundColor: template?.theme?.colors?.background === '#FFFFFF' ? '#F3F4F6' : template?.theme?.colors?.background
                }}
            >
                {/* 
                  * SCALING STRATEGY (Option B):
                  * We use native CSS zoom. This scales the layout appropriately
                  * and allows standard scrollbars to follow along flawlessly
                  * without breaking visual page margins.
                */}
                <div className="mx-auto flex flex-col items-center">
                    <div ref={contentRef} className="w-full">
                        <PaginatedPreview resume={sanitizedResume} templateId={sanitizedResume.templateId} forceContinuous={viewMode === "continuous"} zoom={zoom} />
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 14px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #2b2b2b;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4a4a4a;
                    border-radius: 7px;
                    border: 3px solid #2b2b2b;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #666;
                }
            `}</style>
        </div>
    );
};
