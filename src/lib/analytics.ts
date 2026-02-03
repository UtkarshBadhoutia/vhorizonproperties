// Analytics tracking component
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

export function AnalyticsTracker() {
    const location = useLocation();

    useEffect(() => {
        if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
            ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
        }
    }, [location]);

    return null;
}

// Custom event tracking functions
export const trackEvent = (category: string, action: string, label?: string) => {
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
        ReactGA.event({
            category,
            action,
            label,
        });
    }
};

export const trackPropertyView = (propertyId: number, propertyTitle: string) => {
    trackEvent('Property', 'View', `${propertyId}: ${propertyTitle}`);
};

export const trackSearch = (query: string) => {
    trackEvent('Search', 'Query', query);
};

export const trackContactForm = (propertyId?: number) => {
    trackEvent('Contact', 'Form Submit', propertyId ? `Property ${propertyId}` : 'General');
};

export const trackFavorite = (propertyId: number, action: 'add' | 'remove') => {
    trackEvent('Favorites', action === 'add' ? 'Add' : 'Remove', `Property ${propertyId}`);
};
