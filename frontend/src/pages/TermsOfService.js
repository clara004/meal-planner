import React, { useEffect } from 'react';

const TermsOfService = () => {
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
    <div className="bg-[#f8f9fa] font-['Plus_Jakarta_Sans'] text-[#191c1d] selection:bg-[#0f5238]/20 min-h-screen">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
      `}</style>

      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="reveal relative w-full h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
          <img 
            alt="Modern workspace" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6e3BgH1e-9Aw3eef8MKvjq15RMIffhvngHSsXqpqquOIRsC4woVfEMdTtMo6zQvc5EIoXdqTE7-ApItRfetbK3YEmo0VDqox-5jsX5pKV3h6ZmeP_SoLhT_yzFjcJQzngAPtceUstNhYItxUA0WvSeaAARxYjCH_uDFgUl9D13-2twfZzO9j47xBvqPWZ7gN0_Z6QKfg6FRwffdRGYBQl_SXX2AOQeW0yL7BJvsuHJoFI6n2Mt03EXz3_yiHblep_WDk7zIEAFDxm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/80 via-transparent to-transparent flex items-end">
            <div className="p-12 w-full">
              <h1 className="font-['Lexend'] text-4xl md:text-6xl font-[800] text-white tracking-tighter mb-4">Terms of Service</h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl font-medium">Please read these terms carefully before using Vitality Kitchen.</p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-3xl mx-auto space-y-16">
          
          <article className="reveal space-y-6">
            <h2 className="font-['Lexend'] text-3xl font-[800] text-[#064e3b]">Introduction</h2>
            <p className="text-stone-600 text-lg leading-relaxed">
              Welcome to Vitality Kitchen. These Terms of Service ("Terms") govern your access to and use of Vitality Kitchen's website, mobile applications, and services. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
            </p>
          </article>

          <article className="reveal space-y-6">
            <h2 className="font-['Lexend'] text-3xl font-[800] text-[#064e3b]">User Accounts</h2>
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-stone-100 space-y-6">
              <p className="text-stone-600">To access certain features, you must create an account and agree to:</p>
              <ul className="space-y-4">
                {[
                  "Provide accurate and complete information during registration.",
                  "Maintain the security of your password and account access.",
                  "Promptly notify us of any suspected security breaches."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-stone-600">
                    <span className="material-symbols-outlined text-[#0f5238] scale-90">check_circle</span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="reveal space-y-6">
            <h2 className="font-['Lexend'] text-3xl font-[800] text-[#064e3b]">Service Usage</h2>
            <p className="text-stone-600 text-lg leading-relaxed">
              Our services are intended for personal, non-commercial use only. You agree not to misuse the services or help anyone else do so, including unauthorized access attempts.
            </p>
            
            {/* Medical Disclaimer Box */}
            <div className="bg-[#f0fdf4] p-8 rounded-[2rem] border-l-8 border-[#0f5238] shadow-sm">
              <h3 className="font-['Lexend'] text-[#0f5238] font-[800] text-xl mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span> Medical Disclaimer
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Vitality Kitchen is not a medical organization. The content provided is for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician regarding medical conditions.
              </p>
            </div>
          </article>

          <article className="reveal space-y-6">
            <h2 className="font-['Lexend'] text-3xl font-[800] text-[#064e3b]">Intellectual Property</h2>
            <p className="text-stone-600 text-lg leading-relaxed">
              The service and its original content, features, and functionality remain the exclusive property of Vitality Kitchen. All recipe imagery, macro-data visualizations, and design tokens are protected by copyright laws and may not be used without consent.
            </p>
          </article>

          <article className="reveal space-y-6">
            <h2 className="font-['Lexend'] text-3xl font-[800] text-[#064e3b]">Limitation of Liability</h2>
            <p className="text-stone-600 text-lg leading-relaxed">
              In no event shall Vitality Kitchen, nor its directors or affiliates, be liable for any indirect, incidental, or consequential damages resulting from your access to or inability to use the service.
            </p>
          </article>

          <div className="reveal pt-10 border-t border-stone-200">
            <p className="text-stone-400 font-bold text-xs uppercase tracking-widest text-center">Last updated: May 15, 2026</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;