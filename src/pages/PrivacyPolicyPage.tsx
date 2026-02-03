import { SEO } from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <SEO
                title="Privacy Policy - V Horizon Properties"
                description="Privacy Policy for V Horizon Properties"
            />
            <StructuredData type="organization" />

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                <div className="prose prose-invert max-w-none space-y-6">
                    <p className="text-zinc-400">
                        <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                    </p>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                        <p className="text-zinc-300">
                            V Horizon Properties is committed to protecting your privacy. This policy explains how we collect,
                            use, and safeguard your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2">
                            <li>Personal information (name, email, phone)</li>
                            <li>Property preferences and requirements</li>
                            <li>Usage data and analytics</li>
                            <li>Cookies and tracking technologies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2">
                            <li>Provide and improve our services</li>
                            <li>Process property requirements</li>
                            <li>Send updates and notifications</li>
                            <li>Analyze usage and improve user experience</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                        <p className="text-zinc-300">
                            We implement appropriate security measures to protect your personal information. However,
                            no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                        <p className="text-zinc-300">
                            For privacy-related questions: vhorizonproperties.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
