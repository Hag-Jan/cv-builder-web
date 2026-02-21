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
    headingLabel = 'PROFESSIONAL SUMMARY'
}) => {
    if (!content) return null;

    return (
        <div className="mb-7" style={{ fontFamily }}>
            <h2
                className="text-[12pt] font-bold mb-3 uppercase tracking-wider border-b border-gray-200 pb-1"
                style={{ color: accentColor }}
            >
                {headingLabel}
            </h2>
            <p className="text-[11pt] leading-[1.6] text-gray-800 text-justify">
                {content}
            </p>
        </div>
    );
};
