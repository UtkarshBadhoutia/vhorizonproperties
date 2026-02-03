export function PropertyDetailSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            {/* Hero image skeleton */}
            <div className="h-96 bg-zinc-800 rounded-xl" />

            {/* Title and price */}
            <div className="space-y-3">
                <div className="h-8 bg-zinc-800 rounded w-3/4" />
                <div className="h-6 bg-zinc-800 rounded w-1/3" />
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 bg-zinc-800 rounded" />
                ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
            </div>

            {/* Amenities */}
            <div className="space-y-3">
                <div className="h-6 bg-zinc-800 rounded w-1/4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-10 bg-zinc-800 rounded" />
                    ))}
                </div>
            </div>
        </div>
    );
}
