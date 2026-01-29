"use client";

import { useResume } from "@/contexts/ResumeContext";
import { EducationSection, EducationItem } from "@/types/resume-schema-v1";
import { v4 as uuidv4 } from "uuid";

export function EducationEditor({ section }: { section: EducationSection }) {
    const { updateSection } = useResume();

    const handleAddItem = () => {
        const newItem: EducationItem = {
            id: uuidv4(),
            school: "",
            degree: "",
            date: "",
        };
        updateSection({
            ...section,
            items: [...section.items, newItem],
        });
    };

    const updateItem = (itemId: string, updates: Partial<EducationItem>) => {
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
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold">Education</h3>
                <button onClick={handleAddItem} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
                    + Add Education
                </button>
            </div>

            {section.items.length === 0 && (
                <p className="text-gray-500 text-sm">No education added yet.</p>
            )}

            {section.items.map((item) => (
                <div key={item.id} className="border p-4 rounded bg-white shadow-sm space-y-4">
                    <div className="flex justify-between">
                        <h4 className="font-medium text-gray-700">School Details</h4>
                        <button onClick={() => removeItem(item.id)} className="text-red-500 text-xs hover:underline">Remove</button>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500">School / University</label>
                            <input
                                value={item.school}
                                onChange={(e) => updateItem(item.id, { school: e.target.value })}
                                className="w-full border p-2 rounded text-sm"
                                placeholder="University of Examples"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Degree / Major</label>
                            <input
                                value={item.degree}
                                onChange={(e) => updateItem(item.id, { degree: e.target.value })}
                                className="w-full border p-2 rounded text-sm"
                                placeholder="Bachelor of Science in Computer Science"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Date / Graduation</label>
                            <input
                                type="text"
                                value={item.date}
                                onChange={(e) => updateItem(item.id, { date: e.target.value })}
                                className="w-full border p-2 rounded text-sm"
                                placeholder="May 2024"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
