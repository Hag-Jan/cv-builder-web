"use client";

import React, { useMemo } from "react";
import { parseStructuredDate, formatStructuredDate, type StructuredDate } from "@/lib/utils/date-formatter";
import { cn } from "@/lib/utils";

interface MonthYearPickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    showPresent?: boolean;
    className?: string;
}

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function MonthYearPicker({
    value,
    onChange,
    label,
    showPresent = false,
    className
}: MonthYearPickerProps) {
    const structured = useMemo(() => parseStructuredDate(value), [value]);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = 1970;
        const result = [];
        for (let y = currentYear; y >= startYear; y--) {
            result.push(y.toString());
        }
        return result;
    }, []);

    const handleChange = (updates: Partial<StructuredDate>) => {
        const newData = { ...structured, ...updates };
        // If it was unparseable but they changed something, clear unparseable flag
        if (newData.isUnparseable) {
            delete newData.isUnparseable;
            delete newData.originalValue;
        }
        onChange(formatStructuredDate(newData));
    };

    return (
        <div className={cn("space-y-1", className)}>
            {label && (
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">
                        {label}
                    </label>
                    {showPresent && (
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={structured.isPresent}
                                onChange={(e) => handleChange({
                                    isPresent: e.target.checked,
                                    month: e.target.checked ? null : (structured.month || MONTHS[new Date().getMonth()]),
                                    year: e.target.checked ? null : (structured.year || new Date().getFullYear().toString())
                                })}
                                className="w-3 h-3 rounded text-blue-600 focus:ring-0 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">PRESENT</span>
                        </label>
                    )}
                </div>
            )}

            {!structured.isPresent ? (
                <div className="flex gap-2">
                    <select
                        value={structured.month || ""}
                        onChange={(e) => handleChange({ month: e.target.value || null })}
                        className="flex-1 h-9 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-gray-100 transition-all"
                    >
                        <option value="">Month</option>
                        {MONTHS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <select
                        value={structured.year || ""}
                        onChange={(e) => handleChange({ year: e.target.value || null })}
                        className="flex-1 h-9 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-gray-100 transition-all"
                    >
                        <option value="">Year</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className="h-9 px-3 flex items-center bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-500 italic">
                    Currently Working Here
                </div>
            )}

            {structured.isUnparseable && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium italic mt-1">
                    Loaded as: "{structured.originalValue}" (Editing will reset format)
                </p>
            )}
        </div>
    );
}
