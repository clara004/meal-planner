import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const generateDays = (mondayDate) => {
  const days = [];
  const keys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const shorts = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayDate);
    d.setDate(d.getDate() + i);
    const isToday = d.getTime() === today.getTime();
    const month = d.toLocaleString('en-US', { month: 'short' });
    days.push({
      short: shorts[i],
      date: `${month} ${d.getDate()}`,
      today: isToday,
      key: keys[i]
    });
  }
  return days;
};

const MEAL_SLOTS = ['Breakfast', 'Lunch', 'Dinner'];

// initialise plan state
const buildInitialPlan = () => {
  const plan = {};
  for (let i = 0; i < 7; i++) {
    plan[i] = {};
    MEAL_SLOTS.forEach(slot => { plan[i][slot] = null; });
  }
  return plan;
};

// ── Sub-components ────────────────────────────────────────────────────────────
function RecipeCard({ recipe, onRemove }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', background: 'white', borderRadius: '12px', padding: '10px',
        boxShadow: '0 4px 20px rgba(45,106,79,0.07)', border: `1px solid ${hovered ? 'rgba(15,82,56,0.2)' : 'transparent'}`,
        transition: 'all 0.15s'
      }}
    >
      {hovered && (
        <button onClick={onRemove} style={{
          position: 'absolute', top: '-8px', right: '-8px',
          background: '#ba1a1a', color: 'white', border: 'none', borderRadius: '50%',
          width: '22px', height: '22px', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 2
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
        </button>
      )}
      <img src={recipe.img} alt={recipe.name} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }} />
      <p style={{
        fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
        color: '#0f5238', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
      }}>{recipe.name}</p>
      <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '11px', color: '#707973', fontWeight: 500 }}>{recipe.kcal} kcal</p>
    </div>
  );
}

function EmptySlot({ label, onAdd }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onAdd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', minHeight: '100px', border: `2px dashed ${hovered ? '#2d6a4f' : '#bfc9c1'}`,
        borderRadius: '12px', background: hovered ? 'rgba(45,106,79,0.04)' : 'transparent',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '4px', cursor: 'pointer', transition: 'all 0.15s'
      }}>
      <span className="material-symbols-outlined" style={{ color: hovered ? '#2d6a4f' : '#bfc9c1', fontSize: '22px' }}>add_circle</span>
      <span style={{
        fontFamily: 'Plus Jakarta Sans', fontSize: '11px', fontWeight: 700,
        color: hovered ? '#2d6a4f' : '#bfc9c1', letterSpacing: '0.03em'
      }}>
        {label ? `Add ${label}` : 'Add Recipe'}
      </span>
    </button>
  );
}

