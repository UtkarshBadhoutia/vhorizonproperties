import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { debugLog } from "@/lib/debug";
import { rateLimiter, RateLimitConfigs } from "@/lib/rateLimit";
import { sanitizeEmail } from "@/lib/sanitize";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Rate limiting check
        const rateLimitKey = `password-reset:${email.toLowerCase()}`;
        if (!rateLimiter.check(rateLimitKey, RateLimitConfigs.passwordReset)) {
            const resetTime = rateLimiter.getResetTime(rateLimitKey);
            toast.error(`Too many password reset attempts. Please try again in ${Math.ceil(resetTime / 60)} minutes.`);
            return;
        }

        setLoading(true);

        try {
            // Sanitize email
            const sanitizedEmail = sanitizeEmail(email);

            const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                debugLog.authError("Password reset error:", error);
                throw error;
            }

            debugLog.auth("Password reset email sent to:", sanitizedEmail);
            setEmailSent(true);
            toast.success("Password reset link sent! Check your email.");
            // Clear rate limit on successful request
            rateLimiter.clear(rateLimitKey);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to send reset email";
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
                        <Mail className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Reset Your Password
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {emailSent ? (
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-2xl backdrop-blur-sm space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-white">Check Your Email</h3>
                                <p className="text-sm text-zinc-400">
                                    We've sent a password reset link to <span className="text-white font-medium">{email}</span>
                                </p>
                                <p className="text-xs text-zinc-500 mt-4">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setEmailSent(false);
                                setEmail("");
                            }}
                        >
                            Try Another Email
                        </Button>
                    </div>
                ) : (
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary/50"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>Send Reset Link</>
                                )}
                            </Button>
                        </form>

                        <Alert className="mt-4 bg-blue-900/10 border-blue-900/20 text-blue-400">
                            <AlertDescription className="text-xs">
                                The reset link will expire in 1 hour for security purposes.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <p className="text-center text-xs text-zinc-600">
                    <Link to="/login" className="hover:text-zinc-400 transition-colors inline-flex items-center gap-1">
                        <ArrowLeft className="h-3 w-3" />
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
