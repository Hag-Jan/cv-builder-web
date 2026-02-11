"use client";

import React from "react";

interface ATSScoreDisplayProps {
    score: number;
}

export function ATSScoreDisplay({ score }: ATSScoreDisplayProps) {
    // Color based on score ranges
    const getScoreColor = (score: number) => {
        if (score >= 70) return { bg: "bg-green-100", text: "text-green-700", border: "border-green-400" };
        if (score >= 40) return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-400" };
        return { bg: "bg-red-100", text: "text-red-700", border: "border-red-400" };
    };

    const colors = getScoreColor(score);

    return (
        <div className={`flex items-center justify-center w-32 h-32 rounded-full border-4 ${colors.border} ${colors.bg} mx-auto`}>
            <div className="text-center">
                <div className={`text-4xl font-bold ${colors.text}`}>{score}%</div>
                <div className={`text-xs ${colors.text} opacity-80`}>ATS Score</div>
            </div>
        </div>
    );
}
