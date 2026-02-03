import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 p-4 shadow-2xl"
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-description"
        >
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <h3 id="cookie-consent-title" className="font-semibold text-white mb-1">
                                We use cookies
                            </h3>
                            <p id="cookie-consent-description" className="text-sm text-zinc-400">
                                We use cookies to enhance your experience. By clicking "Accept", you consent to our use of cookies.{' '}
                                <a href="/privacy-policy" className="text-primary hover:underline">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" onClick={handleDecline}>
                            Decline
                        </Button>
                        <Button size="sm" onClick={handleAccept}>
                            Accept
                        </Button>
                        <button
                            onClick={handleDecline}
                            className="p-2 text-zinc-400 hover:text-white"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
