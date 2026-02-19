"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, RefreshCw, Check, X, TrendingUp, Zap, Target } from "lucide-react";
import { getBulletImprovements } from "@/lib/ai/actions";

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

    useEffect(() => {
        fetchSuggestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBulletImprovements(originalText, jobDescription, missingKeywords);
            setSuggestions(data.suggestions);
            setRemainingCalls(data.remainingCalls);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate suggestions");
        } finally {
            setLoading(false);
        }
    };

    const variantIcons = [
        <TrendingUp key="0" className="w-3.5 h-3.5 text-blue-500" />,
        <Zap key="1" className="w-3.5 h-3.5 text-amber-500" />,
        <Target key="2" className="w-3.5 h-3.5 text-green-500" />
    ];

    const variantLabels = ["Metric Focused", "Action Focused", "Skill Focused"];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="text-lg font-bold tracking-tight">AI Bullet Optimizer</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Original Context */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Original Draft</p>
                        <p className="text-xs text-slate-600 leading-relaxed">&quot;{originalText}&quot;</p>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="py-12 flex flex-col items-center justify-center space-y-3">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter animate-pulse">Engineering STAR variants...</p>
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                                <p className="text-sm text-red-600 font-medium mb-3">{error}</p>
                                <button onClick={fetchSuggestions} className="text-xs font-bold text-red-700 underline uppercase tracking-widest">Try Again</button>
                            </div>
                        ) : (
                            suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => onApply(suggestion)}
                                    className="group w-full text-left p-4 border border-slate-200 hover:border-blue-500 rounded-xl transition-all hover:bg-blue-50/30 hover:shadow-sm active:scale-[0.99] flex gap-3"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest">
                                            {variantIcons[index]}
                                            <span className="text-slate-400">{variantLabels[index]}</span>
                                        </div>
                                        <p className="text-sm text-slate-800 font-medium leading-relaxed">
                                            {suggestion}
                                        </p>
                                    </div>
                                    <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 p-1.5 rounded-full text-white shadow-lg">
                                        <Check className="w-3 h-3" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t flex items-center justify-between">
                    <div className="flex flex-col">
                        <button
                            onClick={fetchSuggestions}
                            disabled={loading || (remainingCalls !== null && remainingCalls <= 0)}
                            className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-30 uppercase tracking-widest"
                        >
                            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                            Regenerate
                        </button>
                        {remainingCalls !== null && (
                            <span className="text-[9px] text-slate-400 font-medium mt-0.5">{remainingCalls} free uses left</span>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
