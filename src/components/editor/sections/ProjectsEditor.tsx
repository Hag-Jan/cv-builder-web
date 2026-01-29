"use client";

import { useResume } from "@/contexts/ResumeContext";
import { ProjectsSection, ProjectItem } from "@/types/resume-schema-v1";
import { v4 as uuidv4 } from "uuid";

export function ProjectsEditor({ section }: { section: ProjectsSection }) {
    const { updateSection } = useResume();

    const handleAddItem = () => {
        const newItem: ProjectItem = {
            id: uuidv4(),
            name: "",
            description: "",
            link: "",
        };
        updateSection({
            ...section,
            items: [...section.items, newItem],
        });
    };

    const updateItem = (itemId: string, updates: Partial<ProjectItem>) => {
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
                <h3 className="text-lg font-semibold">Projects</h3>
                <button
                    onClick={handleAddItem}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
                >
                    + Add Project
                </button>
            </div>

            {section.items.length === 0 && (
                <p className="text-gray-500 text-sm italic text-center py-4">No projects added yet.</p>
            )}

            <div className="space-y-4">
                {section.items.map((item) => (
                    <div key={item.id} className="border p-4 rounded bg-white shadow-sm space-y-4 group transition-all hover:border-blue-200">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-700">Project Details</h4>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 text-xs hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Project Name</label>
                                <input
                                    value={item.name}
                                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                                    className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Portfolio Website"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Link (Optional)</label>
                                <input
                                    value={item.link || ""}
                                    onChange={(e) => updateItem(item.id, { link: e.target.value })}
                                    className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                <textarea
                                    value={item.description || ""}
                                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                    className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none min-h-[80px] resize-y"
                                    placeholder="Briefly describe what you built and the technologies used..."
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
