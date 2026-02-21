"use client";

import { useState, useCallback } from "react";
import { useResume } from "@/contexts/ResumeContext";
import type { EducationSectionV2, EducationItemV2 } from "@/types/resume-schema-v2";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, GraduationCap, Calendar, Award, BarChart } from "lucide-react";
import { SafeLocalDebouncedInput } from "@/components/ui/SafeLocalDebouncedInput";
import { MonthYearPicker } from "../inputs/MonthYearPicker";

export function EducationEditor({ section }: { section: EducationSectionV2 }) {
    const { updateSection } = useResume();

    const handleAddItem = () => {
        const newItem: EducationItemV2 = {
            id: uuidv4(),
            school: "",
            degree: "",
            date: "",
            gpa: "",
            honors: "",
        };
        updateSection(section.id, (prev) => {
            const casted = prev as EducationSectionV2;
            return {
                ...casted,
                items: [...casted.items, newItem],
            };
        });
    };

    const updateItem = useCallback((itemId: string, updates: Partial<EducationItemV2>) => {
        updateSection(section.id, (prev) => {
            const casted = prev as EducationSectionV2;
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
            const casted = prev as EducationSectionV2;
            const newItems = casted.items.filter((item) => item.id !== itemId);
            return { ...casted, items: newItems };
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b dark:border-gray-800 pb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Education</h3>
                <button
                    onClick={handleAddItem}
                    className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Add Education
                </button>
            </div>

            {section.items.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm font-medium">No education history added yet</p>
                    <button onClick={handleAddItem} className="mt-2 text-blue-600 text-sm hover:underline font-medium">Add your first degree</button>
                </div>
            )}

            <div className="space-y-4">
                {section.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900/50 shadow-sm overflow-hidden">
                        <div className="bg-gray-50/50 dark:bg-gray-800/50 px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">School Details</span>
                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight mb-1">
                                        School / University <span className="text-red-500">*</span>
                                    </label>
                                    <SafeLocalDebouncedInput
                                        value={item.school}
                                        onChange={(val) => updateItem(item.id, { school: val })}
                                        isInvalid={!item.school.trim()}
                                        placeholder="University of California"
                                        label="school"
                                        debounceTime={1500}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">
                                        Degree <span className="text-red-500">*</span>
                                    </label>
                                    <SafeLocalDebouncedInput
                                        value={item.degree}
                                        onChange={(val) => updateItem(item.id, { degree: val })}
                                        isInvalid={!item.degree.trim()}
                                        placeholder="B.S. Computer Science"
                                        label="degree"
                                        debounceTime={1500}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <MonthYearPicker
                                            label="Graduation Date"
                                            value={item.date}
                                            onChange={(val) => updateItem(item.id, { date: val })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">GPA</label>
                                        <SafeLocalDebouncedInput
                                            type="text"
                                            value={item.gpa || ""}
                                            onChange={(val) => updateItem(item.id, { gpa: val })}
                                            placeholder="3.8/4.0"
                                            label="gpa"
                                            debounceTime={1500}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">Honors/Awards</label>
                                        <SafeLocalDebouncedInput
                                            value={item.honors || ""}
                                            onChange={(val) => updateItem(item.id, { honors: val })}
                                            placeholder="Dean's List, Cum Laude"
                                            label="honors"
                                            debounceTime={1500}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
