"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useResume } from "@/contexts/ResumeContext";
import AutosaveIndicator from "./AutosaveIndicator";

interface EditorShellProps {
    children: React.ReactNode;
}

/**
 * EditorShell — wraps the editor pane and provides:
 * 1. Visual container for the editor
 * 2. Cmd+S keyboard shortcut for immediate save
 * 3. Status bar with isolated AutosaveIndicator
 */
export default function EditorShell({ children }: EditorShellProps) {
    const { saveResume } = useResume();

    // Cmd+S / Ctrl+S shortcut
    const handleKeyDown = useCallback(
        async (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                // Note: Manual save via Cmd+S won't update the UI status 
                // in this decoupled model unless we add a shared state.
                // For now, we rely on the debounced autosave to pick up the change.
                try {
                    await saveResume();
                } catch {
                    // Handled by indicator eventually or silent for shortcut
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
            <div className="flex items-center justify-end px-4 py-1.5 border-b border-gray-100 bg-gray-50/50 min-h-[30px]">
                <AutosaveIndicator />
            </div>

            {/* Editor content */}
            <div className="flex-1 overflow-y-auto p-6">
                {children}
            </div>
        </div>
    );
}
