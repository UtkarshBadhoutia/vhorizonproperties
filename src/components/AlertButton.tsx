import { useState } from 'react';
import { Bell, BellOff, Loader2, DollarSign } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePropertyAlerts } from '@/hooks/usePropertyAlerts';
import { toast } from 'sonner';

interface AlertButtonProps {
    propertyId: number;
    currentPrice: number;
}

export function AlertButton({ propertyId, currentPrice }: AlertButtonProps) {
    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState<'price_drop' | 'new_property'>('price_drop');
    const [targetPrice, setTargetPrice] = useState(currentPrice * 0.9); // 10% below current
    const { createAlert, hasAlert, isCreating } = usePropertyAlerts(propertyId);

    const alreadyHasAlert = hasAlert(propertyId);

    const handleCreate = () => {
        createAlert(
            {
                propertyId,
                alertType,
                targetPrice: alertType === 'price_drop' ? targetPrice : undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Alert created successfully!');
                    setOpen(false);
                },
                onError: () => {
                    toast.error('Failed to create alert');
                },
            }
        );
    };

    if (alreadyHasAlert) {
        return (
            <Button variant="outline" size="sm" disabled>
                <BellOff className="h-4 w-4 mr-2" />
                Alert Active
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-white">Create Property Alert</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Get notified when this property matches your criteria
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-3">
                        <Label className="text-zinc-300">Alert Type</Label>
                        <RadioGroup value={alertType} onValueChange={(v) => setAlertType(v as 'price_drop' | 'new_property')}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="price_drop" id="price_drop" />
                                <Label htmlFor="price_drop" className="text-zinc-300 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        Price Drop Alert
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        Notify me when price drops below target
                                    </p>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {alertType === 'price_drop' && (
                        <div className="space-y-2">
                            <Label htmlFor="target-price" className="text-zinc-300">
                                Target Price
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                    ₹
                                </span>
                                <Input
                                    id="target-price"
                                    type="number"
                                    value={targetPrice}
                                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                                    className="bg-zinc-950/50 border-zinc-800 text-white pl-8"
                                    disabled={isCreating}
                                />
                            </div>
                            <p className="text-xs text-zinc-500">
                                Current price: ₹{currentPrice.toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isCreating}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={isCreating}>
                        {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Create Alert
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
