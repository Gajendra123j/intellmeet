import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Mail, Lock, Loader, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Slider images ────────────────────────────────────────────────────────────
const topSlides = [
  {
    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=80",
    caption: "Seamless Team Collaboration",
  },
  {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
    caption: "AI-Powered Insights",
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
    caption: "Enterprise-Grade Security",
  },
];

const bottomSlides = [
  {
    url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&auto=format&fit=crop&q=80",
    label: "500+ Companies Trust Us",
  },
  {
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
    label: "Real-Time Transcription",
  },
  {
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80",
    label: "Global Reach, Zero Lag",
  },
];

// ─── Profile GIF (animated avatar) ───────────────────────────────────────────
const PROFILE_GIF =
  "https://img.freepik.com/premium-photo/3d-icon-candid-business-meeting-team-discussing-acquisition-terms-modern-meeting-room-ideal_980716-751148.jpg?w=360";

// ─── Mini Slider Component ────────────────────────────────────────────────────
function ImageSlider({
  slides,
  height,
  interval = 3500,
  showCaption = true,
}: {
  slides: { url: string; caption?: string; label?: string }[];
  height: string;
  interval?: number;
  showCaption?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, interval);
    return () => clearInterval(timer);
  }, [slides.length, interval]);

  const go = (dir: 1 | -1) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent((p) => (p + dir + slides.length) % slides.length);
      setAnimating(false);
    }, 300);
  };

  const text = slides[current].caption || slides[current].label || "";

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl group"
      style={{ height }}
    >
      {/* Images */}
      {slides.map((s, i) => (
        <img
          key={i}
          src={s.url}
          alt={s.caption || s.label || ""}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          style={{
            opacity: i === current ? (animating ? 0 : 1) : 0,
            transform: i === current ? "scale(1)" : "scale(1.05)",
            transitionDuration: "700ms",
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

      {/* Caption */}
      {showCaption && text && (
        <div className="absolute bottom-3 left-4 right-4">
          <p
            className="text-white text-xs font-semibold tracking-widest uppercase opacity-90"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            {text}
          </p>
        </div>
      )}

      {/* Arrows */}
      <button
        onClick={() => go(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <ChevronLeft className="w-3 h-3 text-white" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <ChevronRight className="w-3 h-3 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 right-3 flex gap-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? "16px" : "5px",
              height: "5px",
              background: i === current ? "#60a5fa" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Fill all fields");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Syne:wght@600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          background: #f0f4ff;
          position: relative;
          overflow: hidden;
          padding: 24px 16px;
        }

        /* Animated mesh background */
        .login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, #dbeafe 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, #e0e7ff 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 50% 50%, #f0f9ff 0%, transparent 70%);
          animation: meshShift 12s ease-in-out infinite alternate;
          z-index: 0;
        }

        /* ─── Grid Lines ─────────────────────────────────────────────────── */
        .login-root::after {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(99, 120, 220, 0.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 120, 220, 0.10) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        @keyframes meshShift {
          0%   { filter: hue-rotate(0deg) brightness(1); }
          100% { filter: hue-rotate(15deg) brightness(1.04); }
        }

        /* Floating orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 2;
          animation: float 8s ease-in-out infinite alternate;
        }
        .orb-1 { width: 340px; height: 340px; background: #bfdbfe; top: -80px; left: -80px; animation-delay: 0s; }
        .orb-2 { width: 260px; height: 260px; background: #c7d2fe; bottom: -60px; right: -60px; animation-delay: -3s; }
        .orb-3 { width: 180px; height: 180px; background: #bae6fd; top: 40%; left: 60%; animation-delay: -5s; }

        @keyframes float {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, -20px) scale(1.06); }
        }

        /* Card */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 28px;
          padding: 28px 28px 24px;
          box-shadow:
            0 4px 6px rgba(59,130,246,0.04),
            0 20px 60px rgba(59,130,246,0.10),
            0 0 0 1px rgba(255,255,255,0.6) inset;
          transform: translateY(${mounted ? "0" : "24px"});
          opacity: ${mounted ? 1 : 0};
          transition: transform 0.7s cubic-bezier(.22,1,.36,1), opacity 0.7s ease;
        }

        /* Brand row */
        .brand-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .brand-gif {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          object-fit: cover;
          border: 2px solid rgba(59,130,246,0.2);
          box-shadow: 0 4px 12px rgba(59,130,246,0.18);
          flex-shrink: 0;
        }
        .brand-text h1 {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #1e3a5f;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }
        .brand-text p {
          font-size: 11.5px;
          color: #6b7280;
          font-weight: 400;
          letter-spacing: 0.02em;
          margin-top: 2px;
        }

        /* Section heading */
        .section-heading {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          letter-spacing: -0.3px;
        }

        /* Input group */
        .input-group { margin-bottom: 14px; }
        .input-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          width: 16px;
          height: 16px;
          pointer-events: none;
          transition: color 0.2s;
        }
        .input-wrap:focus-within .input-icon { color: #3b82f6; }

        .input-field {
          width: 100%;
          padding: 11px 14px 11px 38px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #111827;
          background: rgba(249,250,251,0.8);
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .input-field::placeholder { color: #d1d5db; }
        .input-field:focus {
          border-color: #3b82f6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }

        /* Button */
        .btn-login {
          width: 100%;
          padding: 13px;
          margin-top: 6px;
          font-family: 'Syne', sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #fff;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #1e40af 100%);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35), 0 1px 3px rgba(37,99,235,0.2);
          transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
        }
        .btn-login::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .btn-login:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(37,99,235,0.40), 0 2px 6px rgba(37,99,235,0.2);
          filter: brightness(1.06);
        }
        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Footer link */
        .signup-row {
          text-align: center;
          font-size: 13px;
          color: #6b7280;
          margin-top: 16px;
        }
        .signup-row a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s;
        }
        .signup-row a:hover { color: #1d4ed8; }

        /* Demo hint */
        .demo-hint {
          margin-top: 10px;
          text-align: center;
          font-size: 11px;
          color: #9ca3af;
          background: rgba(243,244,246,0.7);
          border-radius: 8px;
          padding: 7px 12px;
          border: 1px dashed #e5e7eb;
        }
        .demo-hint strong { color: #6b7280; font-weight: 600; }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 16px 0;
        }
        .divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .divider-text { font-size: 11px; color: #d1d5db; font-weight: 500; letter-spacing: 0.05em; }

        /* Trust badges */
        .trust-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 14px;
        }
        .trust-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        .trust-badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
        }
        .trust-badge span {
          font-size: 10px;
          color: #9ca3af;
          letter-spacing: 0.03em;
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; }
      `}</style>

      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="login-root">
        <div className="login-card">

          {/* ── Top Image Slider ── */}
          <div style={{ marginBottom: "20px" }}>
            <ImageSlider slides={topSlides} height="160px" interval={4000} />
          </div>

          {/* ── Brand Row ── */}
          <div className="brand-row">
            <img
              src={PROFILE_GIF}
              alt="IntellMeet AI Avatar"
              className="brand-gif"
            />
            <div className="brand-text">
              <h1>IntellMeet</h1>
              <p>AI-Powered Enterprise Meetings</p>
            </div>
          </div>

          {/* ── Form ── */}
          <p className="section-heading">Sign in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-wrap">
                <Mail className="input-icon" />
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrap">
                <Lock className="input-icon" />
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading && (
                <Loader
                  className="spin"
                  style={{ width: 16, height: 16 }}
                />
              )}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="signup-row">
            No account?{" "}
            <Link to="/register">Create one free</Link>
          </div>

          {/* ── Divider ── */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">TRUSTED BY TEAMS WORLDWIDE</span>
            <div className="divider-line" />
          </div>

          {/* ── Bottom Image Slider ── */}
          <ImageSlider slides={bottomSlides} height="110px" interval={3200} />

          {/* ── Trust indicators ── */}
          <div className="trust-row">
            {["SOC 2 Certified", "99.9% Uptime", "End-to-End Encrypted"].map((t) => (
              <div className="trust-badge" key={t}>
                <div className="trust-badge-dot" />
                <span>{t}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}