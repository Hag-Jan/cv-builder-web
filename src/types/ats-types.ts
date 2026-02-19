import { ResumeV2 } from "./resume-schema-v2";

export interface ATSAnalysisRequest {
    resume: ResumeV2;
    jobDescription: string;
}

export interface BulletAnalysis {
    text: string;
    hasMetric: boolean;
    hasWeakVerb: boolean;
    hasStrongVerb: boolean;
    hasPassiveVoice: boolean;
    weakVerb?: string;
    strongVerb?: string;
}

export interface ScoreDelta {
    metricsBonus: number;
    strongVerbsBonus: number;
    keywordAlignmentScore: number;
    weakVerbsPenalty: number;
    passiveVoicePenalty: number;
}

export interface ImpactFix {
    type: "missing_keyword" | "no_metric" | "weak_verb";
    priority: number;
    description: string;
    bullet?: string;
}

export interface ATSAnalysisResponse {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    warnings: string[];
    bulletAnalysis: BulletAnalysis[];
    scoreDelta: ScoreDelta;
    topImpactFixes: ImpactFix[];
}
