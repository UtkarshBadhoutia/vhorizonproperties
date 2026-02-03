import { Property } from '@/lib/types';
import { X, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ComparisonTableProps {
    properties: Property[];
    onRemove: (id: number) => void;
}

/**
 * Side-by-side property comparison table
 * Highlights best/worst values for easy comparison
 */
export function ComparisonTable({ properties, onRemove }: ComparisonTableProps) {
    if (properties.length === 0) {
        return null;
    }

    // Find min/max values for highlighting
    const prices = properties.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const sizes = properties.map(p => p.size || 0);
    const maxSize = Math.max(...sizes);

    const getHighlightClass = (value: number, min: number, max: number, higherIsBetter = false) => {
        if (properties.length === 1) return '';

        if (higherIsBetter) {
            return value === max ? 'text-green-500 font-semibold' : '';
        } else {
            return value === min ? 'text-green-500 font-semibold' : '';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-zinc-800">
                        <th className="p-4 text-left text-zinc-400 font-medium sticky left-0 bg-zinc-950 z-10">
                            Feature
                        </th>
                        {properties.map((property) => (
                            <th key={property.id} className="p-4 text-left min-w-[250px]">
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="font-semibold text-white truncate">
                                                {property.title}
                                            </div>
                                            <div className="text-sm text-zinc-400 truncate">
                                                {property.location}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onRemove(property.id)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {property.status}
                                    </Badge>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Image */}
                    <tr className="border-b border-zinc-800">
                        <td className="p-4 text-zinc-400 sticky left-0 bg-zinc-950 z-10">
                            Image
                        </td>
                        {properties.map((property) => (
                            <td key={property.id} className="p-4">
                                <img
                                    src={property.heroImage}
                                    alt={property.title}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                            </td>
                        ))}
                    </tr>

                    {/* Price */}
                    <tr className="border-b border-zinc-800">
                        <td className="p-4 text-zinc-400 sticky left-0 bg-zinc-950 z-10">
                            Price
                        </td>
                        {properties.map((property) => (
                            <td
                                key={property.id}
                                className={`p-4 ${getHighlightClass(property.price, minPrice, maxPrice)}`}
                            >
                                <div className="flex items-center gap-2">
                                    ₹{property.price.toLocaleString()}
                                    {property.price === minPrice && properties.length > 1 && (
                                        <TrendingDown className="h-4 w-4 text-green-500" />
                                    )}
                                </div>
                            </td>
                        ))}
                    </tr>

                    {/* Size */}
                    <tr className="border-b border-zinc-800">
                        <td className="p-4 text-zinc-400 sticky left-0 bg-zinc-950 z-10">
                            Size
                        </td>
                        {properties.map((property) => (
                            <td
                                key={property.id}
                                className={`p-4 ${getHighlightClass(property.size || 0, 0, maxSize, true)}`}
                            >
                                <div className="flex items-center gap-2">
                                    {property.size ? `${property.size} sq ft` : 'N/A'}
                                    {property.size === maxSize && properties.length > 1 && property.size > 0 && (
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                    )}
                                </div>
                            </td>
                        ))}
                    </tr>

                    {/* Bedrooms */}
                    <tr className="border-b border-zinc-800">
                        <td className="p-4 text-zinc-400 sticky left-0 bg-zinc-950 z-10">
                            Bedrooms
                        </td>
                        {properties.map((property) => (
                            <td key={property.id} className="p-4">
                                {property.bedrooms || 'N/A'}
                            </td>
                        ))}
                    </tr>

                    {/* Bathrooms */}
                    <tr className="border-b border-zinc-800">
                        <td className="p-4 text-zinc-400 sticky left-0 bg-zinc-950 z-10">
                            Bathrooms
                        </td>
                        {properties.map((property) => (
                            <td key={property.id} className="p-4">
                                {property.bathrooms || 'N/A'}
                            </td>
                        ))}
                    </tr>

                    {/* Property Type */}
                    <tr className="border-b border-zinc-800">
                        <td className="p-4 text-zinc-400 sticky left-0 bg-zinc-950 z-10">
                            Type
                        </td>
                        {properties.map((property) => (
                            <td key={property.id} className="p-4 capitalize">
                                {property.propertyType || 'N/A'}
                            </td>
                        ))}
                    </tr>

                    {/* Amenities */}
                    <tr className="border-b border-zinc-800">
                        <td className="p-4 text-zinc-400 sticky left-0 bg-zinc-950 z-10">
                            Amenities
                        </td>
                        {properties.map((property) => (
                            <td key={property.id} className="p-4">
                                <div className="flex flex-wrap gap-1">
                                    {property.amenities && property.amenities.length > 0 ? (
                                        property.amenities.slice(0, 3).map((amenity, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {amenity}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-zinc-500">None listed</span>
                                    )}
                                    {property.amenities && property.amenities.length > 3 && (
                                        <Badge variant="secondary" className="text-xs">
                                            +{property.amenities.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </td>
                        ))}
                    </tr>

                    {/* Description */}
                    <tr>
                        <td className="p-4 text-zinc-400 sticky left-0 bg-zinc-950 z-10">
                            Description
                        </td>
                        {properties.map((property) => (
                            <td key={property.id} className="p-4">
                                <p className="text-sm text-zinc-300 line-clamp-3">
                                    {property.description || 'No description available'}
                                </p>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
