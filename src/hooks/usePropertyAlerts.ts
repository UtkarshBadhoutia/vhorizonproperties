import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { debugLog } from '@/lib/debug';

export interface PropertyAlert {
    id: string;
    user_id: string;
    property_id: number;
    alert_type: 'price_drop' | 'new_property';
    target_price?: number;
    is_active: boolean;
    created_at: string;
}

/**
 * Hook for managing property alerts
 */
export function usePropertyAlerts(propertyId?: number) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch alerts for user
    const { data: alerts = [], isLoading, error } = useQuery({
        queryKey: ['property-alerts', user?.id, propertyId],
        queryFn: async () => {
            if (!user) return [];

            let query = supabase
                .from('property_alerts')
                .select('*')
                .eq('user_id', user.id);

            if (propertyId) {
                query = query.eq('property_id', propertyId);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) {
                debugLog.authError('Error fetching alerts:', error);
                throw error;
            }

            return data as PropertyAlert[];
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });

    // Create alert
    const createAlert = useMutation({
        mutationFn: async ({
            propertyId,
            alertType,
            targetPrice,
        }: {
            propertyId: number;
            alertType: 'price_drop' | 'new_property';
            targetPrice?: number;
        }) => {
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('property_alerts')
                .insert({
                    user_id: user.id,
                    property_id: propertyId,
                    alert_type: alertType,
                    target_price: targetPrice,
                    is_active: true,
                })
                .select()
                .single();

            if (error) {
                debugLog.authError('Error creating alert:', error);
                throw error;
            }

            return data as PropertyAlert;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
        },
    });

    // Toggle alert active status
    const toggleAlert = useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            const { data, error } = await supabase
                .from('property_alerts')
                .update({ is_active: isActive })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                debugLog.authError('Error toggling alert:', error);
                throw error;
            }

            return data as PropertyAlert;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
        },
    });

    // Delete alert
    const deleteAlert = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('property_alerts')
                .delete()
                .eq('id', id);

            if (error) {
                debugLog.authError('Error deleting alert:', error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
        },
    });

    // Check if alert exists for property
    const hasAlert = (propertyId: number) => {
        return alerts.some(alert => alert.property_id === propertyId && alert.is_active);
    };

    return {
        alerts,
        isLoading,
        error,
        createAlert: createAlert.mutate,
        toggleAlert: toggleAlert.mutate,
        deleteAlert: deleteAlert.mutate,
        hasAlert,
        isCreating: createAlert.isPending,
        isToggling: toggleAlert.isPending,
        isDeleting: deleteAlert.isPending,
    };
}
