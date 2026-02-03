export function GallerySkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {/* Main image */}
            <div className="h-96 bg-zinc-800 rounded-xl" />

            {/* Thumbnail grid */}
            <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-zinc-800 rounded" />
                ))}
            </div>
        </div>
    );
}
