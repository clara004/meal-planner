import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        setRecipe(res.data.recipe);
        
        const storedUserStr = localStorage.getItem('user');
        if (storedUserStr && res.data.recipe.ratings) {
          const user = JSON.parse(storedUserStr);
          const existing = res.data.recipe.ratings.find(r => r.user === user.id);
          if (existing) setUserRating(existing.rating);
        }
      } catch (err) {
        console.error('Failed to fetch recipe:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleRating = async (star) => {
    setUserRating(star);
    try {
      const res = await api.post(`/recipes/${id}/rate`, { rating: star });
      setRecipe(res.data.recipe);
    } catch (err) {
      console.error('Failed to save rating:', err);
    }
  };

  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [recipe]);

  if (loading) return <div className="pt-40 text-center text-gray-400">Loading recipe...</div>;
  if (!recipe) return <div className="pt-40 text-center">Recipe not found.</div>;

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] font-sans selection:bg-[#2d6a4f]/20">
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .step-number-pill { border-radius: 9999px; }
      `}</style>

      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100/50 shadow-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5">
          <div 
            onClick={() => navigate('/')} 
            className="text-[24px] font-[800] tracking-tight text-[#064e3b] font-['Lexend'] cursor-pointer"
          >
            Vitality Kitchen
          </div>
          
          <div className="hidden md:flex items-center gap-10 font-['Lexend'] text-[14px] tracking-wide">
            <button onClick={() => navigate('/')} className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent">Home</button>
            <button 
              onClick={() => navigate('/recipes')} 
              className="text-[#0f5238] font-bold border-b-2 border-[#0f5238] pb-1 bg-transparent"
            >
              Recipes
            </button>
            <button 
              onClick={() => navigate('/meal-planner')} 
              className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent"
            >
              Meal Planner
            </button>
            <button 
              onClick={() => navigate('/grocery')} 
              className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent"
            >
              Grocery List
            </button>
          </div>

          <div className="flex items-center gap-6">
            {localStorage.getItem('token') ? (
              <button onClick={() => navigate('/profile')} className="bg-[#0f5238] text-white px-6 py-2.5 pill-button font-bold text-sm shadow-lg hover:bg-[#064e3b] transition-all flex items-center gap-2" style={{ borderRadius: '9999px' }}>
                <span className="material-symbols-outlined text-sm">person</span>
                Profile
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-stone-600 font-bold text-sm">Login</button>
                <button onClick={() => navigate('/login')} className="bg-[#0f5238] text-white px-8 py-3 pill-button font-bold text-sm shadow-lg hover:bg-[#064e3b] transition-all" style={{ borderRadius: '9999px' }}>Get Started</button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className={`reveal ${pageLoaded ? 'active' : ''} pt-24 pb-20 max-w-[1280px] mx-auto px-6`}>
        <button onClick={() => navigate('/recipes')}
          className="flex items-center gap-2 text-[#0f5238] font-bold mb-8 hover:bg-[#b1f0ce] px-4 py-2 rounded-full transition-all">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Recipes
        </button>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-auto">
              {recipe.image
                ? <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-emerald-50 flex items-center justify-center"><span className="material-symbols-outlined text-6xl text-emerald-200">restaurant</span></div>
              }
              <div className="absolute top-6 left-6 flex gap-2">
                {recipe.averageRating >= 4 && (
                  <span className="bg-white/90 px-4 py-1.5 rounded-full text-[#0f5238] text-xs font-bold shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">stars</span> HIGHLY RATED
                  </span>
                )}
                {recipe.category && <span className="bg-[#0f5238]/90 px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-sm">{recipe.category.toUpperCase()}</span>}
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center lg:items-start">
              <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-2">Rate this recipe</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => handleRating(star)}
                    className="material-symbols-outlined cursor-pointer text-4xl transition-all duration-200 hover:scale-110"
                    style={{ fontVariationSettings: `'FILL' ${userRating >= star ? 1 : 0}`, color: userRating >= star ? '#fd9d1a' : '#bfc9c1' }}>
                    star
                  </span>
                ))}
              </div>
              {userRating > 0 && <p className="text-xs font-bold text-[#0f5238] mt-2">You rated this {userRating} stars!</p>}
              {recipe.averageRating > 0 && <p className="text-xs text-gray-400 mt-1">Average rating: {recipe.averageRating} / 5</p>}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-[48px] font-bold text-[#0f5238] leading-tight mb-4">{recipe.title}</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{recipe.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <span className="material-symbols-outlined text-[#0f5238]">schedule</span>
                <p className="text-xs text-gray-400 font-bold">TIME</p>
                <p className="font-bold">{recipe.prepTime ? `${recipe.prepTime} min` : '—'}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <span className="material-symbols-outlined text-[#0f5238]">local_fire_department</span>
                <p className="text-xs text-gray-400 font-bold">CALORIES</p>
                <p className="font-bold">{recipe.perServing?.calories ?? '—'}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <span className="material-symbols-outlined text-[#0f5238]">restaurant</span>
                <p className="text-xs text-gray-400 font-bold">SERVES</p>
                <p className="font-bold">{recipe.servings || '—'}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-[#0f5238] mb-4">MACRONUTRIENTS</h3>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex mb-4">
                <div className="bg-[#2d6a4f]" style={{ width: '33%' }}></div>
                <div className="bg-[#fd9d1a]" style={{ width: '34%' }}></div>
                <div className="bg-[#57624e]" style={{ width: '33%' }}></div>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <p>Protein: {recipe.perServing?.protein ?? '—'}g</p>
                <p>Carbs: {recipe.perServing?.carbs ?? '—'}g</p>
                <p>Fats: {recipe.perServing?.fat ?? '—'}g</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <aside className="lg:col-span-4">
            <h2 className="text-2xl font-bold text-[#0f5238] mb-6">Ingredients</h2>
            <div className="space-y-3">
              {recipe.ingredients?.map((ing, i) => (
                <label key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-transparent hover:border-[#0f5238]/20 transition-all cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded text-[#0f5238]" />
                  <span className="text-gray-700">{ing.name}</span>
                </label>
              ))}
            </div>
          </aside>

          <section className="lg:col-span-8">
            <h2 className="text-2xl font-bold text-[#0f5238] mb-8">Instructions</h2>
            <div className="space-y-8 relative">
              {recipe.steps?.map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-10 h-10 bg-[#b1f0ce] text-[#0f5238] font-bold flex items-center justify-center step-number-pill shrink-0">{i + 1}</div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
                    <p className="text-gray-600 leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-[#0f5238] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all">
          <span className="material-symbols-outlined">add_shopping_cart</span>
          <span className="font-bold">Add to List</span>
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;