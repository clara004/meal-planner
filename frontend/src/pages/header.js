import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?background=0f5238&color=fff&name=User';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Re-check auth state on every route change or user profile update
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const stored = localStorage.getItem('user');
        if (stored) {
          try { setUser(JSON.parse(stored)); } catch { setUser({}); }
        } else {
          setUser({});
        }
      } else {
        setUser(null);
      }
    };
    
    checkAuth();
    
    window.addEventListener('userUpdated', checkAuth);
    return () => window.removeEventListener('userUpdated', checkAuth);
  }, [location]);

  const isActive = (path) => location.pathname === path;

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
          {user ? (
            // Logged in — profile button with avatar + first name
            <button
              onClick={() => navigate('/profile')}
              className="bg-[#0f5238] text-white px-6 py-2.5 font-bold text-sm shadow-lg hover:bg-[#064e3b] transition-all flex items-center gap-2 border-none cursor-pointer"
              style={{ borderRadius: '9999px' }}
            >
              <img
                src={user.avatar || FALLBACK_AVATAR}
                alt=""
                onError={(e) => { e.target.src = FALLBACK_AVATAR; }}
                style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
              />
              {user.name ? user.name.split(' ')[0] : 'Profile'}
            </button>
          ) : (
            // Logged out — Login + Get Started
            <>
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
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;