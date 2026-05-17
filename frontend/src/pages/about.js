// src/pages/About.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8f9fa] font-['Plus_Jakarta_Sans'] text-[#191c1d] selection:bg-[#0f5238]/20 min-h-screen flex flex-col">
      <style>{`
        .ambient-shadow { box-shadow: 0px 4px 20px rgba(45, 106, 79, 0.05); }
        .hero-gradient { background: linear-gradient(135deg, rgba(15, 82, 56, 0.03) 0%, rgba(255, 255, 255, 0) 100%); }
      `}</style>

      {/* HEADER REMOVED FROM HERE - App.js handles it now */}

      <main className="pt-24 overflow-x-hidden flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden hero-gradient py-20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
            <div className="z-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f5238]/10 text-[#0f5238] ring-1 ring-[#0f5238]/20 mb-6 font-bold text-[10px] uppercase tracking-widest">
                Our Brand Story
              </span>
              <h1 className="font-['Lexend'] text-4xl md:text-[56px] font-[800] text-[#064e3b] leading-[1.1] mb-6 tracking-tighter">
                Our Mission for Your Vitality
              </h1>
              <p className="text-[18px] text-stone-600 max-w-xl leading-relaxed mb-8">
                Vitality Kitchen is a precision nutrition tool designed to help you track daily calories and macros while discovering easy, nutritious recipes.
              </p>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] relative">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0g6pTF5KAtHBVdDCrHQAD188DVXsAjrDlN1n9chW31yrZUJMJHhPkMDPTRgrAR_URU8g0K-Lv-8zWIAq1Irp4e6C18sJ1g05JHQkTl_oF0VhyVX9icZcTru_FhPx7ieitjsXRmj81tHrBwbdb81jae9pMXQpPkYG1rVVkNNAgFzMha0hsk-dX2NXSADg6Qz8iYA6d4qM5MgQobyyO3I5gcqTq3MzGqCscQEMn-muFAURTq3aS3mKF710hxA25GvQshTX4vl-fg_rR" alt="Kitchen" />
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100">
              <h2 className="font-['Lexend'] text-3xl font-[700] text-[#064e3b] mb-6">Why We Exist</h2>
              <p className="text-stone-600 leading-relaxed text-lg">
                We believe health shouldn't be a chore. Vitality is about the joy of eating well-prepared, fresh food that fuels your specific goals.
              </p>
            </div>
            <div className="md:col-span-5 bg-[#2d6a4f] rounded-[2.5rem] text-white flex flex-col justify-between p-8 shadow-xl">
              <span className="material-symbols-outlined text-[40px] mb-4 text-[#fd9d1a]">query_stats</span>
              <div>
                <h3 className="font-['Lexend'] text-2xl font-[700] mb-2">Precision Tools</h3>
                <p className="text-sm opacity-90 leading-relaxed">Advanced macro tracking and calorie budgeting designed for clarity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="font-['Lexend'] text-4xl font-[800] text-[#064e3b] mb-12 tracking-tighter">Our Technical Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {['Clara Stefanos', 'Maria Ramy', 'Marina Joseph', 'Peter Nader', 'Pola Ashraf'].map((name) => (
                <div 
                  key={name} 
                  className="group flex flex-col items-center p-8 rounded-[2rem] bg-white shadow-sm border border-stone-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default"
                >
                  <div className="w-20 h-20 rounded-full bg-[#b1f0ce] mb-6 flex items-center justify-center text-[#0f5238] group-hover:bg-[#0f5238] group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-4xl">person</span>
                  </div>
                  <h3 className="font-bold text-[#064e3b] font-['Lexend'] text-sm group-hover:text-[#0f5238] transition-colors">{name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-2 font-bold">Developer</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Bottom Link */}
      <div className="w-full py-10 border-t border-stone-100 bg-white flex justify-center">
        <button 
          onClick={() => navigate('/about')} 
          className="text-stone-400 font-['Lexend'] text-xs font-bold uppercase tracking-[0.2em] hover:text-[#0f5238] transition-colors bg-transparent border-none cursor-pointer"
        >
          About Us
        </button>
      </div>
    </div>
  );
};

export default About;