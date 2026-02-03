/**
 * Rate limiting utility
 * Prevents abuse by limiting the number of requests
 */

interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
    blockDurationMs?: number;
}

interface RateLimitEntry {
    count: number;
    resetAt: number;
    blockedUntil?: number;
}

class RateLimiter {
    private attempts: Map<string, RateLimitEntry> = new Map();

    /**
     * Check if action is allowed
     * @param key Unique identifier (e.g., email, IP)
     * @param config Rate limit configuration
     * @returns true if allowed, false if rate limited
     */
    check(key: string, config: RateLimitConfig): boolean {
        const now = Date.now();
        const entry = this.attempts.get(key);

        // Check if blocked
        if (entry?.blockedUntil && now < entry.blockedUntil) {
            return false;
        }

        // Reset if window expired
        if (!entry || now > entry.resetAt) {
            this.attempts.set(key, {
                count: 1,
                resetAt: now + config.windowMs,
            });
            return true;
        }

        // Increment count
        entry.count++;

        // Block if exceeded
        if (entry.count > config.maxAttempts) {
            entry.blockedUntil = now + (config.blockDurationMs || config.windowMs * 2);
            this.attempts.set(key, entry);
            return false;
        }

        this.attempts.set(key, entry);
        return true;
    }

    /**
     * Get remaining attempts
     */
    getRemaining(key: string, config: RateLimitConfig): number {
        const entry = this.attempts.get(key);
        if (!entry) return config.maxAttempts;

        const now = Date.now();
        if (now > entry.resetAt) return config.maxAttempts;

        return Math.max(0, config.maxAttempts - entry.count);
    }

    /**
     * Get time until reset (in seconds)
     */
    getResetTime(key: string): number {
        const entry = this.attempts.get(key);
        if (!entry) return 0;

        const now = Date.now();
        if (entry.blockedUntil && now < entry.blockedUntil) {
            return Math.ceil((entry.blockedUntil - now) / 1000);
        }

        if (now < entry.resetAt) {
            return Math.ceil((entry.resetAt - now) / 1000);
        }

        return 0;
    }

    /**
     * Clear rate limit for a key
     */
    clear(key: string): void {
        this.attempts.delete(key);
    }

    /**
     * Clear all rate limits
     */
    clearAll(): void {
        this.attempts.clear();
    }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Predefined configurations
export const RateLimitConfigs = {
    // Login: 5 attempts per 15 minutes
    login: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000,
        blockDurationMs: 30 * 60 * 1000, // 30 min block
    },

    // Password reset: 3 attempts per hour
    passwordReset: {
        maxAttempts: 3,
        windowMs: 60 * 60 * 1000,
        blockDurationMs: 2 * 60 * 60 * 1000, // 2 hour block
    },

    // Contact form: 5 submissions per hour
    contactForm: {
        maxAttempts: 5,
        windowMs: 60 * 60 * 1000,
        blockDurationMs: 60 * 60 * 1000, // 1 hour block
    },

    // Search: 30 queries per minute
    search: {
        maxAttempts: 30,
        windowMs: 60 * 1000,
    },

    // API calls: 100 per minute
    api: {
        maxAttempts: 100,
        windowMs: 60 * 1000,
    },
} as const;

/**
 * React hook for rate limiting
 */
export function useRateLimit(key: string, config: RateLimitConfig) {
    const check = () => rateLimiter.check(key, config);
    const getRemaining = () => rateLimiter.getRemaining(key, config);
    const getResetTime = () => rateLimiter.getResetTime(key);
    const clear = () => rateLimiter.clear(key);

    return {
        check,
        getRemaining,
        getResetTime,
        clear,
    };
}
