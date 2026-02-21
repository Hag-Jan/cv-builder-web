import React from "react";

interface A4PageProps {
    children: React.ReactNode;
    isContinuous?: boolean;
    zoom?: number;
}

/**
 * A4Page represents a single physical A4 page in the preview.
 * Dimensions are based on A4 ratio (1:1.414).
 * We use 210mm x 297mm as the standard.
 */
export const A4Page: React.FC<A4PageProps> = ({ children, isContinuous = false, zoom = 1 }) => {
    return (
        <div
            className={`bg-white mx-auto relative flex flex-col ${isContinuous ? "" : "mb-12 shadow-xl rounded-sm ring-1 ring-gray-200"
                }`}
            style={{
                // Mathematical outer boundaries scaled perfectly by zoom
                width: `calc(210mm * ${zoom})`,
                ...(isContinuous
                    ? { minHeight: `calc(297mm * ${zoom})`, overflow: "visible" }
                    : { height: `calc(297mm * ${zoom})`, overflow: "hidden" }),
                boxSizing: "border-box",
                transition: "width 0.2s ease-out, height 0.2s ease-out, minHeight 0.2s ease-out"
            } as React.CSSProperties}
        >
            <div
                className="origin-top-left"
                style={{
                    transform: `scale(${zoom})`,
                    width: "210mm",
                    // PDF-like padding inside the scaled space
                    padding: "20mm",
                    minHeight: isContinuous ? "297mm" : "100%",
                }}
            >
                {children}
            </div>
        </div>
    );
};
