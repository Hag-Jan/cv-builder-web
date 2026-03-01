"use client";

import React from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

interface TemplatePreviewCardProps {
    templateId: string;
    name: string;
    description: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const TemplatePreviewCard: React.FC<TemplatePreviewCardProps> = ({
    templateId,
    name,
    description,
    isSelected,
    onSelect,
}) => {
    return (
        <div
            onClick={() => onSelect(templateId)}
            className={clsx(
                "relative cursor-pointer transition-all duration-200 rounded-2xl border p-6 bg-background shadow-sm hover:shadow-md",
                isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
            )}
        >
            <div className="aspect-[3/4] bg-muted rounded-xl mb-6 overflow-hidden border border-border flex items-center justify-center">
                <span className="text-muted-foreground font-medium">Preview</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
            </p>

            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm">
                    <Check size={14} />
                </div>
            )}
        </div>
    );
};

export default TemplatePreviewCard;
