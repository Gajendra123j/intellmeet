import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { User, Mail, Lock, Loader, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// ─── Slider images ─────────────────────────────────────────────────────────────
const topSlides = [
  {
    url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&auto=format&fit=crop&q=80",
    caption: "Join 10,000+ Teams Already Meeting Smarter",
  },
  {
    url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&auto=format&fit=crop&q=80",
    caption: "AI Summaries. Zero Missed Details.",
  },
  {
    url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=80",
    caption: "Built for High-Performance Teams",
  },
];

const bottomSlides = [
  {
    url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&auto=format&fit=crop&q=80",
    label: "Instant AI Transcription",
  },
  {
    url: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1200&auto=format&fit=crop&q=80",
    label: "Smart Meeting Analytics",
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80",
    label: "Collaborate Without Limits",
  },
];

// ─── Profile GIF ───────────────────────────────────────────────────────────────
const PROFILE_GIF =
  "https://img.freepik.com/premium-photo/3d-icon-candid-business-meeting-team-discussing-acquisition-terms-modern-meeting-room-ideal_980716-751148.jpg?w=360";

// ─── Slider Component ──────────────────────────────────────────────────────────
function ImageSlider({
  slides,
  height,
  interval = 3500,
}: {
  slides: { url: string; caption?: string; label?: string }[];
  height: string;
  interval?: number;
}) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % slides.length);
        setFading(false);
      }, 380);
    }, interval);
    return () => clearInterval(timer);
  }, [slides.length, interval]);

  const go = (dir: 1 | -1) => {
    setFading(true);
    setTimeout(() => {
      setCurrent((p) => (p + dir + slides.length) % slides.length);
      setFading(false);
    }, 300);
  };

  const text = slides[current].caption || slides[current].label || "";

  return (
    <div className="reg-slider" style={{ height }}>
      {slides.map((s, i) => (
        <img
          key={i}
          src={s.url}
          alt={s.caption || s.label || ""}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === current ? (fading ? 0 : 1) : 0,
            transform: i === current ? "scale(1)" : "scale(1.06)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            borderRadius: "inherit",
          }}
        />
      ))}
      <div className="reg-slider-overlay" />
      {text && (
        <p className="reg-slider-caption">{text}</p>
      )}
      <button className="reg-slider-arrow left" onClick={() => go(-1)}>
        <ChevronLeft size={12} />
      </button>
      <button className="reg-slider-arrow right" onClick={() => go(1)}>
        <ChevronRight size={12} />
      </button>
      <div className="reg-slider-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`reg-dot ${i === current ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Password Strength ─────────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const strength =
    password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)
      ? 3
      : password.length >= 8
      ? 2
      : password.length >= 4
      ? 1
      : 0;
  const labels = ["", "Weak", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#22c55e"];
  return (
    <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 4,
            background: s <= strength ? colors[strength] : "#e5e7eb",
            transition: "background 0.3s",
          }}
        />
      ))}
      <span style={{ fontSize: 10, color: colors[strength], fontWeight: 600, minWidth: 36 }}>
        {labels[strength]}
      </span>
    </div>
  );
}

