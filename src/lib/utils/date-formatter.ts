/**
 * Formats a raw date string (usually YYYY-MM) into a professional display format (MMM YYYY).
 * Example: "2024-04" -> "Apr 2024"
 */
export function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    if (dateStr.toLowerCase() === "present") return "Present";

    try {
        const [year, month] = dateStr.split("-");
        if (!year || !month) return dateStr;

        const date = new Date(parseInt(year), parseInt(month) - 1);
        if (isNaN(date.getTime())) return dateStr;

        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    } catch (e) {
        return dateStr;
    }
}

/**
 * Validates an email address.
 */
export function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validates a URL (LinkedIn, GitHub, Website).
 */
export function isValidUrl(url: string): boolean {
    try {
        // Handle simple cases like "linkedin.com/in/..." by prepending https:// if missing
        const fullUrl = url.startsWith("http") ? url : `https://${url}`;
        new URL(fullUrl);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Formats a phone number for display.
 */
export function formatPhone(phone: string): string {
    // Basic formatting: remove non-digits and try to group
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
}

/**
 * Sanitizes a raw skill string by stripping leading bullets, dashes,
 * asterisks, colons, and whitespace, then trimming the result.
 * Example: ": Java" → "Java", "• Python" → "Python"
 */
export function sanitizeSkill(raw: string): string {
    return raw.replace(/^[\s\u2022\-\*•·:,;]+/, '');
}

/**
 * Validates a phone number (basic check: at least 7 digits).
 */
export function isValidPhone(phone: string): boolean {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7;
}
