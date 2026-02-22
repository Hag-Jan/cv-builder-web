import React from 'react';

interface ResumeSummaryProps {
    content: string;
    accentColor?: string;
    fontFamily?: string;
    headingLabel?: string;
}

export const ResumeSummary: React.FC<ResumeSummaryProps> = ({
    content,
    accentColor = '#000000',
    fontFamily,
    headingLabel = 'SUMMARY'
}) => {
    if (!content) return null;

    return (
        <div className="mb-8" style={{ fontFamily }}>
            <h2
                className="text-xl font-bold mb-4 uppercase tracking-widest border-b-2 border-gray-400 pb-1"
                style={{ color: '#111827' }} // text-gray-900 equivalent for strong contrast
            >
                {headingLabel === 'SUMMARY' ? 'PROFESSIONAL SUMMARY' : headingLabel}
            </h2>
            <p className="text-base leading-relaxed text-gray-800 text-justify font-medium mt-2">
                {content}
            </p>
        </div>
    );
};
