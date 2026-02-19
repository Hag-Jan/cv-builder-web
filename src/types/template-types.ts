// ─────────────────────────────────────────────────────────
// Template system type definitions
// ─────────────────────────────────────────────────────────

/**
 * Static metadata describing a template.
 * Used by the template picker UI.
 */
export interface TemplateConfig {
    id: string;
    label: string;
    description: string;
    thumbnail: string;           // relative path to preview image
    supportsPdf: boolean;
    supportsHtmlPreview: boolean;
}

/**
 * Theme tokens for a template.
 * Consumed by both HTML preview and PDF render components.
 */
export interface TemplateTheme {
    fontFamily: string;
    fontSize: {
        heading: number;  // px (HTML) or pt (PDF)
        subheading: number;
        body: number;
        small: number;
    };
    colors: {
        primary: string;
        text: string;
        muted: string;
        border: string;
        background: string;
    };
    spacing: {
        section: number;  // gap between sections in px
        item: number;     // gap between items within a section
    };
}
