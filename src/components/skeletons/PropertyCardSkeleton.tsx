export function PropertyCardSkeleton() {
    return (
        <div className="animate-pulse bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            {/* Image skeleton */}
            <div className="h-48 bg-zinc-800" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 bg-zinc-800 rounded w-3/4" />

                {/* Location */}
                <div className="h-4 bg-zinc-800 rounded w-1/2" />

                {/* Price */}
                <div className="h-6 bg-zinc-800 rounded w-2/5" />

                {/* Features */}
                <div className="flex gap-2">
                    <div className="h-3 bg-zinc-800 rounded w-16" />
                    <div className="h-3 bg-zinc-800 rounded w-16" />
                    <div className="h-3 bg-zinc-800 rounded w-16" />
                </div>

                {/* Button */}
                <div className="h-10 bg-zinc-800 rounded mt-4" />
            </div>
        </div>
    );
}

/**
 * Grid of skeleton cards
 */
export function PropertyCardSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
            ))}
        </div>
    );
}
