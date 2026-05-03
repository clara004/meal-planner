import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Recipes", to: "/recipes" },
  { label: "Meal Plan", to: "/dashboard" },
  { label: "Grocery List", to: "/grocery-list", active: true },
];

const CATEGORIES = [
  {
    id: "produce",
    label: "Produce",
    icon: "🥬",
    items: [
      { id: 1, name: "Baby Spinach", qty: "200g", checked: false },
      { id: 2, name: "Cherry Tomatoes", qty: "1 pint", checked: false },
      { id: 3, name: "Red Onion", qty: "1 large", checked: true },
    ],
  },
  {
    id: "proteins",
    label: "Proteins",
    icon: "🍗",
    items: [
      { id: 4, name: "Chicken Breast", qty: "600g", checked: false },
      { id: 5, name: "Fresh Salmon Fillets", qty: "2 fillets", checked: false },
    ],
  },
  {
    id: "dairy",
    label: "Dairy & Eggs",
    icon: "🥚",
    allDone: true,
    items: [
      { id: 6, name: "Greek Yogurt", qty: "500g", checked: true },
      { id: 7, name: "Free Range Eggs", qty: "12", checked: true },
      { id: 8, name: "Feta Cheese", qty: "200g", checked: true },
    ],
  },
  {
    id: "pantry",
    label: "Pantry",
    icon: "🫙",
    items: [
      { id: 9, name: "Quinoa", qty: "1 cup", checked: false },
      { id: 10, name: "Extra Virgin Olive Oil", qty: "Bottled", checked: false },
      { id: 11, name: "Cumin", qty: "Small jar", checked: false },
    ],
  },
];

const RECIPES = [
  {
    id: 1,
    name: "Mediterranean Quinoa Bowl",
    servings: "4 servings",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAFZPq_JW-GVkbLlAWWNVz_MYZrRPhjsuRC-SvpadtXwl2UA285qxjDJ9t7Wj1p-udzNcNOynDyhJFxl5gCXvDP59UG9bxHuGM_NIvmSpzhinEDSPlmDuqKMpsCOM1HNzar8WwqUnoSbzO7-UwAxu0v3njB36sk8ax8qk15ciidaSoImEzKVNGkFENI4RFPw5gi1ZEf67r3k_5hFzAGIQTfCallkAy2OYOBF7taPR8DPPZu58ZKD1O9P4en_7-IkTBsIrgEzL0qliO",
  },
  {
    id: 2,
    name: "Spicy Salmon Tacos",
    servings: "2 servings",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6glLbvkB1_EUUZogPlgU1bk6oOa2DazYATIkv6eBczL9eW3yo9iFMacAi1D3huy2YhEqGR9DZmzD10pUsiQLAIbqWn0HxX-llJmqz_fgAATMW_qUVMwifXSEWwE5HZnaOnrlMgJSPXeyG3-rXr6sJiAxYW8vmpe64_m5y0OFZrPzJt9gBNb6roklR3o5Ijowopnc55ualNcRVrBBDpEyJXNVcsi-S2RmAXOO9Yja3U-4E_NKdYqzNB2_U_1QqWWvcHdSPw6A_-h-J",
  },
  {
    id: 3,
    name: "Power Green Salad",
    servings: "1 serving",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaAKPY-mQ-zX3Mex22daIvZWIG-VulzeqSN7HjQU4fUdCn-ebagsf2tFyLzVU-a3A2Xa_6GNEE7D_wFAQ4-VqBgwLqQ_3rPFXoqZwHWAvdqcWcwrkobZM8DlJESrkIfp5UCr_JovfpRIsHF3-IuVlFb2L7ZRFpM6kYjmuFtabmZiQ35aQXNhX8hUxWypyaOGSgSw7lT6PXYyhwysA5nPxpdNloAAmkYHTr7A6Xjm1AvVwVfVIOf2XsXDNdHY9QXOjz_2KG-s",
  },
];

