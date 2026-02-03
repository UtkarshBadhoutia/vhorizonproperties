import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { debugLog } from '@/lib/debug';

export interface SavedSearch {
    id: string;
    user_id: string;
    name: string;
    filters: {
        status?: string;
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        bedrooms?: number;
        bathrooms?: number;
        amenities?: string[];
        propertyType?: string;
    };
    created_at: string;
    updated_at: string;
}

/**
 * Hook for managing saved searches
 */
export function useSavedSearches() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch saved searches
    const { data: savedSearches = [], isLoading, error } = useQuery({
        queryKey: ['saved-searches', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('saved_searches')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                debugLog.authError('Error fetching saved searches:', error);
                throw error;
            }

            return data as SavedSearch[];
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });

    // Save search
    const saveSearch = useMutation({
        mutationFn: async ({ name, filters }: { name: string; filters: SavedSearch['filters'] }) => {
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('saved_searches')
                .insert({
                    user_id: user.id,
                    name,
                    filters,
                })
                .select()
                .single();

            if (error) {
                debugLog.authError('Error saving search:', error);
                throw error;
            }

            return data as SavedSearch;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved-searches', user?.id] });
        },
    });

    // Update search
    const updateSearch = useMutation({
        mutationFn: async ({ id, name, filters }: { id: string; name: string; filters: SavedSearch['filters'] }) => {
            const { data, error } = await supabase
                .from('saved_searches')
                .update({ name, filters, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                debugLog.authError('Error updating search:', error);
                throw error;
            }

            return data as SavedSearch;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved-searches', user?.id] });
        },
    });

    // Delete search
    const deleteSearch = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('saved_searches')
                .delete()
                .eq('id', id);

            if (error) {
                debugLog.authError('Error deleting search:', error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved-searches', user?.id] });
        },
    });

    return {
        savedSearches,
        isLoading,
        error,
        saveSearch: saveSearch.mutate,
        updateSearch: updateSearch.mutate,
        deleteSearch: deleteSearch.mutate,
        isSaving: saveSearch.isPending,
        isUpdating: updateSearch.isPending,
        isDeleting: deleteSearch.isPending,
    };
}
