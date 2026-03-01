"use client";

import React from "react";
import {
    User,
    AlignLeft,
    Briefcase,
    GraduationCap,
    Wrench,
    FolderKanban,
    FileText,
} from "lucide-react";
import type { SectionTypeV2 } from "@/types/resume-schema-v2";

interface SectionNavItem {
    id: string;
    type: SectionTypeV2;
    label: string;
}

interface SectionNavProps {
    sections: SectionNavItem[];
    activeSectionId: string | null;
    onSelect: (id: string) => void;
}

const SECTION_ICONS: Record<SectionTypeV2, React.ComponentType<{ size?: number }>> = {
    contact: User,
    summary: AlignLeft,
    experience: Briefcase,
    education: GraduationCap,
    skills: Wrench,
    projects: FolderKanban,
    custom: FileText,
};

const SECTION_LABELS: Record<SectionTypeV2, string> = {
    contact: "Contact",
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    custom: "Custom",
};

/**
 * Vertical icon sidebar for section navigation.
 * Compact (~60px wide), with tooltip on hover and active state highlighting.
 */
export default function SectionNav({ sections, activeSectionId, onSelect }: SectionNavProps) {
    return (
        <nav className="flex flex-col items-center gap-1 py-4 px-2 bg-background border-r border-border w-[60px] shrink-0 transition-colors duration-150">
            {sections.map((section) => {
                const Icon = SECTION_ICONS[section.type] || FileText;
                const label = section.type === "custom" ? (section.label || "Custom") : SECTION_LABELS[section.type];
                const isActive = section.id === activeSectionId;

                return (
                    <button
                        key={section.id}
                        onClick={() => onSelect(section.id)}
                        title={label}
                        className={`
              relative group flex items-center justify-center
              w-10 h-10 rounded-lg transition-all duration-150
              ${isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }
            `}
                    >
                        <Icon size={18} />

                        {/* Tooltip */}
                        <span
                            className="
                absolute left-full ml-2 px-2 py-1
                text-xs font-medium text-background bg-foreground rounded
                opacity-0 group-hover:opacity-100
                pointer-events-none transition-opacity duration-150
                whitespace-nowrap z-50
              "
                        >
                            {label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
