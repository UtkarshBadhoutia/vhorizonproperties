import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { debugLog } from '@/lib/debug';
import { sanitizeText } from '@/lib/sanitize';

export interface Message {
    id: string;
    property_id: number;
    sender_id: string;
    receiver_id: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

/**
 * Hook for managing messages
 */
export function useMessages(propertyId?: number, receiverId?: string) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch messages
    const { data: messages = [], isLoading, error } = useQuery({
        queryKey: ['messages', user?.id, propertyId, receiverId],
        queryFn: async () => {
            if (!user) return [];

            let query = supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

            if (propertyId) {
                query = query.eq('property_id', propertyId);
            }

            if (receiverId) {
                query = query.or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`);
            }

            const { data, error } = await query.order('created_at', { ascending: true });

            if (error) {
                debugLog.authError('Error fetching messages:', error);
                throw error;
            }

            return data as Message[];
        },
        enabled: !!user,
        staleTime: 30 * 1000, // 30 seconds
    });

    // Send message
    const sendMessage = useMutation({
        mutationFn: async ({
            propertyId,
            receiverId,
            message,
        }: {
            propertyId: number;
            receiverId: string;
            message: string;
        }) => {
            if (!user) throw new Error('User not authenticated');

            // Sanitize message
            const sanitizedMessage = sanitizeText(message);

            const { data, error } = await supabase
                .from('messages')
                .insert({
                    property_id: propertyId,
                    sender_id: user.id,
                    receiver_id: receiverId,
                    message: sanitizedMessage,
                    is_read: false,
                })
                .select()
                .single();

            if (error) {
                debugLog.authError('Error sending message:', error);
                throw error;
            }

            return data as Message;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });

    // Mark message as read
    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                debugLog.authError('Error marking message as read:', error);
                throw error;
            }

            return data as Message;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });

    // Get unread count
    const unreadCount = messages.filter(
        m => m.receiver_id === user?.id && !m.is_read
    ).length;

    return {
        messages,
        isLoading,
        error,
        sendMessage: sendMessage.mutate,
        markAsRead: markAsRead.mutate,
        unreadCount,
        isSending: sendMessage.isPending,
        isMarking: markAsRead.isPending,
    };
}
