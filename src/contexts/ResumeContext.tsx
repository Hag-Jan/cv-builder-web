"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase.client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Import Schema v2
import type { ResumeV2, ResumeSectionV2 } from "@/types/resume-schema-v2";
import { migrateV1toV2, isV1Resume } from "@/lib/schema/migrate-v1-to-v2";

interface ResumeContextType {
    resume: ResumeV2 | null;
    loading: boolean;
    updateSection: (section: ResumeSectionV2) => void;
    addSection: (type: ResumeSectionV2["type"]) => void;
    removeSection: (id: string) => void;
    saveResume: () => Promise<void>;
    updateTemplate: (templateId: string) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) throw new Error("useResume must be used within a ResumeProvider");
    return context;
};

const INITIAL_RESUME_V2: ResumeV2 = {
    resumeId: "",
    schemaVersion: "2.0",
    templateId: "classic",
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    sections: [
        { id: "summary", type: "summary", order: 0, content: "" },
        { id: "contact", type: "contact", order: 1, name: "", email: "" },
        { id: "edu", type: "education", order: 2, items: [] },
        { id: "exp", type: "experience", order: 3, items: [] },
        { id: "projects", type: "projects", order: 4, items: [] },
        { id: "skills", type: "skills", order: 5, categories: [] },
    ],
};

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [resume, setResumeState] = useState<ResumeV2 | null>(null);
    const resumeRef = useRef<ResumeV2 | null>(null);
    const [loading, setLoading] = useState(true);

    const setResume = useCallback((updater: ResumeV2 | null | ((prev: ResumeV2 | null) => ResumeV2 | null)) => {
        setResumeState((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            resumeRef.current = next;
            return next;
        });
    }, []);

    // Load Resume
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const loadResume = async () => {
            try {
                const docRef = doc(db, "resumes", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Handle Migration v1 -> v2
                    if (isV1Resume(data)) {
                        console.log("Migrating resume from v1 to v2...");
                        const migrated = migrateV1toV2(data);
                        setResume(migrated);
                        // Optional: save migrated version immediately? 
                        // For now we'll let the user's first edit save it.
                    } else {
                        setResume(data as ResumeV2);
                    }
                } else {
                    const newResume: ResumeV2 = {
                        ...INITIAL_RESUME_V2,
                        resumeId: user.uid,
                        sections: INITIAL_RESUME_V2.sections.map(s => ({ ...s }))
                    };
                    setResume(newResume);
                }
            } catch (error) {
                console.error("Error loading resume:", error);
            } finally {
                setLoading(false);
            }
        };

        loadResume();
    }, [user]);

    const lastUpdateRef = useRef<number>(0);

    const updateSection = useCallback((updatedSection: ResumeSectionV2) => {
        const now = Date.now();
        lastUpdateRef.current = now;

        setResume((prev) => {
            if (!prev) return null;
            const newSections = prev.sections.map((s) =>
                s.id === updatedSection.id ? updatedSection : s
            );
            return {
                ...prev,
                sections: newSections,
                metadata: { ...prev.metadata, updatedAt: new Date(now).toISOString() }
            };
        });
    }, []);

    const addSection = useCallback((type: ResumeSectionV2["type"]) => {
        setResume((prev) => {
            if (!prev) return null;

            // Calculate next order
            const maxOrder = prev.sections.reduce((max, s) => Math.max(max, s.order), -1);

            const newSection: ResumeSectionV2 = {
                id: uuidv4(),
                type,
                order: maxOrder + 1,
                ...(type === "experience" ? { items: [] } : {}),
                ...(type === "education" ? { items: [] } : {}),
                ...(type === "skills" ? { categories: [] } : {}),
                ...(type === "projects" ? { items: [] } : {}),
                ...(type === "custom" ? { title: "New Section", content: [] } : {}),
                ...(type === "contact" ? { name: "", email: "" } : {}),
                ...(type === "summary" ? { content: "" } : {}),
            } as ResumeSectionV2;

            return { ...prev, sections: [...prev.sections, newSection] };
        });
    }, []);

    const removeSection = useCallback((id: string) => {
        setResume((prev) => {
            if (!prev) return null;
            return { ...prev, sections: prev.sections.filter(s => s.id !== id) };
        });
    }, []);

    const saveResume = useCallback(async () => {
        // We use a functional pattern to get the ABSOLUTE LATEST state
        // to avoid closure staleness during the async save operation.
        const currentResume = resumeRef.current;
        if (!currentResume || !user) return;

        const toSave: ResumeV2 = {
            ...currentResume,
            metadata: { ...currentResume.metadata, updatedAt: new Date().toISOString() }
        };

        // 1. Fallback to LocalStorage immediately
        try {
            localStorage.setItem(`resume_backup_${user.uid}`, JSON.stringify(toSave));
        } catch (e) {
            console.warn("LocalStorage save failed:", e);
        }

        // 2. Sanitize to remove undefined values for Firestore
        const sanitized = JSON.parse(JSON.stringify(toSave));

        try {
            const startTime = Date.now();
            await setDoc(doc(db, "resumes", user.uid), sanitized);
            console.log("Resume saved successfully (v2)");

            // Only update local state if no newer local changes happened during the save
            if (lastUpdateRef.current <= startTime) {
                setResume(prev => {
                    if (!prev) return prev;
                    // Only update metadata to reflect saved state, keep current sections
                    return { ...prev, metadata: toSave.metadata };
                });
            }
        } catch (error) {
            console.error("Error saving resume:", error);
            throw error;
        }
    }, [user]);

    // Load Backup on mount if user not yet loaded or if fresh session
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const backupKey = user ? `resume_backup_${user.uid}` : 'resume_backup_anon';
        const backup = localStorage.getItem(backupKey);

        if (backup && !resume) {
            try {
                const parsed = JSON.parse(backup);
                console.log("Restored resume from local backup");
                setResume(parsed);
                setLoading(false);
            } catch (e) {
                console.error("Failed to parse local backup:", e);
            }
        }
    }, [user, resume]);

    const updateTemplate = useCallback((templateId: string) => {
        setResume((prev) => {
            if (!prev) return null;
            return { ...prev, templateId };
        });
    }, []);

    return (
        <ResumeContext.Provider value={{ resume, loading, updateSection, addSection, removeSection, saveResume, updateTemplate }}>
            {children}
        </ResumeContext.Provider>
    );
};
