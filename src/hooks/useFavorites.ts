import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const STORAGE_KEY = "aurum_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load favorites on mount or user change
  useEffect(() => {
    async function loadFavorites() {
      if (user) {
        // Load from Supabase
        const { data, error } = await supabase
          .from("saved_properties")
          .select("property_id");

        if (!error && data) {
          setFavorites(data.map(item => item.property_id));
        }
      } else {
        // Load from LocalStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setFavorites(JSON.parse(stored));
          } catch {
            setFavorites([]);
          }
        }
      }
    }

    loadFavorites();
  }, [user]);

  const toggleFavorite = useCallback(
    async (id: number) => {
      const isCurrentlyFavorite = favorites.includes(id);

      // Optimistic update
      setFavorites((prev) =>
        isCurrentlyFavorite ? prev.filter(fid => fid !== id) : [...prev, id]
      );

      if (user) {
        // Sync with Supabase
        if (isCurrentlyFavorite) {
          // Remove
          const { error } = await supabase
            .from("saved_properties")
            .delete()
            .eq("user_id", user.id)
            .eq("property_id", id);

          if (error) {
            toast({ title: "Error", description: "Failed to remove favorite", variant: "destructive" });
            // Revert on error
            setFavorites((prev) => [...prev, id]);
            return;
          }
        } else {
          // Add
          const { error } = await supabase
            .from("saved_properties")
            .insert({ user_id: user.id, property_id: id });

          if (error) {
            toast({ title: "Error", description: "Failed to save favorite", variant: "destructive" });
            // Revert
            setFavorites((prev) => prev.filter(fid => fid !== id));
            return;
          }
        }
      } else {
        // Sync with LocalStorage
        const next = isCurrentlyFavorite
          ? favorites.filter((fid) => fid !== id)
          : [...favorites, id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }

      toast({
        title: isCurrentlyFavorite ? "Removed from favorites" : "Added to favorites",
        description: isCurrentlyFavorite
          ? "Property removed from your saved list"
          : "Property saved to your favorites",
      });
    },
    [favorites, user, toast]
  );

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
