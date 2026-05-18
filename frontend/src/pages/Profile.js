import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import { useFavorites } from '../context/FavoritesContext';

const ALL_PREFS = ['Vegan', 'Gluten-Free', 'Keto', 'Paleo', 'High-Protein', 'Dairy-Free', 'Nut-Free'];

function normalizePref(raw) {
  const trimmed = raw.trim();
  const match = ALL_PREFS.find(p => p.toLowerCase() === trimmed.toLowerCase());
  return match || trimmed;
}

function normalizePrefsArray(arr) {
  if (!arr || !Array.isArray(arr)) return [];
  const seen = new Set();
  const result = [];
  for (const p of arr) {
    const norm = normalizePref(p);
    if (norm && !seen.has(norm.toLowerCase())) {
      seen.add(norm.toLowerCase());
      result.push(norm);
    }
  }
  return result;
}

//validate
const profileSchema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Enter a valid email address').required('Email is required'),
  calorieGoal: Yup.number()
    .min(500, 'Minimum 500 kcal')
    .max(10000, 'Maximum 10,000 kcal')
    .required('Calorie goal is required'),
});

//rating
function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className="material-symbols-outlined" style={{
          fontSize: '15px', color: '#895100',
          fontVariationSettings: i <= Math.round(rating) ? '"FILL" 1' : '"FILL" 0',
        }}>star</span>
      ))}
      <span style={{
        fontFamily: 'Plus Jakarta Sans', fontSize: '12px',
        color: '#707973', marginLeft: '4px', fontWeight: 600
      }}>{rating}</span>
    </div>
  );
}

