import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  //fetch
  const refreshFavorites = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setFavoriteIds(new Set()); return; }
    try {
      const res = await api.get('/user/favorites');
      const ids = (res.data.favorites || []).map(f => (f._id || f).toString());
      setFavoriteIds(new Set(ids));
    } catch {
      //error
    }
  }, []);

  useEffect(() => { refreshFavorites(); }, [refreshFavorites]);

  //add
  const addFavorite = useCallback(async (recipeId) => {
    const id = recipeId.toString();
    setFavoriteIds(prev => new Set([...prev, id]));
    try {
      await api.post(`/user/favorites/${id}`);
    } catch {
      setFavoriteIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  }, []);

  //delete
  const removeFavorite = useCallback(async (recipeId) => {
    const id = recipeId.toString();
    setFavoriteIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    try {
      await api.delete(`/user/favorites/${id}`);
    } catch {
      //error
      setFavoriteIds(prev => new Set([...prev, id]));
    }
  }, []);

  //toggle
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
