import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useFavorites } from '../context/FavoritesContext';

const RECIPES_PER_PAGE = 12;

const Recipes = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Recipes");
  const [fallingItems, setFallingItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCreateClick = () => {
    const veggieImages = [
      "https://img.icons8.com/plasticine/200/tomato.png",
      "https://img.icons8.com/plasticine/200/carrot.png",
      "https://img.icons8.com/plasticine/200/broccoli.png",
      "https://img.icons8.com/plasticine/200/avocado.png",
      "https://img.icons8.com/plasticine/200/bell-pepper.png"
    ];
    const newItems = Array.from({ length: 12 }).map(() => ({
      id: Math.random(),
      img: veggieImages[Math.floor(Math.random() * veggieImages.length)],
      right: Math.random() * 150 + 10,
      size: Math.random() * 40 + 40,
      duration: Math.random() * 1.2 + 1,
      delay: Math.random() * 0.3,
      rotation: Math.random() * 360,
    }));
    setFallingItems((prev) => [...prev, ...newItems]);
    setTimeout(() => { navigate('/recipes/create'); }, 800);
    setTimeout(() => { setFallingItems((prev) => prev.slice(12)); }, 3000);
  };

  const handleToggleFavorite = async (recipeId) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    await toggleFavorite(recipeId);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await api.get('/recipes');
        setRecipes(res.data.recipes);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All Recipes" ||
      recipe.category === activeCategory ||
      (recipe.dietaryTags && recipe.dietaryTags.includes(activeCategory));
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE));
  const pageStart = (currentPage - 1) * RECIPES_PER_PAGE;
  const paginatedRecipes = filteredRecipes.slice(pageStart, pageStart + RECIPES_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, [paginatedRecipes]);

  return (
    <div className="flex flex-col min-h-screen font-['Plus_Jakarta_Sans'] text-[#191c1d]">
      <style>{`
        .reveal { opacity: 0; transform: translateY(40px) scale(0.98); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0) scale(1); }
        .pill-button { border-radius: 9999px !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes free-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
        }
        .falling-veggie {
          position: fixed; bottom: 80px; z-index: 100;
          pointer-events: none;
          animation: free-fall forwards cubic-bezier(.45,.05,.55,.95);
          filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
        }
      `}</style>

      {fallingItems.map((item) => (
        <img key={item.id} src={item.img} className="falling-veggie" alt="veggie"
          style={{
            right: `${item.right}px`, width: `${item.size}px`, height: 'auto',
            animationDuration: `${item.duration}s`, animationDelay: `${item.delay}s`,
            transform: `rotate(${item.rotation}deg)`
          }} />
      ))}

      <div className="fixed bottom-8 right-8 z-50">
        <button onClick={handleCreateClick}
          className="group bg-[#0f5238] text-white px-8 py-5 pill-button font-[800] text-sm shadow-[0_20px_50px_rgba(15,82,56,0.3)] hover:bg-white hover:text-[#0f5238] hover:scale-110 border-2 border-transparent hover:border-[#0f5238] transition-all duration-300 flex items-center gap-3">
          <div className="w-6 h-6 bg-white/20 group-hover:bg-[#0f5238]/10 rounded-full flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform duration-500">add</span>
          </div>
          Create My Recipe
        </button>
      </div>

      {/* HEADER IS GONE FROM HERE - APP.JS HANDLES IT */}

      <main className="flex-grow pt-10 pb-24 px-6 max-w-7xl mx-auto w-full">
        <section className="mb-16 reveal">
          <div className="max-w-3xl space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0f5238]/10 text-[#0f5238] font-bold text-[10px] tracking-widest uppercase">Chef-Curated Collection</div>
            <h1 className="font-['Lexend'] text-4xl md:text-[64px] font-[800] text-[#064e3b] leading-[1.1] tracking-tighter">
              Nourishing recipes for your <span className="text-[#895100] italic">health goals</span>
            </h1>
            <p className="text-[18px] text-stone-600">Fresh ingredients, calculated macros, zero compromise.</p>
          </div>

          <div className="relative w-full max-w-md mb-10 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#0f5238] transition-colors">search</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3.5 bg-white border border-stone-200/80 rounded-full focus:ring-2 focus:ring-[#0f5238]/20 w-full text-sm transition-all shadow-sm"
              placeholder="Search recipes (e.g. Avocado Toast)..." type="text" />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {["All Recipes", "Breakfast", "Lunch", "Dinner", "Vegetarian", "Keto", "Gluten-Free", "Vegan"].map(cat => (
              <span key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-7 py-3 pill-button font-bold text-sm cursor-pointer whitespace-nowrap transition-all ${activeCategory === cat ? "bg-[#0f5238] text-white shadow-lg" : "bg-white border text-stone-600 hover:bg-emerald-50"}`}>
                {cat}
              </span>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-lg">Loading recipes...</div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">No recipes found.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedRecipes.map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe}
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                  isFavorite={isFavorite(recipe._id)}
                  onToggleFavorite={() => handleToggleFavorite(recipe._id)} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`w-11 h-11 rounded-full font-bold text-sm transition-all ${currentPage === page ? 'bg-[#0f5238] text-white shadow-lg' : 'bg-white border border-stone-200 text-stone-600 hover:bg-emerald-50 hover:text-[#0f5238]'}`}
                    aria-label={`Go to recipes page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER IS GONE FROM HERE - APP.JS HANDLES IT */}
    </div>
  );
};

// ... (Rest of the Stars and RecipeCard components stay the same)
const Stars = ({ rating, count }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="material-symbols-outlined text-[16px]" style={{
          color: '#fd9d1a',
          fontVariationSettings: i <= Math.round(rating) ? '"FILL" 1' : '"FILL" 0'
        }}>star</span>
      ))}
    </div>
    <span className="text-[13px] font-bold text-[#0f5238]">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
    {count > 0 && <span className="text-[12px] text-stone-400 font-medium">({count} reviews)</span>}
  </div>
);

