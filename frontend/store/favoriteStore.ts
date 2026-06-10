import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoriteState {
  favoriteIds: string[];
  setFavorites: (ids: string[]) => void;
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      setFavorites: (ids) => set({ favoriteIds: ids }),
      addFavorite: (propertyId) =>
        set((state) => {
          if (state.favoriteIds.includes(propertyId)) {
            return state;
          }

          return {
            favoriteIds: [...state.favoriteIds, propertyId]
          };
        }),
      removeFavorite: (propertyId) =>
        set({
          favoriteIds: get().favoriteIds.filter((id) => id !== propertyId)
        })
    }),
    {
      name: "realestatehub-favorite-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const favoriteStore = useFavoriteStore;
