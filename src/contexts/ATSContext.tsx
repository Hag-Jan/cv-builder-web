"use client";

import React, { createContext, useContext, useState } from "react";
import { ATSAnalysisResponse } from "@/types/ats-types";

interface ATSContextType {
    atsResult: ATSAnalysisResponse | null;
    jobDescription: string;
    setATSResult: (result: ATSAnalysisResponse | null) => void;
    setJobDescription: (description: string) => void;
}

const ATSContext = createContext<ATSContextType | null>(null);

export const useATS = () => {
    const context = useContext(ATSContext);
    if (!context) throw new Error("useATS must be used within an ATSProvider");
    return context;
};

export const ATSProvider = ({ children }: { children: React.ReactNode }) => {
    const [atsResult, setATSResult] = useState<ATSAnalysisResponse | null>(null);
    const [jobDescription, setJobDescription] = useState<string>("");

    return (
        <ATSContext.Provider value={{ atsResult, jobDescription, setATSResult, setJobDescription }}>
            {children}
        </ATSContext.Provider>
    );
};