const RecipeCard = ({ recipe, onClick, isFavorite, onToggleFavorite }) => (
  <div className="reveal group bg-white rounded-[2rem] overflow-hidden border border-stone-100/50 flex flex-col relative shadow-md hover:shadow-2xl transition-all duration-500">
    <div className="relative h-72 overflow-hidden">
      <img className="w-full h-full object-cover transition-transform group-hover:scale-110" src={recipe.image || 'https://i.pinimg.com/1200x/50/bb/19/50bb19ebe06049da09f065b743286426.jpg'} alt={recipe.title} />
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
      {recipe.averageRating >= 4 && (
        <span className="bg-white/90 px-3 py-1.5 rounded-full text-[#0f5238] text-[10px] font-bold shadow-sm flex items-center gap-1 w-fit">
          <span className="material-symbols-outlined text-[12px]">stars</span> HIGHLY RATED
        </span>
      )}
    </div>
      <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        className={`absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center transition-all z-10 ${isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-[#0f5238] hover:bg-[#0f5238] hover:text-white'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorite ? '"FILL" 1' : '"FILL" 0' }}>favorite</span>
      </button>
    </div>
    <div className="p-8 flex-grow">
      <span className="px-4 py-1.5 bg-[#0f5238]/10 text-[#0f5238] pill-button text-[10px] font-bold uppercase">{recipe.category || 'Recipe'}</span>
      <h3 className="text-[24px] font-[600] font-['Lexend'] text-[#0f5238] mt-4 mb-2 leading-tight">{recipe.title}</h3>
      <div className="mb-4">
        <Stars rating={recipe.averageRating || 0} count={recipe.ratingsCount || 0} />
      </div>
      <div className="flex justify-between text-stone-500 pt-4 border-t border-stone-50 mb-6">
        <span className="text-[12px] font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-[#0f5238]/60">local_fire_department</span>
          {recipe.perServing?.calories ? `${recipe.perServing.calories} kcal` : '— kcal'}
        </span>
        <span className="text-[12px] font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-[#0f5238]/60">schedule</span>
          {recipe.prepTime ? `${recipe.prepTime} min` : '—'}
        </span>
      </div>
      <button onClick={onClick} className="w-full mt-6 py-3 bg-[#0f5238] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#064e3b] transition-all">
        View Full Recipe
      </button>
    </div>
  </div>
);

export default Recipes;