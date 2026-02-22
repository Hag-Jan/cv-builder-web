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
    titleColor = 'text-gray-700',
    contactColor = 'text-gray-700',
    separatorColor = 'text-gray-500',
    borderColor = 'border-gray-500',
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
            className={`mb-4 pb-4 border-b-2 ${borderColor} ${align === 'center' ? 'text-center' : 'text-left'}`}
            style={{ fontFamily }}
        >
            <h1
                className="text-[32pt] font-extrabold leading-tight mb-2"
                style={{ color: accentColor }}
            >
                {name}
            </h1>

            {title && (
                <p className={`text-[16pt] font-bold mb-4 uppercase tracking-widest ${titleColor}`}>
                    {title}
                </p>
            )}

            <div className={`flex flex-wrap ${align === 'center' ? 'justify-center' : 'justify-start'} gap-x-6 gap-y-2 text-[12pt] font-bold mt-4 ${contactColor} uppercase tracking-tight`}>
                {contactItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <span className="whitespace-nowrap">{item}</span>
                        {idx < contactItems.length - 1 && <span className={`mx-1 opacity-50 ${separatorColor}`}>|</span>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
