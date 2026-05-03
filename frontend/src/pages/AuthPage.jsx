import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const loginSchema = Yup.object({
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const registerSchema = Yup.object({
  name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  calorieGoal: Yup.number()
    .min(500, "Minimum 500 calories")
    .max(10000, "Maximum 10,000 calories")
    .required("Please set a daily calorie goal"),
});

function InputField({ id, label, type = "text", placeholder, icon, formik, rightIcon, onRightIconClick }) {
  const hasError = formik.touched[id] && formik.errors[id];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <span className="material-symbols-outlined" style={styles.inputIcon}>{icon}</span>
        <input
          id={id} name={id} type={type} placeholder={placeholder}
          value={formik.values[id]} onChange={formik.handleChange} onBlur={formik.handleBlur}
          style={{ ...styles.input, border: hasError ? "2px solid #ba1a1a" : "2px solid transparent", paddingRight: rightIcon ? "48px" : "16px" }}
        />
        {rightIcon && (
          <span className="material-symbols-outlined" style={styles.inputIconRight} onClick={onRightIconClick}>{rightIcon}</span>
        )}
      </div>
      {hasError && (
        <div style={styles.errorMsg}>
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>error</span>
          {formik.errors[id]}
        </div>
      )}
    </div>
  );
}

function SelectField({ id, label, icon, options, formik }) {
  const hasError = formik.touched[id] && formik.errors[id];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <span className="material-symbols-outlined" style={styles.inputIcon}>{icon}</span>
        <select
          id={id} name={id} value={formik.values[id]}
          onChange={formik.handleChange} onBlur={formik.handleBlur}
          style={{ ...styles.input, border: hasError ? "2px solid #ba1a1a" : "2px solid transparent", appearance: "none", cursor: "pointer" }}
        >
          <option value="" disabled>Select your primary goal</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="material-symbols-outlined" style={styles.inputIconRight}>expand_more</span>
      </div>
      {hasError && (
        <div style={styles.errorMsg}>
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>error</span>
          {formik.errors[id]}
        </div>
      )}
    </div>
  );
}

