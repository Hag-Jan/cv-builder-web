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
import NovaSingle, { renderNovaSingleBlocks } from "@/components/templates/NovaSingle";
import PrismSidebar, { renderPrismSidebarBlocks } from "@/components/templates/PrismSidebar";
import ChronicleTimeline, { renderChronicleTimelineBlocks } from "@/components/templates/ChronicleTimeline";
import BrijrMinimal, { renderBrijrMinimalBlocks } from "@/components/templates/BrijrMinimal";
import ResumifyModern, { renderResumifyModernBlocks } from "@/components/templates/ResumifyModern";
import UniversalFormal, { renderUniversalFormalBlocks } from "@/components/templates/UniversalFormal";
import ResumaveClean, { renderResumaveCleanBlocks } from "@/components/templates/ResumaveClean";
import AdiianSimple, { renderAdiianSimpleBlocks } from "@/components/templates/AdiianSimple";
import ExecutiveClassic, { renderExecutiveClassicBlocks } from "@/components/templates/ExecutiveClassic";
import TechClean, { renderTechCleanBlocks } from "@/components/templates/TechClean";
import MinimalPro, { renderMinimalProBlocks } from "@/components/templates/MinimalPro";

// ── New ATS Templates ────────────────────────────────────
import ClassicTemplate, { renderClassicBlocks } from "@/components/templates/ClassicTemplate";
import ModernTemplate, { renderModernBlocks } from "@/components/templates/ModernTemplate";
import MinimalTemplate, { renderMinimalBlocks } from "@/components/templates/MinimalTemplate";
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
    // Normalise ID (handle underscores from old links/params)
    const normalizedId = templateId.replace(/_/g, "-");

    // Alias mapping for old or common names
    const aliases: Record<string, string> = {
        "business-classic": "academic",
        "business-modern": "executive",
        "business-minimal": "minimal",
        "business-two-column": "sidebar-pro",
        "sidebar_pro": "sidebar-pro",
        "nova-single": "nova",
        "prism-sidebar": "prism",
        "chronicle-timeline": "chronicle",
        "academic": "academic",
        "creative": "creative",
        "minimalist": "minimal",
        "executive": "executive",
        "sidebar-pro": "sidebar-pro"
    };

    const targetId = aliases[normalizedId] || normalizedId;
    const entry = registry.get(targetId);
    if (entry) return entry;

    // Fallback to classic if registered, otherwise academic
    const fallback = registry.get("classic") || registry.get("academic");
    if (fallback) return fallback;

    throw new Error(
        `Template "${templateId}" not found and no "academic" fallback registered.`
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

// ATS Base Models
registerTemplate({
    config: { id: "classic", label: "Classic ATS", description: "Standard single column ATS-friendly layout.", thumbnail: "", supportsPdf: true, supportsHtmlPreview: true },
    theme: { fontFamily: "Georgia, serif", fontSize: { heading: 18, subheading: 13, body: 10, small: 9 }, colors: { primary: "#000000", text: "#000000", muted: "#333333", border: "#000000", background: "#FFFFFF" }, spacing: { section: 16, item: 10 } },
    HtmlComponent: ClassicTemplate,
    renderBlocks: renderClassicBlocks,
});

registerTemplate({
    config: { id: "modern", label: "Modern ATS", description: "Bold left borders and dynamic fonts.", thumbnail: "", supportsPdf: true, supportsHtmlPreview: true },
    theme: { fontFamily: "Inter, sans-serif", fontSize: { heading: 20, subheading: 14, body: 11, small: 9 }, colors: { primary: "#2563EB", text: "#1F2937", muted: "#6B7280", border: "#E5E7EB", background: "#FFFFFF" }, spacing: { section: 20, item: 12 } },
    HtmlComponent: ModernTemplate,
    renderBlocks: renderModernBlocks,
});

registerTemplate({
    config: { id: "minimal", label: "Minimal ATS", description: "Pure spacing architecture and typography.", thumbnail: "", supportsPdf: true, supportsHtmlPreview: true },
    theme: { fontFamily: "Inter, sans-serif", fontSize: { heading: 16, subheading: 12, body: 10, small: 8 }, colors: { primary: "#111827", text: "#374151", muted: "#9CA3AF", border: "transparent", background: "#FFFFFF" }, spacing: { section: 14, item: 8 } },
    HtmlComponent: MinimalTemplate,
    renderBlocks: renderMinimalBlocks,
});

// Academic (formerly Classic)
registerTemplate({
    config: {
        id: "academic",
        label: "The Academic",
        description: "Elegant serif design for researchers and educators",
        thumbnail: "/templates/classic-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Georgia, serif",
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
    HtmlComponent: BusinessClassic,
    renderBlocks: renderBusinessClassicBlocks,
});

// Creative (formerly Modern)
registerTemplate({
    config: {
        id: "creative",
        label: "The Creative",
        description: "Bold layouts and color blocks for designers",
        thumbnail: "/templates/modern-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
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

// Minimalist (formerly Minimal)
registerTemplate({
    config: {
        id: "minimalist",
        label: "The Minimalist",
        description: "Ultra-clean single-column layout with high-contrast spacing",
        thumbnail: "/templates/minimal-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
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
    HtmlComponent: ATSBaseTemplate,
    renderBlocks: renderATSBaseBlocks,
});

// ── Business Templates ────────────────────────────────────

// Executive (formerly Business Modern/Classic)
registerTemplate({
    config: {
        id: "executive",
        label: "The Executive",
        description: "Professional, structured design for corporate leadership",
        thumbnail: "/templates/business-modern-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
        fontSize: { heading: 18, subheading: 13, body: 10, small: 9 },
        colors: {
            primary: "#0F4C81",
            text: "#1F2937",
            muted: "#444444",
            border: "#0F4C81",
            background: "#FFFFFF",
        },
        spacing: { section: 14, item: 10 },
    },
    HtmlComponent: BusinessModern,
    renderBlocks: renderBusinessModernBlocks,
});

// Sidebar Pro (formerly Business Two Column)
registerTemplate({
    config: {
        id: "sidebar-pro",
        label: "The Sidebar Pro",
        description: "Professional two-column layout with a distinct sidebar",
        thumbnail: "/templates/business-two-column-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
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

// ── New Originals ─────────────────────────────────────────

// The Nova
registerTemplate({
    config: {
        id: "nova",
        label: "The Nova",
        description: "Clean single-column with vivid accent bars and pill-style skill tags",
        thumbnail: "/templates/nova-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
        fontSize: { heading: 16, subheading: 12, body: 11, small: 9 },
        colors: {
            primary: "#2563EB",
            text: "#111827",
            muted: "#6B7280",
            border: "#E5E7EB",
            background: "#FFFFFF",
        },
        spacing: { section: 14, item: 8 },
    },
    HtmlComponent: NovaSingle,
    renderBlocks: renderNovaSingleBlocks,
});

// The Prism
registerTemplate({
    config: {
        id: "prism",
        label: "The Prism",
        description: "Two-column dark sidebar layout — skills and contact on the left",
        thumbnail: "/templates/prism-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
        fontSize: { heading: 16, subheading: 12, body: 11, small: 9 },
        colors: {
            primary: "#1a3456",
            text: "#1F2937",
            muted: "#6B7280",
            border: "#1a3456",
            background: "#FFFFFF",
        },
        spacing: { section: 16, item: 10 },
    },
    HtmlComponent: PrismSidebar,
    renderBlocks: renderPrismSidebarBlocks,
});

// The Chronicle
registerTemplate({
    config: {
        id: "chronicle",
        label: "The Chronicle",
        description: "Timeline-focused layout with a date column — ideal for senior roles",
        thumbnail: "/templates/chronicle-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
        fontSize: { heading: 16, subheading: 12, body: 11, small: 9 },
        colors: {
            primary: "#0F766E",
            text: "#111827",
            muted: "#6B7280",
            border: "#E5E7EB",
            background: "#FFFFFF",
        },
        spacing: { section: 14, item: 8 },
    },
    HtmlComponent: ChronicleTimeline,
    renderBlocks: renderChronicleTimelineBlocks,
});

// The Brijr Minimalist
registerTemplate({
    config: {
        id: "brijr-minimal",
        label: "The Brijr Minimalist",
        description: "Ultra-clean single-column layout with premium typography and subtle accents",
        thumbnail: "/templates/minimal-thumb.png", // Reusing minimalist thumb for now
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
        fontSize: { heading: 18, subheading: 14, body: 11, small: 9 },
        colors: {
            primary: "#2563eb",
            text: "#0f172a",
            muted: "#64748b",
            border: "#e2e8f0",
            background: "#FFFFFF",
        },
        spacing: { section: 16, item: 10 },
    },
    HtmlComponent: BrijrMinimal,
    renderBlocks: renderBrijrMinimalBlocks,
});

// The Resumify Modern
registerTemplate({
    config: {
        id: "resumify-modern",
        label: "The Resumify Modern",
        description: "Professional single-column layout with section separators and clean hierarchy",
        thumbnail: "/templates/modern-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
        fontSize: { heading: 16, subheading: 14, body: 11, small: 9 },
        colors: {
            primary: "#111827",
            text: "#1e293b",
            muted: "#64748b",
            border: "#e2e8f0",
            background: "#FFFFFF",
        },
        spacing: { section: 20, item: 12 },
    },
    HtmlComponent: ResumifyModern,
    renderBlocks: renderResumifyModernBlocks,
});

// The Universal Formal
registerTemplate({
    config: {
        id: "universal-formal",
        label: "The Universal Formal",
        description: "Classic high-density serif design for academic and traditional professions",
        thumbnail: "/templates/classic-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Georgia, serif",
        fontSize: { heading: 18, subheading: 13, body: 10, small: 9 },
        colors: {
            primary: "#2D3436",
            text: "#1e293b",
            muted: "#444444",
            border: "#2D3436",
            background: "#FFFFFF",
        },
        spacing: { section: 14, item: 10 },
    },
    HtmlComponent: UniversalFormal,
    renderBlocks: renderUniversalFormalBlocks,
});

// The Resumave Clean
registerTemplate({
    config: {
        id: "resumave-clean",
        label: "The Resumave Clean",
        description: "Modern A4-optimized layout with a clean timeline and grid-based projects",
        thumbnail: "/templates/business-modern-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
        fontSize: { heading: 18, subheading: 14, body: 11, small: 9 },
        colors: {
            primary: "#3b82f6",
            text: "#1e293b",
            muted: "#64748b",
            border: "#e2e8f0",
            background: "#FFFFFF",
        },
        spacing: { section: 18, item: 12 },
    },
    HtmlComponent: ResumaveClean,
    renderBlocks: renderResumaveCleanBlocks,
});

// The Adiian Simple
registerTemplate({
    config: {
        id: "adiian-simple",
        label: "The Adiian Simple",
        description: "High-readability Tailwind-first design with bold headers and timeline borders",
        thumbnail: "/templates/nova-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Inter, sans-serif",
        fontSize: { heading: 18, subheading: 14, body: 11, small: 9 },
        colors: {
            primary: "#4f46e5",
            text: "#0f172a",
            muted: "#64748b",
            border: "#e2e8f0",
            background: "#FFFFFF",
        },
        spacing: { section: 16, item: 10 },
    },
    HtmlComponent: AdiianSimple,
    renderBlocks: renderAdiianSimpleBlocks,
});






// Executive Classic
registerTemplate({
    config: {
        id: "executive-classic",
        label: "Executive Classic",
        description: "Strong visual hierarchy for senior/management roles with a thick indigo accent line",
        thumbnail: "/templates/business-modern-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Georgia, serif",
        fontSize: { heading: 18, subheading: 13, body: 10, small: 9 },
        colors: {
            primary: "#3730A3",
            text: "#1F2937",
            muted: "#4B5563",
            border: "#3730A3",
            background: "#FFFFFF",
        },
        spacing: { section: 16, item: 10 },
    },
    HtmlComponent: ExecutiveClassic,
    renderBlocks: renderExecutiveClassicBlocks,
});

// Tech Clean
registerTemplate({
    config: {
        id: "tech-clean",
        label: "Tech Clean",
        description: "Clean sans-serif developer-focused layout, skills rendered as small inline pill tags",
        thumbnail: "/templates/nova-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: { heading: 18, subheading: 13, body: 10, small: 9 },
        colors: {
            primary: "#2563EB",
            text: "#0f172a",
            muted: "#64748b",
            border: "#e2e8f0",
            background: "#FFFFFF",
        },
        spacing: { section: 16, item: 10 },
    },
    HtmlComponent: TechClean,
    renderBlocks: renderTechCleanBlocks,
});

// Minimal Pro
registerTemplate({
    config: {
        id: "minimal-pro",
        label: "Minimal Pro",
        description: "Ultra minimal typographic hierarchy, generous whitespace, thin horizontal dividers",
        thumbnail: "/templates/minimal-thumb.png",
        supportsPdf: true,
        supportsHtmlPreview: true,
    },
    theme: {
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: { heading: 18, subheading: 13, body: 10, small: 9 },
        colors: {
            primary: "#111827",
            text: "#111827",
            muted: "#64748b",
            border: "#e2e8f0",
            background: "#FFFFFF",
        },
        spacing: { section: 18, item: 12 },
    },
    HtmlComponent: MinimalPro,
    renderBlocks: renderMinimalProBlocks,
});

// Legacy export for backward compatibility
export const AVAILABLE_TEMPLATES = listTemplates().map((c) => ({
    id: c.id,
    label: c.label,
}));
