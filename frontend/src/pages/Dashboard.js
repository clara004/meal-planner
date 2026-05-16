import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const DAY_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const SLOTS = ['Breakfast','Lunch','Dinner'];

const todayKey = () => {
  const d = new Date().getDay();          // 0=Sun … 6=Sat
  return DAY_KEYS[d === 0 ? 6 : d - 1];  // map to mon-indexed array
};

const greetingText = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const Icon = ({ name, fill = 0, style = {} }) => (
  <span className="material-symbols-outlined"
    style={{ fontVariationSettings: `'FILL' ${fill}`, verticalAlign: 'middle', ...style }}>
    {name}
  </span>
);

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';

/* ════════════════════════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser]       = useState(null);
  const [stats, setStats]     = useState({ recipesCreated: 0, mealsPlanned: 0, recipesRated: 0 });
  const [todayMeals, setTodayMeals] = useState({ Breakfast: null, Lunch: null, Dinner: null });
  const [todayKcal, setTodayKcal]   = useState(0);
  const [myRecipes, setMyRecipes]   = useState([]);
  const [suggested, setSuggested]   = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPageLoaded(true), 50);
    fetchAll();
    return () => clearTimeout(t);
  }, []);

  const fetchAll = async () => {
    try {
      const [profileRes, myRecipesRes, allRecipesRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/recipes/my-recipes'),
        api.get('/recipes'),
      ]);

      // ── Profile & stats ──
      const u = profileRes.data.user;
      if (!u.avatar) u.avatar = '/default-avatar.png';
      setUser(u);
      setStats(profileRes.data.stats);

      // ── My recipes ──
      const mine = myRecipesRes.data.recipes || [];
      setMyRecipes(mine.slice(0, 4));

      // ── Activity feed (latest 4 recipes by date) ──
      const sorted = [...mine].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setActivities(sorted.slice(0, 4).map(r => ({
        icon: 'restaurant',
        bg: 'rgba(15,82,56,0.1)',
        color: '#0f5238',
        text: 'You created',
        bold: `"${r.title}"`,
        time: timeAgo(r.createdAt),
      })));

      // ── Suggested (top-rated community recipes, exclude own) ──
      const all = allRecipesRes.data.recipes || [];
      const community = all
        .filter(r => r.user !== u.id)
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      setSuggested((community.length ? community : all).slice(0, 4));

      // ── Today's meal plan ──
      try {
        const monday = getMonday(new Date());
        const planRes = await api.get(`/mealplan?startDate=${monday.toISOString()}`);
        if (planRes.data.plan) {
          const dayData = planRes.data.plan.week[todayKey()] || {};
          const meals = {};
          let kcal = 0;
          SLOTS.forEach(slot => {
            const r = dayData[slot];
            if (r && r._id) {
              meals[slot] = r;
              kcal += r.perServing?.calories || 0;
            } else {
              meals[slot] = null;
            }
          });
          setTodayMeals(meals);
          setTodayKcal(Math.round(kcal));
        }
      } catch { /* no plan yet, that's fine */ }

      setLoading(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  /* ── Loading state ─── */
  if (loading) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center',
        height:'100vh', fontFamily:'Lexend', color:'#0f5238', fontSize:'20px' }}>
        Loading Dashboard…
      </div>
    );
  }

  const calorieGoal = user?.calorie_goal || 2000;
  const calPct = Math.min(todayKcal / calorieGoal, 1);
  const circumference = 2 * Math.PI * 70;               // r=70
  const dashOffset = circumference * (1 - calPct);
  const filledMeals = SLOTS.filter(s => todayMeals[s]).length;

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style>{`
        .material-symbols-outlined { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; vertical-align:middle; }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background-color:#f8f9fa; background-image:radial-gradient(#2d6a4f18 0.5px,transparent 0.5px); background-size:24px 24px; font-family:'Plus Jakarta Sans',sans-serif; color:#191c1d; }
        .reveal { opacity:0; transform:translateY(60px) scale(.98); transition:opacity 1.2s cubic-bezier(.2,1,.3,1),transform 1.2s cubic-bezier(.2,1,.3,1); will-change:transform,opacity; }
        .reveal.active { opacity:1; transform:translateY(0) scale(1); }
        .pill-button { border-radius:9999px !important; }
        .dash-card { transition:all .15s; }
        .dash-card:hover { box-shadow:0 8px 28px rgba(45,106,79,.12); transform:translateY(-2px); }
        .meal-img { transition:transform .5s ease; }
        .meal-img:hover { transform:scale(1.05); }
        @media(max-width:900px){ .dash-grid-3{grid-template-columns:1fr!important;} .dash-grid-2{grid-template-columns:1fr!important;} }
      `}</style>

      {/* ── Main ── */}
      <main className={`reveal ${pageLoaded ? 'active' : ''}`}
        style={{ maxWidth:1280, margin:'0 auto', padding:'110px 32px 80px' }}>

        {/* ── Hero Banner ── */}
        <section style={{
          position:'relative', background:'linear-gradient(135deg,#0f5238,#2d6a4f)',
          borderRadius:16, overflow:'hidden', padding:'48px', marginBottom:40,
          boxShadow:'0 8px 32px rgba(15,82,56,.18)'
        }}>
          <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between',
            alignItems:'center', gap:32, flexWrap:'wrap' }}>
            <div style={{ maxWidth:560 }}>
              <h1 style={{ fontFamily:'Lexend', fontSize:42, fontWeight:700, color:'white',
                marginBottom:12, letterSpacing:'-0.02em' }}>
                {greetingText()}, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ fontSize:17, lineHeight:1.6, color:'#b1f0ce', opacity:.9 }}>
                {filledMeals === 0
                  ? "Your kitchen is ready. Start planning today's meals!"
                  : `You've planned ${filledMeals} meal${filledMeals > 1 ? 's' : ''} today. Keep it up!`}
              </p>
              <button onClick={() => navigate('/meal-planner')}
                style={{ marginTop:28, background:'white', color:'#0f5238', padding:'12px 32px',
                  borderRadius:12, fontWeight:700, fontSize:14, border:'none', cursor:'pointer',
                  letterSpacing:'.03em', boxShadow:'0 4px 12px rgba(0,0,0,.1)' }}>
                Update Meal Plan
              </button>
            </div>

            {/* Calorie ring */}
            <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="160" height="160" style={{ transform:'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="12" />
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#fd9d1a" strokeWidth="12"
                  strokeDasharray={circumference} strokeDashoffset={dashOffset}
                  strokeLinecap="round" style={{ transition:'stroke-dashoffset .8s ease' }} />
              </svg>
              <div style={{ position:'absolute', display:'flex', flexDirection:'column',
                alignItems:'center', color:'white' }}>
                <span style={{ fontFamily:'Lexend', fontSize:24, fontWeight:600, lineHeight:1 }}>
                  {todayKcal.toLocaleString()}
                </span>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.08em', opacity:.8,
                  textTransform:'uppercase', marginTop:4 }}>
                  kcal / {calorieGoal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stat Cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:48 }}
          className="dash-grid-3">
          {[
            ['menu_book','Recipes Created', stats.recipesCreated, '#0f5238'],
            ['calendar_today','Meals Planned', stats.mealsPlanned, '#0f5238'],
            ['rate_review','Recipes Rated', stats.recipesRated, '#0f5238'],
            ['local_fire_department','Daily Calories', `${todayKcal.toLocaleString()}`, '#895100', 'kcal'],
          ].map(([icon, label, value, color, unit]) => (
            <div key={label} className="dash-card" style={{
              background:'white', padding:'22px 24px', borderRadius:14,
              boxShadow:'0 4px 20px rgba(45,106,79,.06)', display:'flex', flexDirection:'column', gap:6
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Icon name={icon} style={{ fontSize:20, color:'#2d6a4f' }} />
                <span style={{ fontSize:11, fontWeight:700, color:'#707973',
                  textTransform:'uppercase', letterSpacing:'.05em' }}>{label}</span>
              </div>
              <span style={{ fontFamily:'Lexend', fontSize:26, fontWeight:700, color }}>
                {value}{unit && <span style={{ fontSize:14, fontWeight:400, color:'#707973', marginLeft:4 }}>{unit}</span>}
              </span>
            </div>
          ))}
        </div>

        {/* ── Today's Meal Plan ── */}
        <section style={{ marginBottom:56 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:'Lexend', fontSize:26, fontWeight:700, color:'#0f5238' }}>
                Today's Meal Plan
              </h2>
              <p style={{ fontSize:13, color:'#707973', marginTop:4 }}>
                {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
              </p>
            </div>
            <button onClick={() => navigate('/meal-planner')} style={{
              color:'#0f5238', fontWeight:700, fontSize:13, background:'none', border:'none',
              cursor:'pointer', display:'flex', alignItems:'center', gap:4
            }}>
              Full Schedule <Icon name="arrow_forward" style={{ fontSize:16 }} />
            </button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="dash-grid-3">
            {SLOTS.map(slot => {
              const recipe = todayMeals[slot];
              return (
                <div key={slot} className="dash-card" style={{
                  background:'white', borderRadius:14, overflow:'hidden',
                  boxShadow:'0 4px 20px rgba(45,106,79,.06)'
                }}>
                  <div style={{ height:180, overflow:'hidden', position:'relative' }}>
                    <img className="meal-img"
                      src={recipe?.image || DEFAULT_IMG} alt={recipe?.title || slot}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    <div style={{
                      position:'absolute', top:14, right:14, background: recipe ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.2)',
                      backdropFilter:'blur(4px)', padding:4, borderRadius:'50%',
                      color: recipe ? '#0f5238' : 'white'
                    }}>
                      <Icon name={recipe ? 'check_circle' : 'radio_button_unchecked'} fill={recipe ? 1 : 0} />
                    </div>
                  </div>
                  <div style={{ padding:20 }}>
                    <span style={{ fontSize:11, fontWeight:800, color:'#895100',
                      textTransform:'uppercase', letterSpacing:'.06em' }}>{slot}</span>
                    <h3 style={{ fontFamily:'Lexend', fontSize:18, fontWeight:600, color:'#0f5238', marginTop:4 }}>
                      {recipe?.title || 'Not planned yet'}
                    </h3>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14 }}>
                      <span style={{ fontSize:13, color:'#707973' }}>
                        {recipe ? `${Math.round(recipe.perServing?.calories || 0)} kcal` : '—'}
                      </span>
                      {recipe?.cuisine && (
                        <span style={{ padding:'4px 12px', background:'#b1f0ce', color:'#0e5138',
                          fontSize:11, fontWeight:700, borderRadius:9999 }}>{recipe.cuisine}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily progress bar */}
          <div className="dash-card" style={{
            background:'white', padding:'20px 24px', borderRadius:14, marginTop:20,
            boxShadow:'0 4px 20px rgba(45,106,79,.06)'
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13,
              fontWeight:700, color:'#0f5238', marginBottom:8 }}>
              <span>Daily Progress</span>
              <span>{Math.round(calPct * 100)}% of goal reached</span>
            </div>
            <div style={{ width:'100%', height:10, background:'#edeeef', borderRadius:9999, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${Math.round(calPct * 100)}%`,
                background:'#2d6a4f', borderRadius:9999, transition:'width .6s ease' }} />
            </div>
          </div>
        </section>

        {/* ── Two-column: My Recipes + Activity Feed ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, marginBottom:56 }}
          className="dash-grid-2">

          {/* My Recipes */}
          <section>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontFamily:'Lexend', fontSize:26, fontWeight:700, color:'#0f5238' }}>My Recipes</h2>
              <button onClick={() => navigate('/recipes/create')} style={{
                background:'rgba(15,82,56,.1)', border:'none', borderRadius:'50%', padding:8,
                cursor:'pointer', color:'#0f5238', display:'flex'
              }}>
                <Icon name="add" />
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {myRecipes.length === 0 && (
                <p style={{ fontSize:14, color:'#707973', fontStyle:'italic' }}>
                  You haven't created any recipes yet.
                </p>
              )}
              {myRecipes.map(r => (
                <div key={r._id} className="dash-card" style={{
                  background:'white', padding:14, borderRadius:14, display:'flex',
                  alignItems:'center', gap:14, boxShadow:'0 4px 16px rgba(45,106,79,.05)', cursor:'pointer'
                }} onClick={() => navigate(`/recipes/${r._id}`)}>
                  <img src={r.image || DEFAULT_IMG} alt={r.title}
                    style={{ width:72, height:72, borderRadius:10, objectFit:'cover', flexShrink:0 }} />
                  <div style={{ flexGrow:1, minWidth:0 }}>
                    <h4 style={{ fontFamily:'Lexend', fontSize:15, fontWeight:600, color:'#0f5238',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.title}</h4>
                    <p style={{ fontSize:13, color:'#707973', marginTop:2 }}>
                      {Math.round(r.perServing?.calories || 0)} kcal • {r.cuisine || 'General'}
                    </p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/recipes/${r._id}`); }}
                    style={{ padding:'8px 16px', border:'1px solid #bfc9c1', color:'#0f5238',
                      borderRadius:8, fontWeight:700, fontSize:13, background:'none', cursor:'pointer',
                      flexShrink:0 }}>
                    View
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Feed */}
          <section>
            <h2 style={{ fontFamily:'Lexend', fontSize:26, fontWeight:700, color:'#0f5238', marginBottom:20 }}>
              Recent Activity
            </h2>
            <div style={{ position:'relative', display:'flex', flexDirection:'column', gap:28 }}>
              {/* timeline line */}
              {activities.length > 1 && (
                <div style={{ position:'absolute', left:23, top:16, bottom:16, width:1,
                  background:'rgba(191,201,193,.3)' }} />
              )}
              {activities.length === 0 && (
                <p style={{ fontSize:14, color:'#707973', fontStyle:'italic' }}>No recent activity.</p>
              )}
              {activities.map((a, i) => (
                <div key={i} style={{ position:'relative', display:'flex', alignItems:'flex-start', gap:14 }}>
                  <div style={{ width:48, height:48, borderRadius:'50%', background:a.bg,
                    display:'flex', alignItems:'center', justifyContent:'center', zIndex:1, flexShrink:0 }}>
                    <Icon name={a.icon} style={{ color:a.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize:15, color:'#191c1d' }}>{a.text} <strong>{a.bold}</strong></p>
                    <span style={{ fontSize:13, color:'#707973' }}>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Suggested Recipes ── */}
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontFamily:'Lexend', fontSize:26, fontWeight:700, color:'#0f5238', marginBottom:20 }}>
            Suggested Recipes
          </h2>
          <div style={{ display:'flex', gap:20, overflowX:'auto', paddingBottom:20 }}
            className="scrollbar-hide">
            {suggested.map(r => (
              <div key={r._id} className="dash-card" style={{
                minWidth:260, background:'white', borderRadius:14, overflow:'hidden',
                boxShadow:'0 4px 20px rgba(45,106,79,.06)', display:'flex', flexDirection:'column'
              }}>
                <img src={r.image || DEFAULT_IMG} alt={r.title}
                  style={{ height:150, width:'100%', objectFit:'cover' }} />
                <div style={{ padding:16, flexGrow:1, display:'flex', flexDirection:'column' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:4, color:'#fd9d1a', marginBottom:6 }}>
                    <Icon name="star" fill={1} style={{ fontSize:15 }} />
                    <span style={{ fontSize:12, fontWeight:700 }}>
                      {r.averageRating || 0} ({r.ratings?.length || 0})
                    </span>
                  </div>
                  <h4 style={{ fontFamily:'Lexend', fontSize:15, fontWeight:600, color:'#0f5238',
                    marginBottom:14, flexGrow:1 }}>{r.title}</h4>
                  <button onClick={() => navigate(`/recipes/${r._id}`)} style={{
                    width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    background:'#0f5238', color:'white', padding:'10px', borderRadius:10,
                    fontWeight:700, fontSize:13, border:'none', cursor:'pointer'
                  }}>
                    <Icon name="visibility" style={{ fontSize:16 }} /> View Recipe
                  </button>
                </div>
              </div>
            ))}
            {suggested.length === 0 && (
              <p style={{ fontSize:14, color:'#707973', fontStyle:'italic' }}>No recipes available yet.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}