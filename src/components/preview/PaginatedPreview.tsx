"use client";

import React, { useEffect, useRef, useState, useDeferredValue } from "react";
import { A4Page } from "./A4Page";
import type { ResumeV2 as Resume } from "@/types/resume-schema-v2";
import { getTemplate } from "@/lib/pdf/templateEngine";
import { refinedPaginate, BlockType } from "@/engine/pagination";

interface PaginatedPreviewProps {
    resume: Resume;
    templateId: string;
    /** true = render as one continuous scroll (Continuous mode) */
    forceContinuous?: boolean;
    /** CSS zoom factor applied to the page stack (0.5 – 2.0) */
    zoom?: number;
}

/**
 * PageLayoutBlock — structural metadata only, NO React element.
 * Content is always rendered fresh from the `resume` prop on each React cycle
 * so typing instantly reflects in the preview without waiting for repagination.
 */
interface PageLayoutBlock {
    id: string;
    type: BlockType;
    /** Index into the array returned by template.renderBlocks(resume) */
    blockIndex: number;
    height: number;
    sectionId?: string;
    sectionTitle?: string;
}

/**
 * PaginatedPreview — Two-track rendering for instant live preview.
 *
 * ┌─ Track 1 (INSTANT) ─────────────────────────────────────────────────────┐
 * │  `liveBlocks` = template.renderBlocks(resume) — recalculated on every   │
 * │  React render. No debounce, no state. Typing always shows immediately.   │
 * └─────────────────────────────────────────────────────────────────────────┘
 * ┌─ Track 2 (DEFERRED) ────────────────────────────────────────────────────┐
 * │  `pageLayout` = the assignment of block indices to pages.               │
 * │  Recalculated with useDeferredValue + debounce so it never blocks       │
 * │  the UI. Re-flows ~130 ms after typing pauses.                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * SCALING — CSS `zoom` is applied to the page-stack wrapper.
 * This proportionally scales pages AND the 32 px gap between them.
 * The phantom measurement div lives OUTSIDE the zoom wrapper so that
 * getBoundingClientRect() always returns 1:1 (unscaled) values.
 */
