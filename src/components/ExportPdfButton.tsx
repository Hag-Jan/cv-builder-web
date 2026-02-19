"use client";

import React, { useState } from 'react';
import { Download, Loader2, FileText, Check } from 'lucide-react';
import type { ResumeV2 } from '@/types/resume-schema-v2';

interface ExportPdfButtonProps {
    resume: ResumeV2;
}

type PaperSize = 'A4' | 'Letter';

/**
 * Enhanced Export button that uses the server-side Puppeteer service.
 * Supports A4 and Letter paper sizes.
 */
export default function ExportPdfButton({ resume }: ExportPdfButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [paperSize, setPaperSize] = useState<PaperSize>('A4');
    const [showOptions, setShowOptions] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const downloadPdf = async () => {
        if (!resume) return;

        setIsGenerating(true);
        setError(null);

        try {
            const res = await fetch("/api/pdf/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume, paper: paperSize }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.details || "Failed to generate PDF");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "ResumeATS.pdf";
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
            setShowOptions(false);
        } catch (e) {
            console.error("Download failed:", e);
            setError("Download failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="relative inline-flex items-center gap-1">
            {/* Primary Export Button */}
            <button
                type="button"
                onClick={downloadPdf}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md transition-all shadow-sm font-bold text-xs uppercase tracking-wider disabled:bg-blue-400 active:scale-95"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4" />
                        <span>{paperSize} PDF</span>
                    </>
                )}
            </button>

            {/* Options Toggle */}
            <button
                onClick={() => setShowOptions(!showOptions)}
                className="px-2 py-2 bg-blue-600 border-l border-blue-500 hover:bg-blue-700 text-white rounded-r-md transition-all shadow-sm active:scale-95"
                title="Change Paper Size"
            >
                <FileText size={16} />
            </button>

            {/* Paper Size Selector Popover */}
            {showOptions && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-100 shadow-xl rounded-lg z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Paper Size</p>
                    <button
                        onClick={() => { setPaperSize('A4'); setShowOptions(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${paperSize === 'A4' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                        <span>A4 (International)</span>
                        {paperSize === 'A4' && <Check size={14} />}
                    </button>
                    <button
                        onClick={() => { setPaperSize('Letter'); setShowOptions(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${paperSize === 'Letter' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                        <span>Letter (US)</span>
                        {paperSize === 'Letter' && <Check size={14} />}
                    </button>
                </div>
            )}

            {error && (
                <div className="absolute top-full right-0 mt-12 bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-[10px] font-bold border border-red-100 shadow-sm animate-shake whitespace-nowrap z-50">
                    {error}
                </div>
            )}
        </div>
    );
}