function LoginForm({ onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerError("");
      try {
        const res = await api.post("/auth/login", values);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onSuccess && onSuccess(res.data.user);
      } catch (err) {
        setServerError(err.response?.data?.message || "Invalid email or password. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {serverError && <div style={styles.serverError}><span className="material-symbols-outlined" style={{ fontSize: "18px" }}>warning</span>{serverError}</div>}
      <InputField id="email" label="Email Address" type="email" placeholder="name@example.com" icon="mail" formik={formik} />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <a href="#" style={styles.forgotLink}>Forgot password?</a>
        </div>
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined" style={styles.inputIcon}>lock</span>
          <input
            id="password" name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange} onBlur={formik.handleBlur}
            style={{ ...styles.input, border: formik.touched.password && formik.errors.password ? "2px solid #ba1a1a" : "2px solid transparent", paddingRight: "48px" }}
          />
          <span className="material-symbols-outlined" style={{ ...styles.inputIconRight, cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div style={styles.errorMsg}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>error</span>
            {formik.errors.password}
          </div>
        )}
      </div>
      <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Logging in..." : "Log In to Your Kitchen"}
      </button>
    </form>
  );
}

function RegisterForm({ onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "", calorieGoal: "", dietaryPrefs: "" },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerError("");
      try {
        const payload = {
          name: values.name,
          email: values.email,
          password: values.password,
          calorie_goal: Number(values.calorieGoal),
          dietary_prefs: values.dietaryPrefs ? values.dietaryPrefs.split(",").map(s => s.trim()) : [],
        };
        const res = await api.post("/auth/register", payload);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onSuccess && onSuccess(res.data.user);
      } catch (err) {
        setServerError(err.response?.data?.message || "Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {serverError && <div style={styles.serverError}><span className="material-symbols-outlined" style={{ fontSize: "18px" }}>warning</span>{serverError}</div>}
      <InputField id="name" label="Full Name" placeholder="Your full name" icon="person" formik={formik} />
      <InputField id="email" label="Email Address" type="email" placeholder="name@example.com" icon="mail" formik={formik} />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="password" style={styles.label}>Password</label>
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined" style={styles.inputIcon}>lock</span>
          <input
            id="password" name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 6 characters"
            value={formik.values.password}
            onChange={formik.handleChange} onBlur={formik.handleBlur}
            style={{ ...styles.input, border: formik.touched.password && formik.errors.password ? "2px solid #ba1a1a" : "2px solid transparent", paddingRight: "48px" }}
          />
          <span className="material-symbols-outlined" style={{ ...styles.inputIconRight, cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </div>
        {formik.touched.password && formik.errors.password && <div style={styles.errorMsg}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>error</span>{formik.errors.password}</div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined" style={styles.inputIcon}>lock_reset</span>
          <input
            id="confirmPassword" name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange} onBlur={formik.handleBlur}
            style={{ ...styles.input, border: formik.touched.confirmPassword && formik.errors.confirmPassword ? "2px solid #ba1a1a" : "2px solid transparent", paddingRight: "48px" }}
          />
          <span className="material-symbols-outlined" style={{ ...styles.inputIconRight, cursor: "pointer" }} onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? "visibility_off" : "visibility"}
          </span>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && <div style={styles.errorMsg}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>error</span>{formik.errors.confirmPassword}</div>}
      </div>
      <SelectField
        id="calorieGoal" label="Daily Calorie Goal" icon="monitor_weight" formik={formik}
        options={[
          { value: "1500", label: "1500 kcal — Weight Loss" },
          { value: "2000", label: "2000 kcal — Maintenance" },
          { value: "2500", label: "2500 kcal — Muscle Gain" },
          { value: "3000", label: "3000 kcal — Athletic Performance" },
        ]}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="dietaryPrefs" style={styles.label}>Dietary Preferences <span style={{ color: "#707973", fontWeight: 400 }}>(optional)</span></label>
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined" style={styles.inputIcon}>restaurant</span>
          <input
            id="dietaryPrefs" name="dietaryPrefs" type="text"
            placeholder="e.g. vegan, gluten-free, keto"
            value={formik.values.dietaryPrefs}
            onChange={formik.handleChange} onBlur={formik.handleBlur}
            style={{ ...styles.input, border: "2px solid transparent" }}
          />
        </div>
        <span style={{ fontSize: "11px", color: "#707973" }}>Separate multiple preferences with commas</span>
      </div>
      <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Creating account..." : "Create My Account"}
      </button>
    </form>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  // ← FIXED: navigate to dashboard instead of home
  const handleSuccess = (user) => {
    navigate("/dashboard");
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        input, select { font-family: 'Plus Jakarta Sans', sans-serif; }
        input::placeholder { color: #aab0ac; }
        input:focus, select:focus { outline: none; border: 2px solid #2d6a4f !important; background: #ffffff !important; }
        .tab-btn { transition: all 0.2s ease; }
        .tab-btn:hover { color: #2d6a4f; }
        .submit-btn:hover { background: #0f5238 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(45,106,79,0.3) !important; }
        .submit-btn:active { transform: scale(0.98); }
        .submit-btn { transition: all 0.2s ease; }
        @media (max-width: 768px) {
          .auth-image-side { display: none !important; }
          .auth-form-side { width: 100% !important; }
        }
      `}</style>

      <main style={{ display: "flex", minHeight: "100vh", width: "100%", background: "#f8f9fa" }}>
        <section className="auth-image-side" style={{ width: "50%", position: "relative", overflow: "hidden", background: "#0f5238", display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4R4tCU3Bfo7lHOLaHmmTqBc4Z7mrh00MoAX_bvA6f8LtQ3CUECRzuKZppybX1j2qUDbwxIFHbEYZwjKoQEqwsUvK9NCdF9JNLo9hO_YbOMW7tIe3O95yTnPETXAuZncX2OHUfPtwjXDj5G1dEyozNxkJRAXlvGiN0r6LJ5zeE3-HvJV6wFuRSBtCrI5sTrfJEygFz5gXVQ1NMtZ96E38c2x0w7C1MAIb0QbJzA-I0gXNSRKlJiacRRGOSqD-GTdcwauhTsotTmmmE")`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,82,56,0.85) 0%, transparent 60%)" }} />
          <div style={{ position: "relative", zIndex: 10, padding: "80px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
            <h1 style={{ fontFamily: "Lexend", fontSize: "48px", fontWeight: 700, color: "#ffffff", lineHeight: "1.15", maxWidth: "380px", marginBottom: "16px", letterSpacing: "-0.02em" }}>
              Fuel your life with Vitality.
            </h1>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: "18px", color: "#b1f0ce", maxWidth: "320px", lineHeight: "1.6", marginBottom: "32px" }}>
              Discover chef-curated meal plans tailored to your health goals and macro requirements.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex" }}>
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCK3uLAhecjkJp0g8QH1xzk4Segn2atvZ5LdTfbCSoQdhIApmByNeZJmGmvw5ix01EsyIB35fpnYFwXrinJtIoDXoev4ghqZHPyyN2xRkvWZQfqNdscOjC4moAFrH49r9mVgmrERiaYgHn-D-QVsAyi_fzW3DMpmsCO4mvgJkilGxnWRdU8IsJRzyL9SIPGDM3HVfFIKXFcUSxBvgEfVVSJiOq9xU0VVxsVN57LG_REIc0ZXENAEO_e6FgiYo7Fhdt5bV_vt4vpJQQy",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuC52jH4ZPSMbAsOV95QpzSoa2Qb-awQ9Lca_O3XmYZg8_7EDK2jJNC5BegPVZDC6GPw9EZ0Yn2zm0P8YqkgVrnhkLApWUNldBigXE8CXr2CBaFAMiIwqplqYWiu5ii88QwpGGROiIQAjRBRJO15ohd289BvFJa6JuwAQugxKq1epxDpq9haq2-_ubV-kF5zLpkphMUtc5fn1fGkGKMtDn54aH2WIUCAkNoxbce_0Z7-gg-ZuogeAqkTcbnruvsuc2k8MG6E90c0guK6",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDmjcXE4jemmlWR_zFR2fRdJOdp4yFUJf9Oy1wvVWI3S_L0OdAzwHBGvFIv5fNfYA3y6lLe24pAZ12Xn5wCskDNqoiCEqUH6nckgMF5I2RShzQf-zluNtdcIxilouGWB7b4KEZRE9nr1Z6K_WwWLyHCrsPCsGPgVA9ejDfpOPogNMfcbpATOlcL9EYWvaJ0EpC6b0TQqedZL5FQc8EBFIJwGxKzy9u6uY4B7O0MW_-PRjUD85FIAnhMv10Uy_OZVI-cA5x55fH",
                ].map((src, i) => (
                  <img key={i} src={src} alt="user" style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid white", objectFit: "cover", marginLeft: i > 0 ? "-10px" : 0 }} />
                ))}
              </div>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: "13px", fontWeight: 600, color: "#ffffff", letterSpacing: "0.02em" }}>
                Joined by 20k+ health enthusiasts
              </p>
            </div>
          </div>
        </section>

        <section className="auth-form-side" style={{ width: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", padding: "48px 32px", backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232d6a4f' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
          <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: 40, height: 40, background: "#2d6a4f", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ color: "white", fontSize: "22px" }}>eco</span>
              </div>
              <div>
                <div style={{ fontFamily: "Lexend", fontWeight: 700, fontSize: "18px", color: "#2d6a4f", lineHeight: 1 }}>Vitality</div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: "10px", color: "#707973", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1, marginTop: "2px" }}>Kitchen</div>
              </div>
            </div>
            <div>
              <h2 style={{ fontFamily: "Lexend", fontSize: "28px", fontWeight: 600, color: "#191c1d", lineHeight: 1.3, marginBottom: "6px" }}>
                {tab === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontSize: "15px", color: "#404943" }}>
                {tab === "login" ? "Your journey to wellness continues here." : "Start your wellness journey today."}
              </p>
            </div>
            <div style={{ display: "flex", padding: "4px", background: "#f3f4f5", borderRadius: "14px", gap: "4px" }}>
              {["login", "register"].map((t) => (
                <button key={t} className="tab-btn" onClick={() => setTab(t)} type="button"
                  style={{ flex: 1, padding: "10px", border: "none", borderRadius: "10px", cursor: "pointer", fontFamily: "Lexend", fontSize: "14px", fontWeight: 600, background: tab === t ? "#ffffff" : "transparent", color: tab === t ? "#2d6a4f" : "#707973", boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none" }}>
                  {t === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>
            {tab === "login" ? <LoginForm onSuccess={handleSuccess} /> : <RegisterForm onSuccess={handleSuccess} />}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ flex: 1, height: "1px", background: "#e1e3e4" }} />
              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: "11px", fontWeight: 700, color: "#707973", letterSpacing: "0.08em", textTransform: "uppercase" }}>or continue with</span>
              <div style={{ flex: 1, height: "1px", background: "#e1e3e4" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                { label: "Google", icon: <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                { label: "Apple", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.96 0-2.04-.6-3.21-.6-1.19 0-2.31.6-3.13.6-2.34 0-4.47-3.27-4.47-6.52 0-3.32 2.01-5.12 4-5.12 1.02 0 1.9.54 2.65.54.72 0 1.76-.59 2.92-.59 1.1 0 2.21.5 3.01 1.58-2.6 1.4-2.18 4.8.44 6.18-.55 1.5-1.37 3.02-2.21 3.93zm-3.08-14.77c-.89 1.1-2.21 1.76-3.4 1.76.12-1.28.84-2.58 1.79-3.51 1-.98 2.37-1.76 3.47-1.76-.11 1.28-.97 2.41-1.86 3.51z"/></svg> },
              ].map(({ label, icon }) => (
                <button key={label} type="button" style={styles.socialBtn}>{icon} {label}</button>
              ))}
            </div>
            <p style={{ textAlign: "center", fontFamily: "Plus Jakarta Sans", fontSize: "11px", color: "#707973", lineHeight: 1.6 }}>
              By continuing, you agree to Vitality Kitchen's{" "}
              <a href="#" style={{ color: "#2d6a4f", fontWeight: 700, textDecoration: "none" }}>Terms of Service</a>
              {" "}and{" "}
              <a href="#" style={{ color: "#2d6a4f", fontWeight: 700, textDecoration: "none" }}>Privacy Policy</a>.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  label: { fontFamily: "Plus Jakarta Sans", fontSize: "13px", fontWeight: 600, color: "#404943", letterSpacing: "0.02em" },
  input: { width: "100%", height: "48px", paddingLeft: "48px", paddingRight: "16px", background: "#f1f3f5", borderRadius: "12px", fontFamily: "Plus Jakarta Sans", fontSize: "15px", color: "#191c1d", border: "2px solid transparent", transition: "all 0.15s ease" },
  inputIcon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#707973", fontSize: "20px", pointerEvents: "none" },
  inputIconRight: { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#707973", fontSize: "20px" },
  errorMsg: { display: "flex", alignItems: "center", gap: "5px", fontFamily: "Plus Jakarta Sans", fontSize: "12px", color: "#ba1a1a", fontWeight: 500 },
  serverError: { display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: "#ffdad6", borderRadius: "10px", fontFamily: "Plus Jakarta Sans", fontSize: "13px", color: "#93000a", fontWeight: 500 },
  forgotLink: { fontFamily: "Plus Jakarta Sans", fontSize: "12px", fontWeight: 700, color: "#2d6a4f", textDecoration: "none" },
  submitBtn: { width: "100%", height: "48px", background: "#2d6a4f", color: "#ffffff", border: "none", borderRadius: "12px", cursor: "pointer", fontFamily: "Lexend", fontSize: "15px", fontWeight: 600, boxShadow: "0 4px 16px rgba(45,106,79,0.2)" },
  socialBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "44px", border: "1.5px solid #bfc9c1", borderRadius: "12px", background: "#ffffff", cursor: "pointer", fontFamily: "Plus Jakarta Sans", fontSize: "13px", fontWeight: 600, color: "#191c1d" },
};