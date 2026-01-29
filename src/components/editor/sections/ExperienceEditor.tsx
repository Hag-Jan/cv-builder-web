"use client";

import { useResume } from "@/contexts/ResumeContext";
import { ExperienceSection, ExperienceItem } from "@/types/resume-schema-v1";
import { LexicalRichText } from "../LexicalRichText";
import { v4 as uuidv4 } from "uuid";

export function ExperienceEditor({ section }: { section: ExperienceSection }) {
    const { updateSection } = useResume();

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
                    </div>
                </div>
            ))}
        </div>
    );
}
