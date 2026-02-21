"use client";

import { useResume } from "@/contexts/ResumeContext";
import { useATS } from "@/contexts/ATSContext";
import { useAuth } from "@/contexts/AuthContext";
import type { ExperienceSectionV2, ExperienceItemV2 } from "@/types/resume-schema-v2";
import dynamic from "next/dynamic";
import { AISuggestionsPopover } from "@/components/ai/AISuggestionsPopover";
import { v4 as uuidv4 } from "uuid";
import { Sparkles, Loader2, Plus, Trash2, MapPin, Calendar, Briefcase } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { Input } from "@/components/ui/Input";
import { SafeLocalDebouncedInput } from "@/components/ui/SafeLocalDebouncedInput";
import { MonthYearPicker } from "../inputs/MonthYearPicker";

const LexicalRichText = dynamic(() => import("../LexicalRichText").then((mod) => mod.LexicalRichText), {
    ssr: false,
    loading: () => <div className="h-[100px] border rounded bg-gray-50 flex items-center justify-center text-gray-400">Loading editor...</div>
});

export function ExperienceEditor({ section }: { section: ExperienceSectionV2 }) {
    const { resume, updateSection } = useResume();
    const { atsResult, jobDescription } = useATS();
    const { user } = useAuth();
    const [showAIPopover, setShowAIPopover] = useState<{ itemId: string; bulletIndex: number } | null>(null);
    const [improvingBulletId, setImprovingBulletId] = useState<string | null>(null);
    const [aiInfo, setAiInfo] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    const handleAddItem = () => {
        const newItem: ExperienceItemV2 = {
            id: uuidv4(),
            company: "",
            role: "",
            location: "",
            startDate: "",
            bullets: [],
        };
        updateSection(section.id, (prev) => {
            const casted = prev as ExperienceSectionV2;
            return {
                ...casted,
                items: [...casted.items, newItem],
            };
        });
    };

    const updateItem = useCallback((itemId: string, updates: Partial<ExperienceItemV2>) => {
        updateSection(section.id, (prev) => {
            const casted = prev as ExperienceSectionV2;
            const item = casted.items.find(i => i.id === itemId);
            if (!item) return prev;

            // Check if actual change happened
            const hasChange = Object.keys(updates).some(key => (item as any)[key] !== (updates as any)[key]);
            if (!hasChange) return prev;

            const newItems = casted.items.map((it) =>
                it.id === itemId ? { ...it, ...updates } : it
            );
            return { ...casted, items: newItems };
        });
    }, [section.id, updateSection]);

    const removeItem = (itemId: string) => {
        updateSection(section.id, (prev) => {
            const casted = prev as ExperienceSectionV2;
            const newItems = casted.items.filter((item) => item.id !== itemId);
            return { ...casted, items: newItems };
        });
    };

    const handleApplySuggestion = (itemId: string, bulletIndex: number, suggestion: string) => {
        const item = section.items.find(i => i.id === itemId);
        if (!item) return;

        const newBullets = [...item.bullets];
        newBullets[bulletIndex] = suggestion;
        updateItem(itemId, { bullets: newBullets });
        setShowAIPopover(null);
    };

    const handleImprove = (itemId: string, bulletIndex: number) => {
        setShowAIPopover({ itemId, bulletIndex });
    };

    const hasATSResults = atsResult && atsResult.missingKeywords.length > 0 && jobDescription;

    return (
        <div className="space-y-6 relative">
            {apiError && (
                <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded shadow-lg z-50 text-sm animate-in fade-in slide-in-from-bottom-2">
                    <p className="font-semibold">AI Improvement Failed</p>
                    <p>{apiError}</p>
                </div>
            )}
            {aiInfo && (
                <div className="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded shadow-lg z-50 text-sm animate-in fade-in slide-in-from-bottom-2">
                    <p className="font-semibold">Service Update</p>
                    <p>{aiInfo}</p>
                </div>
            )}
            <div className="flex justify-between items-center border-b dark:border-gray-800 pb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Experience</h3>
                <button
                    onClick={handleAddItem}
                    className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Add Position
                </button>
            </div>

            {section.items.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm font-medium">No experience added yet</p>
                    <button onClick={handleAddItem} className="mt-2 text-blue-600 text-sm hover:underline font-medium">Add your first role</button>
                </div>
            )}

            <div className="space-y-4">
                {section.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900/50 shadow-sm overflow-hidden group">
                        <div className="bg-gray-50/50 dark:bg-gray-800/50 px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Position Details</span>
                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">
                                        Company <span className="text-red-500">*</span>
                                    </label>
                                    <SafeLocalDebouncedInput
                                        value={item.company}
                                        onChange={(val) => updateItem(item.id, { company: val })}
                                        isInvalid={!item.company.trim()}
                                        placeholder="Google"
                                        label="company"
                                        debounceTime={1500}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <SafeLocalDebouncedInput
                                        value={item.role}
                                        onChange={(val) => updateItem(item.id, { role: val })}
                                        isInvalid={!item.role.trim()}
                                        placeholder="Senior Engineer"
                                        label="role"
                                        debounceTime={1500}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight flex items-center gap-1">
                                        <MapPin size={10} /> Location
                                    </label>
                                    <SafeLocalDebouncedInput
                                        value={item.location || ""}
                                        onChange={(val) => updateItem(item.id, { location: val })}
                                        placeholder="San Francisco, CA"
                                        label="location"
                                        debounceTime={1500}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <MonthYearPicker
                                        label="Start Date"
                                        value={item.startDate}
                                        onChange={(val) => updateItem(item.id, { startDate: val })}
                                    />
                                    <MonthYearPicker
                                        label="End Date"
                                        value={item.endDate || ""}
                                        showPresent
                                        onChange={(val) => updateItem(item.id, { endDate: val })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">Key Achievements & Responsibilities</label>
                                <LexicalRichText
                                    initialValue={item.bullets}
                                    onChange={(bullets) => updateItem(item.id, { bullets })}
                                    placeholder="• Leading a team of..."
                                />

                                {hasATSResults && item.bullets.length > 0 && (
                                    <div className="mt-3 space-y-2 bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-md border border-purple-100 dark:border-purple-900/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles size={14} className="text-purple-600 dark:text-purple-400" />
                                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">AI Suggestions</p>
                                        </div>
                                        {item.bullets.map((bullet, index) => {
                                            const bulletId = `${section.id}:${item.id}:${index}`;
                                            const isImproving = improvingBulletId === bulletId;

                                            return (
                                                <div key={index} className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded border border-purple-100 dark:border-purple-900/20 group/bullet">
                                                    <span className="text-[11px] text-gray-600 dark:text-gray-400 flex-1 line-clamp-1 italic">{bullet}</span>
                                                    <button
                                                        onClick={() => handleImprove(item.id, index)}
                                                        disabled={isImproving}
                                                        className={`flex items-center gap-1 bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${isImproving ? "opacity-75 cursor-not-allowed" : "hover:bg-purple-700"}`}
                                                    >
                                                        {isImproving ? <Loader2 className="w-3 h-3 animate-spin shadow-none" /> : <Sparkles className="w-2.5 h-2.5" />}
                                                        Improve
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Suggestions Popover */}
            {showAIPopover && user && hasATSResults && (
                <AISuggestionsPopover
                    originalText={section.items.find(i => i.id === showAIPopover.itemId)?.bullets[showAIPopover.bulletIndex] || ""}
                    jobDescription={jobDescription}
                    missingKeywords={atsResult.missingKeywords}
                    onApply={(suggestion) => handleApplySuggestion(showAIPopover.itemId, showAIPopover.bulletIndex, suggestion)}
                    onClose={() => setShowAIPopover(null)}
                    userId={user.uid}
                />
            )}
        </div>
    );
}

// ── Experience Editor ────────────────────────────────
