import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const DAYS = [
  { short: 'Mon', date: 'May 5',  today: true  },
  { short: 'Tue', date: 'May 6',  today: false },
  { short: 'Wed', date: 'May 7',  today: false },
  { short: 'Thu', date: 'May 8',  today: false },
  { short: 'Fri', date: 'May 9',  today: false },
  { short: 'Sat', date: 'May 10', today: false },
  { short: 'Sun', date: 'May 11', today: false },
];

const MEAL_SLOTS = ['Breakfast', 'Lunch', 'Dinner'];

const SUGGESTED = [
  { name: 'Green Vitality Bowl',  kcal: 320, time: '15 min', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4aNOBvCAuIUinAPdwS2MhuhyxIBh2a0iKr-MEN1hXLZMAt9EkKj7lkrreobV4zPQVGqBIkt7shIEYBDEwNgnjN2Uu7JmTXEBJMilnP5BaCA6ErjPsOealc-jjXwyoJKK-mM8xlcMZVyla_f4YR33h2jGkADW2Rw3z9EANXFur4xVelAknhzb-XZRCX6oqTogq25Z9NaTYlSpzHW6UAbGLNLd2PKMQ9lHlivjbKkvZOGzb98dnmT1Coka36iGWhVNcLkrR8Ny0lqgH' },
  { name: 'Lemon Salmon Bake',    kcal: 480, time: '25 min', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6CLSCYyU8gxuMQan2lTSLzPzTbP-MK5gBTnUVl7qowj1Fc3pNWI4N-3MQqfqRu8gVsLHqQS7DvnmcPgPa5ALbIark6GSnGBKFIkShK9ESPMaYz4gQjx6Qo0Clnxl87LDjjEfTV_8UAEsieFFCVwDrZY3ZFSw5NzdLEIeB5ZjN0klHPvRE1U4RBqdJw5gTmr-kaTVwTINLG3t75oOEob2XoHGRpjOmUMjmjRRe5qPv6d3O-8CU2MpeE-Pu89HkHU7mJVuJ29M3tH6F' },
  { name: 'Hearty Lentil Soup',   kcal: 390, time: '40 min', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnh5-jleFvfRqr6mNQRcJdERr1JcaMJ0uYDMfSQyXRZlK0vOMWdDrWZqC5iphWyBspiQAjvj0ZG7yQZxjEx0XZExVgolCh5O34W4TEz5SxBw9hjVEzxRGzQU_jOQsaaS0ujYlm62UtoNQLBtm6Pai1wJ85JiDVg1IFKUYzrQVynGBY1JdF7v3XONrXd1V_Fr6rjeWcg1MTI1im_8eL1iIqgbTwS-cUMc-UHZiE74LusPVo7v6XLc7odZ0zyzRYX74NcTL7t1rOXbfI' },
];

// Prefilled recipes for Monday
const MONDAY_MEALS = {
  Breakfast: { name: 'Avocado Berry Bowl', kcal: 420, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGxdgt5KmdoKDN7ApDVHIWmpEX2ehtYl6TicmIYpu5FgZ8wPyjfjuJARvygjzEj5rvEurIh1Yaxqws5rGlso-741UprnoZqU2bIm9SvP3u3vkZbAAXGBJ4P7BeuvwwxT3bvLB_y1CyJI5CCMV6HSbpbwVp3kWjdQFuiF7qt-mbSPxribl1JuQTQSW4eddHlujLqdLVzT0YCALsC7s7oyrw24Mj5GSAK0_YiU3PY6nIkJzZ2lcfQg32huqmlVSgB6ofkJ0ZiKVpkdkW' },
  Lunch:     { name: 'Quinoa Power Salad', kcal: 580, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJa5UHNYN5H0_qKe5sCgxFchTyLXuehiMqrqjx8Re9nx-j7y9ryMw4YbmRG5FDJ_g6QglZfQ1_4NDV26UL5WQMylkRIzsub5eGVMym-D4FLSAxfIrxOrLog6706qr_lkH3qr2eZriEIX8EFHCxkcO7PlEzu4Pg4HfpatJsszqEiah1-b0HVVENL457xcf5ywSYzK_TMCY2qSOS9dR8yoCVsMksOnB8iUto5UXGJsGmY5giiZLzv--276oa0wD2SGUXdCUdEdw3bCHY' },
  Dinner:    null,
};

const TUESDAY_MEALS = {
  Breakfast: null,
  Lunch:     { name: 'Hummus Plate', kcal: 310, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7EpWUflb2KDmFA88-FjockMLooqyG0CR8x3-VAYbbeflz4flpknFRJADccvG6OduSLoPGIDy_0p7-PlgsqkgHwgzUBUjGft3Vffg0VD-MxsI5128GfpecERlDpZ4mRt2h-ZrCGrpcPj-1ZyKVPuLz8mj3yVSUByWgCJv1PjPaqm2pL2Nue_kkmEzv8uc1Zw1roCWfzaQ28V2xP8HK2tWZwaepOX_Ig6SeZcmcqnE0G1dQ_zn24gvlf96gMBPJs9QRo00wozko-cIZ' },
  Dinner:    null,
};

// initialise plan state
const buildInitialPlan = () => {
  const plan = {};
  DAYS.forEach((d, i) => {
    plan[i] = {};
    MEAL_SLOTS.forEach(slot => { plan[i][slot] = null; });
  });
  // seed Monday & Tuesday
  Object.assign(plan[0], MONDAY_MEALS);
  Object.assign(plan[1], TUESDAY_MEALS);
  return plan;
};

// ── Sub-components ────────────────────────────────────────────────────────────
function RecipeCard({ recipe, onRemove }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', background: 'white', borderRadius: '12px', padding: '10px',
        boxShadow: '0 4px 20px rgba(45,106,79,0.07)', border: `1px solid ${hovered ? 'rgba(15,82,56,0.2)' : 'transparent'}`,
        transition: 'all 0.15s' }}
    >
      {hovered && (
        <button onClick={onRemove} style={{ position: 'absolute', top: '-8px', right: '-8px',
          background: '#ba1a1a', color: 'white', border: 'none', borderRadius: '50%',
          width: '22px', height: '22px', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
        </button>
      )}
      <img src={recipe.img} alt={recipe.name} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }} />
      <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
        color: '#0f5238', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{recipe.name}</p>
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
      style={{ width: '100%', minHeight: '100px', border: `2px dashed ${hovered ? '#2d6a4f' : '#bfc9c1'}`,
        borderRadius: '12px', background: hovered ? 'rgba(45,106,79,0.04)' : 'transparent',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '4px', cursor: 'pointer', transition: 'all 0.15s' }}>
      <span className="material-symbols-outlined" style={{ color: hovered ? '#2d6a4f' : '#bfc9c1', fontSize: '22px' }}>add_circle</span>
      <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '11px', fontWeight: 700,
        color: hovered ? '#2d6a4f' : '#bfc9c1', letterSpacing: '0.03em' }}>
        {label ? `Add ${label}` : 'Add Recipe'}
      </span>
    </button>
  );
}

function DayColumn({ day, dayIndex, meals, onAdd, onRemove, isToday }) {
  const totalKcal = Object.values(meals).reduce((sum, r) => sum + (r?.kcal || 0), 0);
  const goalKcal  = 2000;
  const pct       = Math.min((totalKcal / goalKcal) * 100, 100);
  const barColor  = pct > 90 ? '#ba1a1a' : pct > 70 ? '#fd9d1a' : '#2d6a4f';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px',
      borderRadius: '18px', position: 'relative',
      background: isToday ? 'rgba(177,240,206,0.18)' : 'white',
      border: isToday ? '1.5px solid #b1f0ce' : 'none',
      boxShadow: isToday ? 'none' : '0 4px 20px rgba(45,106,79,0.06)',
      minWidth: 0,
    }}>
      {isToday && (
        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
          background: '#0f5238', color: 'white', fontSize: '9px', fontWeight: 800,
          padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.1em',
          textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: 'Plus Jakarta Sans' }}>
          Today
        </div>
      )}

      {/* Day header */}
      <div style={{ textAlign: 'center', paddingTop: isToday ? '8px' : '0' }}>
        <p style={{ fontFamily: 'Lexend', fontSize: '16px', fontWeight: 700,
          color: isToday ? '#0f5238' : '#191c1d', margin: 0 }}>{day.short}</p>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '11px', fontWeight: 700,
          color: '#707973', margin: 0 }}>{day.date}</p>
      </div>

      {/* Meal slots */}
      {MEAL_SLOTS.map(slot => (
        <div key={slot}>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '9px', fontWeight: 800,
            color: '#707973', textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: '4px' }}>{slot}</p>
          {meals[slot]
            ? <RecipeCard recipe={meals[slot]} onRemove={() => onRemove(dayIndex, slot)} />
            : <EmptySlot label={slot} onAdd={() => onAdd(dayIndex, slot)} />
          }
        </div>
      ))}

      {/* Daily total */}
      <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #e1e3e4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '9px', fontWeight: 800,
            color: '#0f5238', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Total</span>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
            color: barColor }}>{totalKcal.toLocaleString()} kcal</span>
        </div>
        <div style={{ height: '6px', background: '#e1e3e4', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: barColor,
            borderRadius: '9999px', transition: 'width 0.3s' }} />
        </div>
      </div>
    </div>
  );
}

