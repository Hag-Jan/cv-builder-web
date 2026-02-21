import React from "react";
import type { TemplateConfig, TemplateTheme } from "@/types/template-types";
import type { ResumeV2 as Resume } from "@/types/resume-schema-v2";

// ── HTML template imports ─────────────────────────────
import ATSBaseTemplate, { renderATSBaseBlocks } from "@/components/templates/ATSBaseTemplate";
import ModernHtmlTemplate, { renderModernHtmlBlocks } from "@/components/templates/ModernHtmlTemplate";
import MinimalHtmlTemplate, { renderMinimalHtmlBlocks } from "@/components/templates/MinimalHtmlTemplate";
import BusinessClassic, { renderBusinessClassicBlocks } from "@/components/templates/BusinessClassic";
import BusinessTwoColumn, { renderBusinessTwoColumnBlocks } from "@/components/templates/BusinessTwoColumn";
import BusinessModern, { renderBusinessModernBlocks } from "@/components/templates/BusinessModern";
import BusinessMinimal, { renderBusinessMinimalBlocks } from "@/components/templates/BusinessMinimal";

// ─────────────────────────────────────────────────────────
// Unified Template Registry
// Serves both HTML preview and PDF export from a single ID.
// ─────────────────────────────────────────────────────────

export interface TemplateEntry {
    config: TemplateConfig;
    theme: TemplateTheme;
    HtmlComponent: React.ComponentType<{ resume: Resume }>;
    renderBlocks?: (resume: Resume) => React.ReactNode[];
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
    HtmlComponent: ATSBaseTemplate,
    renderBlocks: renderATSBaseBlocks,
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
    HtmlComponent: ModernHtmlTemplate,
    renderBlocks: renderModernHtmlBlocks,
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
    HtmlComponent: MinimalHtmlTemplate,
    renderBlocks: renderMinimalHtmlBlocks,
});

// ── Business Templates ────────────────────────────────────

// Business Classic
registerTemplate({
    config: {
        id: "business-classic",
        label: "Business Classic",
        description: "Single-column, serif, conservative — maximum ATS safety",
        thumbnail: "/templates/business-classic-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Helvetica",
        fontSize: { heading: 18, subheading: 13, body: 10, small: 9 },
        colors: {
            primary: "#000000",
            text: "#000000",
            muted: "#444444",
            border: "#000000",
            background: "#FFFFFF",
        },
        spacing: { section: 14, item: 10 },
    },
    HtmlComponent: BusinessClassic,
    renderBlocks: renderBusinessClassicBlocks,
});

// Business Two Column
registerTemplate({
    config: {
        id: "business-two-column",
        label: "Business Two Column",
        description: "65/35 CSS grid layout — sidebar with skills, main with experience",
        thumbnail: "/templates/business-two-column-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Helvetica",
        fontSize: { heading: 20, subheading: 13, body: 10, small: 9 },
        colors: {
            primary: "#1E3A5F",
            text: "#1F2937",
            muted: "#6B7280",
            border: "#1E3A5F",
            background: "#FFFFFF",
        },
        spacing: { section: 18, item: 10 },
    },
    HtmlComponent: BusinessTwoColumn,
    renderBlocks: renderBusinessTwoColumnBlocks,
});

// Business Modern
registerTemplate({
    config: {
        id: "business-modern",
        label: "Business Modern",
        description: "Single-column, navy accent, clean left-border section headings",
        thumbnail: "/templates/business-modern-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Helvetica",
        fontSize: { heading: 22, subheading: 14, body: 10, small: 9 },
        colors: {
            primary: "#0F4C81",
            text: "#1F2937",
            muted: "#6B7280",
            border: "#0F4C81",
            background: "#FFFFFF",
        },
        spacing: { section: 16, item: 10 },
    },
    HtmlComponent: BusinessModern,
    renderBlocks: renderBusinessModernBlocks,
});

// Business Minimal
registerTemplate({
    config: {
        id: "business-minimal",
        label: "Business Minimal",
        description: "Ultra-clean single-column, generous whitespace, pure grayscale",
        thumbnail: "/templates/business-minimal-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Helvetica",
        fontSize: { heading: 20, subheading: 12, body: 10, small: 8 },
        colors: {
            primary: "#111827",
            text: "#374151",
            muted: "#9CA3AF",
            border: "#E5E7EB",
            background: "#FFFFFF",
        },
        spacing: { section: 16, item: 8 },
    },
    HtmlComponent: BusinessMinimal,
    renderBlocks: renderBusinessMinimalBlocks,
});

// Legacy export for backward compatibility
export const AVAILABLE_TEMPLATES = listTemplates().map((c) => ({
    id: c.id,
    label: c.label,
}));
