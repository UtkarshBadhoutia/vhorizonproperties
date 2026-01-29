
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/lib/types";
import { properties as staticProperties } from "@/lib/data";

export function useProperties() {
    const { data: properties = [], isLoading, error } = useQuery({
        queryKey: ["properties"],
        queryFn: async () => {
            // Fetch from Supabase
            const { data, error } = await supabase
                .from("properties" as any)
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching properties, falling back to static data", error);
                return staticProperties;
            }

            // If no data in DB, fallback to static for demo purposes (optional logic)
            if (!data || data.length === 0) {
                return staticProperties;
            }

            // Map snake_case DB fields to camelCase TS interface
            return data.map((item: any) => ({
                ...item,
                heroImage: item.hero_image,
                agentId: item.agent_id,
                superArea: item.super_area,
                carpetArea: item.carpet_area,
                currentRent: item.current_rent,
                virtualTourUrl: item.virtual_tour_url,
                // Ensure arrays are handled if they come as null
                amenities: item.amenities || [],
                gallery: item.gallery || []
            })) as Property[];
        },
        // Initial data from static file to prevent flash of empty content
        initialData: staticProperties,
    });

    const getPropertyById = (id: number) => {
        return properties.find(p => p.id === id);
    };

    return {
        properties,
        getPropertyById,
        isLoading,
        error
    };
}
