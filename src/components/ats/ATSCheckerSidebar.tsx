"use client";

import React, { useState } from "react";
import { Resume } from "@/types/resume-schema-v1";
import { ATSAnalysisResponse } from "@/types/ats-types";
import { ATSScoreDisplay } from "./ATSScoreDisplay";
import { KeywordBadges } from "./KeywordBadges";
import { X, Loader2, AlertCircle } from "lucide-react";
import { useATS } from "@/contexts/ATSContext";

interface ATSCheckerSidebarProps {
    resume: Resume;
    onClose: () => void;
}

export function ATSCheckerSidebar({ resume, onClose }: ATSCheckerSidebarProps) {
    const { setATSResult, setJobDescription: setContextJobDescription } = useATS();
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ATSAnalysisResponse | null>(null);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            setError("Please enter a job description");
            return;
        }

        setLoading(true);
        setError(null);

        try {
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
            // Store in context for AI improvement feature
            setATSResult(data);
            setContextJobDescription(jobDescription);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to analyze resume");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
                onClick={onClose}
                aria-label="Close ATS panel"
            />

            {/* Sliding Panel */}
            <div className="fixed right-0 top-0 h-full w-[420px] bg-white border-l shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">ATS Optimizer</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Job Description Input */}
                    <div>
                        <label htmlFor="job-description" className="block text-sm font-semibold mb-2">
                            Paste Job Description
                        </label>
                        <textarea
                            id="job-description"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full h-40 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Paste the full job description here..."
                        />
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !jobDescription.trim()}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            "Analyze Resume"
                        )}
                    </button>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Results */}
                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Score Display */}
                            <div className="py-4">
                                <ATSScoreDisplay score={result.score} />
                                <p className="text-center text-sm text-gray-600 mt-3">
                                    {result.matchedKeywords.length} of {result.matchedKeywords.length + result.missingKeywords.length} keywords matched
                                </p>
                            </div>

                            {/* Matched Keywords */}
                            {result.matchedKeywords.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold mb-3 text-green-800">
                                        ✓ Matched Keywords ({result.matchedKeywords.length})
                                    </h3>
                                    <KeywordBadges keywords={result.matchedKeywords} variant="matched" />
                                </div>
                            )}

                            {/* Missing Keywords */}
                            {result.missingKeywords.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold mb-3 text-red-800">
                                        ✗ Missing Keywords ({result.missingKeywords.length})
                                    </h3>
                                    <KeywordBadges keywords={result.missingKeywords} variant="missing" />
                                    <p className="text-xs text-gray-600 mt-2">
                                        Consider adding these keywords to improve your ATS score
                                    </p>
                                </div>
                            )}

                            {/* Warnings */}
                            {result.warnings.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold mb-3 text-yellow-800">
                                        ⚠ Warnings ({result.warnings.length})
                                    </h3>
                                    <ul className="space-y-2">
                                        {result.warnings.map((warning, index) => (
                                            <li
                                                key={index}
                                                className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900"
                                            >
                                                {warning}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Re-analyze Button */}
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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
