"use client";

import React from "react";

interface ZoomControlsProps {
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitToScreen: () => void;
}

/**
 * ZoomControls Component
 * 
 * Toolbar for controlling preview zoom level
 */
export default function ZoomControls({
    zoom,
    onZoomIn,
    onZoomOut,
    onFitToScreen,
}: ZoomControlsProps) {
    return (
        <div className="flex items-center gap-2 mb-4 justify-center bg-background p-1 rounded-xl border border-border shadow-sm w-fit mx-auto">
            <button
                onClick={onZoomOut}
                disabled={zoom <= 0.5}
                className="p-2 bg-background hover:bg-muted text-foreground rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Zoom Out"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                    />
                    <path
                        fillRule="evenodd"
                        d="M5 8a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            <span className="px-3 text-sm font-semibold text-foreground min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
            </span>

            <button
                onClick={onZoomIn}
                disabled={zoom >= 2}
                className="p-2 bg-background hover:bg-muted text-foreground rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Zoom In"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                    />
                    <path
                        fillRule="evenodd"
                        d="M8 5a1 1 0 011-1h1v1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 110-2h1V6a1 1 0 011-1z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            <div className="w-[1px] h-6 bg-border mx-1" />

            <button
                onClick={onFitToScreen}
                className="px-4 py-2 bg-background hover:bg-muted text-foreground border border-border rounded-lg text-sm font-semibold transition-all shadow-sm"
                title="Fit to Screen"
            >
                Fit to Screen
            </button>
        </div>
    );
}
