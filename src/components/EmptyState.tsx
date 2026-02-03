import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * Reusable empty state component
 * 
 * Usage:
 * <EmptyState
 *   icon={Search}
 *   title="No results found"
 *   description="Try adjusting your search or filters"
 *   action={{ label: "Clear filters", onClick: clearFilters }}
 * />
 */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {/* Icon */}
            <div className="mb-4 rounded-full bg-zinc-800/50 p-6">
                <Icon className="h-12 w-12 text-zinc-400" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white mb-2">
                {title}
            </h3>

            {/* Description */}
            <p className="text-zinc-400 max-w-md mb-6">
                {description}
            </p>

            {/* Optional action button */}
            {action && (
                <Button
                    onClick={action.onClick}
                    variant="outline"
                    className="mt-2"
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
}
