"use client";

import { useResume } from "@/contexts/ResumeContext";
import type { CustomSectionV2 } from "@/types/resume-schema-v2";
import { Plus, Trash2, GripVertical, Type } from "lucide-react";
import { Input } from "@/components/ui/Input";

/**
 * CustomSectionEditor
 * 
 * Handles generic list-based sections (e.g., References, Hobbies, Awards).
 * Allows editing the section title and a list of text strings.
 */
export function CustomSectionEditor({ section }: { section: CustomSectionV2 }) {
    const { updateSection } = useResume();

    const updateTitle = (title: string) => {
        updateSection(section.id, (prev) => ({
            ...(prev as CustomSectionV2),
            title,
        }));
    };

    const updateContentItem = (index: number, value: string) => {
        const newContent = [...section.content];
        newContent[index] = value;
        updateSection(section.id, (prev) => ({
            ...(prev as CustomSectionV2),
            content: newContent,
        }));
    };

    const addContentItem = () => {
        updateSection(section.id, (prev) => ({
            ...(prev as CustomSectionV2),
            content: [...(prev as CustomSectionV2).content, ""],
        }));
    };

    const removeContentItem = (index: number) => {
        const newContent = section.content.filter((_, i) => i !== index);
        updateSection(section.id, (prev) => ({
            ...(prev as CustomSectionV2),
            content: newContent,
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b dark:border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                    <Type className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {section.title || "Custom Section"}
                    </h3>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">
                        Section Title
                    </label>
                    <Input
                        value={section.title}
                        onChange={(e) => updateTitle(e.target.value)}
                        placeholder="e.g. References, Hobbies, Awards"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">
                        Content Items
                    </label>

                    {section.content.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-lg">
                            <p className="text-sm text-gray-400">No items added yet</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        {section.content.map((item, index) => (
                            <div key={index} className="flex gap-2 group">
                                <div className="mt-2 text-gray-300">
                                    <GripVertical size={14} />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        value={item}
                                        onChange={(e) => updateContentItem(index, e.target.value)}
                                        placeholder="Enter details..."
                                    />
                                </div>
                                <button
                                    onClick={() => removeContentItem(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addContentItem}
                        className="w-full flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all text-sm font-medium"
                    >
                        <Plus size={16} />
                        Add Item
                    </button>
                </div>
            </div>
        </div>
    );
}
