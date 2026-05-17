import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const footerButtonStyle = (path) => `
    px-5 py-2 rounded-full transition-all duration-300 border-none cursor-pointer flex items-center justify-center
    ${isActive(path)
      ? 'bg-[#f0fdf4] text-[#0f5238] font-bold shadow-sm'
      : 'text-stone-600 font-medium bg-transparent hover:bg-[#f0fdf4]/50'}
    hover:-translate-y-1 hover:shadow-md hover:text-[#0f5238]
  `;

  return (
    <footer className="w-full border-t border-stone-100 bg-white font-['Lexend'] text-sm py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">

        <div className="flex flex-col items-center md:items-start gap-4">
          <div onClick={() => navigate('/')} className="text-[26px] font-[800] text-[#064e3b] tracking-tight cursor-pointer hover:scale-105 transition-transform">
            Vitality Kitchen
          </div>
          <p className="text-stone-500 max-w-xs text-center md:text-left leading-relaxed font-['Plus_Jakarta_Sans']">
            Nourishing your journey with science, taste, and absolute joy. © 2026 Vitality Kitchen.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-2 gap-y-4">
          <button onClick={() => navigate('/about')} className={footerButtonStyle('/about')}>About Us</button>
          <button onClick={() => navigate('/privacy-policy')} className={footerButtonStyle('/privacy-policy')}>Privacy Policy</button>
          <button onClick={() => navigate('/terms-of-service')} className={footerButtonStyle('/terms-of-service')}>Terms of Service</button>
          <button onClick={() => navigate('/contact')} className={footerButtonStyle('/contact')}>Contact</button>
          <button className={footerButtonStyle('/faq')}>FAQ</button>
        </div>

        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#0f5238] hover:bg-[#0f5238] hover:text-white hover:-translate-y-1 shadow-sm hover:shadow-lg transition-all cursor-pointer">
            <span className="material-symbols-outlined text-xl">share</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#0f5238] hover:bg-[#0f5238] hover:text-white hover:-translate-y-1 shadow-sm hover:shadow-lg transition-all cursor-pointer">
            <span className="material-symbols-outlined text-xl">mail</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;