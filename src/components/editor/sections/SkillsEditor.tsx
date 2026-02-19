"use client";

import { useResume } from "@/contexts/ResumeContext";
import { sanitizeSkill } from "@/lib/utils/date-formatter";
import type { SkillsSectionV2, SkillCategoryV2 } from "@/types/resume-schema-v2";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, Zap, Layers } from "lucide-react";

const LexicalRichText = dynamic(() => import("../LexicalRichText").then((mod) => mod.LexicalRichText), {
    ssr: false,
    loading: () => <div className="h-[100px] border rounded bg-gray-50 flex items-center justify-center text-gray-400">Loading editor...</div>
});

export function SkillsEditor({ section }: { section: SkillsSectionV2 }) {
    const { updateSection } = useResume();

    const handleAddCategory = () => {
        const newCategory: SkillCategoryV2 = {
            id: uuidv4(),
            label: "",
            skills: [],
        };
        updateSection({
            ...section,
            categories: [...section.categories, newCategory],
        });
    };

    const updateCategory = (catId: string, updates: Partial<SkillCategoryV2>) => {
        const newCats = section.categories.map((cat) =>
            cat.id === catId ? { ...cat, ...updates } : cat
        );
        updateSection({ ...section, categories: newCats });
    };

    const removeCategory = (catId: string) => {
        const newCats = section.categories.filter((cat) => cat.id !== catId);
        updateSection({ ...section, categories: newCats });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                <button
                    onClick={handleAddCategory}
                    className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            {section.categories.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm font-medium">No skill categories added yet</p>
                    <button onClick={handleAddCategory} className="mt-2 text-blue-600 text-sm hover:underline font-medium">Add your first skill group</button>
                </div>
            )}

            <div className="space-y-4">
                {section.categories.map((cat) => (
                    <div key={cat.id} className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                        <div className="bg-gray-50/50 px-4 py-2 border-b border-gray-100 flex justify-between items-center gap-4">
                            <div className="flex items-center gap-2 flex-1">
                                <Layers size={14} className="text-gray-400" />
                                <input
                                    value={cat.label}
                                    onChange={(e) => updateCategory(cat.id, { label: e.target.value })}
                                    className="bg-transparent font-semibold text-sm text-gray-700 focus:outline-none w-full placeholder:text-gray-300 border-b border-transparent focus:border-blue-500 py-0.5"
                                    placeholder="Category Name (e.g. Languages)"
                                />
                            </div>
                            <button onClick={() => removeCategory(cat.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="p-4">
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-tight mb-2">Skills (One per line)</label>
                            <LexicalRichText
                                initialValue={cat.skills}
                                onChange={(skills) =>
                                    updateCategory(cat.id, {
                                        skills: skills
                                            .map(sanitizeSkill)
                                            .filter(Boolean),
                                    })
                                }
                                placeholder="Python&#10;JavaScript&#10;TypeScript"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
