import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    // Basic reveal animation logic
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
    <div className="bg-[#f8f9fa] font-['Plus_Jakarta_Sans'] text-[#191c1d] selection:bg-[#0f5238]/20 min-h-screen">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.5); }
      `}</style>

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        {/* Simplified Hero Section */}
        <section className="reveal relative h-[300px] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl">
          <img 
            alt="Privacy Policy Hero" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjVgCpuDuR5uI6giWlUeOGnS0shBsdHHxLwiTAq3FyvsimRnNAUxcDgrCx4Ny6MtvhnqgfNRes78H2NuUjCHMEI6NAPMbBhR_AUAPWIdZe-_UGp63bWnW0QRpUJaHa88iUMpoSekg_XNFxFF8yqn6zosPbtS4Nx5Lt9xlWs746FpBSSqBSJ60aMEVTS1dJBdFD6NOha-m3o7bgeGyX0cI1Dj8wZOUtBypvqz1hp_kpeZu9mRc3AGwxr86dfec46HLZjPeXNdDKw7tV"
          />
          <div className="absolute inset-0 bg-[#064e3b]/40 flex items-center justify-center">
            <h1 className="font-['Lexend'] text-4xl md:text-6xl font-[800] text-white tracking-tighter">Privacy Policy</h1>
          </div>
        </section>

        {/* Intro Text */}
        <div className="reveal text-center mb-16 space-y-4">
          <p className="text-xl text-stone-600 leading-relaxed font-medium">
            Your data security and personal privacy are the foundation of our commitment to your health journey.
          </p>
          <div className="inline-block px-4 py-1 bg-stone-100 text-stone-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Last Updated: May 15, 2026
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          <section className="reveal space-y-4">
            <h2 className="font-['Lexend'] text-2xl font-[800] text-[#064e3b]">Information We Collect</h2>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-4 text-stone-600 leading-relaxed">
              <p>We collect essential information to provide our services, specifically:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong className="text-[#0f5238]">Account Details:</strong> Your name, email, and dietary preferences.</li>
                <li><strong className="text-[#0f5238]">Usage Data:</strong> How you interact with recipes and meal plans.</li>
                <li><strong className="text-[#0f5238]">Health Data:</strong> Voluntary information regarding allergens or goals.</li>
              </ul>
            </div>
          </section>

          <section className="reveal space-y-4">
            <h2 className="font-['Lexend'] text-2xl font-[800] text-[#064e3b]">How We Use Your Information</h2>
            <p className="text-stone-600 leading-relaxed text-lg px-2">
              Your data allows us to personalize recipe recommendations, generate optimized meal plans, send grocery updates, and maintain the security of our platform.
            </p>
          </section>

          <section className="reveal space-y-4">
            <h2 className="font-['Lexend'] text-2xl font-[800] text-[#064e3b]">Data Security</h2>
            <div className="bg-[#2d6a4f] text-white p-8 rounded-[2rem] shadow-xl">
              <p className="leading-relaxed opacity-90">
                We implement industry-standard encryption and security measures to protect your data. Our servers are monitored 24/7 to ensure your personal information remains strictly confidential and secure.
              </p>
            </div>
          </section>

          <section className="reveal space-y-4">
            <h2 className="font-['Lexend'] text-2xl font-[800] text-[#064e3b]">Cookies</h2>
            <p className="text-stone-600 leading-relaxed text-lg px-2">
              We use cookies to remember your preferences and understand how you navigate our site, allowing us to improve your user experience and platform speed.
            </p>
          </section>

          {/* Contact CTA */}
          <section className="reveal bg-[#fd9d1a]/10 p-12 rounded-[2.5rem] text-center border border-[#fd9d1a]/20 mt-20">
            <h3 className="font-['Lexend'] text-2xl font-[800] text-[#895100] mb-3">Need Clarification?</h3>
            <p className="text-stone-600 mb-8 max-w-md mx-auto">If you have any questions about how we handle your data, our support team is here to help.</p>
            <button className="bg-[#0f5238] text-white px-10 py-4 rounded-full font-bold text-sm shadow-lg hover:bg-[#064e3b] transition-all active:scale-95 border-none cursor-pointer">
              Contact Support
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;