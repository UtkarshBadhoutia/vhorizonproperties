import DOMPurify from 'dompurify';

/**
 * Input sanitization utilities
 * Protects against XSS attacks by sanitizing user input
 */

/**
 * Sanitize HTML content
 * Use for rich text or HTML that needs to be displayed
 */
export function sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
}

/**
 * Sanitize plain text
 * Removes all HTML tags
 */
export function sanitizeText(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
}

/**
 * Sanitize email
 * Validates and sanitizes email addresses
 */
export function sanitizeEmail(email: string): string {
    const sanitized = sanitizeText(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitized)) {
        throw new Error('Invalid email format');
    }

    return sanitized;
}

/**
 * Sanitize phone number
 * Removes non-numeric characters except + and -
 */
export function sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-\s()]/g, '').trim();
}

/**
 * Sanitize URL
 * Ensures URL is safe and valid
 */
export function sanitizeUrl(url: string): string {
    const sanitized = sanitizeText(url).trim();

    try {
        const urlObj = new URL(sanitized);

        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            throw new Error('Invalid URL protocol');
        }

        return urlObj.toString();
    } catch {
        throw new Error('Invalid URL format');
    }
}

/**
 * Sanitize search query
 * Removes special characters that could be used for SQL injection
 */
export function sanitizeSearchQuery(query: string): string {
    return sanitizeText(query)
        .replace(/[<>"'%;()&+]/g, '')
        .trim()
        .slice(0, 100); // Limit length
}

/**
 * Sanitize form data object
 * Sanitizes all string values in an object
 */
export function sanitizeFormData<T extends Record<string, unknown>>(
    data: T,
    options: {
        allowHtml?: string[]; // Fields that can contain HTML
    } = {}
): T {
    const sanitized: Record<string, unknown> = { ...data };

    for (const [key, value] of Object.entries(sanitized)) {
        if (typeof value === 'string') {
            if (options.allowHtml?.includes(key)) {
                sanitized[key] = sanitizeHtml(value);
            } else {
                sanitized[key] = sanitizeText(value);
            }
        }
    }

    return sanitized as T;
}

/**
 * Validate and sanitize property requirement data
 */
export interface PropertyRequirement {
    property_type: string;
    location: string;
    budget_min?: number;
    budget_max?: number;
    bedrooms?: number;
    bathrooms?: number;
    size_min?: number;
    size_max?: number;
    amenities?: string[];
    notes?: string;
}

export function sanitizePropertyRequirement(
    data: Partial<PropertyRequirement>
): PropertyRequirement {
    return {
        property_type: sanitizeText(data.property_type || ''),
        location: sanitizeText(data.location || ''),
        budget_min: data.budget_min ? Math.max(0, Number(data.budget_min)) : undefined,
        budget_max: data.budget_max ? Math.max(0, Number(data.budget_max)) : undefined,
        bedrooms: data.bedrooms ? Math.max(0, Math.min(20, Number(data.bedrooms))) : undefined,
        bathrooms: data.bathrooms ? Math.max(0, Math.min(20, Number(data.bathrooms))) : undefined,
        size_min: data.size_min ? Math.max(0, Number(data.size_min)) : undefined,
        size_max: data.size_max ? Math.max(0, Number(data.size_max)) : undefined,
        amenities: data.amenities?.map(a => sanitizeText(a)),
        notes: data.notes ? sanitizeText(data.notes).slice(0, 500) : undefined,
    };
}
