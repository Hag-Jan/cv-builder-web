"use client";

import { useResume } from "@/contexts/ResumeContext";
import { useATS } from "@/contexts/ATSContext";
import { useAuth } from "@/contexts/AuthContext";
import { ExperienceSection, ExperienceItem } from "@/types/resume-schema-v1";
import { LexicalRichText } from "../LexicalRichText";
import { AISuggestionsPopover } from "@/components/ai/AISuggestionsPopover";
import { v4 as uuidv4 } from "uuid";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function ExperienceEditor({ section }: { section: ExperienceSection }) {
    const { updateSection } = useResume();
    const { atsResult, jobDescription } = useATS();
    const { user } = useAuth();
    const [showAIPopover, setShowAIPopover] = useState<{ itemId: string; bulletIndex: number } | null>(null);

    const handleAddItem = () => {
        const newItem: ExperienceItem = {
            id: uuidv4(),
            company: "",
            role: "",
            startDate: "",
            bullets: [],
        };
        updateSection({
            ...section,
            items: [...section.items, newItem],
        });
    };

    const updateItem = (itemId: string, updates: Partial<ExperienceItem>) => {
        const newItems = section.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
        );
        updateSection({ ...section, items: newItems });
    };

    const removeItem = (itemId: string) => {
        const newItems = section.items.filter((item) => item.id !== itemId);
        updateSection({ ...section, items: newItems });
    };

    const handleApplySuggestion = (itemId: string, bulletIndex: number, suggestion: string) => {
        const item = section.items.find(i => i.id === itemId);
        if (!item) return;

        const newBullets = [...item.bullets];
        newBullets[bulletIndex] = suggestion;
        updateItem(itemId, { bullets: newBullets });
    };

    const hasATSResults = atsResult && atsResult.missingKeywords.length > 0 && jobDescription;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold">Experience</h3>
                <button onClick={handleAddItem} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
                    + Add Position
                </button>
            </div>

            {section.items.length === 0 && (
                <p className="text-gray-500 text-sm">No experience added yet.</p>
            )}

            {section.items.map((item) => (
                <div key={item.id} className="border p-4 rounded bg-white shadow-sm space-y-4">
                    <div className="flex justify-between">
                        <h4 className="font-medium text-gray-700">Position Details</h4>
                        <button onClick={() => removeItem(item.id)} className="text-red-500 text-xs hover:underline">Remove</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Company</label>
                            <input
                                value={item.company}
                                onChange={(e) => updateItem(item.id, { company: e.target.value })}
                                className="w-full border p-2 rounded text-sm"
                                placeholder="Google"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Role</label>
                            <input
                                value={item.role}
                                onChange={(e) => updateItem(item.id, { role: e.target.value })}
                                className="w-full border p-2 rounded text-sm"
                                placeholder="Senior Engineer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Start Date</label>
                            <input
                                type="month"
                                value={item.startDate}
                                onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                                className="w-full border p-2 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">End Date</label>
                            <input
                                type="text" // Using text to allow "Present"
                                value={item.endDate || ""}
                                onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                                className="w-full border p-2 rounded text-sm"
                                placeholder="YYYY-MM or Present"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Summary / Bullets (One per line)</label>
                        {/* Key ensures text is reset if item changes (though usually id is stable) */}
                        <LexicalRichText
                            initialValue={item.bullets}
                            onChange={(bullets) => updateItem(item.id, { bullets })}
                            placeholder="• Leading a team of..."
                        />

                        {/* AI Improve Buttons for Each Bullet */}
                        {hasATSResults && item.bullets.length > 0 && (
                            <div className="mt-3 space-y-2">
                                <p className="text-xs font-medium text-gray-600">AI Improve Bullets:</p>
                                {item.bullets.map((bullet, index) => (
                                    <div key={index} className="flex items-start gap-2 bg-purple-50 p-2 rounded">
                                        <span className="text-xs text-gray-600 flex-1 line-clamp-2">{bullet}</span>
                                        <button
                                            onClick={() => setShowAIPopover({ itemId: item.id, bulletIndex: index })}
                                            className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            AI Improve
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}

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
