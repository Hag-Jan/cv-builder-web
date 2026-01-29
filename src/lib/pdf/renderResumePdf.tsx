import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { Resume } from '@/types/resume-schema-v1';
import { getTemplate } from './templateEngine';

/**
 * Generates a PDF Blob for the given resume using the selected template.
 * 
 * @param resume The resume data to render
 * @returns A promise that resolves to the PDF Blob
 */
export async function generateResumePdf(resume: Resume): Promise<Blob> {
    const Template = getTemplate(resume.templateId);
    const doc = <Template resume={resume} />;
    const asBlob = await pdf(doc).toBlob();
    return asBlob;
}