export const PaginatedPreview: React.FC<PaginatedPreviewProps> = ({
    resume,
    templateId,
    forceContinuous = false,
    zoom = 1,
}) => {
    // useDeferredValue lets React keep the current layout stable while computing
    // the new one in the background — zero jank during typing.
    const deferredResume = useDeferredValue(resume);
    const deferredTemplateId = useDeferredValue(templateId);

    const [pageLayout, setPageLayout] = useState<PageLayoutBlock[][]>([]);
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const phantomRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Template for the LIVE render (current, not deferred)
    const template = getTemplate(templateId);
    // Template for the DEFERRED measurement pass
    const deferredTemplate = getTemplate(deferredTemplateId);

    useEffect(() => { setIsMounted(true); }, []);

    // ── Track 2: deferred page-layout computation ─────────────────────────

    const paginate = () => {
        if (!phantomRef.current) return;

        const rawBlocks = deferredTemplate.renderBlocks
            ? deferredTemplate.renderBlocks(deferredResume)
            : [];

        // Continuous mode or template with no block support → single page
        if (rawBlocks.length === 0 || forceContinuous) {
            setPageLayout([[{ id: "full", type: "entry", blockIndex: 0, height: 0 }]]);
            setIsMeasuring(false);
            return;
        }

        setIsMeasuring(true);

        // Wait one frame for the phantom container to populate, then measure.
        // Phantom is outside the zoom wrapper → measurements are always 1:1.
        setTimeout(() => {
            if (!phantomRef.current) return;

            const blockEls = Array.from(phantomRef.current.children) as HTMLElement[];
            const measured = blockEls.map((el, index) => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                const marginTop = parseFloat(style.marginTop) || 0;
                const marginBottom = parseFloat(style.marginBottom) || 0;

                return {
                    id: el.getAttribute("data-block-id") || `block-${index}`,
                    type: (el.getAttribute("data-block-type") as BlockType) || "entry",
                    blockIndex: index,
                    height: rect.height + marginTop + marginBottom,
                    sectionId: el.getAttribute("data-section-id") || undefined,
                    sectionTitle: el.getAttribute("data-section-title") || undefined,
                    // `element` is required by the pagination engine signature only
                    element: rawBlocks[index],
                };
            });

            const pages = refinedPaginate(measured);

            // Store only structure — strip the element, rebuild from liveBlocks on render
            setPageLayout(
                pages.map((page) =>
                    page.map((b) => ({
                        id: b.id,
                        type: b.type,
                        blockIndex: (b as any).blockIndex ?? 0,
                        height: b.height,
                        sectionId: b.sectionId,
                        sectionTitle: b.sectionTitle,
                    }))
                )
            );
            setIsMeasuring(false);
        }, 80);
    };

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(paginate, 50);
        return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
    }, [deferredResume, deferredTemplateId, forceContinuous]);

    // ── Track 1: live block elements (always current) ─────────────────────

    // Rebuild from the current (non-deferred) resume on every render.
    // No state, no debounce — changes appear synchronously on the next frame.
    const liveBlocks: React.ReactNode[] = template.renderBlocks
        ? template.renderBlocks(resume)
        : [];

    // ── Render ─────────────────────────────────────────────────────────────

    if (!isMounted) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0" }}>
                <p style={{ color: "#9CA3AF" }}>Loading preview...</p>
            </div>
        );
    }

    // ── Continuous mode (one long page, no clips) ─────────────────────────
    if (forceContinuous) {
        const Component = template.HtmlComponent;
        return (
            <div style={{ zoom } as React.CSSProperties}>
                <A4Page isContinuous>
                    {liveBlocks.length > 0 ? liveBlocks : <Component resume={resume} />}
                </A4Page>
            </div>
        );
    }

    // ── Paginated mode (default) ───────────────────────────────────────────
    return (
        <>
            {/*
             * zoom is applied here so pages + the 32px marginBottom gap between
             * pages all scale together. No transform:scale is used — CSS zoom
             * is reflow-aware and scrollbars update correctly.
             *
             * The phantom div is a SIBLING outside this wrapper (see below)
             * so its getBoundingClientRect() values are never affected by zoom.
             */}
            <div
                style={{
                    zoom,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "40px 0",
                    minHeight: "100%",
                } as React.CSSProperties}
            >
                {/* Multi-page badge */}
                {pageLayout.length > 1 && (
                    <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        marginBottom: 24, padding: "6px 16px",
                        background: "#fffbeb", border: "1px solid #fde68a",
                        borderRadius: 6, color: "#92400e",
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                    }}>
                        <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Resume exceeds 1 page ({pageLayout.length} pages)
                    </div>
                )}

                {/* Pages */}
                {pageLayout.length === 0 ? (
                    // Initial load: show a single page skeleton while measuring
                    isMeasuring ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 80, color: "#9CA3AF" }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                border: "2px solid #D1D5DB", borderTopColor: "#2563EB",
                                animation: "spin 0.7s linear infinite", marginBottom: 16,
                            }} />
                            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                                Preparing preview…
                            </p>
                        </div>
                    ) : (
                        // Fallback: no layout yet, show full component
                        <A4Page>
                            <template.HtmlComponent resume={resume} />
                        </A4Page>
                    )
                ) : (
                    pageLayout.map((pageBlocks, pageIndex) => (
                        <A4Page key={pageIndex}>
                            {pageBlocks.map((block, blockIndex) => {
                                const isContinued =
                                    pageIndex > 0 &&
                                    blockIndex === 0 &&
                                    block.type !== "header" &&
                                    !!block.sectionId &&
                                    pageLayout[pageIndex - 1].some((pb) => pb.sectionId === block.sectionId);

                                // Fetch live element — always current, no snapshot lag
                                const liveElement = liveBlocks[block.blockIndex] ?? null;

                                return (
                                    <React.Fragment key={block.id}>
                                        {/* "(Continued)" header for split sections */}
                                        {isContinued && (
                                            <div style={{ marginBottom: 12, borderBottom: "1px solid #F3F4F6", paddingBottom: 4 }}>
                                                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#9CA3AF" }}>
                                                    {block.sectionTitle} (Continued)
                                                </span>
                                            </div>
                                        )}
                                        {/*
                                         * Top margin on the very first block of pages 2+ ensures the
                                         * content doesn't start flush against the top page edge.
                                         * 16px ≈ the visual breathing room a reader expects.
                                         */}
                                        <div style={pageIndex > 0 && blockIndex === 0 && !isContinued
                                            ? { marginTop: 16 }
                                            : undefined}
                                        >
                                            {liveElement}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </A4Page>
                    ))
                )}
            </div>

            {/*
             * PHANTOM CONTAINER
             * ─────────────────
             * Must be a SIBLING of the zoom wrapper (not a child) so that
             * getBoundingClientRect() is never affected by the parent's CSS zoom.
             * Uses position:fixed + off-screen coordinates to stay out of layout flow
             * and not cause scroll side-effects.
             */}
            <div
                ref={phantomRef}
                style={{
                    position: "fixed",
                    top: -99999,
                    left: -99999,
                    width: "170mm",       // 210mm – 2×20mm side padding
                    padding: 0,
                    margin: 0,
                    visibility: "hidden",
                    pointerEvents: "none",
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: deferredTemplate.theme?.fontFamily || "Inter, Arial, sans-serif",
                    fontSize: deferredTemplate.theme?.fontSize?.body
                        ? `${deferredTemplate.theme.fontSize.body}pt`
                        : "10pt",
                }}
            >
                {deferredTemplate.renderBlocks
                    ? deferredTemplate.renderBlocks(deferredResume)
                    : null}
            </div>
        </>
    );
};
