import React from 'react';
import { Image, Transformation } from 'cloudinary-react';

interface OptimizedImageProps {
    publicId: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
    quality?: 'auto' | number;
    loading?: 'lazy' | 'eager';
}

/**
 * Optimized image component using Cloudinary
 * 
 * Features:
 * - Automatic format conversion (WebP, AVIF)
 * - Responsive sizing
 * - Lazy loading
 * - Quality optimization
 * 
 * Setup:
 * 1. Create Cloudinary account at cloudinary.com
 * 2. Add VITE_CLOUDINARY_CLOUD_NAME to .env
 * 3. Upload images to Cloudinary
 * 
 * Usage:
 * <OptimizedImage 
 *   publicId="properties/hero-image" 
 *   alt="Property" 
 *   width={800}
 * />
 */
export function OptimizedImage({
    publicId,
    alt,
    width = 800,
    height,
    className = '',
    crop = 'fill',
    quality = 'auto',
    loading = 'lazy',
}: OptimizedImageProps) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    // Fallback to regular img if Cloudinary not configured
    if (!cloudName) {
        return (
            <img
                src={publicId}
                alt={alt}
                width={width}
                height={height}
                className={className}
                loading={loading}
            />
        );
    }

    return (
        <Image
            cloudName={cloudName}
            publicId={publicId}
            alt={alt}
            className={className}
            loading={loading}
            secure
        >
            <Transformation
                width={width}
                height={height}
                crop={crop}
                quality={quality}
                fetchFormat="auto"
                dpr="auto"
            />
        </Image>
    );
}

/**
 * Responsive image with multiple sizes
 */
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'width'> {
    sizes?: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
}

export function ResponsiveImage({
    publicId,
    alt,
    sizes = { mobile: 400, tablet: 768, desktop: 1200 },
    ...props
}: ResponsiveImageProps) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
        return (
            <img
                src={publicId}
                alt={alt}
                className={props.className}
                loading={props.loading}
            />
        );
    }

    return (
        <picture>
            <source
                media="(max-width: 640px)"
                srcSet={`https://res.cloudinary.com/${cloudName}/image/upload/w_${sizes.mobile},f_auto,q_auto/${publicId}`}
            />
            <source
                media="(max-width: 1024px)"
                srcSet={`https://res.cloudinary.com/${cloudName}/image/upload/w_${sizes.tablet},f_auto,q_auto/${publicId}`}
            />
            <img
                src={`https://res.cloudinary.com/${cloudName}/image/upload/w_${sizes.desktop},f_auto,q_auto/${publicId}`}
                alt={alt}
                className={props.className}
                loading={props.loading || 'lazy'}
            />
        </picture>
    );
}
