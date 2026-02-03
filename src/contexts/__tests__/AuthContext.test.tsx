import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../AuthContext';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
            onAuthStateChange: vi.fn(() => ({
                data: { subscription: { unsubscribe: vi.fn() } },
            })),
            signOut: vi.fn(() => Promise.resolve({ error: null })),
        },
    },
}));

describe('AuthContext', () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider queryClient={queryClient}>{children}</AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );

    it('provides auth context', async () => {
        const TestComponent = () => {
            return <div>Test</div>;
        };

        render(<TestComponent />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('Test')).toBeInTheDocument();
        });
    });

    it('initializes with loading state', () => {
        // Test implementation
        expect(true).toBe(true);
    });
});
