import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipesData } from '../data/recipesData';

const Recipes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Recipes");
  const [fallingItems, setFallingItems] = useState([]);

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
    setTimeout(() => { navigate('/create-recipe'); }, 800);
    setTimeout(() => { setFallingItems((prev) => prev.slice(12)); }, 3000);
  };

  const filteredRecipes = recipesData.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All Recipes" || recipe.category === activeCategory;
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
    <div className="flex flex-col min-h-screen font-['Plus_Jakarta_Sans'] text-[#191c1d]">
      <style>{`
        .reveal { opacity: 0; transform: translateY(40px) scale(0.98); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0) scale(1); }
        @keyframes free-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
        }
        .falling-veggie { position: fixed; bottom: 80px; z-index: 100; pointer-events: none; animation: free-fall forwards linear; }
      `}</style>

      {fallingItems.map((item) => (
        <img key={item.id} src={item.img} className="falling-veggie" alt="veggie" style={{ right: `${item.right}px`, width: `${item.size}px`, animationDuration: `${item.duration}s`, animationDelay: `${item.delay}s` }} />
      ))}

      <div className="fixed bottom-8 right-8 z-50">
        <button onClick={handleCreateClick} className="bg-[#0f5238] text-white px-8 py-5 rounded-full font-[800] text-sm shadow-2xl hover:scale-110 transition-all border-none cursor-pointer flex items-center gap-3">
          Create My Recipe
        </button>
      </div>

      <main className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        <section className="mb-16 reveal">
          <div className="max-w-3xl space-y-4 mb-12 text-left">
            <h1 className="font-['Lexend'] text-4xl md:text-[64px] font-[800] text-[#064e3b] tracking-tighter leading-tight">
              Nourishing Recipes for Your <span className="text-[#895100] italic">Health Goals</span>
            </h1>
            <p className="text-[18px] text-stone-600">Fresh ingredients, calculated macros, zero compromise.</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {["All Recipes", "Breakfast", "Lunch", "Dinner"].map(cat => (
              <span key={cat} onClick={() => setActiveCategory(cat)} className={`px-7 py-3 rounded-full font-bold text-sm cursor-pointer whitespace-nowrap transition-all ${activeCategory === cat ? "bg-[#0f5238] text-white shadow-lg" : "bg-white border text-stone-600 hover:bg-emerald-50"}`}>{cat}</span>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onClick={() => navigate(`/recipes/${recipe.id}`)} />
          ))}
        </div>
      </main>
    </div>
  );
};

const RecipeCard = ({ recipe, onClick }) => (
  <div className="reveal group bg-white rounded-[2rem] overflow-hidden border border-stone-100 flex flex-col relative shadow-md hover:shadow-2xl transition-all duration-500">
    <div className="relative h-72 overflow-hidden">
      <img className="w-full h-full object-cover transition-transform group-hover:scale-110" src={recipe.img} alt={recipe.title}/>
      <button className="absolute top-5 right-5 w-11 h-11 bg-white/90 rounded-full text-[#0f5238] flex items-center justify-center transition-all border-none cursor-pointer"><span className="material-symbols-outlined">favorite</span></button>
    </div>
    <div className="p-8 flex-grow">
      <span className="px-4 py-1.5 bg-[#0f5238]/10 text-[#0f5238] rounded-full text-[10px] font-bold uppercase">{recipe.category}</span>
      <h3 className="text-[24px] font-[600] font-['Lexend'] text-[#0f5238] my-4 leading-tight">{recipe.title}</h3>
      <button onClick={onClick} className="w-full mt-6 py-3 bg-[#0f5238] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#064e3b] transition-all border-none cursor-pointer">View Full Recipe</button>
    </div>
  </div>
);

export default Recipes;