import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const INITIAL_USER = {
  name:        'Alex Johnson',
  email:       'alex.j@vitalitykitchen.com',
  calorieGoal: 2000,
  memberSince: 'March 2024',
  avatar:      'https://lh3.googleusercontent.com/aida-public/AB6AXuAF1A43lE5FzpyCtsh5bGVBNgjuO2B_fiwdZPpEXjGSEBmWtnbxkwtztdMYvcZboIKrXHDz6OjYH321BaUcmR1HSybz2F1Xhb8sCRw8OzXpWZxErE4XP2rgZIm0oq3GXHNrERDXsjJOIjBrcGvjcEDHTExi13ol8-amByDgh5Yz640cveHVvFNTQEeDQHUe76_xFjvNWOzsK8l3y5idOs1i2F8etBO_9dYvSrM28YJgvn6pfHe5HnfvLbdjF6InlfwlP-GGCJCyEQ1n',
  dietaryPrefs: ['Vegan', 'Gluten-Free'],
  stats: { recipes: 12, mealPlans: 24, reviews: 48 },
};

const ALL_PREFS = ['Vegan', 'Gluten-Free', 'Keto', 'Paleo', 'High-Protein', 'Dairy-Free', 'Nut-Free'];

const MOCK_RECIPES = [
  { id: 1, name: 'Avocado Berry Bowl',  cuisine: 'Healthy',       kcal: 420, rating: 4.8, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGxdgt5KmdoKDN7ApDVHIWmpEX2ehtYl6TicmIYpu5FgZ8wPyjfjuJARvygjzEj5rvEurIh1Yaxqws5rGlso-741UprnoZqU2bIm9SvP3u3vkZbAAXGBJ4P7BeuvwwxT3bvLB_y1CyJI5CCMV6HSbpbwVp3kWjdQFuiF7qt-mbSPxribl1JuQTQSW4eddHlujLqdLVzT0YCALsC7s7oyrw24Mj5GSAK0_YiU3PY6nIkJzZ2lcfQg32huqmlVSgB6ofkJ0ZiKVpkdkW' },
  { id: 2, name: 'Quinoa Power Salad',  cuisine: 'Mediterranean', kcal: 580, rating: 4.5, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJa5UHNYN5H0_qKe5sCgxFchTyLXuehiMqrqjx8Re9nx-j7y9ryMw4YbmRG5FDJ_g6QglZfQ1_4NDV26UL5WQMylkRIzsub5eGVMym-D4FLSAxfIrxOrLog6706qr_lkH3qr2eZriEIX8EFHCxkcO7PlEzu4Pg4HfpatJsszqEiah1-b0HVVENL457xcf5ywSYzK_TMCY2qSOS9dR8yoCVsMksOnB8iUto5UXGJsGmY5giiZLzv--276oa0wD2SGUXdCUdEdw3bCHY' },
  { id: 3, name: 'Hearty Lentil Soup',  cuisine: 'Vegan',         kcal: 390, rating: 4.6, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnh5-jleFvfRqr6mNQRcJdERr1JcaMJ0uYDMfSQyXRZlK0vOMWdDrWZqC5iphWyBspiQAjvj0ZG7yQZxjEx0XZExVgolCh5O34W4TEz5SxBw9hjVEzxRGzQU_jOQsaaS0ujYlm62UtoNQLBtm6Pai1wJ85JiDVg1IFKUYzrQVynGBY1JdF7v3XONrXd1V_Fr6rjeWcg1MTI1im_8eL1iIqgbTwS-cUMc-UHZiE74LusPVo7v6XLc7odZ0zyzRYX74NcTL7t1rOXbfI' },
];

// ── Validation Schema ─────────────────────────────────────────────────────────
const profileSchema = Yup.object({
  name:        Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email:       Yup.string().email('Enter a valid email address').required('Email is required'),
  calorieGoal: Yup.number()
    .min(500,   'Minimum 500 kcal')
    .max(10000, 'Maximum 10,000 kcal')
    .required('Calorie goal is required'),
});

// ── Star Rating Component ─────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className="material-symbols-outlined" style={{
          fontSize: '15px', color: '#895100',
          fontVariationSettings: i <= Math.round(rating) ? '"FILL" 1' : '"FILL" 0',
        }}>star</span>
      ))}
      <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px',
        color: '#707973', marginLeft: '4px', fontWeight: 600 }}>{rating}</span>
    </div>
  );
}

