import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { debugLog } from "@/lib/debug";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [timeoutReached, setTimeoutReached] = useState(false);

    useEffect(() => {
        let mounted = true;

        const handleAuthCallback = async () => {
            try {
                debugLog.auth("Starting authentication callback processing...");
                debugLog.auth("URL", window.location.href);

                // Check for error parameters in the URL (hash or search)
                const params = new URLSearchParams(window.location.hash.substring(1)); // For implicit flow
                const queryParams = new URLSearchParams(window.location.search); // For PKCE flow

                const error = params.get('error') || queryParams.get('error');
                const errorDescription = params.get('error_description') || queryParams.get('error_description');

                debugLog.auth("URL params check", { error, errorDescription });

                if (error) {
                    debugLog.authError("Auth callback error", { error, errorDescription });
                    toast.error(`Authentication failed: ${errorDescription || error}`);
                    if (mounted) navigate("/login", { replace: true });
                    return;
                }

                // v2: getSession() handles URL parsing for both implicit and PKCE flows automatically
                debugLog.auth("Retrieving session from Supabase...");
                const startTime = Date.now();
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                const elapsed = Date.now() - startTime;
                debugLog.auth(`Session retrieval took ${elapsed}ms`);

                if (sessionError) {
                    debugLog.authError("Session retrieval error", sessionError);
                    toast.error("Failed to establish session. Please try again.");
                    if (mounted) navigate("/login", { replace: true });
                    return;
                }

                if (!session) {
                    debugLog.warn("No session found after callback");
                    toast.error("No session established. Please sign in again.");
                    if (mounted) navigate("/login", { replace: true });
                    return;
                }

                // Successful session establishment
                debugLog.auth("Session established successfully for user", session.user.email);
                debugLog.auth("Redirecting to dashboard...");
                toast.success("Signed in successfully!");
                if (mounted) navigate("/dashboard", { replace: true });
            } catch (err) {
                debugLog.authError("Unexpected error handling auth callback", err);
                toast.error("An unexpected error occurred. Please try again.");
                if (mounted) navigate("/login", { replace: true });
            }
        };

        // Set a timeout to prevent infinite loading (increased to 15 seconds for slower connections)
        const timeoutId = setTimeout(() => {
            if (mounted) {
                debugLog.authError("Authentication timeout reached (15s)");
                setTimeoutReached(true);
                toast.error("Authentication is taking too long. Please check your connection and try again.");
                navigate("/login", { replace: true });
            }
        }, 15000); // 15 second timeout

        handleAuthCallback();

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                        {timeoutReached ? "Authentication Timeout" : "Signing you in..."}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {timeoutReached
                            ? "Redirecting you back to login..."
                            : "Please wait while we complete your sign-in"}
                    </p>
                </div>
            </div>
        </div>
    );
}
