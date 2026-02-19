/**
 * Deterministically formats a raw date string into a professional display format (MMM YYYY).
 * Strategy: Treat as display-only strings, avoiding JS Date parsing to preserve exact years (e.g., 0007).
 */
export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    const trimmed = dateStr.trim();
    if (!trimmed) return "";

    const lower = trimmed.toLowerCase();
    if (lower === "present" || lower === "now" || lower === "current") return "Present";

    // Pattern 1: YYYY-MM (standard input type="month")
    const yyyyMm = trimmed.match(/^(\d{4})-(\d{1,2})$/);
    if (yyyyMm) {
        const [_, year, month] = yyyyMm;
        return `${getMonthShort(month)} ${year}`;
    }

    // Pattern 2: MM/YYYY or M/YYYY
    const mmYyyy = trimmed.match(/^(\d{1,2})\/(\d{4})$/);
    if (mmYyyy) {
        const [_, month, year] = mmYyyy;
        return `${getMonthShort(month)} ${year}`;
    }

    // Pattern 3: Full Month Name + Year (e.g., "July 0007")
    const fullMonthYear = trimmed.match(/^([a-zA-Z]+)\s+(\d{1,4})$/);
    if (fullMonthYear) {
        const [_, monthName, year] = fullMonthYear;
        const shortMonth = getMonthShortFromName(monthName);
        return shortMonth ? `${shortMonth} ${year.padStart(4, '0')}` : trimmed;
    }

    // Pattern 4: Year Only (YYYY)
    if (/^\d{4}$/.test(trimmed)) {
        return trimmed;
    }

    // Pattern 5: Small Year Only (e.g., "0007")
    if (/^\d{1,4}$/.test(trimmed)) {
        return trimmed.padStart(4, '0');
    }

    // Fallback: Preserve original text if no patterns match
    return trimmed;
}

/**
 * Normalizes phone numbers to E.164 if possible, otherwise returns as-is.
 */
export function normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    // Simple E.164-ish normalization for 10-digit US numbers
    if (digits.length === 10) {
        return `+1${digits}`;
    }
    // If it already looks like E.164, preserve it
    if (phone.startsWith("+") && digits.length >= 10) {
        return `+${digits}`;
    }
    return phone;
}

/**
 * Formats a phone number for friendly display.
 */
export function formatPhone(phone: string): string {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");

    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits.startsWith("1")) {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    return phone;
}

/**
 * Validates phone syntax - permissive check, ensuring at least some digits.
 */
export function isValidPhone(phone: string): boolean {
    if (!phone) return false;
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7;
}

/**
 * Validates email syntax using a conservative regex.
 */
export function isValidEmail(email: string): boolean {
    if (!email) return false;
    // RFC 5322 compliant-ish lightweight check
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}

/**
 * Ensures a URL has a scheme for the preview layer.
 */
export function ensureUrlScheme(url: string | null | undefined): string {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }
    return `https://${trimmed}`;
}

/**
 * Validates a URL using safe parsing.
 */
export function isValidUrl(url: string): boolean {
    if (!url) return false;
    try {
        const effort = url.startsWith("http") ? url : `https://${url}`;
        new URL(effort);
        return true;
    } catch {
        return false;
    }
}

/**
 * Sanitizes input while typing - ONLY leading bullets/special chars.
 * NO .trim() here to avoid cursor jumps.
 */
export function sanitizeIntermediate(val: string): string {
    return val.replace(/^[\s\u2022\-\*•·:,;]+/, '');
}

/**
 * Full sanitization for save path.
 */
export function sanitizeOnSave(val: string): string {
    return val.trim().replace(/^[\s\u2022\-\*•·:,;]+/, '');
}

export interface StructuredDate {
    month: string | null;
    year: string | null;
    isPresent: boolean;
    isUnparseable?: boolean;
    originalValue?: string;
}

/**
 * Parses a raw date string into a structured format for the editor.
 * If parsing fails, returns the original value and marks as unparseable.
 */
export function parseStructuredDate(dateStr: string | null | undefined): StructuredDate {
    if (!dateStr) return { month: null, year: null, isPresent: false };
    const trimmed = dateStr.trim();
    if (!trimmed) return { month: null, year: null, isPresent: false };

    const lower = trimmed.toLowerCase();
    if (lower === "present" || lower === "now" || lower === "current") {
        return { month: null, year: null, isPresent: true };
    }

    // Pattern 1: YYYY-MM
    const yyyyMm = trimmed.match(/^(\d{4})-(\d{1,2})$/);
    if (yyyyMm) {
        return { month: getMonthShort(yyyyMm[2]), year: yyyyMm[1], isPresent: false };
    }

    // Pattern 2: MMM YYYY (e.g., "Jul 2023")
    const shortMonthYear = trimmed.match(/^([a-zA-Z]{3})\s+(\d{4})$/);
    if (shortMonthYear) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (months.includes(shortMonthYear[1])) {
            return { month: shortMonthYear[1], year: shortMonthYear[2], isPresent: false };
        }
    }

    // Pattern 3: Full Month + Year (e.g., "July 2023")
    const fullMonthYear = trimmed.match(/^([a-zA-Z]+)\s+(\d{1,4})$/);
    if (fullMonthYear) {
        const shortMonth = getMonthShortFromName(fullMonthYear[1]);
        if (shortMonth) {
            return { month: shortMonth, year: fullMonthYear[2].padStart(4, '0'), isPresent: false };
        }
    }

    // Pattern 4: Year Only (YYYY)
    if (/^\d{4}$/.test(trimmed)) {
        return { month: null, year: trimmed, isPresent: false };
    }

    // Fallback: If parsing fails, keep original string as fallback
    // TODO: Could not parse date string: "${trimmed}"
    return {
        month: null,
        year: null,
        isPresent: false,
        isUnparseable: true,
        originalValue: trimmed
    };
}

/**
 * Formats a structured date back into a string for the schema/template.
 */
export function formatStructuredDate(data: StructuredDate): string {
    if (data.isUnparseable && data.originalValue) return data.originalValue;
    if (data.isPresent) return "Present";
    if (!data.year) return "";
    if (!data.month) return data.year;
    return `${data.month} ${data.year}`;
}

// Helper: Month number to short name
function getMonthShort(month: string): string {
    const m = parseInt(month, 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[m - 1] || month;
}

// Helper: Full month name to short name
function getMonthShortFromName(name: string): string | null {
    const months: Record<string, string> = {
        january: "Jan", jan: "Jan",
        february: "Feb", feb: "Feb",
        march: "Mar", mar: "Mar",
        april: "Apr", apr: "Apr",
        may: "May",
        june: "Jun", jun: "Jun",
        july: "Jul", jul: "Jul",
        august: "Aug", aug: "Aug",
        september: "Sep", sep: "Sep",
        october: "Oct", oct: "Oct",
        november: "Nov", nov: "Nov",
        december: "Dec", dec: "Dec"
    };
    return months[name.toLowerCase()] || null;
}
