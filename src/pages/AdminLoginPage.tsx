import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Loader2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in as Admin
    useEffect(() => {
        if (!authLoading && user) {
            if (isAdmin) {
                navigate("/admin");
            } else {
                // If user is logged in but NOT admin, show error or let them re-login as admin (logic below)
                // Ideally we shouldn't auto-redirect normal users to dashboard here, 
                // because they might be admins trying to log in with an admin account.
                // But valid Admins should be redirected.
                // We'll handle the "Not an Admin" case in the submit handler or showing a banner.
            }
        }
    }, [user, isAdmin, authLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;

            // Check if the signed-in user is an admin
            const { data: roleData } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", data.user.id)
                .eq("role", "admin")
                .maybeSingle();

            if (!roleData) {
                // Not an admin, sign them out immediately
                await supabase.auth.signOut();
                throw new Error("Access Denied: You do not have administrator privileges.");
            }

            toast.success("Admin access granted.");
            navigate("/admin");

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Authentication failed";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            <div className="w-full max-w-[400px] space-y-6 relative z-10">
                <div className="text-center space-y-2">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 border border-primary/20">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Admin Portal
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Restricted access area. Authorized personnel only.
                    </p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@vhorizon.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-300">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-zinc-950/50 border-zinc-800 text-white pr-10 placeholder:text-zinc-600 focus-visible:ring-primary/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Lock className="h-3 w-3" /> Authenticate
                                </span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Warning */}
                <Alert className="bg-red-900/10 border-red-900/20 text-red-400">
                    <AlertTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="h-3 w-3" /> Security Notice
                    </AlertTitle>
                    <AlertDescription className="text-xs mt-1 text-red-400/80">
                        All access is logged and monitored. IP addresses are recorded.
                    </AlertDescription>
                </Alert>

                <p className="text-center text-xs text-zinc-600">
                    <Link to="/login" className="hover:text-zinc-400 transition-colors">
                        Not an admin? Go to User Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