function DayColumn({ day, dayIndex, meals, onAdd, onRemove, isToday }) {
  const totalKcal = Object.values(meals).reduce((sum, r) => sum + (r?.kcal || 0), 0);
  const goalKcal = 2000;
  const pct = Math.min((totalKcal / goalKcal) * 100, 100);
  const barColor = pct > 90 ? '#ba1a1a' : pct > 70 ? '#fd9d1a' : '#2d6a4f';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px',
      borderRadius: '18px', position: 'relative',
      background: isToday ? 'rgba(177,240,206,0.18)' : 'white',
      border: isToday ? '1.5px solid #b1f0ce' : 'none',
      boxShadow: isToday ? 'none' : '0 4px 20px rgba(45,106,79,0.06)',
      minWidth: 0,
      marginTop: isToday ? '14px' : '14px',
    }}>
      {isToday && (
        <div style={{
          position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
          background: '#0f5238', color: 'white', fontSize: '9px', fontWeight: 800,
          padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.1em',
          textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: 'Plus Jakarta Sans'
        }}>
          Today
        </div>
      )}

      {/* Day header */}
      <div style={{ textAlign: 'center', paddingTop: isToday ? '8px' : '0' }}>
        <p style={{
          fontFamily: 'Lexend', fontSize: '16px', fontWeight: 700,
          color: isToday ? '#0f5238' : '#191c1d', margin: 0
        }}>{day.short}</p>
        <p style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: '11px', fontWeight: 700,
          color: '#707973', margin: 0
        }}>{day.date}</p>
      </div>

      {/* Meal slots */}
      {MEAL_SLOTS.map(slot => (
        <div key={slot}>
          <p style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: '9px', fontWeight: 800,
            color: '#707973', textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: '4px'
          }}>{slot}</p>
          {meals[slot]
            ? <RecipeCard recipe={meals[slot]} onRemove={() => onRemove(dayIndex, slot)} />
            : <EmptySlot label={slot} onAdd={() => onAdd(dayIndex, slot)} />
          }
        </div>
      ))}

      {/* Daily total */}
      <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #e1e3e4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: '9px', fontWeight: 800,
            color: '#0f5238', textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>Daily Total</span>
          <span style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
            color: barColor
          }}>{totalKcal.toLocaleString()} kcal</span>
        </div>
        <div style={{ height: '6px', background: '#e1e3e4', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`, background: barColor,
            borderRadius: '9999px', transition: 'width 0.3s'
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Recipe Picker Modal ───────────────────────────────────────────────────────

function RecipePickerModal({ slot, onSelect, onClose, allRecipes, filters }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = allRecipes.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || r.cuisine === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '20px', width: '100%', maxWidth: '560px',
        maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)'
      }} onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div style={{ padding: '20px 24px 0', borderBottom: '1px solid #e1e3e4', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{
              fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
              color: '#0f5238', margin: 0
            }}>Add Recipe — {slot?.label}</h3>
            <button onClick={onClose} style={{
              background: 'none', border: 'none',
              cursor: 'pointer', color: '#707973'
            }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <span className="material-symbols-outlined" style={{
              position: 'absolute', left: '12px',
              top: '50%', transform: 'translateY(-50%)', color: '#707973', fontSize: '20px'
            }}>search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes..."
              style={{
                width: '100%', height: '42px', paddingLeft: '42px', paddingRight: '16px',
                background: '#f3f4f5', border: '2px solid transparent', borderRadius: '10px',
                fontFamily: 'Plus Jakarta Sans', fontSize: '14px', boxSizing: 'border-box'
              }} />
          </div>
          {/* Filter chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '5px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
                background: filter === f ? '#0f5238' : '#f3f4f5',
                color: filter === f ? 'white' : '#404943',
                transition: 'all 0.15s',
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Recipe grid */}
        <div style={{
          overflowY: 'auto', padding: '16px 24px', flex: 1,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'
        }}>
          {filtered.map(recipe => (
            <button key={recipe.id} onClick={() => onSelect(recipe)}
              style={{
                background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden',
                border: '1px solid #e1e3e4', transition: 'all 0.15s', cursor: 'pointer',
                padding: 0, textAlign: 'left', font: 'inherit', color: 'inherit',
                display: 'flex', flexDirection: 'column', minHeight: '218px'
              }}>
              <div style={{ position: 'relative' }}>
                <img src={recipe.img} alt={recipe.name}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
                <span style={{
                  position: 'absolute', top: '8px', right: '8px',
                  width: '30px', height: '30px', borderRadius: '50%', background: '#0f5238',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.18)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                </span>
              </div>
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
                  color: '#191c1d', margin: '0 0 2px'
                }}>{recipe.name}</p>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans', fontSize: '11px',
                  color: '#707973', margin: '0 0 8px'
                }}>{recipe.kcal} kcal • {recipe.cuisine}</p>
                <span
                  style={{
                    width: '100%', padding: '7px', background: '#0f5238', color: 'white',
                    borderRadius: '8px', fontFamily: 'Plus Jakarta Sans', fontSize: '12px',
                    fontWeight: 700, textAlign: 'center', marginTop: 'auto', display: 'block'
                  }}>
                  Add
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{
              gridColumn: '1/-1', textAlign: 'center', padding: '40px',
              color: '#707973', fontFamily: 'Plus Jakarta Sans', fontSize: '14px'
            }}>
              No recipes match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MealPlanner() {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()));
  const days = generateDays(currentWeekStart);

  const [plan, setPlan] = useState(buildInitialPlan());
  const [allRecipes, setAllRecipes] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [filters, setFilters] = useState(['All']);
  const [pickerSlot, setPickerSlot] = useState(null); // { dayIndex, label }
  
  const weekLabel = `${days[0].date} – ${days[6].date}, ${currentWeekStart.getFullYear()}`;
  const [saved, setSaved] = useState(false);
  const [planError, setPlanError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const recRes = await api.get('/recipes');
        const formattedRecipes = recRes.data.recipes.map(r => ({
          id: r._id,
          name: r.title,
          kcal: r.perServing?.calories || 0,
          cuisine: r.cuisine || 'General',
          img: r.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
          time: r.prepTime ? `${r.prepTime} min` : '15 min'
        }));
        setAllRecipes(formattedRecipes);
        setSuggested(formattedRecipes.slice(0, 3));
        const cats = new Set(formattedRecipes.map(r => r.cuisine));
        setFilters(['All', ...Array.from(cats)]);

        let planRes;
        try {
          planRes = await api.get(`/mealplan?startDate=${currentWeekStart.toISOString()}`);
          if (!planRes.data.plan) planRes = await api.post('/mealplan', { startDate: currentWeekStart.toISOString() });
        } catch (e) {
          if (e.response?.status === 404) {
            planRes = await api.post('/mealplan', { startDate: currentWeekStart.toISOString() });
          } else {
            throw e;
          }
        }

        const backendPlan = planRes.data.plan.week;
        const newPlan = buildInitialPlan();
        days.forEach((d, i) => {
          MEAL_SLOTS.forEach(slot => {
            const recipeData = backendPlan[d.key]?.[slot];
            if (recipeData) {
              newPlan[i][slot] = {
                id: recipeData._id,
                name: recipeData.title,
                kcal: recipeData.perServing?.calories || 0,
                cuisine: recipeData.cuisine || 'General',
                img: recipeData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
                time: recipeData.prepTime ? `${recipeData.prepTime} min` : '15 min'
              };
            }
          });
        });
        setPlan(newPlan);
      } catch (err) {
        console.error('Failed to load meal plan data:', err);
      }
    };
    loadData();
  }, [navigate, currentWeekStart]);

  const totalKcal = Object.values(plan).reduce((sum, day) => sum + Object.values(day).reduce((s, r) => s + (r?.kcal || 0), 0), 0);
  const avgKcal = Math.round(totalKcal / 7);

  const handleAdd = (dayIndex, slot) => setPickerSlot({ dayIndex, label: slot });
  const findFirstEmptySlot = () => {
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      for (const slot of MEAL_SLOTS) {
        if (!plan[dayIndex][slot]) return { dayIndex, label: slot };
      }
    }
    return null;
  };

  const handleSuggestedAdd = (recipe) => {
    const firstEmptySlot = findFirstEmptySlot();
    if (!firstEmptySlot) {
      setPlanError('Your week is already full. Remove a meal before adding another one.');
      return;
    }
    setPickerSlot(firstEmptySlot);
    handleSelect(recipe, firstEmptySlot);
  };

  const handleRemove = async (dayIndex, slot) => {
    try {
      await api.delete(`/mealplan/${days[dayIndex].key}/${slot}?startDate=${currentWeekStart.toISOString()}`);
      setPlan(prev => ({ ...prev, [dayIndex]: { ...prev[dayIndex], [slot]: null } }));
    } catch (err) { console.error('Failed to remove recipe:', err); }
  };
  const handleSelect = async (recipe, targetSlot = pickerSlot) => {
    if (!targetSlot || targetSlot.dayIndex === null || targetSlot.dayIndex === undefined) return;
    try {
      setPlanError('');
      await api.put(`/mealplan/${days[targetSlot.dayIndex].key}/${targetSlot.label}`, { 
        recipeId: recipe.id,
        startDate: currentWeekStart.toISOString()
      });
      setPlan(prev => ({
        ...prev,
        [targetSlot.dayIndex]: { ...prev[targetSlot.dayIndex], [targetSlot.label]: recipe },
      }));
      setPickerSlot(null);
    } catch (err) {
      console.error('Failed to add recipe:', err);
      setPlanError(err.response?.data?.message || 'Could not add that meal. Please try again.');
    }
  };
  const handleClearWeek = async () => {
    try {
      for (let i = 0; i < 7; i++) {
        for (const slot of MEAL_SLOTS) {
          if (plan[i][slot]) await api.delete(`/mealplan/${days[i].key}/${slot}?startDate=${currentWeekStart.toISOString()}`);
        }
      }
      setPlan(buildInitialPlan());
    } catch (err) { console.error('Failed to clear week:', err); }
  };
  const handleSave = async () => {
    try {
      // Build the week object mapping day keys to recipe IDs
      const week = {};
      days.forEach((d, i) => {
        week[d.key] = {};
        MEAL_SLOTS.forEach(slot => {
          week[d.key][slot] = plan[i][slot]?.id || null;
        });
      });

      await api.put('/mealplan', {
        startDate: currentWeekStart.toISOString(),
        week
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save plan:', err);
      setPlanError('Could not save the meal plan. Please try again.');
    }
  };

  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        .reveal { opacity: 0; transform: translateY(60px) scale(0.98); transition: opacity 1.2s cubic-bezier(0.2, 1, 0.3, 1), transform 1.2s cubic-bezier(0.2, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal.active { opacity: 1; transform: translateY(0) scale(1); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background-color: #f8f9fa;
          background-image: radial-gradient(#bfc9c1 0.5px, transparent 0.5px);
          background-size: 24px 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .mp-nav-link { font-family: 'Plus Jakarta Sans'; font-size: 14px; font-weight: 600; color: #64748b; text-decoration: none; transition: color 0.15s; }
        .mp-nav-link:hover { color: #2d6a4f; }
        .mp-nav-link.active { color: #2d6a4f; border-bottom: 2px solid #2d6a4f; padding-bottom: 2px; }
        .mp-btn-ghost { background: none; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans'; font-size: 14px; font-weight: 600; color: #1a4731; padding: 8px 20px; border-radius: '8px'; transition: background 0.15s; }
        .mp-btn-ghost:hover { background: #f0faf5; border-radius: 8px; }
        .mp-suggested:hover { box-shadow: 0 8px 24px rgba(45,106,79,0.12); transform: translateY(-1px); }
        .mp-suggested { transition: all 0.15s; }
        @media (max-width: 1024px) {
          .mp-grid { grid-template-columns: repeat(4, minmax(0,1fr)) !important; }
        }
        @media (max-width: 640px) {
          .mp-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .mp-layout { flex-direction: column !important; }
        }
      `}</style>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100/50 shadow-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5">
          {/* Logo - Click to go Home */}
          <div
            onClick={() => navigate('/')}
            className="text-[24px] font-[800] tracking-tight text-[#064e3b] font-['Lexend'] cursor-pointer"
          >
            Vitality Kitchen
          </div>

          <div className="hidden md:flex items-center gap-10 font-['Lexend'] text-[14px] tracking-wide">
            <button onClick={() => navigate('/')} className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent">Home</button>
            <button
              onClick={() => navigate('/recipes')}
              className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent"
            >
              Recipes
            </button>
            <button
              onClick={() => navigate('/meal-planner')}
              className="text-[#0f5238] font-bold border-b-2 border-[#0f5238] pb-1 bg-transparent"
            >
              Meal Planner
            </button>
            <button
              onClick={() => navigate('/grocery')}
              className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent"
            >
              Grocery List
            </button>
          </div>

          <div className="flex items-center gap-6">
            {localStorage.getItem('token') ? (
              <button onClick={() => navigate('/profile')} className="bg-[#0f5238] text-white px-6 py-2.5 pill-button font-bold text-sm shadow-lg hover:bg-[#064e3b] transition-all flex items-center gap-2" style={{ borderRadius: '9999px' }}>
                <span className="material-symbols-outlined text-sm">person</span>
                Profile
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-stone-600 font-bold text-sm">Login</button>
                <button onClick={() => navigate('/login')} className="bg-[#0f5238] text-white px-8 py-3 pill-button font-bold text-sm shadow-lg hover:bg-[#064e3b] transition-all" style={{ borderRadius: '9999px' }}>Get Started</button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className={`reveal ${pageLoaded ? 'active' : ''}`} style={{ maxWidth: '1440px', margin: '0 auto', padding: '110px 48px 120px' }}>

        {/* ── Page Header ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '32px', flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontFamily: 'Lexend', fontSize: '32px', fontWeight: 700,
              color: '#0f5238', marginBottom: '12px', letterSpacing: '-0.01em'
            }}>Weekly Meal Plan</h1>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', background: 'white',
              padding: '8px 16px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(45,106,79,0.06)',
              width: 'fit-content'
            }}>
              <button onClick={() => {
                const prev = new Date(currentWeekStart);
                prev.setDate(prev.getDate() - 7);
                setCurrentWeekStart(prev);
              }} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#707973',
                display: 'flex', alignItems: 'center'
              }}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span style={{
                fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                color: '#191c1d', minWidth: '160px', textAlign: 'center'
              }}>{weekLabel}</span>
              <button onClick={() => {
                const next = new Date(currentWeekStart);
                next.setDate(next.getDate() + 7);
                setCurrentWeekStart(next);
              }} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#707973',
                display: 'flex', alignItems: 'center'
              }}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/grocery')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px',
                background: '#fd9d1a', color: '#2c1700', border: 'none', borderRadius: '10px',
                fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(253,157,26,0.3)'
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_cart</span>
              Generate Shopping List
            </button>
            <button onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px',
                background: saved ? '#1D9E75' : '#0f5238', color: 'white', border: 'none',
                borderRadius: '10px', fontFamily: 'Plus Jakarta Sans', fontSize: '13px',
                fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s',
                boxShadow: '0 2px 8px rgba(15,82,56,0.25)'
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {saved ? 'check' : 'save'}
              </span>
              {saved ? 'Saved!' : 'Save Plan'}
            </button>
          </div>
        </div>

        {/* ── Main Layout ── */}
        {planError && (
          <div style={{
            marginBottom: '18px', padding: '12px 16px', background: '#ffdad6',
            color: '#93000a', borderRadius: '10px', fontFamily: 'Plus Jakarta Sans',
            fontSize: '13px', fontWeight: 700
          }}>
            {planError}
          </div>
        )}

        <div className="mp-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

          {/* 7-day grid */}
          <div style={{ flexGrow: 1, overflowX: 'auto', paddingBottom: '8px' }}>
            <div className="mp-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))',
              gap: '12px', minWidth: '900px'
            }}>
              {days.map((day, i) => (
                <DayColumn key={i} day={day} dayIndex={i} meals={plan[i]}
                  onAdd={handleAdd} onRemove={handleRemove} isToday={day.today} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Nutrition summary */}
            <div style={{
              background: 'white', borderRadius: '18px', padding: '22px',
              boxShadow: '0 4px 20px rgba(45,106,79,0.06)', border: '1px solid #ecfdf5'
            }}>
              <h2 style={{
                fontFamily: 'Lexend', fontSize: '16px', fontWeight: 700,
                color: '#0f5238', marginBottom: '16px'
              }}>Nutrition Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {[
                  ['Weekly Total', `${totalKcal.toLocaleString()} kcal`],
                  ['Daily Average', `${avgKcal.toLocaleString()} kcal`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '13px', color: '#707973' }}>{label}</span>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700, color: '#0f5238' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                {[['#2d6a4f', 'Protein'], ['#fd9d1a', 'Carbs'], ['#57624e', 'Fat']].map(([c, l]) => (
                  <span key={l} style={{
                    fontFamily: 'Plus Jakarta Sans', fontSize: '10px',
                    fontWeight: 800, color: c, textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>{l}</span>
                ))}
              </div>
              <div style={{
                height: '10px', width: '100%', display: 'flex',
                borderRadius: '9999px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ width: '30%', background: '#2d6a4f', height: '100%' }} />
                <div style={{ width: '50%', background: '#fd9d1a', height: '100%' }} />
                <div style={{ width: '20%', background: '#57624e', height: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {['30%', '50%', '20%'].map(p => (
                  <span key={p} style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '10px', color: '#707973', fontWeight: 600 }}>{p}</span>
                ))}
              </div>
            </div>

            {/* Suggested recipes */}
            <div>
              <h2 style={{
                fontFamily: 'Lexend', fontSize: '16px', fontWeight: 700,
                color: '#0f5238', marginBottom: '14px'
              }}>Suggested for You</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {suggested.map(r => (
                  <div key={r.name} className="mp-suggested"
                    style={{
                      display: 'flex', gap: '12px', background: 'white', padding: '12px',
                      borderRadius: '14px', boxShadow: '0 4px 16px rgba(45,106,79,0.06)', alignItems: 'center'
                    }}>
                    <img src={r.img} alt={r.name}
                      style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
                        color: '#191c1d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>{r.name}</p>
                      <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '11px', color: '#707973' }}>
                        {r.kcal} kcal • {r.time}
                      </p>
                    </div>
                    <button onClick={() => handleSuggestedAdd(r)}
                      style={{
                        background: '#f0faf5', color: '#0f5238', border: 'none',
                        borderRadius: '8px', padding: '7px', cursor: 'pointer', flexShrink: 0,
                        display: 'flex', alignItems: 'center', transition: 'all 0.15s'
                      }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Bottom Sticky Bar ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid #e1e3e4', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1440px', margin: '0 auto', padding: '0 48px',
          height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
            {[['Week Total', `${totalKcal.toLocaleString()} kcal`],
            ['Daily Average', `${avgKcal.toLocaleString()} kcal`]].map(([l, v]) => (
              <div key={l}>
                <div style={{
                  fontFamily: 'Plus Jakarta Sans', fontSize: '9px', fontWeight: 800,
                  color: '#707973', textTransform: 'uppercase', letterSpacing: '0.08em'
                }}>{l}</div>
                <div style={{
                  fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                  color: '#0f5238'
                }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={handleClearWeek}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: '1.5px solid #bfc9c1',
              background: 'none', color: '#707973', cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
              transition: 'all 0.15s'
            }}>
            Clear Week
          </button>
        </div>
      </div>

      {/* ── Recipe Picker Modal ── */}
      {pickerSlot && (
        <RecipePickerModal
          slot={pickerSlot}
          onSelect={handleSelect}
          onClose={() => setPickerSlot(null)}
          allRecipes={allRecipes}
          filters={filters}
        />
      )}
    </>
  );
}
