"use client";

import React, { useState, useEffect } from "react";
import ATSBaseTemplate from "@/components/templates/ATSBaseTemplate";
import ZoomControls from "@/components/ZoomControls";
import { Resume } from "@/types/resume-schema-v1";

interface ResumePreviewProps {
    resume: Resume;
}

/**
 * ResumePreview Component
 * 
 * Renders a live preview of the resume using ATSBaseTemplate
 * Styled to look like A4 paper with shadow, zoom controls, and scrollable container
 */
export default function ResumePreview({ resume }: ResumePreviewProps) {
    const [zoom, setZoom] = useState(1);

    // Check if resume has meaningful content
    const hasContent = resume.sections.some((section) => {
        if (section.type === "contact") {
            const contactSection = section as any;
            return contactSection.name || contactSection.email;
        }
        if (section.type === "experience") {
            return (section as any).items?.length > 0;
        }
        if (section.type === "education") {
            return (section as any).items?.length > 0;
        }
        if (section.type === "skills") {
            return (section as any).categories?.length > 0;
        }
        if (section.type === "projects") {
            return (section as any).items?.length > 0;
        }
        if (section.type === "custom") {
            return (section as any).content?.length > 0;
        }
        return false;
    });

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.1, 0.5));
    };

    const handleFitToScreen = () => {
        setZoom(1);
    };

    if (!hasContent) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gray-100">
                <p className="text-lg">Start filling your resume to see preview</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-100">
            {/* Zoom Controls Toolbar */}
            <div className="pt-4 px-4">
                <ZoomControls
                    zoom={zoom}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onFitToScreen={handleFitToScreen}
                />
            </div>

            {/* Scrollable Preview Container */}
            <div className="flex-1 overflow-auto px-8 pb-8">
                {/* A4 Paper Container with improved styling */}
                <div
                    className="mx-auto bg-white shadow-2xl transition-transform duration-200"
                    style={{
                        maxWidth: "850px",
                        minHeight: "1100px",
                        transform: `scale(${zoom})`,
                        transformOrigin: "top center",
                        marginBottom: zoom > 1 ? `${(zoom - 1) * 500}px` : "0",
                    }}
                >
                    <ATSBaseTemplate resume={resume} />
                </div>
            </div>
        </div>
    );
}
