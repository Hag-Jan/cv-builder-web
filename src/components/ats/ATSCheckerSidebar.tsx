"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ResumeV2 } from "@/types/resume-schema-v2";
import type { ATSAnalysisResponse } from "@/types/ats-types";
import { ATSScoreDisplay } from "./ATSScoreDisplay";
import { KeywordBadges } from "./KeywordBadges";
import { X, Loader2, AlertCircle, Zap, TrendingUp, Target, Sparkles, BrainCircuit } from "lucide-react";
import { useATS } from "@/contexts/ATSContext";
import { analyzeJobMatch, MatchAnalysis } from "@/lib/ai/actions";

interface ATSCheckerSidebarProps {
    resume: ResumeV2;
    onClose: () => void;
}

export function ATSCheckerSidebar({ resume, onClose }: ATSCheckerSidebarProps) {
    const { setATSResult, setJobDescription: setContextJobDescription } = useATS();
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ATSAnalysisResponse | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<MatchAnalysis | null>(null);
    const [isDeepScanning, setIsDeepScanning] = useState(false);
    const [animatedScore, setAnimatedScore] = useState(0);
    const prevScoreRef = useRef(0);

    // Animate score counter
    useEffect(() => {
        if (!result && !aiAnalysis) return;
        const target = aiAnalysis ? aiAnalysis.score : (result?.score || 0);
        const start = prevScoreRef.current;
        const duration = 800;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(start + (target - start) * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        prevScoreRef.current = target;
    }, [result?.score, aiAnalysis?.score]);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            setError("Please enter a job description");
            return;
        }

        setLoading(true);
        setError(null);
        setAiAnalysis(null);

        try {
            // 1. Semantic Deep Scan (AI)
            setIsDeepScanning(true);
            const aiData = await analyzeJobMatch(resume, jobDescription);
            setAiAnalysis(aiData);
            setIsDeepScanning(false);

            // 2. Keyword/Deterministic Check
            const response = await fetch("/api/ats-checker", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume, jobDescription }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Analysis failed");
            }

            const data: ATSAnalysisResponse = await response.json();
            setResult(data);
            setATSResult(data);
            setContextJobDescription(jobDescription);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to analyze resume");
        } finally {
            setLoading(false);
            setIsDeepScanning(false);
        }
    };

    const fixTypeIcons: Record<string, React.ReactNode> = {
        missing_keyword: <Target className="w-4 h-4 text-red-500" />,
        no_metric: <TrendingUp className="w-4 h-4 text-amber-500" />,
        weak_verb: <Zap className="w-4 h-4 text-orange-500" />,
    };

    const fixTypeBg: Record<string, string> = {
        missing_keyword: "bg-red-50 border-red-200",
        no_metric: "bg-amber-50 border-amber-200",
        weak_verb: "bg-orange-50 border-orange-200",
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="fixed right-0 top-0 h-full w-[420px] bg-white border-l shadow-2xl z-[70] overflow-y-auto transform transition-transform duration-300 ease-in-out">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-bold">AI ATS Optimizer</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Paste Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            placeholder="Paste the full job description here..."
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !jobDescription.trim()}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-all flex items-center justify-center gap-2 shadow-md uppercase tracking-wide text-xs h-12"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {isDeepScanning ? "AI Deep Scan..." : "Analyzing..."}
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Analyze with AI
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800 font-medium">{error}</p>
                        </div>
                    )}

                    {(aiAnalysis || result) && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="py-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                <ATSScoreDisplay score={animatedScore} />
                                <p className="text-center text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">
                                    {aiAnalysis ? "Semantic AI Match Score" : "Keyword Alignment Score"}
                                </p>
                            </div>

                            {aiAnalysis && (
                                <div className="space-y-4">
                                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                                        <h3 className="text-xs font-bold text-purple-800 flex items-center gap-2 uppercase tracking-wider mb-3">
                                            <Sparkles className="w-4 h-4" />
                                            AI Recommendations
                                        </h3>
                                        <ul className="space-y-2">
                                            {aiAnalysis.recommendations.map((rec, i) => (
                                                <li key={i} className="text-xs text-purple-900 border-l-2 border-purple-300 pl-3 py-1 font-medium">
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold mb-3 text-red-700 uppercase tracking-wider">
                                            Missing Keywords ({aiAnalysis.missingKeywords.length})
                                        </h3>
                                        <KeywordBadges keywords={aiAnalysis.missingKeywords} variant="missing" />
                                    </div>
                                </div>
                            )}

                            {result && !aiAnalysis && (
                                <div className="space-y-4">
                                    {result.missingKeywords.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold mb-3 text-red-700 uppercase tracking-wider">
                                                Missing Keywords ({result.missingKeywords.length})
                                            </h3>
                                            <KeywordBadges keywords={result.missingKeywords} variant="missing" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {result?.topImpactFixes && result.topImpactFixes.length > 0 && (
                                <div className="space-y-3 border-t pt-4">
                                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                                        <Zap className="w-4 h-4 text-amber-500" />
                                        Quick Fixes
                                    </h3>
                                    {result.topImpactFixes.map((fix, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border text-[11px] font-medium ${fixTypeBg[fix.type] || "bg-gray-50"}`}
                                        >
                                            <div className="flex items-start gap-2">
                                                {fixTypeIcons[fix.type]}
                                                <span>{fix.description}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors text-[10px] uppercase tracking-widest"
                            >
                                Re-analyze
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
