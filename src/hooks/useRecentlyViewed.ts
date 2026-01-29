import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedStore {
  recentIds: number[];
  addToRecent: (id: number) => void;
  clearRecent: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      recentIds: [],
      addToRecent: (id) =>
        set((state) => {
          const filtered = state.recentIds.filter((rid) => rid !== id);
          return { recentIds: [id, ...filtered].slice(0, 10) };
        }),
      clearRecent: () => set({ recentIds: [] }),
    }),
    {
      name: "recently-viewed-properties",
    }
  )
);
