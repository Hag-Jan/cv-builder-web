"use client";

import React from "react";

interface KeywordBadgesProps {
    keywords: string[];
    variant: "matched" | "missing";
}

export function KeywordBadges({ keywords, variant }: KeywordBadgesProps) {
    if (keywords.length === 0) {
        return null;
    }

    const bgColor = variant === "matched" ? "bg-green-100" : "bg-red-100";
    const textColor = variant === "matched" ? "text-green-800" : "text-red-800";
    const borderColor = variant === "matched" ? "border-green-300" : "border-red-300";

    return (
        <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
                <span
                    key={index}
                    className={`px-3 py-1 rounded-full border ${bgColor} ${textColor} ${borderColor} text-sm font-medium`}
                >
                    {keyword}
                </span>
            ))}
        </div>
    );
}
