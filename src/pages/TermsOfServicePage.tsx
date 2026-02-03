import { SEO } from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <SEO
                title="Terms of Service - V Horizon Properties"
                description="Terms of Service for V Horizon Properties"
            />
            <StructuredData type="organization" />

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

                <div className="prose prose-invert max-w-none space-y-6">
                    <p className="text-zinc-400">
                        <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                    </p>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-zinc-300">
                            By using V Horizon Properties, you agree to these Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
                        <p className="text-zinc-300 mb-4">You agree to:</p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2">
                            <li>Provide accurate information</li>
                            <li>Maintain account security</li>
                            <li>Notify us of unauthorized access</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. User Conduct</h2>
                        <p className="text-zinc-300 mb-4">You agree not to:</p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2">
                            <li>Post false or misleading listings</li>
                            <li>Harass or harm other users</li>
                            <li>Violate applicable laws</li>
                            <li>Attempt unauthorized access</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Disclaimer</h2>
                        <p className="text-zinc-300">
                            THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
                        <p className="text-zinc-300">
                            For questions: vhorizonproperties.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
