import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { debugLog } from '@/lib/debug';

export interface Booking {
    id: string;
    property_id: number;
    user_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    notes?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Hook for managing bookings
 */
export function useBookings(propertyId?: number) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch bookings
    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ['bookings', user?.id, propertyId],
        queryFn: async () => {
            if (!user) return [];

            let query = supabase
                .from('bookings')
                .select('*')
                .eq('user_id', user.id);

            if (propertyId) {
                query = query.eq('property_id', propertyId);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) {
                debugLog.authError('Error fetching bookings:', error);
                throw error;
            }

            return data as Booking[];
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });

    // Create booking
    const createBooking = useMutation({
        mutationFn: async ({
            propertyId,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            notes,
        }: {
            propertyId: number;
            checkIn: string;
            checkOut: string;
            guests: number;
            totalPrice: number;
            notes?: string;
        }) => {
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    property_id: propertyId,
                    user_id: user.id,
                    check_in: checkIn,
                    check_out: checkOut,
                    guests,
                    total_price: totalPrice,
                    notes,
                    status: 'pending',
                })
                .select()
                .single();

            if (error) {
                debugLog.authError('Error creating booking:', error);
                throw error;
            }

            return data as Booking;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });

    // Update booking status
    const updateBookingStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: Booking['status'] }) => {
            const { data, error } = await supabase
                .from('bookings')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                debugLog.authError('Error updating booking:', error);
                throw error;
            }

            return data as Booking;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });

    // Cancel booking
    const cancelBooking = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('bookings')
                .update({ status: 'cancelled', updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                debugLog.authError('Error cancelling booking:', error);
                throw error;
            }

            return data as Booking;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });

    return {
        bookings,
        isLoading,
        error,
        createBooking: createBooking.mutate,
        updateBookingStatus: updateBookingStatus.mutate,
        cancelBooking: cancelBooking.mutate,
        isCreating: createBooking.isPending,
        isUpdating: updateBookingStatus.isPending,
        isCancelling: cancelBooking.isPending,
    };
}
