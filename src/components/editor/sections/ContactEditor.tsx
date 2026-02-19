import { useResume } from "@/contexts/ResumeContext";
import type { ContactSectionV2 } from "@/types/resume-schema-v2";
import { isValidEmail, isValidUrl, isValidPhone, normalizePhone } from "@/lib/utils/date-formatter";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, AlertCircle, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function ContactEditor({ section }: { section: ContactSectionV2 }) {
    const { updateSection } = useResume();
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (field: keyof ContactSectionV2, value: string) => {
        updateSection(section.id, (prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleNormalizePhone = () => {
        if (section.phone) {
            handleChange("phone", normalizePhone(section.phone));
        }
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
        required = false,
        action
    }: {
        label: string,
        field: keyof ContactSectionV2,
        type?: string,
        placeholder: string,
        icon: any,
        required?: boolean,
        action?: { label: string, icon: any, onClick: () => void }
    }) => {
        const error = errors[field as keyof typeof errors];
        const isInvalid = touched[field] && error;

        return (
            <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Icon size={10} className={isInvalid ? "text-red-500" : "text-gray-400"} />
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                    {action && section[field] && (
                        <button
                            onClick={action.onClick}
                            className="text-[9px] font-bold text-blue-500 hover:text-blue-600 uppercase flex items-center gap-1 transition-colors"
                        >
                            <action.icon size={10} />
                            {action.label}
                        </button>
                    )}
                </div>
                <div className="relative group">
                    <Input
                        type={type}
                        value={section[field] || ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                        onBlur={() => handleBlur(field)}
                        isInvalid={!!isInvalid}
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
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">Contact Information</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded">Basics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <div className="md:col-span-2">
                    <InputField label="Full Name" field="name" placeholder="John Doe" icon={User} required />
                </div>

                <InputField label="Email Address" field="email" type="email" placeholder="john@example.com" icon={Mail} required />
                <InputField
                    label="Phone Number"
                    field="phone"
                    type="tel"
                    placeholder="+1 555 000 0000"
                    icon={Phone}
                    action={{ label: "Normalize", icon: Wand2, onClick: handleNormalizePhone }}
                />

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
