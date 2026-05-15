import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100/50 shadow-sm">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        
        {/* Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="text-[24px] font-[800] tracking-tight text-[#064e3b] font-['Lexend'] cursor-pointer hover:scale-105 transition-transform"
        >
          Vitality Kitchen
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-4 font-['Lexend'] text-[14px] tracking-wide">
          
          {/* HOME */}
          <button 
            onClick={() => navigate('/')} 
            className={`px-5 py-2 rounded-full transition-all duration-300 bg-transparent border-none cursor-pointer flex items-center justify-center
              ${isActive('/') ? 'text-[#0f5238] font-bold bg-white shadow-sm' : 'text-stone-500 font-medium'}
              hover:-translate-y-1 hover:shadow-md hover:bg-white/90 hover:text-[#0f5238]`}
          >
            Home
          </button>
          
          {/* RECIPES */}
          <button 
            onClick={() => navigate('/recipes')} 
            className={`px-5 py-2 rounded-full transition-all duration-300 bg-transparent border-none cursor-pointer flex items-center justify-center
              ${isActive('/recipes') ? 'text-[#0f5238] font-bold bg-white shadow-sm' : 'text-stone-500 font-medium'}
              hover:-translate-y-1 hover:shadow-md hover:bg-white/90 hover:text-[#0f5238]`}
          >
            Recipes
          </button>

          {/* MEAL PLANS */}
          <button 
            className="px-5 py-2 rounded-full transition-all duration-300 bg-transparent border-none cursor-pointer flex items-center justify-center text-stone-500 font-medium hover:-translate-y-1 hover:shadow-md hover:bg-white/90 hover:text-[#0f5238]"
          >
            Meal Plans
          </button>
          
          {/* GROCERY LIST */}
          <button 
            className="px-5 py-2 rounded-full transition-all duration-300 bg-transparent border-none cursor-pointer flex items-center justify-center text-stone-500 font-medium hover:-translate-y-1 hover:shadow-md hover:bg-white/90 hover:text-[#0f5238]"
          >
            Grocery List
          </button>

          {/* "About Us" and "Community" have been REMOVED from here */}
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/login')} 
            className="text-stone-600 font-bold text-sm bg-transparent border-none cursor-pointer hover:text-[#0f5238] transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-[#0f5238] text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-[#064e3b] hover:-translate-y-1 hover:shadow-emerald-900/20 transition-all border-none cursor-pointer active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;