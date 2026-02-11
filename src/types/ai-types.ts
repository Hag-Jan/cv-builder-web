export interface AIImproveRequest {
    text: string;
    jobDescription: string;
    missingKeywords: string[];
}

export interface AIImproveResponse {
    suggestions: string[];
    remainingCalls: number;
}

export interface UserUsage {
    uid: string;
    aiCallsUsed: number;
    lastUpdated: string; // ISO date
}
