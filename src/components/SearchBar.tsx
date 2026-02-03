import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, X, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/lib/types';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { rateLimiter, RateLimitConfigs } from '@/lib/rateLimit';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SearchResult {
    id: number;
    title: string;
    location: string;
    price: number;
    hero_image: string;
    status: string;
}

const SEARCH_HISTORY_KEY = 'property_search_history';
const MAX_HISTORY = 5;

/**
 * Search bar with autocomplete and history
 */
export function SearchBar() {
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 300);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Load search history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch {
                // Invalid JSON, ignore
            }
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Perform search when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim().length < 2) {
            setResults([]);
            return;
        }

        performSearch(debouncedQuery);
    }, [debouncedQuery]);

    const performSearch = async (searchQuery: string) => {
        // Rate limiting
        const rateLimitKey = 'search:global';
        if (!rateLimiter.check(rateLimitKey, RateLimitConfigs.search)) {
            toast.error('Too many searches. Please wait a moment.');
            return;
        }

        setIsLoading(true);

        try {
            // Sanitize query
            const sanitized = sanitizeSearchQuery(searchQuery);

            // Search properties
            const { data, error } = await supabase
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .from('properties' as any)
                .select('id, title, location, price, hero_image, status')
                .or(`title.ilike.%${sanitized}%,location.ilike.%${sanitized}%`)
                .limit(5);

            if (error) throw error;

            setResults(data || []);
            setIsOpen(true);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const addToHistory = (searchTerm: string) => {
        const newHistory = [searchTerm, ...history.filter(h => h !== searchTerm)].slice(0, MAX_HISTORY);
        setHistory(newHistory);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(SEARCH_HISTORY_KEY);
    };

    const handleResultClick = (result: SearchResult) => {
        addToHistory(query);
        setQuery('');
        setIsOpen(false);
        navigate(`/property/${result.id}`);
    };

    const handleHistoryClick = (term: string) => {
        setQuery(term);
        setIsOpen(true);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-2xl">
            {/* Search input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                    type="text"
                    placeholder="Search properties by title or location..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="pl-10 pr-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (query.length >= 2 || history.length > 0) && (
                <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    {/* Loading state */}
                    {isLoading && (
                        <div className="p-4 text-center text-zinc-400">
                            Searching...
                        </div>
                    )}

                    {/* Search results */}
                    {!isLoading && results.length > 0 && (
                        <div className="p-2">
                            <div className="text-xs text-zinc-500 px-3 py-2">Results</div>
                            {results.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleResultClick(result)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg text-left transition-colors"
                                >
                                    <img
                                        src={result.hero_image}
                                        alt={result.title}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white font-medium truncate">
                                            {result.title}
                                        </div>
                                        <div className="text-sm text-zinc-400 truncate">
                                            {result.location}
                                        </div>
                                    </div>
                                    <div className="text-primary font-semibold">
                                        ₹{result.price.toLocaleString()}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No results */}
                    {!isLoading && query.length >= 2 && results.length === 0 && (
                        <div className="p-4 text-center text-zinc-400">
                            No properties found for "{query}"
                        </div>
                    )}

                    {/* Search history */}
                    {!isLoading && query.length < 2 && history.length > 0 && (
                        <div className="p-2">
                            <div className="flex items-center justify-between px-3 py-2">
                                <div className="text-xs text-zinc-500">Recent Searches</div>
                                <button
                                    onClick={clearHistory}
                                    className="text-xs text-zinc-400 hover:text-white"
                                >
                                    Clear
                                </button>
                            </div>
                            {history.map((term, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleHistoryClick(term)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg text-left transition-colors"
                                >
                                    <Clock className="h-4 w-4 text-zinc-500" />
                                    <span className="text-white">{term}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
