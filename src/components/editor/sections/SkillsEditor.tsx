"use client";

import { useResume } from "@/contexts/ResumeContext";
import { SkillsSection, SkillCategory } from "@/types/resume-schema-v1";
import { LexicalRichText } from "../LexicalRichText";
import { v4 as uuidv4 } from "uuid";

export function SkillsEditor({ section }: { section: SkillsSection }) {
    const { updateSection } = useResume();

    const handleAddCategory = () => {
        const newCategory: SkillCategory = {
            id: uuidv4(),
            label: "",
            skills: [],
        };
        updateSection({
            ...section,
            categories: [...section.categories, newCategory],
        });
    };

    const updateCategory = (catId: string, updates: Partial<SkillCategory>) => {
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
                <h3 className="text-lg font-semibold">Skills</h3>
                <button onClick={handleAddCategory} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
                    + Add Category
                </button>
            </div>

            {section.categories.length === 0 && (
                <p className="text-gray-500 text-sm">No skill categories added yet.</p>
            )}

            {section.categories.map((cat) => (
                <div key={cat.id} className="border p-4 rounded bg-white shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <input
                            value={cat.label}
                            onChange={(e) => updateCategory(cat.id, { label: e.target.value })}
                            className="font-medium text-gray-700 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-1/2"
                            placeholder="Category Name (e.g. Languages)"
                        />
                        <button onClick={() => removeCategory(cat.id)} className="text-red-500 text-xs hover:underline">Remove</button>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Skills (One per line)</label>
                        <LexicalRichText
                            initialValue={cat.skills}
                            onChange={(skills) => updateCategory(cat.id, { skills })}
                            placeholder="Python&#10;JavaScript&#10;TypeScript"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
