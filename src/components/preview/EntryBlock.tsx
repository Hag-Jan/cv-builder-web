import React from "react";
import { BlockType } from "@/engine/pagination";

interface EntryBlockProps {
    children: React.ReactNode;
    type: BlockType;
    id: string;
    sectionId?: string;
    sectionTitle?: string;
}

/**
 * EntryBlock wraps a piece of resume content and provides metadata 
 * to the pagination engine via data attributes.
 */
export const EntryBlock: React.FC<EntryBlockProps> = ({ children, type, id, sectionId, sectionTitle }) => {
    return (
        <div
            className="resume-entry-block w-full"
            data-block-type={type}
            data-block-id={id}
            data-section-id={sectionId}
            data-section-title={sectionTitle}
            style={{
                breakInside: "avoid",
                pageBreakInside: "avoid"
            }}
        >
            {children}
        </div>
    );
};