// ── Recipe Card ───────────────────────────────────────────────────────────────
function RecipeCard({ recipe, onDelete, onRemoveFavorite, navigate, isRemoving }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isEditable = Boolean(onDelete);
  const isFavoriteCard = Boolean(onRemoveFavorite);

  return (
    <div style={{
      background: 'white', borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(45,106,79,0.07)', border: '1px solid #ecfdf5'
    }}>
      <div style={{ position: 'relative' }}>
        <img src={recipe.image || 'https://i.pinimg.com/1200x/50/bb/19/50bb19ebe06049da09f065b743286426.jpg'} alt={recipe.title || recipe.name}
          style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'rgba(15,82,56,0.85)', color: 'white', fontSize: '10px',
          fontWeight: 700, padding: '3px 10px', borderRadius: '9999px',
          fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.04em'
        }}>{recipe.cuisine}</span>
      </div>
      <div style={{ padding: '14px' }}>
        <p style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
          color: '#191c1d', marginBottom: '10px', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>{recipe.title || recipe.name}</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => {
            const recipeId = recipe._id || recipe.id;
            navigate(isEditable ? `/recipes/edit/${recipeId}` : `/recipes/${recipeId}`);
          }} style={{
            flex: 1, padding: '8px', background: '#f0faf5', color: '#0f5238',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>{isEditable ? 'edit' : 'visibility'}</span>
            {isEditable ? 'Edit' : 'View'}
          </button>
          {isFavoriteCard ? (
            <button
              onClick={() => !isRemoving && onRemoveFavorite(recipe._id || recipe.id)}
              disabled={isRemoving}
              style={{
                flex: 1, padding: '8px',
                background: isRemoving ? '#f1f3f5' : '#ffdad6',
                color: isRemoving ? '#aaa' : '#93000a',
                border: 'none', borderRadius: '8px',
                cursor: isRemoving ? 'default' : 'pointer',
                fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                transition: 'all 0.15s'
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px', fontVariationSettings: '"FILL" 1' }}>
                {isRemoving ? 'hourglass_empty' : 'favorite'}
              </span>
              {isRemoving ? 'Removing…' : 'Remove'}
            </button>
          ) : confirmDelete ? (
            <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
              <button onClick={() => onDelete(recipe._id || recipe.id)}
                style={{
                  flex: 1, padding: '8px', background: '#ba1a1a', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans', fontSize: '11px', fontWeight: 700
                }}>Yes</button>
              <button onClick={() => setConfirmDelete(false)}
                style={{
                  flex: 1, padding: '8px', background: '#f1f3f5', color: '#707973',
                  border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans', fontSize: '11px', fontWeight: 700
                }}>No</button>
            </div>
          ) : isEditable ? (
            <button onClick={() => setConfirmDelete(true)}
              style={{
                flex: 1, padding: '8px', background: '#ffdad6', color: '#93000a',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans', fontSize: '12px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>Delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Input Field ───────────────────────────────────────────────────────────────
function Field({ id, label, type = 'text', icon, formik, suffix }) {
  const hasError = formik.touched[id] && formik.errors[id];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontFamily: 'Plus Jakarta Sans', fontSize: '11px', fontWeight: 800,
        color: '#707973', textTransform: 'uppercase', letterSpacing: '0.08em'
      }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span className="material-symbols-outlined" style={{
          position: 'absolute', left: '12px',
          top: '50%', transform: 'translateY(-50%)', color: '#707973', fontSize: '18px',
          pointerEvents: 'none'
        }}>{icon}</span>
        <input id={id} name={id} type={type}
          value={formik.values[id]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          style={{
            width: '100%', height: '44px', paddingLeft: '40px',
            paddingRight: suffix ? '52px' : '14px',
            background: '#f1f3f5', border: `2px solid ${hasError ? '#ba1a1a' : 'transparent'}`,
            borderRadius: '10px', fontFamily: 'Plus Jakarta Sans', fontSize: '14px',
            color: '#191c1d', boxSizing: 'border-box', transition: 'border 0.15s'
          }} />
        {suffix && (
          <span style={{
            position: 'absolute', right: '14px', top: '50%',
            transform: 'translateY(-50%)', fontFamily: 'Plus Jakarta Sans',
            fontSize: '12px', fontWeight: 700, color: '#707973'
          }}>{suffix}</span>
        )}
      </div>
      {hasError && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontFamily: 'Plus Jakarta Sans', fontSize: '12px', color: '#ba1a1a', fontWeight: 500
        }}>
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

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ recipesCreated: 0, mealsPlanned: 0, recipesRated: 0 });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'recipes' | 'favorites' | 'plans'
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [removingFavoriteIds, setRemovingFavoriteIds] = useState(new Set());
  const [savedMsg, setSavedMsg] = useState(false);
  const { removeFavorite } = useFavorites();

  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 50);
    fetchProfileData();
    return () => clearTimeout(timer);
  }, []);

  const fetchProfileData = async (silent = false) => {
    try {
      const [profileRes, recipesRes, favoritesRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/recipes/my-recipes'),
        api.get('/user/favorites')
      ]);
      const u = profileRes.data.user;

      const memberDate = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      u.memberSince = memberDate;
      if (!u.avatar) {
        u.avatar = '/default-avatar.png';
      }

      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      window.dispatchEvent(new Event('userUpdated'));
      setSelectedPrefs(normalizePrefsArray(u.dietary_prefs));
      setStats(profileRes.data.stats);
      setRecipes(recipesRes.data.recipes || []);
      setFavoriteRecipes(favoritesRes.data.favorites || []);
      setMealPlans(profileRes.data.mealPlans || []);
      if (!silent) setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      calorieGoal: user?.calorie_goal || 2000,
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          email: values.email,
          calorie_goal: values.calorieGoal,
          dietary_prefs: selectedPrefs
        };
        const res = await api.put('/user/profile', payload);
        setUser(prev => {
          const updated = { ...prev, ...res.data.user };
          localStorage.setItem('user', JSON.stringify(updated));
          window.dispatchEvent(new Event('userUpdated'));
          return updated;
        });
        setEditMode(false);
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 2500);
      } catch (err) {
        console.error(err);
      }
    },
  });

  const togglePref = (pref) => {
    setSelectedPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleCancel = () => {
    formik.resetForm();
    setSelectedPrefs(normalizePrefsArray(user?.dietary_prefs));
    setEditMode(false);
  };

  const handleDeleteRecipe = async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes(prev => prev.filter(r => (r._id || r.id) !== id));
      setFavoriteRecipes(prev => prev.filter(r => (r._id || r.id) !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFavorite = async (id) => {
    const idStr = id?.toString();
    if (removingFavoriteIds.has(idStr)) return;

    setRemovingFavoriteIds(prev => new Set([...prev, idStr]));
    try {
      await removeFavorite(idStr);
      setFavoriteRecipes(prev => prev.filter(r => (r._id || r.id)?.toString() !== idStr));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    } finally {
      setRemovingFavoriteIds(prev => { const s = new Set(prev); s.delete(idStr); return s; });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const img = new Image();
          img.src = reader.result;
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 200;
            const MAX_HEIGHT = 200;
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const base64Avatar = canvas.toDataURL('image/jpeg', 0.8);

            const res = await api.put('/user/profile/avatar', { avatar: base64Avatar });
            setUser(prev => {
              const updated = { ...prev, avatar: res.data.avatar };
              localStorage.setItem('user', JSON.stringify(updated));
              window.dispatchEvent(new Event('userUpdated'));
              return updated;
            });
          };
        } catch (err) {
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user/profile');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete account');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Lexend', color: '#0f5238', fontSize: '20px' }}>Loading Profile...</div>;
  }

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

      {/* HEADER REMOVED - MANAGED BY APP.JS */}

      <main className={`reveal ${pageLoaded ? 'active' : ''}`} style={{ paddingTop: '96px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>

          {savedMsg && (
            <div style={{
              background: '#E1F5EE', border: '1px solid #1D9E75', borderRadius: '10px',
              padding: '12px 18px', marginBottom: '24px', display: 'flex',
              alignItems: 'center', gap: '10px', fontFamily: 'Plus Jakarta Sans',
              fontSize: '14px', fontWeight: 600, color: '#0F6E56'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
              Profile updated successfully!
            </div>
          )}

          <div className="pf-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

            <aside className="pf-sidebar" style={{ width: '300px', flexShrink: 0 }}>
              <div style={{
                background: 'white', borderRadius: '20px', padding: '32px',
                boxShadow: '0 4px 20px rgba(45,106,79,0.06)', display: 'flex',
                flexDirection: 'column', alignItems: 'center', textAlign: 'center'
              }}>

                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    border: '4px solid #2d6a4f', padding: '3px', boxShadow: '0 4px 16px rgba(45,106,79,0.2)'
                  }}>
                    <img src={user?.avatar} alt="profile"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
                  <button onClick={() => fileInputRef.current.click()} style={{
                    position: 'absolute', bottom: '2px', right: '2px',
                    background: '#0f5238', color: 'white', border: 'none', borderRadius: '50%',
                    width: '30px', height: '30px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>photo_camera</span>
                  </button>
                </div>

                <h1 style={{
                  fontFamily: 'Lexend', fontSize: '22px', fontWeight: 700,
                  color: '#0f5238', marginBottom: '4px'
                }}>{user?.name}</h1>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans', fontSize: '13px',
                  color: '#707973', marginBottom: '12px'
                }}>{user?.email}</p>
                <span style={{
                  background: '#b1f0ce', color: '#2d6a4f', fontSize: '11px',
                  fontWeight: 800, padding: '4px 14px', borderRadius: '9999px',
                  fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.02em',
                  marginBottom: '24px', display: 'inline-block'
                }}>
                  Member since {user?.memberSince}
                </span>

                <div style={{
                  width: '100%', display: 'flex', flexDirection: 'column',
                  gap: '10px', marginBottom: '24px'
                }}>
                  {[
                    ['menu_book', 'Recipes Created', recipes.length],
                    ['bookmark_heart', 'Meals Planned', stats.mealsPlanned],
                    ['rate_review', 'Recipes Rated', stats.recipesRated],
                  ].map(([icon, label, count]) => (
                    <div key={label} className="pf-stat-card"
                      style={{
                        background: '#f3f4f5', padding: '12px 16px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="material-symbols-outlined"
                          style={{ fontSize: '20px', color: '#2d6a4f' }}>{icon}</span>
                        <span style={{
                          fontFamily: 'Plus Jakarta Sans', fontSize: '13px',
                          fontWeight: 500, color: '#404943'
                        }}>{label}</span>
                      </div>
                      <span style={{
                        fontFamily: 'Lexend', fontSize: '20px', fontWeight: 700,
                        color: '#0f5238'
                      }}>{count}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => { setEditMode(true); setActiveTab('info'); }}
                  style={{
                    width: '100%', padding: '12px', background: '#0f5238', color: 'white',
                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                    fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 12px rgba(15,82,56,0.25)', transition: 'all 0.15s'
                  }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                  Edit Profile
                </button>
                <button onClick={handleLogout}
                  style={{
                    width: '100%', padding: '12px', background: 'transparent', color: '#ba1a1a',
                    border: '2px solid #ffdad6', borderRadius: '10px', cursor: 'pointer',
                    fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700, marginTop: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.15s'
                  }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                  Logout
                </button>

                {showDeleteConfirm ? (
                  <div style={{ marginTop: '12px', width: '100%', background: '#ffdad6', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px', color: '#93000a', fontWeight: 600, margin: 0 }}>Are you sure? This will permanently delete your account.</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleDeleteAccount} style={{ flex: 1, padding: '8px', background: '#ba1a1a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Lexend', fontSize: '12px', fontWeight: 700 }}>Yes</button>
                      <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '8px', background: 'transparent', color: '#93000a', border: '1px solid #ba1a1a', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Lexend', fontSize: '12px', fontWeight: 700 }}>No</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      width: '100%', padding: '12px', background: 'transparent', color: '#ba1a1a',
                      border: 'none', borderRadius: '10px', cursor: 'pointer',
                      fontFamily: 'Lexend', fontSize: '13px', fontWeight: 600, marginTop: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      transition: 'all 0.15s'
                    }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_forever</span>
                    Delete Account
                  </button>
                )}
              </div>
            </aside>

            <section style={{ flexGrow: 1, minWidth: 0 }}>

              {/* Tabs */}
              <div style={{
                display: 'flex', gap: '0', borderBottom: '2px solid #e1e3e4',
                marginBottom: '24px'
              }}>
                {[['info', 'My Info'], ['recipes', 'My Recipes'], ['favorites', 'Favorites'], ['plans', 'My Plans']].map(([key, label]) => (
                  <button key={key} onClick={() => {
                    setActiveTab(key);
                    if (key === 'plans') fetchProfileData(true);
                  }}
                    style={{
                      padding: '12px 24px', background: 'none', border: 'none',
                      cursor: 'pointer', fontFamily: 'Lexend', fontSize: '14px',
                      fontWeight: activeTab === key ? 700 : 500,
                      color: activeTab === key ? '#0f5238' : '#707973',
                      borderBottom: activeTab === key ? '2.5px solid #0f5238' : '2.5px solid transparent',
                      marginBottom: '-2px', transition: 'all 0.15s'
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === 'info' && (
                <div style={{
                  background: 'white', borderRadius: '20px', padding: '28px',
                  boxShadow: '0 4px 20px rgba(45,106,79,0.06)'
                }}>

                  {editMode ? (
                    <form onSubmit={formik.handleSubmit}>
                      <h3 style={{
                        fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                        color: '#0f5238', marginBottom: '24px'
                      }}>Edit Personal Details</h3>

                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr',
                        gap: '18px', marginBottom: '24px'
                      }}>
                        <Field id="name" label="Full Name" icon="person" formik={formik} />
                        <Field id="email" label="Email Address" icon="mail" formik={formik} type="email" />
                        <Field id="calorieGoal" label="Daily Calorie Goal" icon="local_fire_department" formik={formik} type="number" suffix="kcal" />
                      </div>

                      {/* Dietary prefs */}
                      <div style={{
                        marginBottom: '24px', paddingTop: '20px',
                        borderTop: '1px solid #f3f4f5'
                      }}>
                        <h4 style={{
                          fontFamily: 'Lexend', fontSize: '15px', fontWeight: 700,
                          color: '#0f5238', marginBottom: '14px'
                        }}>Dietary Preferences</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {ALL_PREFS.map(pref => {
                            const active = selectedPrefs.includes(pref);
                            return (
                              <button key={pref} type="button" onClick={() => togglePref(pref)}
                                className="pf-pref-chip"
                                style={{
                                  padding: '7px 16px', borderRadius: '9999px',
                                  border: `1.5px solid ${active ? '#2d6a4f' : '#bfc9c1'}`,
                                  background: active ? '#b1f0ce' : 'white',
                                  color: active ? '#0f5238' : '#707973',
                                  fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                                  display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                {active && <span className="material-symbols-outlined"
                                  style={{ fontSize: '14px' }}>check</span>}
                                {pref}
                              </button>
                            );
                          })}
                          {/* Show any custom prefs not in ALL_PREFS so the user can remove them */}
                          {selectedPrefs
                            .filter(p => !ALL_PREFS.map(a => a.toLowerCase()).includes(p.toLowerCase()))
                            .map(pref => (
                              <button key={pref} type="button" onClick={() => togglePref(pref)}
                                className="pf-pref-chip"
                                style={{
                                  padding: '7px 16px', borderRadius: '9999px',
                                  border: '1.5px solid #2d6a4f',
                                  background: '#b1f0ce', color: '#0f5238',
                                  fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                                  display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                <span className="material-symbols-outlined"
                                  style={{ fontSize: '14px' }}>check</span>
                                {pref}
                                <span className="material-symbols-outlined"
                                  style={{ fontSize: '14px', marginLeft: '2px' }}>close</span>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{
                        display: 'flex', gap: '12px', paddingTop: '20px',
                        borderTop: '1px solid #f3f4f5'
                      }}>
                        <button type="submit"
                          style={{
                            padding: '11px 28px', background: '#0f5238', color: 'white',
                            border: 'none', borderRadius: '10px', cursor: 'pointer',
                            fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 4px 12px rgba(15,82,56,0.2)'
                          }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                          Save Changes
                        </button>
                        <button type="button" onClick={handleCancel}
                          style={{
                            padding: '11px 28px', background: '#f3f4f5', color: '#707973',
                            border: 'none', borderRadius: '10px', cursor: 'pointer',
                            fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700
                          }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 style={{
                        fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                        color: '#0f5238', marginBottom: '24px'
                      }}>Personal Details</h3>

                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr',
                        gap: '24px', marginBottom: '28px'
                      }}>
                        {[
                          ['FULL NAME', user?.name, 'person'],
                          ['EMAIL ADDRESS', user?.email, 'mail'],
                          ['DAILY CALORIE GOAL', `${user?.calorie_goal?.toLocaleString() || 2000} kcal`, 'local_fire_department'],
                          ['MEMBER SINCE', user?.memberSince, 'calendar_month'],
                        ].map(([label, value, icon]) => (
                          <div key={label}>
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              marginBottom: '6px'
                            }}>
                              <span className="material-symbols-outlined"
                                style={{ fontSize: '14px', color: '#707973' }}>{icon}</span>
                              <span style={{
                                fontFamily: 'Plus Jakarta Sans', fontSize: '10px',
                                fontWeight: 800, color: '#707973', textTransform: 'uppercase',
                                letterSpacing: '0.08em'
                              }}>{label}</span>
                            </div>
                            <p style={{
                              fontFamily: 'Plus Jakarta Sans', fontSize: '16px',
                              fontWeight: 600, color: '#191c1d'
                            }}>{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Dietary prefs */}
                      <div style={{
                        paddingTop: '20px', borderTop: '1px solid #f3f4f5',
                        marginBottom: '28px'
                      }}>
                        <h4 style={{
                          fontFamily: 'Lexend', fontSize: '15px', fontWeight: 700,
                          color: '#0f5238', marginBottom: '14px'
                        }}>Dietary Preferences</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {(user?.dietary_prefs || []).map(pref => (
                            <span key={pref} style={{
                              display: 'flex', alignItems: 'center',
                              gap: '6px', background: '#b1f0ce', color: '#0f5238',
                              padding: '7px 16px', borderRadius: '9999px',
                              fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700
                            }}>
                              <span className="material-symbols-outlined"
                                style={{ fontSize: '14px' }}>eco</span>
                              {pref}
                            </span>
                          ))}
                          {(user?.dietary_prefs || []).length === 0 && (
                            <span style={{
                              fontFamily: 'Plus Jakarta Sans', fontSize: '13px',
                              color: '#707973', fontStyle: 'italic'
                            }}>No preferences set</span>
                          )}
                        </div>
                      </div>

                      <div style={{ paddingTop: '20px', borderTop: '1px solid #f3f4f5' }}>
                        <h4 style={{
                          fontFamily: 'Lexend', fontSize: '15px', fontWeight: 700,
                          color: '#0f5238', marginBottom: '16px'
                        }}>Macro Distribution</h4>
                        <div style={{
                          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                          gap: '20px', background: '#f3f4f5', padding: '20px', borderRadius: '14px'
                        }}>
                          {[['Protein', '#2d6a4f', 30], ['Carbs', '#fd9d1a', 50], ['Fats', '#57624e', 20]].map(([label, color, pct]) => (
                            <div key={label}>
                              <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                marginBottom: '6px'
                              }}>
                                <span style={{
                                  fontFamily: 'Plus Jakarta Sans', fontSize: '12px',
                                  fontWeight: 700, color: '#404943'
                                }}>{label}</span>
                                <span style={{
                                  fontFamily: 'Plus Jakarta Sans', fontSize: '12px',
                                  fontWeight: 800, color
                                }}>{pct}%</span>
                              </div>
                              <div style={{
                                height: '8px', background: '#e1e3e4',
                                borderRadius: '9999px', overflow: 'hidden'
                              }}>
                                <div style={{
                                  height: '100%', width: `${pct}%`,
                                  background: color, borderRadius: '9999px'
                                }} />
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
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '20px'
                  }}>
                    <h3 style={{
                      fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                      color: '#0f5238'
                    }}>My Recipes ({recipes.length})</h3>
                    <button onClick={() => navigate('/recipes/create')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', background: '#0f5238', color: 'white',
                        border: 'none', borderRadius: '10px', cursor: 'pointer',
                        fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(15,82,56,0.2)'
                      }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                      New Recipe
                    </button>
                  </div>

                  {recipes.length > 0 ? (
                    <div className="pf-recipes-grid"
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                      {recipes.map(r => (
                        <div key={r._id || r.id} className="pf-recipe-card">
                          <RecipeCard recipe={r} onDelete={handleDeleteRecipe} navigate={navigate} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Empty state */
                    <div style={{
                      background: 'white', borderRadius: '20px', padding: '64px 32px',
                      boxShadow: '0 4px 20px rgba(45,106,79,0.06)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      textAlign: 'center', gap: '16px'
                    }}>
                      <div style={{
                        width: '80px', height: '80px', background: '#f0faf5',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span className="material-symbols-outlined"
                          style={{ fontSize: '40px', color: '#2d6a4f' }}>menu_book</span>
                      </div>
                      <h4 style={{
                        fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                        color: '#191c1d'
                      }}>You haven't created any recipes yet</h4>
                      <p style={{
                        fontFamily: 'Plus Jakarta Sans', fontSize: '14px',
                        color: '#707973', maxWidth: '320px', lineHeight: 1.6
                      }}>
                        Share your favourite meals with the Vitality Kitchen community.
                      </p>
                      <button onClick={() => navigate('/recipes/create')}
                        style={{
                          marginTop: '8px', padding: '12px 28px', background: '#0f5238',
                          color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
                          fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: '8px',
                          boxShadow: '0 4px 12px rgba(15,82,56,0.2)'
                        }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        Create Your First Recipe
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── FAVORITES TAB ── */}
              {activeTab === 'favorites' && (
                <div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '20px'
                  }}>
                    <h3 style={{
                      fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                      color: '#0f5238'
                    }}>Favorites ({favoriteRecipes.length})</h3>
                    <button onClick={() => navigate('/recipes')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', background: '#0f5238', color: 'white',
                        border: 'none', borderRadius: '10px', cursor: 'pointer',
                        fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(15,82,56,0.2)'
                      }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
                      Browse Recipes
                    </button>
                  </div>

                  {favoriteRecipes.length > 0 ? (
                    <div className="pf-recipes-grid"
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                      {favoriteRecipes.map(r => (
                        <div key={r._id || r.id} className="pf-recipe-card">
                          <RecipeCard
                            recipe={r}
                            onRemoveFavorite={handleRemoveFavorite}
                            navigate={navigate}
                            isRemoving={removingFavoriteIds.has((r._id || r.id)?.toString())}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      background: 'white', borderRadius: '20px', padding: '64px 32px',
                      boxShadow: '0 4px 20px rgba(45,106,79,0.06)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      textAlign: 'center', gap: '16px'
                    }}>
                      <div style={{
                        width: '80px', height: '80px', background: '#f0faf5',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span className="material-symbols-outlined"
                          style={{ fontSize: '40px', color: '#2d6a4f', fontVariationSettings: '"FILL" 1' }}>favorite</span>
                      </div>
                      <h4 style={{
                        fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                        color: '#191c1d'
                      }}>No favorite recipes yet</h4>
                      <p style={{
                        fontFamily: 'Plus Jakarta Sans', fontSize: '14px',
                        color: '#707973', maxWidth: '320px', lineHeight: 1.6
                      }}>
                        Tap the heart on any recipe to keep it here for later.
                      </p>
                      <button onClick={() => navigate('/recipes')}
                        style={{
                          marginTop: '8px', padding: '12px 28px', background: '#0f5238',
                          color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
                          fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: '8px',
                          boxShadow: '0 4px 12px rgba(15,82,56,0.2)'
                        }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restaurant</span>
                        Find Recipes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── PLANS TAB ── */}
              {activeTab === 'plans' && (
                <div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '20px'
                  }}>
                    <h3 style={{
                      fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                      color: '#0f5238'
                    }}>My Weekly Plans ({mealPlans.length})</h3>
                    <button onClick={() => navigate('/meal-planner')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', background: '#0f5238', color: 'white',
                        border: 'none', borderRadius: '10px', cursor: 'pointer',
                        fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(15,82,56,0.2)'
                      }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                      New Plan
                    </button>
                  </div>

                  {mealPlans.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {mealPlans.map(plan => {
                        const startDate = new Date(plan.startDate);
                        const endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 6);

                        // Count meals in this specific plan
                        let mealsCount = 0;
                        if (plan.week) {
                          ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
                            if (plan.week[day]) {
                              ['Breakfast', 'Lunch', 'Dinner'].forEach(slot => {
                                if (plan.week[day][slot]) mealsCount++;
                              });
                            }
                          });
                        }

                        return (
                          <div key={plan._id} style={{
                            background: 'white', borderRadius: '16px', padding: '20px',
                            boxShadow: '0 4px 20px rgba(45,106,79,0.07)', border: '1px solid #ecfdf5',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}>
                            <div>
                              <p style={{ fontWeight: 700 }}>Week of {startDate.toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => navigate(`/meal-planner?startDate=${plan.startDate}`)}
                              style={{
                                padding: '8px 20px', background: '#f0faf5', color: '#0f5238',
                                border: 'none', borderRadius: '10px', cursor: 'pointer',
                                fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 700,
                                transition: 'all 0.15s'
                              }}>
                              View Plan
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{
                      background: 'white', borderRadius: '20px', padding: '64px 32px',
                      boxShadow: '0 4px 20px rgba(45,106,79,0.06)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      textAlign: 'center', gap: '16px'
                    }}>
                      <div style={{
                        width: '80px', height: '80px', background: '#f0faf5',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span className="material-symbols-outlined"
                          style={{ fontSize: '40px', color: '#2d6a4f' }}>calendar_month</span>
                      </div>
                      <h4 style={{
                        fontFamily: 'Lexend', fontSize: '18px', fontWeight: 700,
                        color: '#191c1d'
                      }}>No meal plans saved</h4>
                      <p style={{
                        fontFamily: 'Plus Jakarta Sans', fontSize: '14px',
                        color: '#707973', maxWidth: '320px', lineHeight: 1.6
                      }}>
                        Plan your week in the meal planner and save it to see it here.
                      </p>
                      <button onClick={() => navigate('/meal-planner')}
                        style={{
                          marginTop: '8px', padding: '12px 28px', background: '#0f5238',
                          color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
                          fontFamily: 'Lexend', fontSize: '14px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: '8px',
                          boxShadow: '0 4px 12px rgba(15,82,56,0.2)'
                        }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_add_on</span>
                        Go to Meal Planner
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

    </>
  );
}