export default function GroceryList() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Flatten all items into a single stateful map keyed by item id
  const allItems = CATEGORIES.flatMap((c) => c.items);
  const initialChecked = Object.fromEntries(allItems.map((i) => [i.id, i.checked]));
  const [checked, setChecked] = useState(initialChecked);
  const [collapsed, setCollapsed] = useState({ dairy: true });

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleCollapse = (catId) =>
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));

  const totalItems = allItems.length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const remaining = totalItems - checkedCount;
  const progress = Math.round((checkedCount / totalItems) * 100);

  const markAllDone = () =>
    setChecked(Object.fromEntries(allItems.map((i) => [i.id, true])));

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "#f8f9fa",
        minHeight: "100vh",
        backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── TOP NAV ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          background: "white",
          borderBottom: "1px solid #ecfdf5",
          boxShadow: "0 4px 20px rgba(45,106,79,0.05)",
          fontFamily: "'Lexend', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 32px",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#065f46",
              textDecoration: "none",
              letterSpacing: "-0.02em",
            }}
          >
            Vitality Kitchen
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 font-['Lexend'] text-[14px] tracking-wide desktop-nav">
            <button
              onClick={() => navigate('/')}
              className="text-stone-500 font-medium hover:text-[#0f5238] transition-all bg-transparent"
            >
              Home
            </button>

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
              className="text-[#0f5238] font-bold border-b-2 border-[#0f5238] pb-1 bg-transparent"
            >
              Grocery List
            </button>
          </div>
          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              to="/auth"
              style={{
                padding: "8px 16px",
                color: "#0f5238",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                letterSpacing: "0.03em",
              }}
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              style={{
                padding: "8px 20px",
                background: "#0f5238",
                color: "white",
                borderRadius: 9999,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(15,82,56,0.3)",
                transition: "background 0.2s",
              }}
            >
              Get Started
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
              className="hamburger"
              aria-label="Menu"
            >
              <div style={{ width: 24, height: 2, background: "#374151", marginBottom: 5 }} />
              <div style={{ width: 24, height: 2, background: "#374151", marginBottom: 5 }} />
              <div style={{ width: 24, height: 2, background: "#374151" }} />
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              background: "white",
              borderTop: "1px solid #e5e7eb",
              padding: "16px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  color: l.active ? "#047857" : "#374151",
                  fontWeight: l.active ? 700 : 500,
                  fontSize: 16,
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── MAIN ── */}
      <main
        style={{
          paddingTop: 112,
          paddingBottom: 120,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "112px 32px 140px",
        }}
      >
        {/* Header Section */}
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
            gap: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Lexend', sans-serif",
                fontSize: 48,
                fontWeight: 700,
                color: "#0f5238",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Your Grocery List
            </h1>
            <p style={{ color: "#6b7280", marginTop: 8, fontSize: 18 }}>
              Generated from: Week of May 5 – May 11
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                background: "#0f5238",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                letterSpacing: "0.04em",
                boxShadow: "0 4px 16px rgba(15,82,56,0.15)",
                transition: "opacity 0.2s",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              ↺ Regenerate List
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                background: "#fd9d1a",
                color: "#663b00",
                border: "none",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                letterSpacing: "0.04em",
                boxShadow: "0 4px 16px rgba(253,157,26,0.2)",
                transition: "opacity 0.2s",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              📄 Export as PDF
            </button>
          </div>
        </section>

        {/* Two-column Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
          }}
          className="main-grid"
        >
          {/* ── LEFT: Categories ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {CATEGORIES.map((cat) => {
              const isCollapsed = collapsed[cat.id];
              const catAllDone = cat.items.every((i) => checked[i.id]);

              return (
                <div
                  key={cat.id}
                  style={{
                    background: catAllDone ? "#f3f4f5" : "white",
                    borderRadius: 16,
                    padding: 24,
                    boxShadow: catAllDone
                      ? "none"
                      : "0 4px 20px rgba(45,106,79,0.05)",
                    border: catAllDone
                      ? "1.5px dashed #c9d0c8"
                      : "1px solid rgba(236,253,245,0.5)",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Category Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: isCollapsed ? 0 : 20,
                      paddingBottom: isCollapsed ? 0 : 16,
                      borderBottom: isCollapsed ? "none" : "1px solid #f1f5f9",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCollapse(cat.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span
                        style={{
                          fontSize: 20,
                          padding: "6px 8px",
                          background: "#b1f0ce",
                          borderRadius: 8,
                        }}
                      >
                        {cat.icon}
                      </span>
                      <h2
                        style={{
                          fontFamily: "'Lexend', sans-serif",
                          fontSize: 20,
                          fontWeight: 600,
                          color: catAllDone ? "#9ca3af" : "#111827",
                          margin: 0,
                        }}
                      >
                        {cat.label}
                      </h2>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {catAllDone && (
                        <span
                          style={{
                            background: "#0f5238",
                            color: "white",
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "3px 12px",
                            borderRadius: 9999,
                            letterSpacing: "0.04em",
                          }}
                        >
                          All done!
                        </span>
                      )}
                      <span style={{ color: "#9ca3af", fontSize: 20 }}>
                        {isCollapsed ? "▾" : "▴"}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  {!isCollapsed && (
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                      {cat.items.map((item) => (
                        <li
                          key={item.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 16,
                              cursor: "pointer",
                              flex: 1,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked[item.id] || false}
                              onChange={() => toggle(item.id)}
                              style={{
                                width: 22,
                                height: 22,
                                accentColor: "#0f5238",
                                cursor: "pointer",
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 16,
                                color: checked[item.id] ? "#9ca3af" : "#111827",
                                textDecoration: checked[item.id] ? "line-through" : "none",
                                fontStyle: checked[item.id] ? "italic" : "normal",
                                transition: "all 0.2s",
                              }}
                            >
                              {item.name}
                            </span>
                          </label>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: checked[item.id] ? "#c4c9c3" : "#6b7280",
                              background: checked[item.id] ? "#fafafa" : "#f3f4f5",
                              padding: "4px 12px",
                              borderRadius: 9999,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.qty}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
            className="sidebar"
          >
            {/* Summary Card */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                border: "1px solid rgba(236,253,245,0.5)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Lexend', sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  marginTop: 0,
                  marginBottom: 20,
                }}
              >
                Trip Summary
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, fontWeight: 600 }}>
                <span style={{ color: "#6b7280" }}>Progress</span>
                <span style={{ color: "#0f5238" }}>
                  {checkedCount} of {totalItems} items
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 12,
                  background: "#edeeef",
                  borderRadius: 9999,
                  overflow: "hidden",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "#0f5238",
                    borderRadius: 9999,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Total", val: totalItems },
                  { label: "Checked", val: checkedCount },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    style={{
                      background: "#f3f4f5",
                      borderRadius: 10,
                      padding: 14,
                      textAlign: "center",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                      {label}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 700, color: "#0f5238", fontFamily: "'Lexend', sans-serif" }}>
                      {val}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipes Included */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 4px 20px rgba(45,106,79,0.05)",
                border: "1px solid rgba(236,253,245,0.5)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 20, fontWeight: 600, margin: 0 }}>
                  Recipes included
                </h3>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0f5238" }}>
                  {RECIPES.length} total
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {RECIPES.map((r) => (
                  <Link
                    key={r.id}
                    to={`/recipe/${r.id}`}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: 10,
                      borderRadius: 10,
                      textDecoration: "none",
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 10,
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={r.img}
                        alt={r.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
                        {r.name}
                      </span>
                      <span style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                        {r.servings}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── STICKY BOTTOM BAR ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #ecfdf5",
          zIndex: 40,
          padding: "16px 0",
          boxShadow: "0 -4px 20px rgba(45,106,79,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
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
            style={{
              padding: "12px 32px",
              background: "#0f5238",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              letterSpacing: "0.04em",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: "0 4px 16px rgba(15,82,56,0.2)",
              transition: "opacity 0.2s",
              opacity: remaining === 0 ? 0.5 : 1,
            }}
            disabled={remaining === 0}
          >
            Mark All as Done
          </button>
        </div>
      </div>

      {/* ── GLOBAL FOOTER ── */}
      <footer
        style={{
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          marginTop: 0,
          fontFamily: "'Lexend', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "48px 32px",
            maxWidth: 1280,
            margin: "0 auto",
            gap: 24,
          }}
        >
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#065f46", margin: 0 }}>
              Vitality Kitchen
            </p>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: "6px 0 0" }}>
              © 2024 Vitality Kitchen. Empowering your health journey.
            </p>
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Support", "Contact Us"].map((l) => (
              <a
                key={l}
                href="#"
                style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.target.style.color = "#047857")}
                onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        @media (min-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr 380px !important;
          }
          .sidebar {
            position: sticky;
            top: 100px;
            align-self: start;
          }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
        @media (max-width: 640px) {
          main { padding: 100px 16px 140px !important; }
          h1 { font-size: 32px !important; }
        }
        input[type="checkbox"] {
          border-radius: 6px;
        }
        button:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}