import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Updated style: Now includes a permanent background color for the active path
  const navButtonStyle = (path) => `
    px-5 py-2 rounded-full transition-all duration-300 border-none cursor-pointer flex items-center justify-center
    ${isActive(path) 
      ? 'bg-[#f0fdf4] text-[#0f5238] font-bold shadow-sm' 
      : 'bg-transparent text-stone-500 font-medium hover:bg-[#f0fdf4]/50'}
    hover:-translate-y-1 hover:shadow-md hover:text-[#0f5238]
  `;

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100/50 shadow-sm">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        
        <div 
          onClick={() => navigate('/')} 
          className="text-[24px] font-[800] tracking-tight text-[#064e3b] font-['Lexend'] cursor-pointer hover:scale-105 transition-transform"
        >
          Vitality Kitchen
        </div>
        
        <div className="hidden md:flex items-center gap-2 font-['Lexend'] text-[14px] tracking-wide">
          <button onClick={() => navigate('/')} className={navButtonStyle('/')}>
            Home
          </button>
          
          <button onClick={() => navigate('/recipes')} className={navButtonStyle('/recipes')}>
            Recipes
          </button>

          <button onClick={() => navigate('/meal-planner')} className={navButtonStyle('/meal-planner')}>
            Meal Planner
          </button>

          <button onClick={() => navigate('/grocery')} className={navButtonStyle('/grocery')}>
            Grocery List
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/login')} 
            className="text-stone-600 font-bold text-sm bg-transparent border-none cursor-pointer hover:text-[#0f5238] transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-[#0f5238] text-white px-8 py-3 rounded-full font-[800] text-sm shadow-lg hover:bg-[#064e3b] hover:-translate-y-1 transition-all border-none cursor-pointer active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;