"use client";

import { useResume } from "@/contexts/ResumeContext";
import { ContactSection } from "@/types/resume-schema-v1";

export function ContactEditor({ section }: { section: ContactSection }) {
    const { updateSection } = useResume();

    const handleChange = (field: keyof ContactSection, value: string) => {
        updateSection({
            ...section,
            [field]: value,
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>

            <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                    type="text"
                    value={section.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="John Doe"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={section.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="john@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                    type="tel"
                    value={section.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="+1 555 000 0000"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                    type="text"
                    value={section.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="New York, NY"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Portfolio / Website</label>
                <input
                    type="url"
                    value={section.portfolio || ""}
                    onChange={(e) => handleChange("portfolio", e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="https://johndoe.com"
                />
            </div>
        </div>
    );
}
