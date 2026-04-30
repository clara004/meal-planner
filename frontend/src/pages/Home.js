import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  return (
    <div className="bg-[#f8f9fa] font-['Plus_Jakarta_Sans'] text-[#191c1d] selection:bg-[#0f5238]/20">
      {/* Required CSS for Animations and Pill Buttons */}
      <style>{`
        .reveal {
            opacity: 0;
            transform: translateY(60px) scale(0.98);
            transition: opacity 1.2s cubic-bezier(0.2, 1, 0.3, 1), 
                        transform 1.2s cubic-bezier(0.2, 1, 0.3, 1);
            will-change: transform, opacity;
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .pill-button {
            border-radius: 9999px !important;
        }
      `}</style>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100/50 shadow-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5">
          <div className="text-[24px] font-[800] tracking-tight text-[#064e3b] font-['Lexend']">Vitality Kitchen</div>
          <div className="hidden md:flex items-center gap-10 font-['Lexend'] text-[14px] tracking-wide">
            <a className="text-[#0f5238] font-bold border-b-2 border-[#0f5238] pb-1" href="#">Home</a>
            <a className="text-stone-500 font-medium hover:text-[#0f5238] transition-all" href="#">Meal Plans</a>
            <a className="text-stone-500 font-medium hover:text-[#0f5238] transition-all" href="#">Recipes</a>
            <a className="text-stone-500 font-medium hover:text-[#0f5238] transition-all" href="#">Grocery List</a>
            <a className="text-stone-500 font-medium hover:text-[#0f5238] transition-all" href="#">Community</a>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/login')} className="text-stone-600 font-bold text-sm">Login</button>
            <button onClick={() => navigate('/login')} className="bg-[#0f5238] text-white px-8 py-3 pill-button font-bold text-sm shadow-lg hover:bg-[#064e3b] transition-all">Get Started</button>
          </div>
        </nav>
      </header>

      <main className="pt-24 overflow-x-hidden">
        {/* Hero Section */}
        <section className="reveal">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
            <div className="flex flex-col items-center text-center space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f5238]/10 text-[#0f5238] ring-1 ring-[#0f5238]/20">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
                <span className="tracking-widest uppercase text-[10px] font-bold">Your Journey to Better Health</span>
              </div>
              
              {/* BIG BOLD TITLE (64px / 800 weight) */}
              <h1 className="font-['Lexend'] text-4xl md:text-[64px] font-[800] text-[#064e3b] max-w-4xl tracking-tighter leading-[1.1]">
                Fuel Your Vitality with <span className="text-[#0f5238] italic">Every Bite</span>
              </h1>
              
              <p className="text-[18px] text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Nourish your life with precision meal planning and chef-curated, delicious recipes. We bridge the gap between nutrition science and culinary joy.
              </p>

              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <button className="pill-button px-10 py-4 bg-[#0f5238] text-white font-[800] text-lg shadow-2xl hover:translate-y-[-4px] transition-all">
                  Start Your Journey
                </button>
                <button className="pill-button px-10 py-4 border-2 border-[#0f5238]/20 text-[#0f5238] font-bold text-lg hover:bg-[#0f5238]/5 transition-all">
                  Explore Recipes
                </button>
              </div>

              <div className="flex items-center gap-6 pt-12">
                <div className="flex -space-x-4">
                  {[10, 20, 30].map(i => (
                    <img key={i} alt="User" className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm" src={`https://i.pravatar.cc/150?u=${i}`} />
                  ))}
                </div>
                <p className="text-stone-500 font-semibold">Trusted by <span className="text-[#064e3b] font-[800]">25,000+</span> wellness enthusiasts</p>
              </div>
            </div>
          </div>

          {/* Image Collage - Exact original links and dimensions */}
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-6 lg:px-12 py-10">
            <div className="grid grid-cols-12 grid-rows-2 gap-6 h-[600px] lg:h-[800px]">
              <div className="col-span-12 lg:col-span-6 row-span-2 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                <img alt="Grain bowl" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt9V6fBF5zlaAJF8dNO8b8lJSGAIoiU2gSsCsRn9rfZAnrMKphXBfE1YT5A0_uV0yxvkPMRjxqwW2UC1k0mqPwCS3bjyaTPaw3-PM4LGnLErVeAv4O8SRHZKjgKAYhLFSTrkivJ3MsVG1I6fDUq3PlFlO16_C3Vj2xAVNf_IJB4d1wR4d-4XuTJirZjIsbWWi8y5xp7iG2BBq5qEMYcRxaR26oVXmD1LLSaVo-OLSMrDzs0z44YBmFlC-2f4ebzJGMwt0BL5S_8QD2" />
              </div>
              <div className="hidden lg:block col-span-6 row-span-1 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                <img alt="Salmon dinner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW9naO95Dx6dKqp5n61GsnIc3OMdXLhdunf_rSgdShiZ7yjSY6j5-MXzBxWwwsKyOw3nGhB8Gsbhd9ks5pwz6fxGGI2D7damVgU5ivbHkh_lbVGMBrgtRoj2_iUAo8vSro_U5e0-vldCAqeeRzUT2YTAwzj_heXfYo4anROEfKB7OSQhb5ai-E2eXRGCw1rs93ATehNcJNDRMW3s4nmpvHBvf2xB9AVxQ-O10Wl_VEntfxARd3C7l0dDYzcwClOWrfvnK-jKzchGn_" />
              </div>
              <div className="hidden lg:block col-span-6 row-span-1 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                <img alt="Poke bowl" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgwo9ib_V_AvDDqTMq3RiZO3kEL7LVMXhAcMpjlRmUH4SXHLWc5hQAMljxGXp-wSb93rTVz8wkrX6cSUOr5PYlXXiKCYzuOmdnfbeMUmHGKQ3km9bC4l6rwSG0CHjotIeXR0yFYnI5qCkV72gMot6fzausgwOaBr4UOrRBmEkn6whEdsMBhzAUo5YpSHncQsasHL_DRrIXLwrlMOKKTVBxM3L6y2lfrekwVMg4r4wsRq0nirJymFkuRXAE0Y_g5GRJNlMohSmnZLZ3" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-white border-y border-stone-100 py-16 reveal">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: 'restaurant_menu', title: 'Smart Recipes', desc: 'Personalized flavor profiles' },
              { icon: 'monitoring', title: 'Macro Tracking', desc: 'Precision nutrition data' },
              { icon: 'calendar_today', title: 'Weekly Planner', desc: 'Organize in 5 minutes' },
              { icon: 'shopping_cart', title: 'Auto-Groceries', desc: 'Smart lists sync to phone' },
            ].map((f, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#0f5238] transition-colors">
                  <span className="material-symbols-outlined text-[#0f5238] text-3xl group-hover:text-white">{f.icon}</span>
                </div>
                {/* SUBTITLE (24px / 600 weight) */}
                <h3 className="font-['Lexend'] text-[24px] font-[600] text-[#064e3b]">{f.title}</h3>
                <p className="text-stone-500 text-sm max-w-[160px] mx-auto leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="max-w-4xl mx-auto px-6 py-32">
          <div className="text-center mb-20 space-y-6 reveal">
            {/* BIG BOLD TITLE (64px) */}
            <h2 className="font-['Lexend'] text-4xl md:text-[64px] font-[800] text-[#064e3b] leading-[1.1] tracking-tighter">What Our Community Says</h2>
            <div className="w-24 h-1.5 bg-[#fd9d1a] mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col gap-8">
            {[
              { name: 'Sarah Jenkins', initial: 'SJ', text: "Vitality Kitchen made macro tracking so effortless. I've finally reached my weight goals without feeling restricted for even a single day. The recipes are genuinely restaurant-quality!", color: 'bg-[#b1f0ce]' },
              { name: 'Mark Thompson', initial: 'MT', text: "The smart recipe discovery is an absolute lifesaver for a busy dad. No more 'what's for dinner' stress at 6 PM. My kids actually enjoy the vegetable-heavy meals!", color: 'bg-[#ffdcbc]' },
              { name: 'Elena Rodriguez', initial: 'ER', text: "An exceptionally clean and polished interface that makes healthy living feel luxurious. I've recommended this to every single one of my followers.", color: 'bg-[#dbe7cd]' }
            ].map((r, i) => (
              <div key={i} className="reveal bg-white p-10 rounded-[2rem] shadow-xl border border-emerald-50/50 hover:shadow-2xl transition-all">
                <div className="flex gap-1 text-[#895100] mb-6">
                  {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                </div>
                <blockquote className="text-xl font-medium text-[#064e3b] mb-8 italic leading-relaxed">"{r.text}"</blockquote>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full ${r.color} flex items-center justify-center text-[#0f5238] font-bold text-lg shadow-sm`}>{r.initial}</div>
                  <div>
                    <p className="font-bold text-[#064e3b] text-lg">{r.name}</p>
                    <p className="text-sm text-stone-400 font-medium">Verified Member</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 pb-32 reveal">
          <div className="relative bg-[#2d6a4f] rounded-[3rem] p-16 md:p-24 overflow-hidden shadow-2xl text-center space-y-10">
            {/* BIG BOLD TITLE (64px) */}
            <h2 className="font-['Lexend'] text-3xl md:text-[64px] font-[800] text-white leading-[1.1] tracking-tighter">Ready to transform your relationship with food?</h2>
            <button onClick={() => navigate('/login')} className="pill-button px-14 py-5 bg-white text-[#0f5238] font-[800] text-xl shadow-2xl hover:scale-105 transition-all">
              Get Started For Free
            </button>
          </div>
        </section>
      </main>

      {/* Footer - Complete with all Links */}
      <footer className="w-full border-t border-stone-100 bg-white font-['Lexend'] text-sm">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="text-2xl font-[800] text-[#064e3b] tracking-tight">Vitality Kitchen</div>
            <p className="text-stone-500 max-w-xs text-center md:text-left leading-relaxed">Nourishing your journey with science, taste, and absolute joy. © 2024 Vitality Kitchen.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <a className="text-stone-600 font-medium hover:text-[#0f5238]" href="#">About Us</a>
            <a className="text-stone-600 font-medium hover:text-[#0f5238]" href="#">Privacy Policy</a>
            <a className="text-stone-600 font-medium hover:text-[#0f5238]" href="#">Terms of Service</a>
            <a className="text-stone-600 font-medium hover:text-[#0f5238]" href="#">Contact</a>
            <a className="text-stone-600 font-medium hover:text-[#0f5238]" href="#">FAQ</a>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800 hover:bg-[#0f5238] hover:text-white shadow-sm transition-all cursor-pointer">
              <span className="material-symbols-outlined text-xl">share</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800 hover:bg-[#0f5238] hover:text-white shadow-sm transition-all cursor-pointer">
              <span className="material-symbols-outlined text-xl">mail</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;