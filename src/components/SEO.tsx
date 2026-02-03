import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    type?: 'website' | 'article' | 'profile';
    url?: string;
    keywords?: string[];
}

/**
 * SEO component for managing meta tags
 * Includes Open Graph and Twitter Card support
 */
export function SEO({
    title,
    description,
    image = 'https://vhorizonproperties.com/og-image.jpg',
    type = 'website',
    url,
    keywords = [],
}: SEOProps) {
    const siteUrl = 'https://vhorizonproperties.com';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

    const defaultKeywords = [
        'real estate',
        'properties',
        'buy property',
        'rent property',
        'Delhi properties',
        'V Horizon Properties',
    ];

    const allKeywords = [...defaultKeywords, ...keywords].join(', ');

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={allKeywords} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content="V Horizon Properties" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta name="robots" content="index, follow" />
            <meta name="author" content="V Horizon Properties" />
        </Helmet>
    );
}
