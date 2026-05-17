import React, { useEffect } from 'react';

const ContactUs = () => {
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
    <div className="font-['Plus_Jakarta_Sans'] text-[#191c1d] selection:bg-[#0f5238]/20">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <main className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0 pt-20">
          <img 
            alt="Modern kitchen" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPv9FzvcVTuu-x6qQS_y0dyfge9XCiaQ0q3W380yK4cFpBgelSMFoMJZ2PnhrH1FUEGbWd9lpEAfletQ504VdQtmkAtpqLx0UjJqObcoOBTLRueFpET304RfHOssuUfVuRI9zzAsJrBUd9ZaLFyUTsuMkDKAY7SCodcD8Uw_DHxZcmRJPkBagC8rNY0pWfBoEQMxlZ98YxScyR2ffKE409hjuLAmnwgPxLyNSj2l4ZxLCd9cD5EtUufGMYoril3SC_lSDbmNXX9J58" 
          />
          <div className="absolute inset-0 bg-[#0f5238]/10"></div>
        </div>

        {/* Glassmorphism Card */}
        <div className="reveal relative z-10 w-full max-w-2xl px-6">
          <div className="glass-card p-12 md:p-16 rounded-[3rem] shadow-2xl text-center">
            <h1 className="font-['Lexend'] text-4xl md:text-5xl font-[800] text-[#064e3b] mb-6 tracking-tighter">Get in Touch</h1>
            <p className="text-lg text-stone-600 mb-10 leading-relaxed">
              We're here to support your journey to a more vital kitchen. Connect with us through any of our platforms.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Instagram */}
              <a href="#" className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-[#0f5238] group-hover:bg-[#0f5238] group-hover:text-white transition-all duration-300 shadow-sm">
                  <i className="fa-brands fa-instagram text-2xl"></i>
                </div>
                <span className="font-bold text-xs uppercase tracking-widest text-stone-400 group-hover:text-[#0f5238]">Instagram</span>
              </a>

              {/* Facebook */}
              <a href="#" className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-[#0f5238] group-hover:bg-[#0f5238] group-hover:text-white transition-all duration-300 shadow-sm">
                  <i className="fa-brands fa-facebook-f text-2xl"></i>
                </div>
                <span className="font-bold text-xs uppercase tracking-widest text-stone-400 group-hover:text-[#0f5238]">Facebook</span>
              </a>

              {/* Email */}
              <a href="mailto:support@vitalitykitchen.com" className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-[#0f5238] group-hover:bg-[#0f5238] group-hover:text-white transition-all duration-300 shadow-sm">
                  <i className="fa-solid fa-envelope text-2xl"></i>
                </div>
                <span className="font-bold text-xs uppercase tracking-widest text-stone-400 group-hover:text-[#0f5238]">Gmail</span>
              </a>

              {/* WhatsApp */}
              <a href="#" className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-[#0f5238] group-hover:bg-[#0f5238] group-hover:text-white transition-all duration-300 shadow-sm">
                  <i className="fa-brands fa-whatsapp text-2xl"></i>
                </div>
                <span className="font-bold text-xs uppercase tracking-widest text-stone-400 group-hover:text-[#0f5238]">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;