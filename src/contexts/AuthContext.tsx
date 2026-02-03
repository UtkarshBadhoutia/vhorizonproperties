import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";
import { debugLog } from "@/lib/debug";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: React.ReactNode;
    queryClient: QueryClient;
}

export function AuthProvider({ children, queryClient }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        let mounted = true;

        const checkAdminRole = async (userId: string) => {
            try {
                const { data, error } = await supabase
                    .from("user_roles")
                    .select("role")
                    .eq("user_id", userId)
                    .eq("role", "admin")
                    .maybeSingle();

                if (!mounted) return;

                if (error) {
                    debugLog.authError("Error checking admin role", error);
                    setIsAdmin(false);
                } else {
                    setIsAdmin(!!data);
                }
            } catch (err) {
                debugLog.authError("Error checking admin role", err);
                if (mounted) setIsAdmin(false);
            }
        };


        const initSession = async () => {
            debugLog.auth("initSession started");
            debugLog.auth("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
            debugLog.auth("Supabase Key present:", !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

            try {    // Add timeout to prevent infinite loading if Supabase hangs
                // Increased to 10 seconds to account for slow connections
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Supabase getSession timeout after 10s')), 10000)
                );

                const sessionPromise = supabase.auth.getSession();

                // Race between the actual call and timeout
                const { data: { session: currentSession }, error } = await Promise.race([
                    sessionPromise,
                    timeoutPromise
                ]) as Awaited<ReturnType<typeof supabase.auth.getSession>>;

                debugLog.auth("getSession result", { currentSession, error });

                if (mounted) {
                    if (error) {
                        // If error (invalid token, etc.), assume logged out
                        debugLog.authError("Session verification failed", error);
                        setSession(null);
                        setUser(null);
                    } else {
                        setSession(currentSession);
                        setUser(currentSession?.user ?? null);
                        if (currentSession?.user) {
                            debugLog.auth("Checking admin role");
                            await checkAdminRole(currentSession.user.id);
                        }
                    }
                }
            } catch (err) {
                debugLog.authError("Session init error", err);
                if (mounted) {
                    setSession(null);
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    debugLog.auth("Setting loading to false");
                    setLoading(false);
                }
            }
        };

        debugLog.auth("Calling initSession");
        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
                if (!mounted) return;

                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                if (currentSession?.user) {
                    // Check admin role again on auth state change (like sign in)
                    await checkAdminRole(currentSession.user.id);
                } else {
                    setIsAdmin(false);
                }
                setLoading(false);

                // Refetch all queries when user signs in
                if (event === "SIGNED_IN") {
                    queryClient.invalidateQueries();
                }

                // Clear all cached data when user signs out
                if (event === "SIGNED_OUT") {
                    queryClient.clear();
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [queryClient]);

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            debugLog.authError("Error signing out", error);
        } finally {
            setUser(null);
            setIsAdmin(false);
            // Clear all React Query cache to prevent stale data from persisting
            queryClient.clear();
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
