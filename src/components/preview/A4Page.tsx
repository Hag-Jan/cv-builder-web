import React from "react";

interface A4PageProps {
    children: React.ReactNode;
    /** true = Continuous scroll mode (no fixed height, no page clipping) */
    isContinuous?: boolean;
}

/**
 * A4Page — one physical sheet of A4 paper in the preview.
 *
 * PAGINATED mode  (isContinuous=false — the default):
 *   • Fixed 210mm × 297mm, overflow hidden, shadow.
 *   • mb-8 provides the visible gray gap BETWEEN pages.
 *   • Padding 20mm on all sides keeps content inside the printable area.
 *
 * CONTINUOUS mode (isContinuous=true):
 *   • No fixed height — content scrolls as one long document.
 *   • minHeight 297mm so the first page still looks like a page.
 *   • No mb-8 or clip — content flows naturally.
 *
 * Scaling: CSS `zoom` is applied by the PARENT container (PaginatedPreview),
 * which means the entire stack — pages + mb-8 gaps — scales together.
 * No transform:scale is used here, avoiding the classic "gap collapses" bug.
 */
export const A4Page: React.FC<A4PageProps> = ({ children, isContinuous = false }) => {
    return (
        <div
            style={{
                /* ── Page frame ──────────────────────────────────────── */
                width: "210mm",
                boxSizing: "border-box",
                backgroundColor: "#fff",
                position: "relative",
                flexShrink: 0,        // prevent flex parent from squashing the page
                display: "flex",
                flexDirection: "column",

                /* Paginated: fixed A4 height, clip content that overflows */
                ...(isContinuous
                    ? { minHeight: "297mm", overflow: "visible" }
                    : {
                        height: "297mm",
                        overflow: "hidden",
                        /* Shadow + outline give the "paper" appearance */
                        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10), 0 1px 4px 0 rgba(0,0,0,0.06)",
                        borderRadius: "2px",
                        outline: "1px solid rgba(0,0,0,0.06)",
                        /* Gap between pages — scales with parent zoom ✓ */
                        marginBottom: "32px",
                    }),

                /* ── Printable-area padding (mirrors PDF margins) ─────── */
                padding: "20mm",
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
};
