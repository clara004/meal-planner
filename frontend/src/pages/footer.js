import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full border-t border-stone-100 bg-white font-['Lexend'] text-sm py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
        
        {/* Left: Logo and Info */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div onClick={() => navigate('/')} className="text-[26px] font-[800] text-[#064e3b] tracking-tight cursor-pointer">
            Vitality Kitchen
          </div>
          <p className="text-stone-500 max-w-xs text-center md:text-left leading-relaxed font-['Plus_Jakarta_Sans']">
            Nourishing your journey with science, taste, and absolute joy. © 2024 Vitality Kitchen.
          </p>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          <button onClick={() => navigate('/about')} className="text-stone-600 font-medium hover:text-[#0f5238] transition-colors bg-transparent border-none cursor-pointer">About Us</button>
          <button onClick={() => navigate('/privacy-policy')} className="text-stone-600 font-medium hover:text-[#0f5238] transition-colors bg-transparent border-none cursor-pointer">Privacy Policy</button>
          <button onClick={() => navigate('/terms-of-service')} className="text-stone-600 font-medium hover:text-[#0f5238] transition-colors bg-transparent border-none cursor-pointer">Terms of Service</button>
          
          {/* 3. LINKED CONTACT US HERE */}
          <button onClick={() => navigate('/contact')} className="text-stone-600 font-medium hover:text-[#0f5238] transition-colors bg-transparent border-none cursor-pointer">Contact</button>
          
          <button className="text-stone-600 font-medium hover:text-[#0f5238] transition-colors bg-transparent border-none cursor-pointer">FAQ</button>
        </div>

        {/* Right: Socials */}
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#0f5238] hover:bg-[#0f5238] hover:text-white shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-xl">share</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#0f5238] hover:bg-[#0f5238] hover:text-white shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-xl">mail</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;