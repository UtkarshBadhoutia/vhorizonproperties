import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { HelmetProvider } from "react-helmet-async";
import * as Sentry from "@sentry/react";

// Initialize Sentry for error monitoring
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
                maskAllText: false,
                blockAllMedia: false,
            }),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of transactions in production
        // Session Replay
        replaysSessionSampleRate: 0.1, // Sample 10% of sessions
        replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
    });
}

createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
        <App />
    </HelmetProvider>
);
