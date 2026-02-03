import { useState } from 'react';
import { Calendar, Users, Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useBookings } from '@/hooks/useBookings';
import { toast } from 'sonner';
import { differenceInDays, format } from 'date-fns';

interface BookingFormProps {
    propertyId: number;
    pricePerNight: number;
    propertyTitle: string;
}

export function BookingForm({ propertyId, pricePerNight, propertyTitle }: BookingFormProps) {
    const [open, setOpen] = useState(false);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [notes, setNotes] = useState('');
    const { createBooking, isCreating } = useBookings();

    const calculateTotal = () => {
        if (!checkIn || !checkOut) return 0;
        const nights = differenceInDays(new Date(checkOut), new Date(checkIn));
        return nights > 0 ? nights * pricePerNight : 0;
    };

    const totalPrice = calculateTotal();
    const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0;

    const handleSubmit = () => {
        if (!checkIn || !checkOut) {
            toast.error('Please select check-in and check-out dates');
            return;
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            toast.error('Check-out must be after check-in');
            return;
        }

        if (guests < 1) {
            toast.error('Please specify number of guests');
            return;
        }

        createBooking(
            {
                propertyId,
                checkIn,
                checkOut,
                guests,
                totalPrice,
                notes: notes.trim() || undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Booking request submitted successfully!');
                    setOpen(false);
                    setCheckIn('');
                    setCheckOut('');
                    setGuests(1);
                    setNotes('');
                },
                onError: () => {
                    toast.error('Failed to submit booking request');
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">Book {propertyTitle}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Submit a booking request for this property
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Check-in */}
                    <div className="space-y-2">
                        <Label htmlFor="check-in" className="text-zinc-300">
                            Check-in Date
                        </Label>
                        <Input
                            id="check-in"
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            className="bg-zinc-950/50 border-zinc-800 text-white"
                            disabled={isCreating}
                        />
                    </div>

                    {/* Check-out */}
                    <div className="space-y-2">
                        <Label htmlFor="check-out" className="text-zinc-300">
                            Check-out Date
                        </Label>
                        <Input
                            id="check-out"
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={checkIn || format(new Date(), 'yyyy-MM-dd')}
                            className="bg-zinc-950/50 border-zinc-800 text-white"
                            disabled={isCreating}
                        />
                    </div>

                    {/* Guests */}
                    <div className="space-y-2">
                        <Label htmlFor="guests" className="text-zinc-300">
                            Number of Guests
                        </Label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                id="guests"
                                type="number"
                                min="1"
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                                className="bg-zinc-950/50 border-zinc-800 text-white pl-10"
                                disabled={isCreating}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-zinc-300">
                            Special Requests (Optional)
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder="Any special requests or requirements..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-zinc-950/50 border-zinc-800 text-white resize-none"
                            rows={3}
                            disabled={isCreating}
                        />
                    </div>

                    {/* Price Summary */}
                    {nights > 0 && (
                        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">
                                    ₹{pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}
                                </span>
                                <span className="text-white">₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold pt-2 border-t border-zinc-700">
                                <span className="text-white">Total</span>
                                <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                            </div>
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
                    <Button onClick={handleSubmit} disabled={isCreating || !totalPrice}>
                        {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Submit Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
