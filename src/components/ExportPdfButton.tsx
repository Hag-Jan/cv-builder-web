"use client";

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { generateResumePdf } from '@/lib/pdf/renderResumePdf';
import type { Resume, ContactSection } from '@/types/resume-schema-v1';

interface ExportPdfButtonProps {
    resume: Resume;
}

/**
 * A client-side button component that triggers PDF generation and download.
 * Constructs filename as FirstName_LastName_Resume.pdf based on contact info.
 */
export default function ExportPdfButton({ resume }: ExportPdfButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const blob = await generateResumePdf(resume);

            // Attempt to find contact name for filename
            const contactSection = resume.sections.find(
                (s) => s.type === 'contact'
            ) as ContactSection | undefined;

            const fullName = contactSection?.name || 'My';
            // Basic formatting: trim, replace spaces with underscores, remove non-alphanumeric chars except underscores
            const formattedName = fullName
                .trim()
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_]/g, '');

            const filename = `${formattedName}_Resume.pdf`;

            // Create a temporary link element to trigger download
            const url = URL.createObjectURL(blob);
            const link = document.body.appendChild(document.createElement('a'));
            link.href = url;
            link.download = filename;
            link.click();

            // Cleanup: small delay to ensure download starts in some browsers before removing
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);

        } catch (err) {
            console.error('Failed to generate PDF:', err);
            setError('An error occurred while generating your PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                type="button"
                onClick={handleExport}
                disabled={isGenerating}
                aria-label="Export Resume as PDF"
                className="group relative flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] font-semibold"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Preparing PDF...</span>
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                        <span>Export PDF</span>
                    </>
                )}
            </button>

            {error && (
                <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}
