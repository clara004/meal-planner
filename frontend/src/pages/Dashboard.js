import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ calorieGoal: '—', mealsPlanned: '—', recipesSaved: '—' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored || stored === 'undefined') { navigate('/login'); return; }
    try {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      fetchStats(parsedUser);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const fetchStats = async (parsedUser) => {
    try {
      const [mealsRes, recipesRes] = await Promise.all([
        api.get('/mealplan'),
        api.get('/recipes'),
      ]);
      setStats({
        calorieGoal: parsedUser.calorie_goal ? `${parsedUser.calorie_goal} kcal` : '2,000 kcal',
        mealsPlanned: `${mealsRes.data?.mealPlans?.length ?? 0} meals`,
        recipesSaved: `${recipesRes.data?.recipes?.length ?? 0} recipes`,
      });
    } catch {
      setStats({
        calorieGoal: parsedUser.calorie_goal ? `${parsedUser.calorie_goal} kcal` : '2,000 kcal',
        mealsPlanned: '0 meals',
        recipesSaved: '0 recipes',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', minHeight: '100vh', background: '#f8f9fa' }}>
      <header style={{ background: '#0f5238', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '22px', fontWeight: 800 }}>Vitality Kitchen</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#b1f0ce', fontSize: '14px' }}>Welcome, {user.name}!</span>
          <button onClick={handleLogout} style={{ background: 'white', color: '#0f5238', border: 'none', padding: '8px 20px', borderRadius: '999px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </header>
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f5238', marginBottom: '8px' }}>Hello, {user.name}! 👋</h1>
          <p style={{ color: '#707973', fontSize: '15px' }}>Here's your wellness overview for today.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Daily Calories', value: stats.calorieGoal, icon: '🔥' },
            { label: 'Meals Planned', value: stats.mealsPlanned, icon: '🥗' },
            { label: 'Recipes Saved', value: stats.recipesSaved, icon: '📖' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f5238' }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#707973', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#191c1d', marginBottom: '20px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Browse Recipes', path: '/recipes' },
              { label: 'View Meal Plans', path: '/meal-planner' },
            ].map(({ label, path }) => (
              <button key={label} onClick={() => navigate(path)} style={{ background: '#0f5238', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '999px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;