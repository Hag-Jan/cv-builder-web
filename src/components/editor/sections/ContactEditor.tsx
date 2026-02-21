import { useResume } from "@/contexts/ResumeContext";
import type { ContactSectionV2 } from "@/types/resume-schema-v2";
import { isValidEmail, isValidUrl, isValidPhone, normalizePhone } from "@/lib/utils/date-formatter";
import { useState, useMemo, useCallback, memo } from "react";
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, AlertCircle, Wand2 } from "lucide-react";
import { SafeLocalDebouncedInput } from "@/components/ui/SafeLocalDebouncedInput";

/**
 * Memoized InputField to prevent unnecessary re-renders of the whole form.
 * Moved outside the main component so it doesn't get re-defined on every render.
 */
const InputField = memo(({
    label,
    field,
    value,
    type = "text",
    placeholder,
    icon: Icon,
    required = false,
    isInvalid,
    error,
    onChange,
    onBlur,
    action
}: {
    label: string,
    field: string,
    value: string,
    type?: string,
    placeholder: string,
    icon: any,
    required?: boolean,
    isInvalid: boolean | string | null,
    error: string | null,
    onChange: (val: string) => void,
    onBlur: () => void,
    action?: { label: string, icon: any, onClick: () => void }
}) => {
    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Icon size={10} className={isInvalid ? "text-red-500" : "text-gray-400"} />
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
                {action && value && (
                    <button
                        onClick={action.onClick}
                        type="button"
                        className="text-[9px] font-bold text-blue-500 hover:text-blue-600 uppercase flex items-center gap-1 transition-colors"
                    >
                        <action.icon size={10} />
                        {action.label}
                    </button>
                )}
            </div>
            <div className="relative group">
                <SafeLocalDebouncedInput
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    isInvalid={!!isInvalid}
                    placeholder={placeholder}
                    debounceTime={1500}
                    label={field}
                />
                {isInvalid && error && (
                    <div className="flex items-center gap-1 mt-1 text-red-500">
                        <AlertCircle size={10} />
                        <span className="text-[10px] font-semibold">{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
});
InputField.displayName = "InputField";

export function ContactEditor({ section }: { section: ContactSectionV2 }) {
    const { updateSection } = useResume();
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = useCallback((field: keyof ContactSectionV2, value: string) => {
        updateSection(section.id, (prev) => {
            if ((prev as any)[field] === value) return prev;
            return {
                ...prev,
                [field]: value,
            };
        });
    }, [section.id, updateSection]);

    const handleBlur = useCallback((field: string) => {
        setTouched(prev => {
            if (prev[field]) return prev;
            return { ...prev, [field]: true };
        });
    }, []);

    const handleNormalizePhone = useCallback(() => {
        if (section.phone) {
            handleChange("phone", normalizePhone(section.phone));
        }
    }, [section.phone, handleChange]);

    const errors = useMemo(() => ({
        name: !section.name.trim() ? "Name is required" : null,
        email: !section.email.trim() ? "Email is required" : !isValidEmail(section.email) ? "Invalid email format" : null,
        phone: section.phone && !isValidPhone(section.phone) ? "Invalid phone number" : null,
        linkedin: section.linkedin && !isValidUrl(section.linkedin) ? "Invalid URL" : null,
        github: section.github && !isValidUrl(section.github) ? "Invalid URL" : null,
        website: section.website && !isValidUrl(section.website) ? "Invalid URL" : null,
    }), [section.name, section.email, section.phone, section.linkedin, section.github, section.website]);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">Contact Information</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded">Basics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <div className="md:col-span-2">
                    <InputField
                        label="Full Name"
                        field="name"
                        value={section.name}
                        placeholder="John Doe"
                        icon={User}
                        required
                        isInvalid={touched.name && errors.name}
                        error={errors.name}
                        onChange={(val) => handleChange("name", val)}
                        onBlur={() => handleBlur("name")}
                    />
                </div>

                <InputField
                    label="Email Address"
                    field="email"
                    value={section.email}
                    type="email"
                    placeholder="john@example.com"
                    icon={Mail}
                    required
                    isInvalid={touched.email && errors.email}
                    error={errors.email}
                    onChange={(val) => handleChange("email", val)}
                    onBlur={() => handleBlur("email")}
                />

                <InputField
                    label="Phone Number"
                    field="phone"
                    value={section.phone || ""}
                    type="tel"
                    placeholder="+1 555 000 0000"
                    icon={Phone}
                    isInvalid={touched.phone && errors.phone}
                    error={errors.phone}
                    onChange={(val) => handleChange("phone", val)}
                    onBlur={() => handleBlur("phone")}
                    action={{ label: "Normalize", icon: Wand2, onClick: handleNormalizePhone }}
                />

                <div className="md:col-span-2">
                    <InputField
                        label="Location"
                        field="location"
                        value={section.location || ""}
                        placeholder="New York, NY"
                        icon={MapPin}
                        isInvalid={false}
                        error={null}
                        onChange={(val) => handleChange("location", val)}
                        onBlur={() => handleBlur("location")}
                    />
                </div>

                <InputField
                    label="LinkedIn Profile"
                    field="linkedin"
                    value={section.linkedin || ""}
                    placeholder="linkedin.com/in/username"
                    icon={Linkedin}
                    isInvalid={touched.linkedin && errors.linkedin}
                    error={errors.linkedin}
                    onChange={(val) => handleChange("linkedin", val)}
                    onBlur={() => handleBlur("linkedin")}
                />

                <InputField
                    label="GitHub Profile"
                    field="github"
                    value={section.github || ""}
                    placeholder="github.com/username"
                    icon={Github}
                    isInvalid={touched.github && errors.github}
                    error={errors.github}
                    onChange={(val) => handleChange("github", val)}
                    onBlur={() => handleBlur("github")}
                />

                <div className="md:col-span-2">
                    <InputField
                        label="Portfolio Website"
                        field="website"
                        value={section.website || ""}
                        type="url"
                        placeholder="https://johndoe.com"
                        icon={Globe}
                        isInvalid={touched.website && errors.website}
                        error={errors.website}
                        onChange={(val) => handleChange("website", val)}
                        onBlur={() => handleBlur("website")}
                    />
                </div>
            </div>
        </div>
    );
}

