"use client";

import React, { useEffect, useRef, useState } from "react";
import { useResume } from "@/contexts/ResumeContext";

type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

/**
 * AutosaveIndicator — Isolated component that handles its own debounce logic
 * and status state to prevent unnecessary re-renders of the parent components.
 */
export default function AutosaveIndicator() {
    const { resume, saveResume, lastUpdate } = useResume();
    const [status, setStatus] = useState<SaveStatus>("idle");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevUpdateRef = useRef<number>(0);
    const lastSaveIdRef = useRef<number>(0);

    useEffect(() => {
        if (!resume || lastUpdate === 0) return;

        // Skip if no newer update
        if (lastUpdate <= prevUpdateRef.current) return;

        prevUpdateRef.current = lastUpdate;
        setStatus("unsaved");

        // Clear previous timer
        if (timerRef.current) clearTimeout(timerRef.current);

        // Debounce save
        const saveId = Date.now();
        lastSaveIdRef.current = saveId;

        timerRef.current = setTimeout(async () => {
            setStatus("saving");
            try {
                await saveResume();
                if (lastSaveIdRef.current === saveId) {
                    setStatus("saved");
                    setTimeout(() => {
                        if (lastSaveIdRef.current === saveId) {
                            setStatus("idle");
                        }
                    }, 2000);
                }
            } catch {
                if (lastSaveIdRef.current === saveId) {
                    setStatus("error");
                }
            }
        }, 2000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [resume, saveResume]);

    if (status === "idle") return null;

    const config: Record<SaveStatus, { label: string; color: string; dot: string }> = {
        idle: { label: "", color: "text-transparent", dot: "bg-transparent" },
        unsaved: { label: "Unsaved changes", color: "text-amber-600", dot: "bg-amber-500" },
        saving: { label: "Saving...", color: "text-blue-600", dot: "bg-blue-500 animate-pulse" },
        saved: { label: "Saved", color: "text-green-600", dot: "bg-green-500" },
        error: { label: "Save failed", color: "text-red-600", dot: "bg-red-500" },
    };

    const { label, color, dot } = config[status];

    return (
        <span className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
}
