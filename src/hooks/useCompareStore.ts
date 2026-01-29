import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareStore {
  compareIds: number[];
  addToCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      compareIds: [],
      addToCompare: (id) =>
        set((state) => {
          if (state.compareIds.length >= 4) return state;
          if (state.compareIds.includes(id)) return state;
          return { compareIds: [...state.compareIds, id] };
        }),
      removeFromCompare: (id) =>
        set((state) => ({
          compareIds: state.compareIds.filter((cid) => cid !== id),
        })),
      clearCompare: () => set({ compareIds: [] }),
      isInCompare: (id) => get().compareIds.includes(id),
    }),
    {
      name: "property-compare",
    }
  )
);
