import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Fetch the current user's favorites from the backend
  const refreshFavorites = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setFavoriteIds(new Set()); return; }
    try {
      const res = await api.get('/user/favorites');
      const ids = (res.data.favorites || []).map(f => (f._id || f).toString());
      setFavoriteIds(new Set(ids));
    } catch {
      // Not logged in or network error — leave as-is
    }
  }, []);

  // Load on mount
  useEffect(() => { refreshFavorites(); }, [refreshFavorites]);

  // Add a recipe to favorites
  const addFavorite = useCallback(async (recipeId) => {
    const id = recipeId.toString();
    // Optimistic
    setFavoriteIds(prev => new Set([...prev, id]));
    try {
      await api.post(`/user/favorites/${id}`);
    } catch {
      // Rollback on error
      setFavoriteIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  }, []);

  // Remove a recipe from favorites (always calls DELETE — unconditional)
  const removeFavorite = useCallback(async (recipeId) => {
    const id = recipeId.toString();
    // Optimistic
    setFavoriteIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    try {
      await api.delete(`/user/favorites/${id}`);
    } catch {
      // Rollback on error
      setFavoriteIds(prev => new Set([...prev, id]));
    }
  }, []);

  // Toggle: adds if not present, removes if present
  const toggleFavorite = useCallback(async (recipeId) => {
    const id = recipeId.toString();
    if (favoriteIds.has(id)) {
      await removeFavorite(id);
    } else {
      await addFavorite(id);
    }
  }, [favoriteIds, addFavorite, removeFavorite]);

  const isFavorite = useCallback((recipeId) => {
    return favoriteIds.has(recipeId?.toString());
  }, [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite, addFavorite, removeFavorite, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