// ── Recipe Picker Modal ───────────────────────────────────────────────────────
const ALL_RECIPES = [
  { name: 'Avocado Berry Bowl',  kcal: 420, cuisine: 'Healthy', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGxdgt5KmdoKDN7ApDVHIWmpEX2ehtYl6TicmIYpu5FgZ8wPyjfjuJARvygjzEj5rvEurIh1Yaxqws5rGlso-741UprnoZqU2bIm9SvP3u3vkZbAAXGBJ4P7BeuvwwxT3bvLB_y1CyJI5CCMV6HSbpbwVp3kWjdQFuiF7qt-mbSPxribl1JuQTQSW4eddHlujLqdLVzT0YCALsC7s7oyrw24Mj5GSAK0_YiU3PY6nIkJzZ2lcfQg32huqmlVSgB6ofkJ0ZiKVpkdkW' },
  { name: 'Quinoa Power Salad',  kcal: 580, cuisine: 'Salad',   img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJa5UHNYN5H0_qKe5sCgxFchTyLXuehiMqrqjx8Re9nx-j7y9ryMw4YbmRG5FDJ_g6QglZfQ1_4NDV26UL5WQMylkRIzsub5eGVMym-D4FLSAxfIrxOrLog6706qr_lkH3qr2eZriEIX8EFHCxkcO7PlEzu4Pg4HfpatJsszqEiah1-b0HVVENL457xcf5ywSYzK_TMCY2qSOS9dR8yoCVsMksOnB8iUto5UXGJsGmY5giiZLzv--276oa0wD2SGUXdCUdEdw3bCHY' },
  { name: 'Hummus Plate',        kcal: 310, cuisine: 'Mediterranean', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7EpWUflb2KDmFA88-FjockMLooqyG0CR8x3-VAYbbeflz4flpknFRJADccvG6OduSLoPGIDy_0p7-PlgsqkgHwgzUBUjGft3Vffg0VD-MxsI5128GfpecERlDpZ4mRt2h-ZrCGrpcPj-1ZyKVPuLz8mj3yVSUByWgCJv1PjPaqm2pL2Nue_kkmEzv8uc1Zw1roCWfzaQ28V2xP8HK2tWZwaepOX_Ig6SeZcmcqnE0G1dQ_zn24gvlf96gMBPJs9QRo00wozko-cIZ' },
  { name: 'Green Vitality Bowl', kcal: 320, cuisine: 'Vegan',   img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4aNOBvCAuIUinAPdwS2MhuhyxIBh2a0iKr-MEN1hXLZMAt9EkKj7lkrreobV4zPQVGqBIkt7shIEYBDEwNgnjN2Uu7JmTXEBJMilnP5BaCA6ErjPsOealc-jjXwyoJKK-mM8xlcMZVyla_f4YR33h2jGkADW2Rw3z9EANXFur4xVelAknhzb-XZRCX6oqTogq25Z9NaTYlSpzHW6UAbGLNLd2PKMQ9lHlivjbKkvZOGzb98dnmT1Coka36iGWhVNcLkrR8Ny0lqgH' },
  { name: 'Lemon Salmon Bake',   kcal: 480, cuisine: 'Seafood', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6CLSCYyU8gxuMQan2lTSLzPzTbP-MK5gBTnUVl7qowj1Fc3pNWI4N-3MQqfqRu8gVsLHqQS7DvnmcPgPa5ALbIark6GSnGBKFIkShK9ESPMaYz4gQjx6Qo0Clnxl87LDjjEfTV_8UAEsieFFCVwDrZY3ZFSw5NzdLEIeB5ZjN0klHPvRE1U4RBqdJw5gTmr-kaTVwTINLG3t75oOEob2XoHGRpjOmUMjmjRRe5qPv6d3O-8CU2MpeE-Pu89HkHU7mJVuJ29M3tH6F' },
  { name: 'Hearty Lentil Soup',  kcal: 390, cuisine: 'Vegan',   img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnh5-jleFvfRqr6mNQRcJdERr1JcaMJ0uYDMfSQyXRZlK0vOMWdDrWZqC5iphWyBspiQAjvj0ZG7yQZxjEx0XZExVgolCh5O34W4TEz5SxBw9hjVEzxRGzQU_jOQsaaS0ujYlm62UtoNQLBtm6Pai1wJ85JiDVg1IFKUYzrQVynGBY1JdF7v3XONrXd1V_Fr6rjeWcg1MTI1im_8eL1iIqgbTwS-cUMc-UHZiE74LusPVo7v6XLc7odZ0zyzRYX74NcTL7t1rOXbfI' },
];

const FILTERS = ['All', 'Vegan', 'Salad', 'Seafood', 'Mediterranean', 'Healthy'];

function RecipePickerModal({ slot, onSelect, onClose }) {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');

  const filtered = ALL_RECIPES.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || r.cuisine === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px' }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '560px',
        maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div style={{ padding: '20px 24px 0', borderBottom: '1px solid #e1e3e4', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
              color: '#0f5238', margin: 0 }}>Add Recipe — {slot?.label}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none',
              cursor: 'pointer', color: '#707973' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px',
              top: '50%', transform: 'translateY(-50%)', color: '#707973', fontSize: '20px' }}>search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes..."
              style={{ width: '100%', height: '42px', paddingLeft: '42px', paddingRight: '16px',
                background: '#f3f4f5', border: '2px solid transparent', borderRadius: '10px',
                fontFamily: 'Plus Jakarta Sans', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          {/* Filter chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
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
        <div style={{ overflowY: 'auto', padding: '16px 24px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {filtered.map(recipe => (
            <div key={recipe.name} style={{ background: '#f8f9fa', borderRadius: '12px',
              overflow: 'hidden', border: '1px solid #e1e3e4', transition: 'all 0.15s' }}>
              <img src={recipe.img} alt={recipe.name}
                style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
              <div style={{ padding: '10px' }}>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
                  color: '#191c1d', margin: '0 0 2px' }}>{recipe.name}</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '11px',
                  color: '#707973', margin: '0 0 8px' }}>{recipe.kcal} kcal • {recipe.cuisine}</p>
                <button onClick={() => onSelect(recipe)}
                  style={{ width: '100%', padding: '6px', background: '#0f5238', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                    fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700 }}>
                  Add
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px',
              color: '#707973', fontFamily: 'Plus Jakarta Sans', fontSize: '14px' }}>
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
  const [plan, setPlan]           = useState(buildInitialPlan);
  const [pickerSlot, setPickerSlot] = useState(null); // { dayIndex, label }
  const [weekLabel]               = useState('May 5 – May 11, 2026');
  const [saved, setSaved]         = useState(false);

  const totalKcal = Object.values(plan).reduce((sum, day) =>
    sum + Object.values(day).reduce((s, r) => s + (r?.kcal || 0), 0), 0);
  const avgKcal = Math.round(totalKcal / 7);

  const handleAdd = (dayIndex, slot) => setPickerSlot({ dayIndex, label: slot });
  const handleRemove = (dayIndex, slot) => {
    setPlan(prev => ({ ...prev, [dayIndex]: { ...prev[dayIndex], [slot]: null } }));
  };
  const handleSelect = (recipe) => {
    if (!pickerSlot) return;
    setPlan(prev => ({
      ...prev,
      [pickerSlot.dayIndex]: { ...prev[pickerSlot.dayIndex], [pickerSlot.label]: recipe },
    }));
    setPickerSlot(null);
  };
  const handleClearWeek = () => setPlan(buildInitialPlan());
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; vertical-align: middle; }
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
            {/* Recipes Nav Link */}
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
            <button onClick={() => navigate('/login')} className="text-stone-600 font-bold text-sm">Login</button>
            <button onClick={() => navigate('/login')} className="bg-[#0f5238] text-white px-8 py-3 pill-button font-bold text-sm shadow-lg hover:bg-[#064e3b] transition-all">Get Started</button>
          </div>
        </nav>
      </header>

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 48px 120px' }}>

        {/* ── Page Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'Lexend', fontSize: '32px', fontWeight: 700,
              color: '#0f5238', marginBottom: '12px', letterSpacing: '-0.01em' }}>Weekly Meal Plan</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white',
              padding: '8px 16px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(45,106,79,0.06)',
              width: 'fit-content' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#707973',
                display: 'flex', alignItems: 'center' }}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                color: '#191c1d', minWidth: '160px', textAlign: 'center' }}>{weekLabel}</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#707973',
                display: 'flex', alignItems: 'center' }}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/grocery')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px',
                background: '#fd9d1a', color: '#2c1700', border: 'none', borderRadius: '10px',
                fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(253,157,26,0.3)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_cart</span>
              Generate Shopping List
            </button>
            <button onClick={handleSave}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px',
                background: saved ? '#1D9E75' : '#0f5238', color: 'white', border: 'none',
                borderRadius: '10px', fontFamily: 'Plus Jakarta Sans', fontSize: '13px',
                fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s',
                boxShadow: '0 2px 8px rgba(15,82,56,0.25)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {saved ? 'check' : 'save'}
              </span>
              {saved ? 'Saved!' : 'Save Plan'}
            </button>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="mp-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

          {/* 7-day grid */}
          <div style={{ flexGrow: 1, overflowX: 'auto', paddingBottom: '8px' }}>
            <div className="mp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))',
              gap: '12px', minWidth: '900px' }}>
              {DAYS.map((day, i) => (
                <DayColumn key={i} day={day} dayIndex={i} meals={plan[i]}
                  onAdd={handleAdd} onRemove={handleRemove} isToday={day.today} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Nutrition summary */}
            <div style={{ background: 'white', borderRadius: '18px', padding: '22px',
              boxShadow: '0 4px 20px rgba(45,106,79,0.06)', border: '1px solid #ecfdf5' }}>
              <h2 style={{ fontFamily: 'Lexend', fontSize: '16px', fontWeight: 700,
                color: '#0f5238', marginBottom: '16px' }}>Nutrition Summary</h2>
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
                {[['#2d6a4f','Protein'],['#fd9d1a','Carbs'],['#57624e','Fat']].map(([c,l]) => (
                  <span key={l} style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '10px',
                    fontWeight: 800, color: c, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
                ))}
              </div>
              <div style={{ height: '10px', width: '100%', display: 'flex',
                borderRadius: '9999px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '30%', background: '#2d6a4f', height: '100%' }} />
                <div style={{ width: '50%', background: '#fd9d1a', height: '100%' }} />
                <div style={{ width: '20%', background: '#57624e', height: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {['30%','50%','20%'].map(p => (
                  <span key={p} style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '10px', color: '#707973', fontWeight: 600 }}>{p}</span>
                ))}
              </div>
            </div>

            {/* Suggested recipes */}
            <div>
              <h2 style={{ fontFamily: 'Lexend', fontSize: '16px', fontWeight: 700,
                color: '#0f5238', marginBottom: '14px' }}>Suggested for You</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {SUGGESTED.map(r => (
                  <div key={r.name} className="mp-suggested"
                    style={{ display: 'flex', gap: '12px', background: 'white', padding: '12px',
                      borderRadius: '14px', boxShadow: '0 4px 16px rgba(45,106,79,0.06)', alignItems: 'center' }}>
                    <img src={r.img} alt={r.name}
                      style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
                        color: '#191c1d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</p>
                      <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '11px', color: '#707973' }}>
                        {r.kcal} kcal • {r.time}
                      </p>
                    </div>
                    <button onClick={() => setPickerSlot({ dayIndex: null, label: 'Any', prefill: r })}
                      style={{ background: '#f0faf5', color: '#0f5238', border: 'none',
                        borderRadius: '8px', padding: '7px', cursor: 'pointer', flexShrink: 0,
                        display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}>
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
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid #e1e3e4', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px',
          height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
            {[['Week Total', `${totalKcal.toLocaleString()} kcal`],
              ['Daily Average', `${avgKcal.toLocaleString()} kcal`]].map(([l,v]) => (
              <div key={l}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '9px', fontWeight: 800,
                  color: '#707973', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                  color: '#0f5238' }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={handleClearWeek}
            style={{ padding: '8px 20px', borderRadius: '8px', border: '1.5px solid #bfc9c1',
              background: 'none', color: '#707973', cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
              transition: 'all 0.15s' }}>
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
        />
      )}
    </>
  );
}