"use client";

import { useResume } from "@/contexts/ResumeContext";
import type { EducationSectionV2, EducationItemV2 } from "@/types/resume-schema-v2";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, GraduationCap, Calendar, Award, BarChart } from "lucide-react";
import { Input } from "@/components/ui/Input";

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
        updateSection({
            ...section,
            items: [...section.items, newItem],
        });
    };

    const updateItem = (itemId: string, updates: Partial<EducationItemV2>) => {
        const newItems = section.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
        );
        updateSection({ ...section, items: newItems });
    };

    const removeItem = (itemId: string) => {
        const newItems = section.items.filter((item) => item.id !== itemId);
        updateSection({ ...section, items: newItems });
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
                                    <Input
                                        value={item.school}
                                        onChange={(e) => updateItem(item.id, { school: e.target.value })}
                                        isInvalid={!item.school.trim()}
                                        placeholder="University of Examples"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight mb-1">
                                        Degree / Major <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        value={item.degree}
                                        onChange={(e) => updateItem(item.id, { degree: e.target.value })}
                                        isInvalid={!item.degree.trim()}
                                        placeholder="Bachelor of Science in Computer Science"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight flex items-center gap-1 mb-1">
                                            <Calendar size={10} /> Graduation Date
                                        </label>
                                        <Input
                                            type="month"
                                            value={item.date}
                                            onChange={(e) => updateItem(item.id, { date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight flex items-center gap-1 mb-1">
                                            <BarChart size={10} /> GPA
                                        </label>
                                        <Input
                                            type="text"
                                            value={item.gpa || ""}
                                            onChange={(e) => updateItem(item.id, { gpa: e.target.value })}
                                            placeholder="3.8 / 4.0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight flex items-center gap-1 mb-1">
                                            <Award size={10} /> Honors
                                        </label>
                                        <Input
                                            type="text"
                                            value={item.honors || ""}
                                            onChange={(e) => updateItem(item.id, { honors: e.target.value })}
                                            placeholder="Cum Laude"
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
