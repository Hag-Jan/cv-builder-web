"use client";

import React from "react";
import type { TemplateConfig } from "@/types/template-types";
import { Check } from "lucide-react";

interface TemplatePreviewCardProps {
    config: TemplateConfig;
    isSelected: boolean;
    onSelect: () => void;
}

/**
 * Visual template picker card.
 * Shows a colored placeholder (until real thumbnails are added),
 * template name, description, and a selected state indicator.
 */
export default function TemplatePreviewCard({
    config,
    isSelected,
    onSelect,
}: TemplatePreviewCardProps) {
    return (
        <button
            onClick={onSelect}
            className={`
        relative flex flex-col rounded-lg border-2 overflow-hidden
        transition-all duration-200 text-left
        ${isSelected
                    ? "border-blue-500 shadow-md ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
                }
      `}
        >
            {/* Thumbnail placeholder */}
            <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                    {config.id}
                </span>
            </div>

            {/* Info */}
            <div className="px-3 py-2">
                <p className="text-sm font-semibold text-gray-800">{config.label}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{config.description}</p>
            </div>

            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                </div>
            )}
        </button>
    );
}
