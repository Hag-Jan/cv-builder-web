"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react";
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
    updateSection: (sectionId: string, updater: ResumeSectionV2 | ((prev: ResumeSectionV2) => ResumeSectionV2)) => void;
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
    /**
     * resumeRef provides a synchronous, up-to-date look at the resume state.
     * This is CRITICAL for asynchronous operations like saveResume, where
     * the standard 'resume' state from a closure might be stale.
     */
    const resumeRef = useRef<ResumeV2 | null>(null);
    const [loading, setLoading] = useState(true);

    /**
     * lastUpdateRef tracks the timestamp of the most recent LOCAL modification.
     * We use this to prevent asynchronous Firestore saves from rehydrating 
     * the UI with old data if the user has typed something newer while 
     * the network request was in flight.
     */
    const lastUpdateRef = useRef<number>(0);

    const setResume = useCallback((updater: ResumeV2 | null | ((prev: ResumeV2 | null) => ResumeV2 | null)) => {
        const next = typeof updater === "function" ? updater(resumeRef.current) : updater;
        resumeRef.current = next;
        setResumeState(next);
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
    }, [user, setResume]);

    const updateSection = useCallback((sectionId: string, updater: ResumeSectionV2 | ((prev: ResumeSectionV2) => ResumeSectionV2)) => {
        const now = Date.now();
        lastUpdateRef.current = now;

        setResume((prev) => {
            if (!prev) return null;
            const newSections = prev.sections.map((s) => {
                if (s.id !== sectionId) return s;
                const next = typeof updater === "function" ? updater(s) : updater;
                return next;
            });
            return {
                ...prev,
                sections: newSections,
                metadata: { ...prev.metadata, updatedAt: new Date(now).toISOString() }
            };
        });
    }, [setResume]);

    const addSection = useCallback((type: ResumeSectionV2["type"]) => {
        setResume((prev) => {
            if (!prev) return null;
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
    }, [setResume]);

    const removeSection = useCallback((id: string) => {
        setResume((prev) => {
            if (!prev) return null;
            return { ...prev, sections: prev.sections.filter(s => s.id !== id) };
        });
    }, [setResume]);

    const saveResume = useCallback(async () => {
        const currentResume = resumeRef.current;
        if (!currentResume || !user) return;

        const startTime = Date.now();
        const toSave: ResumeV2 = {
            ...currentResume,
            metadata: { ...currentResume.metadata, updatedAt: new Date(startTime).toISOString() }
        };

        // 1. Fallback to LocalStorage immediately
        try {
            localStorage.setItem(`resume_backup_${user.uid}`, JSON.stringify(toSave));
        } catch (e) {
            console.warn("LocalStorage save failed:", e);
        }

        // 2. Sanitize to remove undefined values for Firestore and apply data-quality rules on save
        const rawToSave = JSON.parse(JSON.stringify(toSave));

        // Deep sanitization of specific fields on save only (trims and cleans data)
        const sanitized = {
            ...rawToSave,
            sections: rawToSave.sections.map((section: any) => {
                if (section.type === 'contact') {
                    return {
                        ...section,
                        email: section.email?.trim(),
                        phone: section.phone?.trim(),
                        linkedin: section.linkedin?.trim(),
                        github: section.github?.trim(),
                        website: section.website?.trim()
                    };
                }
                if (section.type === 'summary') {
                    return { ...section, content: section.content?.trim() };
                }
                if (section.type === 'experience' || section.type === 'education' || section.type === 'projects') {
                    return {
                        ...section,
                        items: section.items?.map((item: any) => {
                            const newItem = { ...item };
                            if (newItem.company) newItem.company = newItem.company.trim();
                            if (newItem.school) newItem.school = newItem.school.trim();
                            if (newItem.role) newItem.role = newItem.role.trim();
                            if (newItem.degree) newItem.degree = newItem.degree.trim();
                            if (newItem.name) newItem.name = newItem.name.trim(); // for projects
                            if (newItem.startDate) newItem.startDate = newItem.startDate.trim();
                            if (newItem.endDate) newItem.endDate = newItem.endDate.trim();
                            if (newItem.date) newItem.date = newItem.date.trim(); // for education
                            return newItem;
                        })
                    };
                }
                return section;
            })
        };

        try {
            await setDoc(doc(db, "resumes", user.uid), sanitized);
            console.log("Resume saved successfully (v2 with sanitization)");

            // Only update local state if no newer local changes happened during the save.
            if (lastUpdateRef.current <= startTime) {
                setResume(prev => {
                    if (!prev) return prev;
                    return { ...prev, metadata: toSave.metadata };
                });
            } else if (process.env.NODE_ENV === "development") {
                console.warn("[ResumeContext] Prevented DB rehydration: newer local changes detected.");
            }
        } catch (error) {
            console.error("Error saving resume:", error);
            throw error;
        }
    }, [user, setResume]);

    const updateTemplate = useCallback((templateId: string) => {
        setResume((prev) => {
            if (!prev) return null;
            return { ...prev, templateId };
        });
    }, [setResume]);

    // Restore Backup on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const backupKey = user ? `resume_backup_${user.uid}` : 'resume_backup_anon';
        const backup = localStorage.getItem(backupKey);

        if (backup && !resumeRef.current) {
            try {
                const parsed = JSON.parse(backup);
                console.log("Restored resume from local backup");
                setResume(parsed);
                setLoading(false);
            } catch (e) {
                console.error("Failed to parse local backup:", e);
            }
        }
    }, [user, setResume]);

    const contextValue = useMemo(() => ({
        resume,
        loading,
        updateSection,
        addSection,
        removeSection,
        saveResume,
        updateTemplate
    }), [resume, loading, updateSection, addSection, removeSection, saveResume, updateTemplate]);

    return (
        <ResumeContext.Provider value={contextValue}>
            {children}
        </ResumeContext.Provider>
    );
};
