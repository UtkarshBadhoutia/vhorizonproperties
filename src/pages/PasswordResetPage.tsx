import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PasswordResetPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        // Check if we have an access token in the URL (from password reset email)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');

        if (accessToken) {
            setHasToken(true);
        } else {
            toast.error("Invalid or expired reset link");
            setTimeout(() => navigate("/forgot-password"), 2000);
        }
    }, [navigate]);

    const getPasswordStrength = (pwd: string) => {
        if (pwd.length === 0) return { strength: 0, label: "", color: "" };
        if (pwd.length < 6) return { strength: 1, label: "Too short", color: "text-red-500" };
        if (pwd.length < 8) return { strength: 2, label: "Weak", color: "text-orange-500" };

        let strength = 2;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;

        if (strength >= 4) return { strength: 4, label: "Strong", color: "text-green-500" };
        return { strength: 3, label: "Good", color: "text-yellow-500" };
    };

    const passwordStrength = getPasswordStrength(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
    const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            toast.success("Password updated successfully!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update password";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!hasToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            <div className="w-full max-w-[400px] space-y-6 relative z-10">
                <div className="text-center space-y-2">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 border border-primary/20">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Create New Password
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Enter a strong password to secure your account.
                    </p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-300">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="bg-zinc-950/50 border-zinc-800 text-white pr-10 placeholder:text-zinc-600 focus-visible:ring-primary/50"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {password.length > 0 && (
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${passwordStrength.strength === 1 ? 'w-1/4 bg-red-500' :
                                                    passwordStrength.strength === 2 ? 'w-1/2 bg-orange-500' :
                                                        passwordStrength.strength === 3 ? 'w-3/4 bg-yellow-500' :
                                                            'w-full bg-green-500'
                                                }`}
                                        />
                                    </div>
                                    <span className={passwordStrength.color}>{passwordStrength.label}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="bg-zinc-950/50 border-zinc-800 text-white pr-10 placeholder:text-zinc-600 focus-visible:ring-primary/50"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && (
                                <div className="flex items-center gap-1 text-xs">
                                    {passwordsMatch ? (
                                        <>
                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                            <span className="text-green-500">Passwords match</span>
                                        </>
                                    ) : passwordsDontMatch ? (
                                        <>
                                            <XCircle className="h-3 w-3 text-red-500" />
                                            <span className="text-red-500">Passwords don't match</span>
                                        </>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            disabled={loading || !passwordsMatch || password.length < 6}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>Reset Password</>
                            )}
                        </Button>
                    </form>

                    <Alert className="mt-4 bg-blue-900/10 border-blue-900/20 text-blue-400">
                        <AlertDescription className="text-xs">
                            Use at least 8 characters with a mix of letters, numbers, and symbols for a strong password.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </div>
    );
}
