import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [fallingItems, setFallingItems] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState('');
  const fileInputRef = React.useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        setImagePreview(compressed);
        setImageData(compressed);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

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
    const newItems = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      img: veggieImages[Math.floor(Math.random() * veggieImages.length)],
      left: Math.random() * 100,
      size: Math.random() * 40 + 50,
      duration: Math.random() * 1.5 + 1.5,
      delay: Math.random() * 0.5,
    }));
    setFallingItems(newItems);
    setTimeout(() => setFallingItems([]), 4000);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      category: '',
      cookTime: '',
      servings: '',
      instructions: '',
      dietaryTags: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      category: Yup.string().required('Category is required'),
      instructions: Yup.string().required('Instructions are required'),
      servings: Yup.number().min(1).required('Servings is required'),
    }),
    onSubmit: async (values) => {
      setSubmitError('');
      try {
        await api.post('/recipes', {
          title: values.title,
          category: values.category,
          prepTime: Number(values.cookTime) || 0,
          servings: Number(values.servings) || 1,
          dietaryTags: values.dietaryTags,
          steps: values.instructions
            .split('\n')
            .filter(s => s.trim()),
          ingredients: [],
          image: imageData || '',
        });
        triggerBurst();
        setTimeout(() => { navigate('/recipes'); }, 2500);
      } catch (err) {
        setSubmitError('Failed to save recipe. Make sure you are logged in.');
        console.error('Failed:', err);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <div className="bg-[#f8f9fa] font-['Plus_Jakarta_Sans'] text-[#191c1d] min-h-screen relative overflow-x-hidden">
        <style>{`
          .pill-button { border-radius: 9999px !important; }
          .glass-card { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.5); }
          @keyframes veggie-drop {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
          .falling-veggie { position: fixed; top: -10vh; z-index: 9999; pointer-events: none; animation: veggie-drop forwards linear; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1)); }
        `}</style>

        {fallingItems.map((item) => (
          <img key={item.id} src={item.img} className="falling-veggie" alt="veggie"
            style={{ left: `${item.left}%`, width: `${item.size}px`, animationDuration: `${item.duration}s`, animationDelay: `${item.delay}s` }} />
        ))}

        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100/50 shadow-sm">
          <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5">
            <div onClick={() => navigate('/')} className="text-[24px] font-[800] tracking-tight text-[#064e3b] font-['Lexend'] cursor-pointer">
              Vitality Kitchen
            </div>

            <div className="hidden md:flex items-center gap-10 font-['Lexend'] text-[14px] tracking-wide">
              <button onClick={() => navigate('/')} className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent">Home</button>
              <button onClick={() => navigate('/recipes')} className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent">Recipes</button>
              <button onClick={() => navigate('/meal-planner')} className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent">Meal Planner</button>
              <button onClick={() => navigate('/grocery')} className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent">Grocery List</button>
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

        <main className="pt-20">
          <div className="relative h-[380px] w-full overflow-hidden">
            <img alt="banner" className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 px-6">
              <h1 className="font-['Lexend'] text-4xl md:text-[64px] font-[800] text-white tracking-tighter leading-tight">Create Your Masterpiece</h1>
              <p className="text-white/90 text-lg mt-4 font-medium max-w-2xl">Share your nutritional wisdom and culinary creativity with the Vitality community.</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto -mt-20 pb-20 px-6 relative z-10">
            <div className="glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50">
              <form onSubmit={formik.handleSubmit} className="p-8 md:p-12 space-y-10">

                {submitError && (
                  <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-medium text-sm">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Recipe Photo</label>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-emerald-200 rounded-[2.5rem] aspect-square flex flex-col items-center justify-center bg-white/50 hover:bg-emerald-50 transition-all cursor-pointer group overflow-hidden relative"
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} className="group-hover:!opacity-100">
                            <span className="material-symbols-outlined text-4xl text-white">edit</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-5xl text-[#0f5238] group-hover:scale-110 transition-transform">add_a_photo</span>
                          <p className="font-['Lexend'] font-bold text-[#0f5238] mt-4">Upload Image</p>
                          <p className="text-stone-400 text-xs mt-1">Click to browse</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-6 py-2">
                    <div>
                      <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Recipe Title *</label>
                      <input name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] text-lg font-medium"
                        placeholder="e.g. Tropical Mango Power Bowl" />
                      {formik.touched.title && formik.errors.title && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.title}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Category *</label>
                      <select name="category" value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] text-lg font-medium bg-white appearance-none cursor-pointer">
                        <option value="" disabled>Select category</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snack">Snack</option>
                      </select>
                      {formik.touched.category && formik.errors.category && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.category}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Cook Time (min)</label>
                        <input name="cookTime" type="number" value={formik.values.cookTime} onChange={formik.handleChange}
                          className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238]" placeholder="e.g. 30" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Servings *</label>
                        <input name="servings" type="number" value={formik.values.servings} onChange={formik.handleChange} onBlur={formik.handleBlur}
                          className="w-full px-8 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#0f5238]" placeholder="e.g. 2" />
                        {formik.touched.servings && formik.errors.servings && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.servings}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-[800] text-stone-400 uppercase tracking-[0.2em] mb-3">Dietary Tags</label>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {["Vegetarian", "Vegan", "Gluten-Free", "Keto"].map(tag => (
                          <label key={tag} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm hover:bg-emerald-50 transition-all">
                            <input
                              type="checkbox"
                              value={tag}
                              checked={formik.values.dietaryTags?.includes(tag)}
                              onChange={(e) => {
                                const current = formik.values.dietaryTags || [];
                                if (e.target.checked) {
                                  formik.setFieldValue('dietaryTags', [...current, tag]);
                                } else {
                                  formik.setFieldValue('dietaryTags', current.filter(t => t !== tag));
                                }
                              }}
                              className="w-4 h-4 accent-[#0f5238]"
                            />
                            <span className="text-sm font-medium text-stone-600">{tag}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <section>
                  <h3 className="font-['Lexend'] text-[24px] font-[800] text-[#064e3b] mb-3">Cooking Instructions *</h3>
                  <p className="text-stone-400 text-sm mb-4">Write each step on a new line.</p>
                  <textarea name="instructions" value={formik.values.instructions} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="w-full p-8 rounded-[2.5rem] border-none shadow-sm focus:ring-2 focus:ring-[#0f5238] resize-none text-gray-700 leading-relaxed"
                    rows="6" placeholder={"Step 1: Prep your ingredients\nStep 2: Mix everything together\nStep 3: Cook for 20 minutes"}></textarea>
                  {formik.touched.instructions && formik.errors.instructions && <p className="text-red-500 text-xs mt-2 ml-4">{formik.errors.instructions}</p>}
                </section>

                <div className="pt-6 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <button type="button" onClick={() => navigate('/recipes')} className="text-stone-400 font-bold hover:text-stone-600 transition-colors px-6">Discard Changes</button>
                  <button type="submit" disabled={formik.isSubmitting}
                    className="bg-[#0f5238] text-white px-14 py-5 pill-button font-[800] text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
                    style={{ opacity: formik.isSubmitting ? 0.7 : 1 }}>
                    {formik.isSubmitting ? 'Saving...' : 'Save Recipe'}
                    <span className="material-symbols-outlined">check_circle</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <footer className="w-full border-t border-stone-100 bg-white font-['Lexend'] text-sm">
          <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row justify-between items-center gap-12">
            <div onClick={() => navigate('/')} className="text-2xl font-[800] text-[#064e3b] cursor-pointer">Vitality Kitchen</div>
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