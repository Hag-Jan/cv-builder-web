import React from 'react';
import type { ResumeV2 } from '@/types/resume-schema-v2';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';

// -----------------------------------------------------------------------------
// Template Registry for UI & Rendering
// -----------------------------------------------------------------------------

export interface TemplateDefinition {
    id: string;
    name: string;
    description: string;
    component: React.ComponentType<{ resume: ResumeV2 }>;
}

export const TEMPLATES: TemplateDefinition[] = [
    {
        id: 'classic',
        name: 'Classic',
        description: 'Single column, professional serif font, clear sections.',
        component: ClassicTemplate
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Accent colors, bold left borders, and modern sans-serif.',
        component: ModernTemplate
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Pure typography, immense whitespace, elegant structure.',
        component: MinimalTemplate
    }
];

export function getTemplateComponent(id: string): React.ComponentType<{ resume: ResumeV2 }> {
    const template = TEMPLATES.find(t => t.id === id);
    return template ? template.component : ClassicTemplate;
}

// -----------------------------------------------------------------------------
// The TemplateRenderer Wrapper Component
// -----------------------------------------------------------------------------

interface TemplateRendererProps {
    templateId: string;
    data: ResumeV2;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateId, data }) => {
    const Component = getTemplateComponent(templateId);
    return <Component resume={ data } />;
};

export { ClassicTemplate, ModernTemplate, MinimalTemplate };
