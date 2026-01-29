"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Resume, ResumeSection } from "@/types/resume-schema-v1";
import { useAuth } from "@/contexts/AuthContext";
import { auth, db } from "@/lib/firebase.client";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { v4 as uuidv4 } from "uuid";

interface ResumeContextType {
    resume: Resume | null;
    loading: boolean;
    updateSection: (section: ResumeSection) => void;
    addSection: (type: ResumeSection["type"]) => void;
    removeSection: (id: string) => void;
    saveResume: () => Promise<void>;
    updateTemplate: (templateId: Resume["templateId"]) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) throw new Error("useResume must be used within a ResumeProvider");
    return context;
};

const INITIAL_RESUME: Resume = {
    resumeId: "",
    schemaVersion: "1.0",
    templateId: "classic",
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    sections: [
        { id: "contact", type: "contact", order: 0, name: "", email: "" },
        { id: "edu", type: "education", order: 1, items: [] },
        { id: "exp", type: "experience", order: 2, items: [] },
        { id: "projects", type: "projects", order: 3, items: [] },
        { id: "skills", type: "skills", order: 4, categories: [] },
    ],
};

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);

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
                    setResume(docSnap.data() as Resume);
                } else {
                    const newResume: Resume = {
                        ...INITIAL_RESUME,
                        resumeId: user.uid,
                        sections: INITIAL_RESUME.sections.map(s => ({ ...s }))
                    };
                    setResume(newResume);
                    // Optional: Auto-save initial state?
                }
            } catch (error) {
                console.error("Error loading resume:", error);
            } finally {
                setLoading(false);
            }
        };

        loadResume();
    }, [user]);

    const updateSection = useCallback((updatedSection: ResumeSection) => {
        setResume((prev) => {
            if (!prev) return null;
            const newSections = prev.sections.map((s) =>
                s.id === updatedSection.id ? updatedSection : s
            );
            return { ...prev, sections: newSections };
        });
    }, []);

    const addSection = useCallback((type: ResumeSection["type"]) => {
        setResume((prev) => {
            if (!prev) return null;
            const newSection: ResumeSection = {
                id: uuidv4(),
                type,
                order: prev.sections.length,
                ...(type === "experience" ? { items: [] } : {}),
                ...(type === "education" ? { items: [] } : {}),
                ...(type === "skills" ? { categories: [] } : {}),
                ...(type === "projects" ? { items: [] } : {}),
                ...(type === "custom" ? { title: "New Section", content: [] } : {}),
                ...(type === "contact" ? { name: "", email: "" } : {}), // Should exist only once usually
            } as ResumeSection;

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
        if (!resume || !user) return;
        const toSave: Resume = {
            ...resume,
            metadata: { ...resume.metadata, updatedAt: new Date().toISOString() }
        };

        try {
            await setDoc(doc(db, "resumes", user.uid), toSave);
            setResume(toSave);
            console.log("Resume saved successfully");
        } catch (error) {
            console.error("Error saving resume:", error);
            throw error;
        }
    }, [resume, user]);

    const updateTemplate = useCallback((templateId: Resume["templateId"]) => {
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
