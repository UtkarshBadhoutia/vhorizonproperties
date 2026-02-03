/**
 * Debug logging utility
 * Only logs in development mode to keep production console clean
 */

type LogData = unknown;

const isDev = import.meta.env.DEV;

export const debugLog = {
    /**
     * Authentication-related logs
     */
    auth: (message: string, data?: LogData) => {
        if (isDev) {
            if (data !== undefined) {
                console.log(`[Auth] ${message}`, data);
            } else {
                console.log(`[Auth] ${message}`);
            }
        }
    },

    /**
     * Authentication errors
     */
    authError: (message: string, error?: LogData) => {
        if (isDev) {
            if (error !== undefined) {
                console.error(`[Auth Error] ${message}`, error);
            } else {
                console.error(`[Auth Error] ${message}`);
            }
        }
    },

    /**
     * General warnings
     */
    warn: (message: string, data?: LogData) => {
        if (isDev) {
            if (data !== undefined) {
                console.warn(message, data);
            } else {
                console.warn(message);
            }
        }
    },

    /**
     * General info logs
     */
    info: (message: string, data?: LogData) => {
        if (isDev) {
            if (data !== undefined) {
                console.log(message, data);
            } else {
                console.log(message);
            }
        }
    },
};
