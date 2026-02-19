import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { ResumeV2 as Resume } from '@/types/resume-schema-v2';
import { getTemplate } from './templateEngine';

/**
 * Generates a PDF Blob for the given resume using the selected template.
 * 
 * @param resume The resume data to render
 * @returns A promise that resolves to the PDF Blob
 */
export async function generateResumePdf(resume: Resume): Promise<Blob> {
    const { PdfComponent } = getTemplate(resume.templateId);
    // Cast to any to handle v1 components that haven't been fully migrated to v2 types yet
    const doc = <PdfComponent resume={resume as any} />;
    const asBlob = await pdf(doc).toBlob();
    return asBlob;
}
