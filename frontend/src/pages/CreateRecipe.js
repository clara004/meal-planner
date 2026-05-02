import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [fallingItems, setFallingItems] = useState([]);

  // ── VEGETABLE BURST LOGIC (FIXED) ──────────────────────────────────────────
  const triggerBurst = () => {
    const veggieImages = [
      "https://img.icons8.com/plasticine/200/tomato.png",
      "https://img.icons8.com/plasticine/200/carrot.png",
      "https://img.icons8.com/plasticine/200/broccoli.png",
      "https://img.icons8.com/plasticine/200/avocado.png",
      "https://img.icons8.com/plasticine/200/bell-pepper.png",
      "https://img.icons8.com/plasticine/200/onion.png",
      "https://img.icons8.com/plasticine/200/corn.png"
    ];

    // Create 15 items that drop from the top area of the screen
    const newItems = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      img: veggieImages[Math.floor(Math.random() * veggieImages.length)],
      left: Math.random() * 100, // Random horizontal percentage (0-100%)
      size: Math.random() * 40 + 50, // Sizes between 50px and 90px
      duration: Math.random() * 1.5 + 1.5, // Fall speed
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
    }));

    setFallingItems(newItems);

    // Clean up after 4 seconds
    setTimeout(() => setFallingItems([]), 4000);
  };

  // ── FORMIK SETUP ────────────────────────────────────────────────────────────
  const formik = useFormik({
    initialValues: {
      title: '',
      cookTime: '',
      calories: '',
      instructions: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      instructions: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      triggerBurst(); // Animation plays here
      
      // Delay navigation so you can see the falling vegetables
      setTimeout(() => {
        navigate('/recipes');
      }, 2500); 
    },
  });

  return (
    <FormikProvider value={formik}>
      <div className="bg-[#f8f9fa] font-['Plus_Jakarta_Sans'] text-[#191c1d] min-h-screen relative overflow-x-hidden">
        
        {/* ── ANIMATION STYLES ── */}
        <style>{`
          .pill-button { border-radius: 9999px !important; }
          .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.5); }
          
          @keyframes veggie-drop {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
          .falling-veggie {
            position: fixed;
            top: -10vh;
            z-index: 9999;
            pointer-events: none;
            animation: veggie-drop forwards linear;
            filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
          }
        `}</style>

        {/* ── FALLING VEGETABLE PARTICLES ── */}
        {fallingItems.map((item) => (
          <img 
            key={item.id} 
            src={item.img} 
            className="falling-veggie" 
            alt="veggie"
            style={{ 
              left: `${item.left}%`, 
              width: `${item.size}px`, 
              animationDuration: `${item.duration}s`, 
              animationDelay: `${item.delay}s` 
            }}
          />
        ))}

        {/* ── CONSTANT NAV BAR ── */}
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100/50 shadow-sm">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
            <div onClick={() => navigate('/')} className="text-[24px] font-[800] text-[#064e3b] font-['Lexend'] cursor-pointer">Vitality Kitchen</div>
            <div className="hidden md:flex gap-10 font-['Lexend'] text-[14px]">
              <button onClick={() => navigate('/')} className="text-stone-500 font-medium hover:text-[#0f5238]">Home</button>
              <button onClick={() => navigate('/recipes')} className="text-stone-500 font-medium hover:text-[#0f5238]">Recipes</button>
              <button className="text-stone-500 font-medium">Meal Plan</button>
              <button className="text-stone-500 font-medium">Grocery List</button>
              <button className="text-stone-500 font-medium">Community</button>
            </div>
            <button onClick={() => navigate('/login')} className="bg-[#0f5238] text-white px-6 py-2 pill-button font-bold text-sm">Login</button>
          </nav>
        </header>

        <main className="pt-20">
          {/* ── WORKING BANNER IMAGE ── */}
          <div className="relative h-[380px] w-full overflow-hidden">
            <img alt="banner" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 px-6">
              <h1 className="font-['Lexend'] text-4xl md:text-[64px] font-[800] text-white tracking-tighter leading-tight">Create Your Masterpiece</h1>
              <p className="text-white/90 text-lg mt-4 font-medium max-w-2xl">Share your nutritional wisdom and culinary creativity with the Vitality community.</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="max-w-4xl mx-auto -mt-20 pb-20 px-6 relative z-10">
            <div className="glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50">
              <form onSubmit={formik.handleSubmit} className="p-8 md:p-12 space-y-12">
                
                {/* Photo & Title Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Recipe Photo</label>
                    <div className="border-2 border-dashed border-emerald-200 rounded-[2.5rem] aspect-square flex flex-col items-center justify-center bg-white/50 hover:bg-emerald-50 transition-all cursor-pointer group">
                      <span className="material-symbols-outlined text-5xl text-[#0f5238] group-hover:scale-110 transition-transform">add_a_photo</span>
                      <p className="font-['Lexend'] font-bold text-[#0f5238] mt-4">Upload Image</p>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-8 py-2">
                    <div>
                      <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Recipe Title</label>
                      <input 
                        name="title" 
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] text-lg font-medium" 
                        placeholder="e.g. Tropical Mango Power Bowl" 
                      />
                      {formik.touched.title && formik.errors.title && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.title}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Cook Time</label>
                        <input name="cookTime" type="number" onChange={formik.handleChange} className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238]" placeholder="Min" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Calories</label>
                        <input name="calories" type="number" onChange={formik.handleChange} className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238]" placeholder="kcal" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions Section */}
                <section>
                  <h3 className="font-['Lexend'] text-[24px] font-[800] text-[#064e3b] mb-6">Cooking Instructions</h3>
                  <textarea 
                    name="instructions" 
                    value={formik.values.instructions}
                    onChange={formik.handleChange}
                    className="w-full p-8 rounded-[2.5rem] border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] resize-none text-gray-700 leading-relaxed" 
                    rows="6" 
                    placeholder="Step 1: Prep your ingredients... Step 2: Combine..."
                  ></textarea>
                  {formik.touched.instructions && formik.errors.instructions && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.instructions}</p>}
                </section>

                {/* Submit Row */}
                <div className="pt-10 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <button type="button" onClick={() => navigate('/recipes')} className="text-stone-400 font-bold hover:text-stone-600 transition-colors px-6">Discard Changes</button>
                  
                  {/* SAVE RECIPE BUTTON */}
                  <button 
                    type="submit" 
                    className="bg-[#0f5238] text-white px-14 py-5 pill-button font-[800] text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
                  >
                    Save Recipe <span className="material-symbols-outlined">check_circle</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* ── UNIFIED FOOTER ── */}
        <footer className="w-full border-t border-stone-100 bg-white font-['Lexend'] text-sm">
          <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div onClick={() => navigate('/')} className="text-2xl font-[800] text-[#064e3b] cursor-pointer">Vitality Kitchen</div>
              <p className="text-stone-500 max-w-xs text-center md:text-left leading-relaxed">Nourishing your journey with science, taste, and absolute joy.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-10">
              <button className="text-stone-600 font-medium hover:text-[#0f5238] bg-transparent">About Us</button>
              <button className="text-stone-600 font-medium hover:text-[#0f5238] bg-transparent">Privacy Policy</button>
              <button className="text-stone-600 font-medium hover:text-[#0f5238] bg-transparent">Terms</button>
              <button className="text-stone-600 font-medium hover:text-[#0f5238] bg-transparent">Contact</button>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#0f5238] cursor-pointer hover:bg-[#0f5238] hover:text-white transition-all"><span className="material-symbols-outlined text-xl">share</span></div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#0f5238] cursor-pointer hover:bg-[#0f5238] hover:text-white transition-all"><span className="material-symbols-outlined text-xl">mail</span></div>
            </div>
          </div>
        </footer>
      </div>
    </FormikProvider>
  );
};

export default CreateRecipe;