import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [fallingItems, setFallingItems] = useState([]);

  const triggerBurst = () => {
    const veggieImages = ["https://img.icons8.com/plasticine/200/tomato.png", "https://img.icons8.com/plasticine/200/carrot.png", "https://img.icons8.com/plasticine/200/broccoli.png"];
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
    initialValues: { title: '', cookTime: '', calories: '', instructions: '' },
    validationSchema: Yup.object({ title: Yup.string().required('Required'), instructions: Yup.string().required('Required') }),
    onSubmit: () => { triggerBurst(); setTimeout(() => { navigate('/recipes'); }, 2500); },
  });

  return (
    <FormikProvider value={formik}>
      <div className="bg-[#f8f9fa] font-['Plus_Jakarta_Sans'] text-[#191c1d] min-h-screen relative overflow-x-hidden flex flex-col">
        <style>{`
          @keyframes veggie-drop { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
          .falling-veggie { position: fixed; top: -10vh; z-index: 9999; pointer-events: none; animation: veggie-drop forwards linear; }
        `}</style>

        {fallingItems.map((item) => (
          <img key={item.id} src={item.img} className="falling-veggie" alt="veggie" style={{ left: `${item.left}%`, width: `${item.size}px`, animationDuration: `${item.duration}s`, animationDelay: `${item.delay}s` }} />
        ))}

        <main className="flex-grow pt-20">
          <div className="relative h-[380px] w-full overflow-hidden">
            <img alt="banner" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 px-6">
              <h1 className="font-['Lexend'] text-4xl md:text-[64px] font-[800] text-white tracking-tighter leading-tight">Create Your Masterpiece</h1>
            </div>
          </div>

          <div className="max-w-4xl mx-auto -mt-20 pb-20 px-6 relative z-10">
            <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white">
              <form onSubmit={formik.handleSubmit} className="space-y-12 text-left">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-5 border-2 border-dashed border-emerald-200 rounded-[2.5rem] aspect-square flex flex-col items-center justify-center bg-white cursor-pointer">
                    <span className="material-symbols-outlined text-5xl text-[#0f5238]">add_a_photo</span>
                  </div>
                  <div className="md:col-span-7 space-y-6">
                    <input name="title" value={formik.values.title} onChange={formik.handleChange} className="w-full px-8 py-5 rounded-full border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#0f5238] outline-none font-medium" placeholder="Recipe Title" />
                    <textarea name="instructions" value={formik.values.instructions} onChange={formik.handleChange} className="w-full p-8 rounded-[2.5rem] border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#0f5238] outline-none resize-none" rows="5" placeholder="Instructions..."></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-6 pt-10">
                  <button type="button" onClick={() => navigate('/recipes')} className="text-stone-400 font-bold bg-transparent border-none cursor-pointer">Discard</button>
                  <button type="submit" className="bg-[#0f5238] text-white px-14 py-5 rounded-full font-[800] text-lg shadow-2xl border-none cursor-pointer transition-all active:scale-95">Save Recipe</button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </FormikProvider>
  );
};

export default CreateRecipe;