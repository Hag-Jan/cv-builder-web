import React from 'react';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import type { Resume } from '@/types/resume-schema-v1';

export type TemplateId = 'classic' | 'modern';

interface TemplateRegistry {
    [key: string]: React.ComponentType<{ resume: Resume }>;
}

const registry: TemplateRegistry = {
    'classic': ClassicTemplate,
    'modern': ModernTemplate,
};

/**
 * Returns the template component for the given templateId.
 * Falls back to 'classic' if the templateId is not found.
 */
export function getTemplate(templateId: string) {
    return registry[templateId] || ClassicTemplate;
}

export const AVAILABLE_TEMPLATES = [
    { id: 'classic', label: 'Classic' },
    { id: 'modern', label: 'Modern' },
];
