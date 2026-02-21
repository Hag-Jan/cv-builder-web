"use client";

import React, { useEffect, useRef, useState } from "react";
import { A4Page } from "./A4Page";
import type { ResumeV2 as Resume } from "@/types/resume-schema-v2";
import { getTemplate } from "@/lib/pdf/templateEngine";
import { refinedPaginate, PaginationBlock, BlockType } from "@/engine/pagination";

interface PaginatedPreviewProps {
    resume: Resume;
    templateId: string;
    forceContinuous?: boolean;
    zoom?: number;
}

/**
 * PaginatedPreview handles the distribution of resume blocks onto multiple A4 pages.
 * It uses a "phantom" measurement technique to determine how much content fits on each page.
 * If forceContinuous is true, it skips pagination and returns a single long page.
 */
export const PaginatedPreview: React.FC<PaginatedPreviewProps> = ({ resume, templateId, forceContinuous = false, zoom = 1 }) => {
    const [pages, setPages] = useState<PaginationBlock[][]>([]);
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const phantomRef = useRef<HTMLDivElement>(null);
    const template = getTemplate(templateId);

    // Use a ref for blocks to avoid re-triggering measurement when blocks change during render
    const blocksRef = useRef<React.ReactNode[]>([]);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const paginate = () => {
        if (!phantomRef.current) return;

        const container = phantomRef.current;
        const rawBlocks = template.renderBlocks ? template.renderBlocks(resume) : [];

        // If template doesn't support blocks or we want continuous, render as single page
        if (rawBlocks.length === 0 || forceContinuous) {
            const Component = template.HtmlComponent;
            const content = forceContinuous && rawBlocks.length > 0
                ? rawBlocks
                : <Component key="full" resume={resume} />;

            setPages([[{
                id: "full",
                type: "entry",
                element: content as any,
                height: 0
            }]]);
            setIsMeasuring(false);
            return;
        }

        // Phase 1: Measurement
        setIsMeasuring(true);
        blocksRef.current = rawBlocks;

        // Small delay to let blocks render in phantom container
        setTimeout(() => {
            if (!phantomRef.current) return;
            const blockElements = Array.from(phantomRef.current.children) as HTMLElement[];

            const measuredBlocks: PaginationBlock[] = blockElements.map((el, index) => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);

                // Capture height + vertical margins (important for accurate layout)
                const marginTop = parseFloat(style.marginTop) || 0;
                const marginBottom = parseFloat(style.marginBottom) || 0;
                const fullHeight = rect.height + marginTop + marginBottom;

                const type = el.getAttribute("data-block-type") as BlockType || "entry";
                const id = el.getAttribute("data-block-id") || `block-${index}`;
                const sectionId = el.getAttribute("data-section-id") || undefined;
                const sectionTitle = el.getAttribute("data-section-title") || undefined;

                return {
                    id,
                    type,
                    element: rawBlocks[index],
                    height: fullHeight,
                    sectionId,
                    sectionTitle
                };
            });

            // Phase 2: Pagination using refined engine
            const paginatedNodes = refinedPaginate(measuredBlocks);

            setPages(paginatedNodes);
            setIsMeasuring(false);
        }, 150);
    };

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Small delay to ensure template and resume are stable
        debounceTimer.current = setTimeout(() => {
            paginate();
        }, 300);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [resume, templateId, forceContinuous]); // Triggers when resume content, template, or view mode changes

    if (!isMounted) {
        return (
            <div className="flex flex-col items-center bg-transparent py-10 min-h-full">
                <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                    <p>Loading preview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center bg-transparent py-10 min-h-full">
            {/* Multi-page Warning */}
            {pages.length > 1 && (
                <div className="mb-6 px-4 py-2 bg-amber-50 border border-amber-200 rounded-md shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <p className="text-amber-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Resume exceeds 1 page ({pages.length} pages)
                    </p>
                </div>
            )}

            {/* Real Pages */}
            {pages.map((pageBlocks, pageIndex) => (
                <A4Page key={pageIndex} isContinuous={forceContinuous} zoom={zoom}>
                    <div className="resume-content-wrapper flex flex-col h-full">
                        {pageBlocks.map((block, blockIndex) => {
                            const isContinued = pageIndex > 0 &&
                                blockIndex === 0 &&
                                block.type !== "header" &&
                                !!block.sectionId &&
                                pages[pageIndex - 1].some(pb => pb.sectionId === block.sectionId);

                            return (
                                <React.Fragment key={block.id}>
                                    {isContinued && (
                                        <div className="mb-4 border-b border-gray-100 pb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                                {block.sectionTitle} (Continued)
                                            </span>
                                        </div>
                                    )}
                                    <div className={pageIndex > 0 && blockIndex === 0 && !isContinued ? "mt-4" : ""}>
                                        {block.element}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </A4Page>
            ))}

            {/* Hidden container for measuring block heights */}
            <div
                ref={phantomRef}
                className="absolute flex flex-col opacity-0 pointer-events-none"
                style={{
                    width: "170mm", // 210mm - 2*20mm padding
                    top: -10000,
                    left: -10000,
                    padding: "0",
                    position: "absolute",
                    visibility: "hidden",
                    // Inject template font and base styles for accurate measurement
                    fontFamily: template.theme?.fontFamily || "Inter, Arial, sans-serif",
                    fontSize: `${template.theme?.fontSize?.body}pt` || "10pt",
                }}
            >
                {template.renderBlocks ? template.renderBlocks(resume) : null}
            </div>

            {isMeasuring && pages.length === 0 && (
                <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Preparing preview...</p>
                </div>
            )}
        </div>
    );
};
