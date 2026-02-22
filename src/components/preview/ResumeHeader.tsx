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
    titleColor?: string;
    contactColor?: string;
    separatorColor?: string;
    borderColor?: string;
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
    titleColor = 'text-gray-600',
    contactColor = 'text-gray-700',
    separatorColor = 'text-gray-400',
    borderColor = 'border-gray-400',
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
            className={`mb-6 pb-4 border-b-2 ${borderColor} ${align === 'center' ? 'text-center' : 'text-left'}`}
            style={{ fontFamily }}
        >
            <h1
                className="text-[24pt] font-bold leading-tight mb-1"
                style={{ color: accentColor }}
            >
                {name}
            </h1>

            {title && (
                <p className={`text-[14pt] font-medium mb-3 uppercase tracking-wide ${titleColor}`}>
                    {title}
                </p>
            )}

            <div className={`flex flex-wrap ${align === 'center' ? 'justify-center' : 'justify-start'} gap-x-2 gap-y-1 text-[11pt] font-medium mt-2 ${contactColor}`}>
                {contactItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <span>{item}</span>
                        {idx < contactItems.length - 1 && <span className={`mx-0.5 ${separatorColor}`}>•</span>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
