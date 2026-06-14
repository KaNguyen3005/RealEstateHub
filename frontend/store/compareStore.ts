import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CompareState {
  propertyIds: string[];
  addToCompare: (propertyId: string) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
}

const MAX_COMPARE_ITEMS = 3;

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      propertyIds: [],
      addToCompare: (propertyId) =>
        set((state) => {
          if (state.propertyIds.includes(propertyId) || state.propertyIds.length >= MAX_COMPARE_ITEMS) {
            return state;
          }

          return {
            propertyIds: [...state.propertyIds, propertyId]
          };
        }),
      removeFromCompare: (propertyId) =>
        set({
          propertyIds: get().propertyIds.filter((id) => id !== propertyId)
        }),
      clearCompare: () => set({ propertyIds: [] })
    }),
    {
      name: "realestatehub-compare-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const compareStore = useCompareStore;
