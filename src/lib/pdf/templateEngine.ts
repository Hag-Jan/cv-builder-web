import React from "react";
import type { TemplateConfig, TemplateTheme } from "@/types/template-types";
import type { ResumeV2 as Resume } from "@/types/resume-schema-v2";

// ─────────────────────────────────────────────────────────
// Unified Template Registry
// Serves both HTML preview and PDF export from a single ID.
// ─────────────────────────────────────────────────────────

export interface TemplateEntry {
    config: TemplateConfig;
    theme: TemplateTheme;
    PdfComponent: React.ComponentType<{ resume: Resume }>;
    HtmlComponent: React.ComponentType<{ resume: Resume }>;
}

const registry = new Map<string, TemplateEntry>();

// ── Registration ─────────────────────────────────────────

export function registerTemplate(entry: TemplateEntry): void {
    registry.set(entry.config.id, entry);
}

// ── Lookup ───────────────────────────────────────────────

/**
 * Returns the full template entry for the given ID.
 * Falls back to "classic" if the ID is not registered.
 */
export function getTemplate(templateId: string): TemplateEntry {
    const entry = registry.get(templateId);
    if (entry) return entry;

    // Fallback
    const fallback = registry.get("classic");
    if (fallback) return fallback;

    throw new Error(
        `Template "${templateId}" not found and no "classic" fallback registered.`
    );
}

/**
 * Returns all registered template configs (for the picker UI).
 */
export function listTemplates(): TemplateConfig[] {
    return Array.from(registry.values()).map((e) => e.config);
}

/**
 * Returns available template IDs.
 */
export function getAvailableTemplateIds(): string[] {
    return Array.from(registry.keys());
}

// ── Default registrations ────────────────────────────────
// Import and register built-in templates.

import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ATSBaseTemplate from "@/components/templates/ATSBaseTemplate";
import MinimalHtmlTemplate from "@/components/templates/MinimalHtmlTemplate";
import ModernHtmlTemplate from "@/components/templates/ModernHtmlTemplate";

// Classic
registerTemplate({
    config: {
        id: "classic",
        label: "Classic",
        description: "Traditional ATS-friendly layout with serif accents",
        thumbnail: "/templates/classic-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Helvetica",
        fontSize: { heading: 18, subheading: 13, body: 10, small: 9 },
        colors: {
            primary: "#000000",
            text: "#000000",
            muted: "#333333",
            border: "#000000",
            background: "#FFFFFF",
        },
        spacing: { section: 16, item: 10 },
    },
    PdfComponent: ClassicTemplate,
    HtmlComponent: ATSBaseTemplate,
});

// Modern
registerTemplate({
    config: {
        id: "modern",
        label: "Modern",
        description: "Contemporary design with color accents and clean typography",
        thumbnail: "/templates/modern-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Helvetica",
        fontSize: { heading: 20, subheading: 14, body: 11, small: 9 },
        colors: {
            primary: "#2563EB",
            text: "#1F2937",
            muted: "#6B7280",
            border: "#E5E7EB",
            background: "#FFFFFF",
        },
        spacing: { section: 20, item: 12 },
    },
    PdfComponent: ModernTemplate,
    HtmlComponent: ModernHtmlTemplate,
});

// Minimal
registerTemplate({
    config: {
        id: "minimal",
        label: "Minimal",
        description: "Ultra-clean single-column layout with no borders",
        thumbnail: "/templates/minimal-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Helvetica",
        fontSize: { heading: 16, subheading: 12, body: 10, small: 8 },
        colors: {
            primary: "#111827",
            text: "#374151",
            muted: "#9CA3AF",
            border: "transparent",
            background: "#FFFFFF",
        },
        spacing: { section: 14, item: 8 },
    },
    PdfComponent: MinimalTemplate,
    HtmlComponent: MinimalHtmlTemplate,
});

// Legacy export for backward compatibility
export const AVAILABLE_TEMPLATES = listTemplates().map((c) => ({
    id: c.id,
    label: c.label,
}));