// ── Recipe Card ───────────────────────────────────────────────────────────────
function RecipeCard({ recipe, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(45,106,79,0.07)', border: '1px solid #ecfdf5' }}>
      <div style={{ position: 'relative' }}>
        <img src={recipe.img} alt={recipe.name}
          style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
        <span style={{ position: 'absolute', top: '10px', left: '10px',
          background: 'rgba(15,82,56,0.85)', color: 'white', fontSize: '10px',
          fontWeight: 700, padding: '3px 10px', borderRadius: '9999px',
          fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.04em' }}>{recipe.cuisine}</span>
      </div>
      <div style={{ padding: '14px' }}>
        <p style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700,
          color: '#191c1d', marginBottom: '4px' }}>{recipe.name}</p>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px',
          color: '#707973', marginBottom: '8px' }}>{recipe.kcal} kcal / serving</p>
        <Stars rating={recipe.rating} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button style={{ flex: 1, padding: '8px', background: '#f0faf5', color: '#0f5238',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit</span>Edit
          </button>
          {confirmDelete ? (
            <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
              <button onClick={() => onDelete(recipe.id)}
                style={{ flex: 1, padding: '8px', background: '#ba1a1a', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans', fontSize: '11px', fontWeight: 700 }}>Yes</button>
              <button onClick={() => setConfirmDelete(false)}
                style={{ flex: 1, padding: '8px', background: '#f1f3f5', color: '#707973',
                  border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans', fontSize: '11px', fontWeight: 700 }}>No</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)}
              style={{ flex: 1, padding: '8px', background: '#ffdad6', color: '#93000a',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Input Field ───────────────────────────────────────────────────────────────
function Field({ id, label, type='text', icon, formik, suffix }) {
  const hasError = formik.touched[id] && formik.errors[id];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '11px', fontWeight: 800,
        color: '#707973', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px',
          top: '50%', transform: 'translateY(-50%)', color: '#707973', fontSize: '18px',
          pointerEvents: 'none' }}>{icon}</span>
        <input id={id} name={id} type={type}
          value={formik.values[id]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          style={{ width: '100%', height: '44px', paddingLeft: '40px',
            paddingRight: suffix ? '52px' : '14px',
            background: '#f1f3f5', border: `2px solid ${hasError ? '#ba1a1a' : 'transparent'}`,
            borderRadius: '10px', fontFamily: 'Plus Jakarta Sans', fontSize: '14px',
            color: '#191c1d', boxSizing: 'border-box', transition: 'border 0.15s' }} />
        {suffix && (
          <span style={{ position: 'absolute', right: '14px', top: '50%',
            transform: 'translateY(-50%)', fontFamily: 'Plus Jakarta Sans',
            fontSize: '12px', fontWeight: 700, color: '#707973' }}>{suffix}</span>
        )}
      </div>
      {hasError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px',
          fontFamily: 'Plus Jakarta Sans', fontSize: '12px', color: '#ba1a1a', fontWeight: 500 }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>
          {formik.errors[id]}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════════════════════
export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser]           = useState(INITIAL_USER);
  const [editMode, setEditMode]   = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'recipes'
  const [recipes, setRecipes]     = useState(MOCK_RECIPES);
  const [savedMsg, setSavedMsg]   = useState(false);
  const [selectedPrefs, setSelectedPrefs] = useState(user.dietaryPrefs);

  const formik = useFormik({
    initialValues: {
      name:        user.name,
      email:       user.email,
      calorieGoal: user.calorieGoal,
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setUser(prev => ({ ...prev, ...values, dietaryPrefs: selectedPrefs }));
      setEditMode(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    },
  });

  const togglePref = (pref) => {
    setSelectedPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleCancel = () => {
    formik.resetForm();
    setSelectedPrefs(user.dietaryPrefs);
    setEditMode(false);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style>{`
        .material-symbols-outlined { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; vertical-align: middle; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background-color: #f8f9fa;
          background-image: radial-gradient(#2d6a4f18 0.5px, transparent 0.5px);
          background-size: 24px 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #191c1d;
        }
        input:focus { outline: none; border: 2px solid #2d6a4f !important; background: white !important; }
        .pf-nav-link { font-family:'Plus Jakarta Sans'; font-size:14px; font-weight:600; color:#64748b; text-decoration:none; transition:color 0.15s; }
        .pf-nav-link:hover { color:#2d6a4f; }
        .pf-stat-card:hover { box-shadow: 0 6px 20px rgba(45,106,79,0.1); transform: translateY(-1px); }
        .pf-stat-card { transition: all 0.15s; }
        .pf-pref-chip { transition: all 0.15s; cursor: pointer; }
        .pf-pref-chip:hover { opacity: 0.85; }
        .pf-recipe-card:hover { box-shadow: 0 10px 30px rgba(45,106,79,0.12); transform: translateY(-2px); }
        .pf-recipe-card { transition: all 0.2s; }
        @media (max-width: 768px) {
          .pf-layout { flex-direction: column !important; }
          .pf-sidebar { width: 100% !important; }
          .pf-recipes-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .pf-recipes-grid { grid-template-columns: 1fr !important; }
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
              className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent"
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px',
            padding: '6px 16px 6px 6px', borderRadius: '9999px',
            border: '1px solid rgba(45,106,79,0.2)', cursor: 'pointer',
            background: 'rgba(177,240,206,0.1)' }}>
            <img src={user.avatar} alt="avatar"
              style={{ width: '36px', height: '36px', borderRadius: '50%',
                border: '2px solid #2d6a4f', objectFit: 'cover' }} />
            <span style={{ fontFamily: 'Lexend', fontSize: '13px', fontWeight: 700,
              color: '#0f5238' }}>Profile Settings</span>
          </div>
        </nav>
      </header>

      {/* ── Main ── */}
      <main style={{ paddingTop: '96px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>

          {/* Saved banner */}
          {savedMsg && (
            <div style={{ background: '#E1F5EE', border: '1px solid #1D9E75', borderRadius: '10px',
              padding: '12px 18px', marginBottom: '24px', display: 'flex',
              alignItems: 'center', gap: '10px', fontFamily: 'Plus Jakarta Sans',
              fontSize: '14px', fontWeight: 600, color: '#0F6E56' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
              Profile updated successfully!
            </div>
          )}

          <div className="pf-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

            {/* ── Left Sidebar ── */}
            <aside className="pf-sidebar" style={{ width: '300px', flexShrink: 0 }}>
              <div style={{ background: 'white', borderRadius: '20px', padding: '32px',
                boxShadow: '0 4px 20px rgba(45,106,79,0.06)', display: 'flex',
                flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                {/* Avatar */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%',
                    border: '4px solid #2d6a4f', padding: '3px', boxShadow: '0 4px 16px rgba(45,106,79,0.2)' }}>
                    <img src={user.avatar} alt="profile"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  <button style={{ position: 'absolute', bottom: '2px', right: '2px',
                    background: '#0f5238', color: 'white', border: 'none', borderRadius: '50%',
                    width: '30px', height: '30px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>photo_camera</span>
                  </button>
                </div>

                <h1 style={{ fontFamily: 'Lexend', fontSize: '22px', fontWeight: 700,
                  color: '#0f5238', marginBottom: '4px' }}>{user.name}</h1>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '13px',
                  color: '#707973', marginBottom: '12px' }}>{user.email}</p>
                <span style={{ background: '#b1f0ce', color: '#2d6a4f', fontSize: '11px',
                  fontWeight: 800, padding: '4px 14px', borderRadius: '9999px',
                  fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.02em',
                  marginBottom: '24px', display: 'inline-block' }}>
                  Member since {user.memberSince}
                </span>

                {/* Stats */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column',
                  gap: '10px', marginBottom: '24px' }}>
                  {[
                    ['menu_book',      'Recipes Created',  user.stats.recipes],
                    ['bookmark_heart', 'Meal Plans Saved', user.stats.mealPlans],
                    ['rate_review',    'Reviews Written',  user.stats.reviews],
                  ].map(([icon, label, count]) => (
                    <div key={label} className="pf-stat-card"
                      style={{ background: '#f3f4f5', padding: '12px 16px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="material-symbols-outlined"
                          style={{ fontSize: '20px', color: '#2d6a4f' }}>{icon}</span>
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '13px',
                          fontWeight: 500, color: '#404943' }}>{label}</span>
                      </div>
                      <span style={{ fontFamily: 'Lexend', fontSize: '20px', fontWeight: 700,
                        color: '#0f5238' }}>{count}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => { setEditMode(true); setActiveTab('info'); }}
                  style={{ width: '100%', padding: '12px', background: '#0f5238', color: 'white',
                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                    fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 12px rgba(15,82,56,0.25)', transition: 'all 0.15s' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                  Edit Profile
                </button>
              </div>
            </aside>

            {/* ── Right Column ── */}
            <section style={{ flexGrow: 1, minWidth: 0 }}>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e1e3e4',
                marginBottom: '24px' }}>
                {[['info','My Info'],['recipes','My Recipes']].map(([key, label]) => (
                  <button key={key} onClick={() => setActiveTab(key)}
                    style={{ padding: '12px 24px', background: 'none', border: 'none',
                      cursor: 'pointer', fontFamily: 'Lexend', fontSize: '14px',
                      fontWeight: activeTab === key ? 700 : 500,
                      color: activeTab === key ? '#0f5238' : '#707973',
                      borderBottom: activeTab === key ? '2.5px solid #0f5238' : '2.5px solid transparent',
                      marginBottom: '-2px', transition: 'all 0.15s' }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* ── MY INFO TAB ── */}
              {activeTab === 'info' && (
                <div style={{ background: 'white', borderRadius: '20px', padding: '28px',
                  boxShadow: '0 4px 20px rgba(45,106,79,0.06)' }}>

                  {editMode ? (
                    /* ── Edit Mode ── */
                    <form onSubmit={formik.handleSubmit}>
                      <h3 style={{ fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                        color: '#0f5238', marginBottom: '24px' }}>Edit Personal Details</h3>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                        gap: '18px', marginBottom: '24px' }}>
                        <Field id="name"        label="Full Name"          icon="person"         formik={formik} />
                        <Field id="email"       label="Email Address"      icon="mail"           formik={formik} type="email" />
                        <Field id="calorieGoal" label="Daily Calorie Goal" icon="local_fire_department" formik={formik} type="number" suffix="kcal" />
                      </div>

                      {/* Dietary prefs */}
                      <div style={{ marginBottom: '24px', paddingTop: '20px',
                        borderTop: '1px solid #f3f4f5' }}>
                        <h4 style={{ fontFamily: 'Lexend', fontSize: '15px', fontWeight: 700,
                          color: '#0f5238', marginBottom: '14px' }}>Dietary Preferences</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {ALL_PREFS.map(pref => {
                            const active = selectedPrefs.includes(pref);
                            return (
                              <button key={pref} type="button" onClick={() => togglePref(pref)}
                                className="pf-pref-chip"
                                style={{ padding: '7px 16px', borderRadius: '9999px',
                                  border: `1.5px solid ${active ? '#2d6a4f' : '#bfc9c1'}`,
                                  background: active ? '#b1f0ce' : 'white',
                                  color: active ? '#0f5238' : '#707973',
                                  fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                                  display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {active && <span className="material-symbols-outlined"
                                  style={{ fontSize: '14px' }}>check</span>}
                                {pref}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '12px', paddingTop: '20px',
                        borderTop: '1px solid #f3f4f5' }}>
                        <button type="submit"
                          style={{ padding: '11px 28px', background: '#0f5238', color: 'white',
                            border: 'none', borderRadius: '10px', cursor: 'pointer',
                            fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 4px 12px rgba(15,82,56,0.2)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                          Save Changes
                        </button>
                        <button type="button" onClick={handleCancel}
                          style={{ padding: '11px 28px', background: '#f3f4f5', color: '#707973',
                            border: 'none', borderRadius: '10px', cursor: 'pointer',
                            fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700 }}>
                          Cancel
                        </button>
                      </div>
                    </form>

                  ) : (
                    /* ── View Mode ── */
                    <>
                      <h3 style={{ fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                        color: '#0f5238', marginBottom: '24px' }}>Personal Details</h3>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                        gap: '24px', marginBottom: '28px' }}>
                        {[
                          ['FULL NAME',          user.name,                    'person'],
                          ['EMAIL ADDRESS',      user.email,                   'mail'],
                          ['DAILY CALORIE GOAL', `${user.calorieGoal.toLocaleString()} kcal`, 'local_fire_department'],
                          ['MEMBER SINCE',       user.memberSince,             'calendar_month'],
                        ].map(([label, value, icon]) => (
                          <div key={label}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
                              marginBottom: '6px' }}>
                              <span className="material-symbols-outlined"
                                style={{ fontSize: '14px', color: '#707973' }}>{icon}</span>
                              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '10px',
                                fontWeight: 800, color: '#707973', textTransform: 'uppercase',
                                letterSpacing: '0.08em' }}>{label}</span>
                            </div>
                            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '16px',
                              fontWeight: 600, color: '#191c1d' }}>{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Dietary prefs */}
                      <div style={{ paddingTop: '20px', borderTop: '1px solid #f3f4f5',
                        marginBottom: '28px' }}>
                        <h4 style={{ fontFamily: 'Lexend', fontSize: '15px', fontWeight: 700,
                          color: '#0f5238', marginBottom: '14px' }}>Dietary Preferences</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {user.dietaryPrefs.map(pref => (
                            <span key={pref} style={{ display: 'flex', alignItems: 'center',
                              gap: '6px', background: '#b1f0ce', color: '#0f5238',
                              padding: '7px 16px', borderRadius: '9999px',
                              fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700 }}>
                              <span className="material-symbols-outlined"
                                style={{ fontSize: '14px' }}>eco</span>
                              {pref}
                            </span>
                          ))}
                          {user.dietaryPrefs.length === 0 && (
                            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '13px',
                              color: '#707973', fontStyle: 'italic' }}>No preferences set</span>
                          )}
                        </div>
                      </div>

                      {/* Macro distribution */}
                      <div style={{ paddingTop: '20px', borderTop: '1px solid #f3f4f5' }}>
                        <h4 style={{ fontFamily: 'Lexend', fontSize: '15px', fontWeight: 700,
                          color: '#0f5238', marginBottom: '16px' }}>Macro Distribution</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                          gap: '20px', background: '#f3f4f5', padding: '20px', borderRadius: '14px' }}>
                          {[['Protein','#2d6a4f',30],['Carbs','#fd9d1a',50],['Fats','#57624e',20]].map(([label,color,pct]) => (
                            <div key={label}>
                              <div style={{ display: 'flex', justifyContent: 'space-between',
                                marginBottom: '6px' }}>
                                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px',
                                  fontWeight: 700, color: '#404943' }}>{label}</span>
                                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px',
                                  fontWeight: 800, color }}>{pct}%</span>
                              </div>
                              <div style={{ height: '8px', background: '#e1e3e4',
                                borderRadius: '9999px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`,
                                  background: color, borderRadius: '9999px' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── MY RECIPES TAB ── */}
              {activeTab === 'recipes' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                      color: '#0f5238' }}>My Recipes ({recipes.length})</h3>
                    <button onClick={() => navigate('/recipes/create')}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', background: '#0f5238', color: 'white',
                        border: 'none', borderRadius: '10px', cursor: 'pointer',
                        fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(15,82,56,0.2)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                      New Recipe
                    </button>
                  </div>

                  {recipes.length > 0 ? (
                    <div className="pf-recipes-grid"
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                      {recipes.map(r => (
                        <div key={r.id} className="pf-recipe-card">
                          <RecipeCard recipe={r} onDelete={handleDeleteRecipe} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Empty state */
                    <div style={{ background: 'white', borderRadius: '20px', padding: '64px 32px',
                      boxShadow: '0 4px 20px rgba(45,106,79,0.06)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      textAlign: 'center', gap: '16px' }}>
                      <div style={{ width: '80px', height: '80px', background: '#f0faf5',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center' }}>
                        <span className="material-symbols-outlined"
                          style={{ fontSize: '40px', color: '#2d6a4f' }}>menu_book</span>
                      </div>
                      <h4 style={{ fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                        color: '#191c1d' }}>You haven't created any recipes yet</h4>
                      <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '14px',
                        color: '#707973', maxWidth: '320px', lineHeight: 1.6 }}>
                        Share your favourite meals with the Vitality Kitchen community.
                      </p>
                      <button onClick={() => navigate('/recipes/create')}
                        style={{ marginTop: '8px', padding: '12px 28px', background: '#0f5238',
                          color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
                          fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: '8px',
                          boxShadow: '0 4px 12px rgba(15,82,56,0.2)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        Create Your First Recipe
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontFamily: 'Lexend', fontSize: '18px', fontWeight: 800,
              color: '#2d6a4f', marginBottom: '4px' }}>Vitality Kitchen</div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px', color: '#6b7280' }}>
              © 2024 Vitality Kitchen. Nourishing your journey.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['Support','Privacy Policy','Terms of Service','Contact Us'].map(l => (
              <a key={l} href="#" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '13px',
                color: '#6b7280', textDecoration: 'underline', textUnderlineOffset: '4px',
                transition: 'color 0.15s' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}