// ─── Main Register Page ────────────────────────────────────────────────────────
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("Fill all fields");
    if (form.password.length < 6) return toast.error("Password min 6 chars");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name",  key: "name",     type: "text",     Icon: User,  placeholder: "John Doe" },
    { label: "Email",      key: "email",    type: "email",    Icon: Mail,  placeholder: "you@company.com" },
    { label: "Password",   key: "password", type: "password", Icon: Lock,  placeholder: "Min. 6 characters" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Syne:wght@600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          background: #eef2ff;
          position: relative;
          overflow: hidden;
          padding: 24px 16px;
        }

        /* Animated background */
        .reg-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 55% at 15% 15%, #dbeafe 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 85% 85%, #ede9fe 0%, transparent 55%),
            radial-gradient(ellipse 50% 45% at 55% 45%, #e0f2fe 0%, transparent 65%);
          animation: regMesh 14s ease-in-out infinite alternate;
          z-index: 0;
        }
        @keyframes regMesh {
          0%   { filter: hue-rotate(0deg) brightness(1); }
          100% { filter: hue-rotate(20deg) brightness(1.05); }
        }

        /* ─── Grid Lines ──────────────────────────────────────────────────── */
        .reg-root::after {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(99, 102, 241, 0.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.10) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        /* Floating orbs */
        .reg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 2;
          animation: regFloat 10s ease-in-out infinite alternate;
        }
        .reg-orb-1 { width: 320px; height: 320px; background: #c7d2fe; top: -60px; right: -60px; animation-delay: 0s; }
        .reg-orb-2 { width: 280px; height: 280px; background: #bfdbfe; bottom: -50px; left: -50px; animation-delay: -4s; }
        .reg-orb-3 { width: 160px; height: 160px; background: #ddd6fe; top: 55%; right: 15%; animation-delay: -7s; }
        @keyframes regFloat {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(-18px, 18px) scale(1.07); }
        }

        /* Card */
        .reg-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.74);
          backdrop-filter: blur(28px) saturate(200%);
          -webkit-backdrop-filter: blur(28px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.88);
          border-radius: 28px;
          padding: 28px 28px 24px;
          box-shadow:
            0 4px 6px rgba(99,102,241,0.04),
            0 24px 64px rgba(99,102,241,0.10),
            0 0 0 1px rgba(255,255,255,0.65) inset;
          transform: translateY(${mounted ? "0" : "28px"});
          opacity: ${mounted ? 1 : 0};
          transition: transform 0.75s cubic-bezier(.22,1,.36,1), opacity 0.75s ease;
        }

        /* Brand */
        .reg-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .reg-gif {
          width: 48px; height: 48px;
          border-radius: 14px;
          object-fit: cover;
          border: 2px solid rgba(99,102,241,0.22);
          box-shadow: 0 4px 14px rgba(99,102,241,0.18);
          flex-shrink: 0;
        }
        .reg-brand-text h1 {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #1e1b4b;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }
        .reg-brand-text p {
          font-size: 11.5px;
          color: #6b7280;
          font-weight: 400;
          letter-spacing: 0.02em;
          margin-top: 2px;
        }

        /* Heading */
        .reg-heading {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 14px;
          letter-spacing: -0.3px;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .reg-heading svg { color: #6366f1; }

        /* Input */
        .reg-field { margin-bottom: 12px; }
        .reg-label {
          display: block;
          font-size: 11.5px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .reg-input-wrap { position: relative; }
        .reg-input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 15px; height: 15px;
          color: #9ca3af;
          pointer-events: none;
          transition: color 0.2s;
        }
        .reg-input {
          width: 100%;
          padding: 11px 14px 11px 37px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #111827;
          background: rgba(249,250,251,0.85);
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .reg-input::placeholder { color: #d1d5db; }
        .reg-input:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .reg-input-wrap:focus-within .reg-input-icon { color: #6366f1; }

        /* Button */
        .reg-btn {
          width: 100%;
          padding: 13px;
          margin-top: 4px;
          font-family: 'Syne', sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #fff;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 55%, #4338ca 100%);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(99,102,241,0.38), 0 1px 4px rgba(99,102,241,0.18);
          transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
        }
        .reg-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%);
          pointer-events: none;
        }
        .reg-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(99,102,241,0.42), 0 2px 6px rgba(99,102,241,0.18);
          filter: brightness(1.07);
        }
        .reg-btn:active:not(:disabled) { transform: translateY(0); }
        .reg-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Sign in link */
        .reg-signin {
          text-align: center;
          font-size: 13px;
          color: #6b7280;
          margin-top: 14px;
        }
        .reg-signin a {
          color: #6366f1;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s;
        }
        .reg-signin a:hover { color: #4f46e5; }

        /* Divider */
        .reg-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 14px 0;
        }
        .reg-divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .reg-divider-text { font-size: 10.5px; color: #d1d5db; font-weight: 500; letter-spacing: 0.06em; white-space: nowrap; }

        /* Perks row */
        .reg-perks {
          display: flex;
          justify-content: space-around;
          margin-top: 14px;
        }
        .reg-perk {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .reg-perk-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .reg-perk span {
          font-size: 10px;
          color: #9ca3af;
          letter-spacing: 0.02em;
          text-align: center;
          line-height: 1.3;
        }

        /* Slider */
        .reg-slider {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 18px;
        }
        .reg-slider-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%, rgba(0,0,0,0.08) 100%);
          border-radius: inherit;
        }
        .reg-slider-caption {
          position: absolute;
          bottom: 10px;
          left: 12px;
          right: 12px;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
        .reg-slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.22);
          border: none;
          border-radius: 50%;
          width: 22px; height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s, background 0.2s;
          backdrop-filter: blur(4px);
        }
        .reg-slider:hover .reg-slider-arrow { opacity: 1; }
        .reg-slider-arrow:hover { background: rgba(255,255,255,0.38); }
        .reg-slider-arrow.left { left: 6px; }
        .reg-slider-arrow.right { right: 6px; }
        .reg-slider-dots {
          position: absolute;
          bottom: 8px;
          right: 10px;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .reg-dot {
          height: 5px;
          border-radius: 3px;
          border: none;
          cursor: pointer;
          transition: width 0.3s, background 0.3s;
          width: 5px;
          background: rgba(255,255,255,0.45);
        }
        .reg-dot.active { width: 16px; background: #a5b4fc; }

        /* Spinner */
        @keyframes regSpin { to { transform: rotate(360deg); } }
        .reg-spin { animation: regSpin 0.7s linear infinite; }

        /* Free badge */
        .reg-free-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #ede9fe, #dbeafe);
          border: 1px solid #c7d2fe;
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 10.5px;
          font-weight: 700;
          color: #4f46e5;
          letter-spacing: 0.04em;
          margin-bottom: 18px;
        }
      `}</style>

      {/* Orbs */}
      <div className="reg-orb reg-orb-1" />
      <div className="reg-orb reg-orb-2" />
      <div className="reg-orb reg-orb-3" />

      <div className="reg-root">
        <div className="reg-card">

          {/* ── Top Slider ── */}
          <div style={{ marginBottom: 20 }}>
            <ImageSlider slides={topSlides} height="155px" interval={4200} />
          </div>

          {/* ── Free Badge ── */}
          <div style={{ textAlign: "center" }}>
            <span className="reg-free-badge">
              ✦ Free Forever · No Credit Card Required
            </span>
          </div>

          {/* ── Brand ── */}
          <div className="reg-brand">
            <img src={PROFILE_GIF} alt="IntellMeet Avatar" className="reg-gif" />
            <div className="reg-brand-text">
              <h1>IntellMeet</h1>
              <p>Start meeting smarter today</p>
            </div>
          </div>

          {/* ── Form ── */}
          <p className="reg-heading">
            <Sparkles size={16} />
            Create your account
          </p>

          <form onSubmit={handleSubmit}>
            {fields.map(({ label, key, type, Icon, placeholder }) => (
              <div className="reg-field" key={key}>
                <label className="reg-label">{label}</label>
                <div className="reg-input-wrap">
                  <Icon className="reg-input-icon" />
                  <input
                    type={type}
                    className="reg-input"
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
                {key === "password" && (
                  <PasswordStrength password={form.password} />
                )}
              </div>
            ))}

            <button type="submit" className="reg-btn" disabled={loading}>
              {loading && <Loader size={15} className="reg-spin" />}
              {loading ? "Creating account…" : "Create Free Account"}
            </button>
          </form>

          <div className="reg-signin">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </div>

          {/* ── Divider ── */}
          <div className="reg-divider">
            <div className="reg-divider-line" />
            <span className="reg-divider-text">WHY TEAMS LOVE INTELLMEET</span>
            <div className="reg-divider-line" />
          </div>

          {/* ── Bottom Slider ── */}
          <ImageSlider slides={bottomSlides} height="108px" interval={3000} />

          {/* ── Perks ── */}
          <div className="reg-perks">
            {[
              { icon: "🤖", label: "AI\nSummaries" },
              { icon: "🔒", label: "E2E\nEncrypted" },
              { icon: "⚡", label: "HD\nVideo" },
              { icon: "🌍", label: "Global\nReach" },
            ].map((p) => (
              <div className="reg-perk" key={p.label}>
                <div
                  className="reg-perk-icon"
                  style={{ background: "rgba(99,102,241,0.08)" }}
                >
                  {p.icon}
                </div>
                <span style={{ whiteSpace: "pre-line" }}>{p.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}