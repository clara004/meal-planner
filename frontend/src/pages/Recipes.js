import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Recipes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Recipes");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const matchesCategory = activeCategory === "All Recipes" ||
                            recipe.category === activeCategory ||
                            (recipe.tags && recipe.tags.includes(activeCategory));
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, [filteredRecipes]);

  return (
    <div className="flex flex-col min-h-screen font-['Plus_Jakarta_Sans'] text-[#191c1d] selection:bg-[#0f5238]/20">
      <style>{`
        .reveal { opacity: 0; transform: translateY(40px) scale(0.98); transition: all 1s ease; }
        .reveal.active { opacity: 1; transform: translateY(0) scale(1); }
        .pill-button { border-radius: 9999px !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100 shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          <div onClick={() => navigate('/')} className="text-[24px] font-[800] text-[#0f5238] font-['Lexend'] cursor-pointer">Vitality Kitchen</div>
          <div className="hidden md:flex gap-10 font-['Lexend'] text-[14px]">
            <button onClick={() => navigate('/')} className="text-stone-500 font-medium">Home</button>
            <button onClick={() => navigate('/recipes')} className="text-[#0f5238] font-bold border-b-2 border-[#0f5238]">Recipes</button>
            <button className="text-stone-500 font-medium">Meal Plan</button>
            <button className="text-stone-500 font-medium">Grocery List</button>
          </div>
          <button onClick={() => navigate('/login')} className="bg-[#0f5238] text-white px-6 py-2 pill-button font-bold text-sm">Login</button>
        </nav>
      </header>

      <main className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        <section className="mb-16 reveal">
          <div className="max-w-3xl space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0f5238]/10 text-[#0f5238] font-bold text-[10px] tracking-widest uppercase">Chef-Curated Collection</div>
            <h1 className="font-['Lexend'] text-4xl md:text-[64px] font-[800] text-[#064e3b] leading-[1.1] tracking-tighter">
              Nourishing Recipes for Your <span className="text-[#895100] italic">Health Goals</span>
            </h1>
            <p className="text-[18px] text-stone-600">Discover fresh ingredients and balanced macros for your wellness journey.</p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {["All Recipes", "Breakfast", "Lunch", "Dinner", "Vegetarian", "Keto", "Gluten-Free", "Vegan"].map(cat => (
              <span key={cat} onClick={() => setActiveCategory(cat)} className={`px-7 py-3 pill-button font-bold text-sm cursor-pointer whitespace-nowrap transition-all ${activeCategory === cat ? "bg-[#0f5238] text-white shadow-lg" : "bg-white border text-stone-600 hover:bg-emerald-50"}`}>{cat}</span>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-lg">Loading recipes...</div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">No recipes found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} onClick={() => navigate(`/recipes/${recipe._id}`)} />
            ))}
          </div>
        )}
      </main>

      <footer className="w-full border-t border-stone-100 bg-white font-['Lexend'] text-sm">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div onClick={() => navigate('/')} className="text-2xl font-[800] text-[#064e3b] cursor-pointer">Vitality Kitchen</div>
            <p className="text-stone-500 max-w-xs text-center md:text-left leading-relaxed">Nourishing your journey with science and joy. © 2024 Vitality Kitchen.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <button className="text-stone-600 font-medium hover:text-[#0f5238]">About Us</button>
            <button className="text-stone-600 font-medium hover:text-[#0f5238]">Privacy Policy</button>
            <button className="text-stone-600 font-medium hover:text-[#0f5238]">Terms of Service</button>
            <button className="text-stone-600 font-medium hover:text-[#0f5238]">Contact</button>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#0f5238] cursor-pointer"><span className="material-symbols-outlined">share</span></div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#0f5238] cursor-pointer"><span className="material-symbols-outlined">mail</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const RecipeCard = ({ recipe, onClick }) => (
  <div className="reveal group bg-white rounded-[2rem] overflow-hidden border border-stone-100/50 flex flex-col relative shadow-md hover:shadow-2xl transition-all">
    <div className="relative h-72 overflow-hidden">
      <img className="w-full h-full object-cover transition-transform group-hover:scale-110" src={recipe.image} alt={recipe.title} />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all"></div>
      <button className="absolute top-5 right-5 w-11 h-11 bg-white/90 rounded-full text-[#0f5238] flex items-center justify-center"><span className="material-symbols-outlined">favorite</span></button>
    </div>
    <div className="p-8 flex-grow">
      <span className="px-4 py-1.5 bg-[#0f5238]/10 text-[#0f5238] pill-button text-[10px] font-bold uppercase">{recipe.category}</span>
      <h3 className="text-[24px] font-[600] font-['Lexend'] text-[#0f5238] my-4 leading-tight">{recipe.title}</h3>
      <div className="flex justify-between text-stone-500 pt-4 border-t">
        <span className="text-[12px] font-bold">{recipe.perServing?.calories ?? '—'} kcal</span>
        <span className="text-[12px] font-bold">{recipe.prepTime || '—'}</span>
      </div>
      <button onClick={onClick} className="w-full mt-6 py-3 bg-[#0f5238] text-white rounded-full font-bold text-sm">View Full Recipe</button>
    </div>
  </div>
);

export default Recipes;