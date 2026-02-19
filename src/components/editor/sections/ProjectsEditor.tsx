"use client";

import { useResume } from "@/contexts/ResumeContext";
import { useATS } from "@/contexts/ATSContext";
import { useAuth } from "@/contexts/AuthContext";
import type { ProjectsSectionV2, ProjectItemV2 } from "@/types/resume-schema-v2";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, FolderGit2, Link as LinkIcon, Code2, ListTodo, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AISuggestionsPopover } from "@/components/ai/AISuggestionsPopover";

const LexicalRichText = dynamic(() => import("../LexicalRichText").then((mod) => mod.LexicalRichText), {
    ssr: false,
    loading: () => <div className="h-[100px] border rounded bg-gray-50 flex items-center justify-center text-gray-400">Loading editor...</div>
});

export function ProjectsEditor({ section }: { section: ProjectsSectionV2 }) {
    const { updateSection } = useResume();
    const { atsResult, jobDescription } = useATS();
    const { user } = useAuth();
    const [showAIPopover, setShowAIPopover] = useState<{ itemId: string; bulletIndex: number } | null>(null);

    const handleAddItem = () => {
        const newItem: ProjectItemV2 = {
            id: uuidv4(),
            name: "",
            description: "",
            link: "",
            techStack: [],
            bullets: [],
        };
        updateSection({
            ...section,
            items: [...section.items, newItem],
        });
    };

    const updateItem = (itemId: string, updates: Partial<ProjectItemV2>) => {
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
        const item = section.items.find((i) => i.id === itemId);
        if (!item) return;

        const newBullets = [...(item.bullets || [])];
        newBullets[bulletIndex] = suggestion;
        updateItem(itemId, { bullets: newBullets });
        setShowAIPopover(null);
    };

    const hasATSResults = atsResult && atsResult.missingKeywords.length > 0 && jobDescription;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b dark:border-gray-800 pb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Projects</h3>
                <button
                    onClick={handleAddItem}
                    className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Add Project
                </button>
            </div>

            {section.items.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <FolderGit2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm font-medium">No projects added yet</p>
                    <button onClick={handleAddItem} className="mt-2 text-blue-600 text-sm hover:underline font-medium">Add your first project</button>
                </div>
            )}

            <div className="space-y-4">
                {section.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900/50 shadow-sm overflow-hidden group">
                        <div className="bg-gray-50/50 dark:bg-gray-800/50 px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Details</span>
                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">Project Name</label>
                                    <Input
                                        value={item.name}
                                        onChange={(e) => updateItem(item.id, { name: e.target.value })}
                                        placeholder="E-commerce Platform"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight flex items-center gap-1">
                                        <LinkIcon size={10} /> Project Link
                                    </label>
                                    <Input
                                        value={item.link || ""}
                                        onChange={(e) => updateItem(item.id, { link: e.target.value })}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight flex items-center gap-1">
                                        <Code2 size={10} /> Tech Stack (comma separated)
                                    </label>
                                    <Input
                                        value={item.techStack?.join(", ") || ""}
                                        onChange={(e) => updateItem(item.id, { techStack: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                                        placeholder="Next.js, Tailwind, TypeScript"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight flex items-center gap-1">
                                    <ListTodo size={10} /> Key Accomplishments
                                </label>
                                <LexicalRichText
                                    initialValue={item.bullets || []}
                                    onChange={(bullets) => updateItem(item.id, { bullets })}
                                    placeholder="• Built a custom..."
                                />

                                {hasATSResults && item.bullets && item.bullets.length > 0 && (
                                    <div className="mt-3 space-y-2 bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-md border border-purple-100 dark:border-purple-900/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles size={14} className="text-purple-600 dark:text-purple-400" />
                                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">AI Suggestions</p>
                                        </div>
                                        {item.bullets.map((bullet, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded border border-purple-100 dark:border-purple-900/20">
                                                <span className="text-[11px] text-gray-600 dark:text-gray-400 flex-1 line-clamp-1 italic">{bullet}</span>
                                                <button
                                                    onClick={() => setShowAIPopover({ itemId: item.id, bulletIndex: index })}
                                                    className="flex items-center gap-1 bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase hover:bg-purple-700 transition-all"
                                                >
                                                    <Sparkles className="w-2.5 h-2.5" />
                                                    Improve
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAIPopover && user && hasATSResults && (
                <AISuggestionsPopover
                    originalText={section.items.find(i => i.id === showAIPopover.itemId)?.bullets?.[showAIPopover.bulletIndex] || ""}
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
