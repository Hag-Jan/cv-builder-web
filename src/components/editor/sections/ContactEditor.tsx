import { useResume } from "@/contexts/ResumeContext";
import type { ContactSectionV2 } from "@/types/resume-schema-v2";
import { isValidEmail, isValidUrl, isValidPhone } from "@/lib/utils/date-formatter";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, AlertCircle } from "lucide-react";

export function ContactEditor({ section }: { section: ContactSectionV2 }) {
    const { updateSection } = useResume();
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (field: keyof ContactSectionV2, value: string) => {
        updateSection({
            ...section,
            [field]: value,
        });
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const errors = {
        name: !section.name.trim() ? "Name is required" : null,
        email: !section.email.trim() ? "Email is required" : !isValidEmail(section.email) ? "Invalid email format" : null,
        phone: section.phone && !isValidPhone(section.phone) ? "Invalid phone number" : null,
        linkedin: section.linkedin && !isValidUrl(section.linkedin) ? "Invalid URL" : null,
        github: section.github && !isValidUrl(section.github) ? "Invalid URL" : null,
        website: section.website && !isValidUrl(section.website) ? "Invalid URL" : null,
    };

    const InputField = ({
        label,
        field,
        type = "text",
        placeholder,
        icon: Icon,
        required = false
    }: {
        label: string,
        field: keyof ContactSectionV2,
        type?: string,
        placeholder: string,
        icon: any,
        required?: boolean
    }) => {
        const error = errors[field as keyof typeof errors];
        const isInvalid = touched[field] && error;

        return (
            <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                    <Icon size={10} className={isInvalid ? "text-red-500" : "text-gray-400"} />
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
                <div className="relative group">
                    <input
                        type={type}
                        value={section[field] || ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                        onBlur={() => handleBlur(field)}
                        className={`w-full bg-white border ${isInvalid ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 group-hover:border-blue-300'} p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 font-medium`}
                        placeholder={placeholder}
                    />
                    {isInvalid && (
                        <div className="flex items-center gap-1 mt-1 text-red-500">
                            <AlertCircle size={10} />
                            <span className="text-[10px] font-semibold">{error}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">Contact Information</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Basics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <div className="md:col-span-2">
                    <InputField label="Full Name" field="name" placeholder="John Doe" icon={User} required />
                </div>

                <InputField label="Email Address" field="email" type="email" placeholder="john@example.com" icon={Mail} required />
                <InputField label="Phone Number" field="phone" type="tel" placeholder="+1 555 000 0000" icon={Phone} />

                <div className="md:col-span-2">
                    <InputField label="Location / City" field="location" placeholder="New York, NY" icon={MapPin} />
                </div>

                <InputField label="LinkedIn Profile" field="linkedin" placeholder="linkedin.com/in/username" icon={Linkedin} />
                <InputField label="GitHub Profile" field="github" placeholder="github.com/username" icon={Github} />

                <div className="md:col-span-2">
                    <InputField label="Portfolio Website" field="website" type="url" placeholder="https://johndoe.com" icon={Globe} />
                </div>
            </div>
        </div>
    );
}
