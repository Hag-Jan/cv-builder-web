"use client";

import React, { useState } from "react";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { AIImproveResponse } from "@/types/ai-types";

interface AISuggestionsPopoverProps {
    originalText: string;
    jobDescription: string;
    missingKeywords: string[];
    onApply: (suggestion: string) => void;
    onClose: () => void;
    userId: string;
}

export function AISuggestionsPopover({
    originalText,
    jobDescription,
    missingKeywords,
    onApply,
    onClose,
    userId,
}: AISuggestionsPopoverProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [remainingCalls, setRemainingCalls] = useState<number | null>(null);

    // Auto-fetch on mount
    React.useEffect(() => {
        fetchSuggestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/ai/improve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
                body: JSON.stringify({
                    text: originalText,
                    jobDescription,
                    missingKeywords,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate suggestions");
            }

            const data: AIImproveResponse = await response.json();
            setSuggestions(data.suggestions);
            setRemainingCalls(data.remainingCalls);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (suggestion: string) => {
        onApply(suggestion);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={onClose}
            />

            {/* Popover */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] bg-white rounded-lg shadow-2xl border z-50 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            <h3 className="font-semibold text-lg">AI-Improved Suggestions</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors text-sm"
                        >
                            ✕
                        </button>
                    </div>
                    {remainingCalls !== null && (
                        <p className="text-xs text-white/90 mt-1">
                            {remainingCalls} free {remainingCalls === 1 ? "call" : "calls"} remaining
                        </p>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Original Text */}
                    <div className="bg-gray-50 p-3 rounded border">
                        <p className="text-xs font-medium text-gray-500 mb-1">Original:</p>
                        <p className="text-sm text-gray-700">{originalText}</p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Generating AI suggestions...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded p-4">
                            <p className="text-sm text-red-800">{error}</p>
                            <button
                                onClick={fetchSuggestions}
                                className="mt-2 text-xs text-red-600 hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Suggestions */}
                    {!loading && !error && suggestions.length > 0 && (
                        <>
                            <div className="space-y-3">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg p-4 transition-all duration-200 group"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                                                        Option {index + 1}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-800 leading-relaxed">
                                                    {suggestion}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleApply(suggestion)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Regenerate Button */}
                            {remainingCalls !== null && remainingCalls > 0 && (
                                <button
                                    onClick={fetchSuggestions}
                                    disabled={loading}
                                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Regenerate Suggestions
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
