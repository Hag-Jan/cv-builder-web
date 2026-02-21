import React from 'react';
import { ensureUrlScheme } from '@/lib/utils/date-formatter';

interface ResumeHeaderProps {
    name: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    accentColor?: string;
    fontFamily?: string;
    align?: 'left' | 'center';
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({
    name,
    title,
    email,
    phone,
    location,
    linkedin,
    github,
    website,
    accentColor = '#000000',
    fontFamily,
    align = 'center'
}) => {
    const contactItems = [
        email,
        phone,
        location,
        linkedin && linkedin.replace(/^https?:\/\/(www\.)?/, ''),
        github && github.replace(/^https?:\/\/(www\.)?/, ''),
        website && website.replace(/^https?:\/\/(www\.)?/, '')
    ].filter(Boolean);

    return (
        <div
            className={`mb-8 pb-6 border-b-2 border-gray-100 ${align === 'center' ? 'text-center' : 'text-left'}`}
            style={{ fontFamily }}
        >
            <h1
                className="text-[24pt] font-bold leading-tight mb-1"
                style={{ color: accentColor }}
            >
                {name}
            </h1>

            {title && (
                <p className="text-[14pt] font-medium text-gray-600 mb-3 uppercase tracking-wide">
                    {title}
                </p>
            )}

            <div className={`flex flex-wrap ${align === 'center' ? 'justify-center' : 'justify-start'} gap-x-3 gap-y-1 text-[11pt] text-gray-700 font-medium mt-2`}>
                {contactItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <span>{item}</span>
                        {idx < contactItems.length - 1 && <span className="text-gray-300 mx-1">•</span>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
