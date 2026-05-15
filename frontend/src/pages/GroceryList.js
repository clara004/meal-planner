import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import html2pdf from "html2pdf.js";

export default function GroceryList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ingredients, setIngredients] = useState([]);
  const [recipesIncluded, setRecipesIncluded] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const startDate = searchParams.get('startDate');
        if (!startDate) {
          setError('No meal plan selected. Go to Meal Planner and click Generate Shopping List.');
          setLoading(false);
          return;
        }
        const res = await api.get(`/mealplan/shopping-list?startDate=${startDate}`);
        setIngredients(res.data.ingredients);
        setRecipesIncluded(res.data.recipesIncluded);
        const initialChecked = {};
        res.data.ingredients.forEach((_, i) => { initialChecked[i] = false; });
        setChecked(initialChecked);
      } catch (err) {
        setError('Could not load shopping list. Make sure you have recipes in your meal plan.');
      } finally {
        setLoading(false);
      }
    };
    fetchShoppingList();
  }, [searchParams]);

  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  const totalItems = ingredients.length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const remaining = totalItems - checkedCount;
  const progress = totalItems ? Math.round((checkedCount / totalItems) * 100) : 0;
  const markAllDone = () => {
    const all = {};
    ingredients.forEach((_, i) => { all[i] = true; });
    setChecked(all);
  };

  const exportPDF = () => {
    const element = document.getElementById('grocery-list-content');
    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     'grocery-list.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, ignoreElements: (node) => node.id === 'action-buttons' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans' }}>
      Loading your shopping list...
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans', gap: 16 }}>
      <p style={{ color: '#6b7280', fontSize: 18, textAlign: 'center', maxWidth: 400 }}>{error}</p>
      <button onClick={() => navigate('/meal-planner')} style={{ background: '#0f5238', color: 'white', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}>
        Go to Meal Planner
      </button>
    </div>
  );

  return (
    <div
      className={`reveal ${pageLoaded ? 'active' : ''}`}
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "#f8f9fa",
        minHeight: "100vh",
        backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100/50 shadow-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5">
          <div
            onClick={() => navigate('/')}
            className="text-[24px] font-[800] tracking-tight text-[#064e3b] font-['Lexend'] cursor-pointer"
          >
            Vitality Kitchen
          </div>
          <div className="hidden md:flex items-center gap-10 font-['Lexend'] text-[14px] tracking-wide">
            <button onClick={() => navigate('/')} className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent">Home</button>
            <button onClick={() => navigate('/recipes')} className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent">Recipes</button>
            <button onClick={() => navigate('/meal-planner')} className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent">Meal Planner</button>
            <button onClick={() => navigate('/grocery')} className="text-[#0f5238] font-bold border-b-2 border-[#0f5238] pb-1 bg-transparent">Grocery List</button>
          </div>
          <div className="flex items-center gap-6">
            {localStorage.getItem('token') ? (
              <button onClick={() => navigate('/profile')} className="bg-[#0f5238] text-white px-6 py-2.5 font-bold text-sm shadow-lg hover:bg-[#064e3b] transition-all flex items-center gap-2" style={{ borderRadius: '9999px' }}>
                <span className="material-symbols-outlined text-sm">person</span>
                Profile
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-stone-600 font-bold text-sm">Login</button>
                <button onClick={() => navigate('/login')} className="bg-[#0f5238] text-white px-8 py-3 font-bold text-sm shadow-lg hover:bg-[#064e3b] transition-all" style={{ borderRadius: '9999px' }}>Get Started</button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* MAIN */}
      <main id="grocery-list-content" style={{ paddingTop: 112, paddingBottom: 120, maxWidth: 1280, margin: "0 auto", padding: "112px 32px 140px" }}>

        {/* Header */}
        <section style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, gap: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 48, fontWeight: 700, color: "#0f5238", letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
              Your Grocery List
            </h1>
            <p style={{ color: "#6b7280", marginTop: 8, fontSize: 18 }}>
              {totalItems} ingredients from {recipesIncluded.length} recipes
            </p>
          </div>
          <div id="action-buttons" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => window.print()}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "white", color: "#0f5238", border: "1px solid #0f5238", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(15,82,56,0.05)", transition: "opacity 0.2s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>print</span>
              Print
            </button>
            <button
              onClick={exportPDF}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "white", color: "#0f5238", border: "1px solid #0f5238", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(15,82,56,0.05)", transition: "opacity 0.2s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
              Export PDF
            </button>
            <button
              onClick={() => navigate('/meal-planner')}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "#0f5238", color: "white", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(15,82,56,0.15)", transition: "opacity 0.2s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              ↺ Regenerate List
            </button>
          </div>
        </section>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="main-grid">

          {/* LEFT: Ingredients */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 4px 20px rgba(45,106,79,0.05)", border: "1px solid rgba(236,253,245,0.5)" }}>
              <h2 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 20 }}>
                Ingredients
              </h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {ingredients.map((item, i) => (
                  <li key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={checked[i] || false}
                        onChange={() => toggle(i)}
                        style={{ width: 22, height: 22, accentColor: "#0f5238", cursor: "pointer", flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 16, color: checked[i] ? "#9ca3af" : "#111827", textDecoration: checked[i] ? "line-through" : "none", fontStyle: checked[i] ? "italic" : "normal", transition: "all 0.2s" }}>
                        {item.name}
                      </span>
                    </label>
                    <span style={{ fontSize: 12, fontWeight: 700, color: checked[i] ? "#c4c9c3" : "#6b7280", background: checked[i] ? "#fafafa" : "#f3f4f5", padding: "4px 12px", borderRadius: 9999, whiteSpace: "nowrap" }}>
                      {item.quantity} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }} className="sidebar">

            {/* Trip Summary */}
            <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 12px 32px rgba(0,0,0,0.08)", border: "1px solid rgba(236,253,245,0.5)" }}>
              <h3 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 20, fontWeight: 600, marginTop: 0, marginBottom: 20 }}>
                Trip Summary
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, fontWeight: 600 }}>
                <span style={{ color: "#6b7280" }}>Progress</span>
                <span style={{ color: "#0f5238" }}>{checkedCount} of {totalItems} items</span>
              </div>
              <div style={{ width: "100%", height: 12, background: "#edeeef", borderRadius: 9999, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "#0f5238", borderRadius: 9999, transition: "width 0.4s ease" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[{ label: "Total", val: totalItems }, { label: "Checked", val: checkedCount }].map(({ label, val }) => (
                  <div key={label} style={{ background: "#f3f4f5", borderRadius: 10, padding: 14, textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase" }}>{label}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 700, color: "#0f5238", fontFamily: "'Lexend', sans-serif" }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipes Included */}
            <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 4px 20px rgba(45,106,79,0.05)", border: "1px solid rgba(236,253,245,0.5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 20, fontWeight: 600, margin: 0 }}>Recipes included</h3>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0f5238" }}>{recipesIncluded.length} total</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recipesIncluded.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: 10, borderRadius: 10 }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {r.image && (
                      <div style={{ width: 60, height: 60, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                        <img src={r.image} alt={r.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>{r.title}</span>
                      <span style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{r.servings} servings</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="sticky-bottom-bar" style={{ position: "fixed", bottom: 0, left: 0, width: "100%", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderTop: "1px solid #ecfdf5", zIndex: 40, padding: "16px 0", boxShadow: "0 -4px 20px rgba(45,106,79,0.05)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: 20, fontWeight: 600, color: "#0f5238", margin: 0 }}>
              {remaining === 0 ? "All done! 🎉" : `${remaining} item${remaining !== 1 ? "s" : ""} remaining`}
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0", fontWeight: 700, letterSpacing: "0.04em" }}>
              {remaining === 0 ? "Ready for checkout!" : "Ready for checkout?"}
            </p>
          </div>
          <button
            onClick={markAllDone}
            style={{ padding: "12px 32px", background: "#0f5238", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: "0.04em", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 4px 16px rgba(15,82,56,0.2)", transition: "opacity 0.2s", opacity: remaining === 0 ? 0.5 : 1 }}
            disabled={remaining === 0}
          >
            Mark All as Done
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-stone-100 bg-white font-['Lexend'] text-sm">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div onClick={() => navigate('/')} className="text-2xl font-[800] text-[#064e3b] cursor-pointer">Vitality Kitchen</div>
            <p className="text-stone-500 max-w-xs text-center md:text-left leading-relaxed">Nourishing your journey with science, taste, and absolute joy. © 2026 Vitality Kitchen.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <button className="text-stone-600 font-medium hover:text-[#0f5238] bg-transparent">About Us</button>
            <button className="text-stone-600 font-medium hover:text-[#0f5238] bg-transparent">Privacy Policy</button>
            <button className="text-stone-600 font-medium hover:text-[#0f5238] bg-transparent">Terms of Service</button>
            <button className="text-stone-600 font-medium hover:text-[#0f5238] bg-transparent">Contact</button>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#0f5238] cursor-pointer hover:bg-[#0f5238] hover:text-white transition-all"><span className="material-symbols-outlined">share</span></div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#0f5238] cursor-pointer hover:bg-[#0f5238] hover:text-white transition-all"><span className="material-symbols-outlined">mail</span></div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 1024px) {
          .main-grid { grid-template-columns: 1fr 380px !important; }
          .sidebar { position: sticky; top: 100px; align-self: start; }
        }
        @media (max-width: 640px) {
          main { padding: 100px 16px 140px !important; }
          h1 { font-size: 32px !important; }
        }
        input[type="checkbox"] { border-radius: 6px; }
        button:hover { opacity: 0.9; }
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.active { opacity: 1; transform: translateY(0); }

        /* Print Styles */
        @media print {
          header, footer, .sidebar, button, .sticky-bottom-bar { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
          .main-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .reveal { background: white !important; background-image: none !important; min-height: auto !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}