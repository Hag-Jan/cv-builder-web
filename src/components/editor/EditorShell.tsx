"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useResume } from "@/contexts/ResumeContext";

interface EditorShellProps {
    children: React.ReactNode;
}

type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

/**
 * EditorShell — wraps the editor pane and provides:
 * 1. Auto-save with 2s debounce after resume changes
 * 2. Visual save status indicator
 * 3. Cmd+S keyboard shortcut for immediate save
 */
export default function EditorShell({ children }: EditorShellProps) {
    const { resume, saveResume } = useResume();
    const [status, setStatus] = useState<SaveStatus>("idle");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevResumeRef = useRef<string | null>(null);

    // Detect changes & trigger debounced save
    useEffect(() => {
        if (!resume) return;

        // Skip metadata for comparison to avoid infinite loops from updatedAt
        const { metadata, ...significantResume } = resume;
        const serialized = JSON.stringify(significantResume);

        // Skip initial load
        if (prevResumeRef.current === null) {
            prevResumeRef.current = serialized;
            return;
        }

        // No significant change
        if (serialized === prevResumeRef.current) return;

        prevResumeRef.current = serialized;
        setStatus("unsaved");

        // Clear previous timer
        if (timerRef.current) clearTimeout(timerRef.current);

        // Debounce save
        timerRef.current = setTimeout(async () => {
            setStatus("saving");
            try {
                await saveResume();
                setStatus("saved");
                // Reset to idle after showing "Saved"
                setTimeout(() => setStatus("idle"), 2000);
            } catch {
                setStatus("error");
            }
        }, 2000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [resume, saveResume]);

    // Cmd+S / Ctrl+S shortcut
    const handleKeyDown = useCallback(
        async (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                if (timerRef.current) clearTimeout(timerRef.current);
                setStatus("saving");
                try {
                    await saveResume();
                    setStatus("saved");
                    setTimeout(() => setStatus("idle"), 2000);
                } catch {
                    setStatus("error");
                }
            }
        },
        [saveResume]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="flex flex-col h-full">
            {/* Save status bar */}
            <div className="flex items-center justify-end px-4 py-1.5 border-b border-gray-100 bg-gray-50/50">
                <SaveStatusIndicator status={status} />
            </div>

            {/* Editor content */}
            <div className="flex-1 overflow-y-auto p-6">
                {children}
            </div>
        </div>
    );
}

// ── Save Status Indicator ────────────────────────────────

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
    const config: Record<SaveStatus, { label: string; color: string; dot: string }> = {
        idle: { label: "", color: "text-transparent", dot: "bg-transparent" },
        unsaved: { label: "Unsaved changes", color: "text-amber-600", dot: "bg-amber-500" },
        saving: { label: "Saving...", color: "text-blue-600", dot: "bg-blue-500 animate-pulse" },
        saved: { label: "Saved", color: "text-green-600", dot: "bg-green-500" },
        error: { label: "Save failed", color: "text-red-600", dot: "bg-red-500" },
    };

    const { label, color, dot } = config[status];

    if (status === "idle") return null;

    return (
        <span className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
}
