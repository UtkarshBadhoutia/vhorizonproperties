import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSavedSearches, SavedSearch } from '@/hooks/useSavedSearches';
import { toast } from 'sonner';

interface SaveSearchButtonProps {
    filters: SavedSearch['filters'];
}

export function SaveSearchButton({ filters }: SaveSearchButtonProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const { saveSearch, isSaving } = useSavedSearches();

    const handleSave = () => {
        if (!name.trim()) {
            toast.error('Please enter a name for this search');
            return;
        }

        saveSearch(
            { name: name.trim(), filters },
            {
                onSuccess: () => {
                    toast.success('Search saved successfully!');
                    setOpen(false);
                    setName('');
                },
                onError: () => {
                    toast.error('Failed to save search');
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Search
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-white">Save Search</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Save your current filters to quickly access them later
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-300">
                            Search Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g., Luxury Apartments in Delhi"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-zinc-950/50 border-zinc-800 text-white"
                            disabled={isSaving}
                        />
                    </div>

                    {/* Show current filters */}
                    <div className="space-y-2">
                        <Label className="text-zinc-400 text-sm">Current Filters:</Label>
                        <div className="text-sm text-zinc-500 space-y-1">
                            {filters.status && <div>• Status: {filters.status}</div>}
                            {filters.location && <div>• Location: {filters.location}</div>}
                            {filters.minPrice && <div>• Min Price: ₹{filters.minPrice.toLocaleString()}</div>}
                            {filters.maxPrice && <div>• Max Price: ₹{filters.maxPrice.toLocaleString()}</div>}
                            {filters.bedrooms && <div>• Bedrooms: {filters.bedrooms}</div>}
                            {filters.bathrooms && <div>• Bathrooms: {filters.bathrooms}</div>}
                            {filters.propertyType && <div>• Type: {filters.propertyType}</div>}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
