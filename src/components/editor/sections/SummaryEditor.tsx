"use client";

import { SummarySection } from "@/types/resume-schema-v2";
import { useResume } from "@/contexts/ResumeContext";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { generateAisummary } from "@/lib/ai/actions";
import { Textarea } from "@/components/ui/Textarea";

export function SummaryEditor({ section }: { section: SummarySection }) {
    const { resume, updateSection } = useResume();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!resume) return;
        setIsGenerating(true);
        setError(null);
        try {
            const summary = await generateAisummary(resume);
            updateSection({ ...section, content: summary });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate summary");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center border-b dark:border-gray-800 pb-2">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-tight">Professional Summary</h3>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Highlight your value proposition</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-all shadow-sm font-bold uppercase tracking-wider disabled:opacity-50 active:scale-95 translate-y-[-2px] border-b-2 border-purple-800"
                >
                    {isGenerating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {isGenerating ? "Generating..." : "AI Generate"}
                </button>
            </div>

            <div className="relative group">
                <Textarea
                    value={section.content || ""}
                    onChange={(e) => updateSection({ ...section, content: e.target.value })}
                    className="h-44 p-4 rounded-xl leading-relaxed font-medium"
                    placeholder="Results-driven professional with experience in..."
                />
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold text-gray-300 uppercase">{(section.content || "").length} chars</p>
                </div>
                {error && (
                    <p className="mt-2 text-xs text-red-500 font-semibold flex items-center gap-1 animate-in slide-in-from-top-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        {error}
                    </p>
                )}
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100/50 dark:border-blue-900/20">
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                    <span className="font-bold underline uppercase mr-1">Pro Tip:</span>
                    The AI uses your experience and skills to draft a summary. Review and personalize it for the best results.
                </p>
            </div>
        </div>
    );
}
