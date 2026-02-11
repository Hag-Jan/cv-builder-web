import { Resume } from "./resume-schema-v1";

export interface ATSAnalysisRequest {
    resume: Resume;
    jobDescription: string;
}

export interface ATSAnalysisResponse {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    warnings: string[];
}
