import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useMeetingStore } from "@/store/meetingStore";
import toast from "react-hot-toast";
import {
  Video, Plus, LogIn, Clock, Users, Sparkles,
  Calendar, CheckCircle, Trash2, ChevronLeft, ChevronRight,
  Zap, Shield, Globe, TrendingUp, ArrowRight, X
} from "lucide-react";

// ─── Slider Data ───────────────────────────────────────────────────────────────
const heroSlides = [
  {
    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&auto=format&fit=crop&q=85",
    title: "Collaborate Without Limits",
    sub: "Real-time AI-powered meetings for modern teams",
    accent: "#38bdf8",
  },
  {
    url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1400&auto=format&fit=crop&q=85",
    title: "AI Summaries, Instantly",
    sub: "Never miss a detail — let IntellMeet capture everything",
    accent: "#a78bfa",
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&fit=crop&q=85",
    title: "Enterprise-Grade Security",
    sub: "End-to-end encrypted. SOC 2 certified. Always private.",
    accent: "#34d399",
  },
];

const bottomSlides = [
  {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&auto=format&fit=crop&q=85",
    label: "500+ Companies Trust IntellMeet",
  },
  {
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&auto=format&fit=crop&q=85",
    label: "Live Transcription in 40+ Languages",
  },
  {
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&auto=format&fit=crop&q=85",
    label: "Zero Lag. Global Infrastructure.",
  },
];

const PROFILE_GIF =
  "https://img.freepik.com/premium-photo/3d-icon-candid-business-meeting-team-discussing-acquisition-terms-modern-meeting-room-ideal_980716-751148.jpg?w=360";

// ─── Hero Slider ───────────────────────────────────────────────────────────────
function HeroSlider() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setCur(p => (p + 1) % heroSlides.length); setFading(false); }, 420);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const go = (dir: 1 | -1) => {
    setFading(true);
    setTimeout(() => { setCur(p => (p + dir + heroSlides.length) % heroSlides.length); setFading(false); }, 320);
  };

  const slide = heroSlides[cur];

  return (
    <div className="db-hero-slider">
      {heroSlides.map((s, i) => (
        <img key={i} src={s.url} alt={s.title}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            opacity: i === cur ? (fading ? 0 : 1) : 0,
            transform: i === cur ? "scale(1)" : "scale(1.04)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        />
      ))}

      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(2,6,23,0.78) 0%, rgba(2,6,23,0.45) 60%, rgba(2,6,23,0.65) 100%)",
      }} />

      {/* Accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, transparent, ${slide.accent}, transparent)`,
        opacity: fading ? 0 : 1, transition: "opacity 0.5s",
      }} />

      {/* Content */}
      <div className="db-hero-content" style={{ opacity: fading ? 0 : 1, transition: "opacity 0.45s" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: `${slide.accent}22`, border: `1px solid ${slide.accent}55`,
          borderRadius: 20, padding: "4px 12px", marginBottom: 10,
        }}>
          <Zap size={11} style={{ color: slide.accent }} />
          <span style={{ fontSize: 11, color: slide.accent, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            AI-Powered Meetings
          </span>
        </div>
        <h2 className="db-hero-title">{slide.title}</h2>
        <p className="db-hero-sub">{slide.sub}</p>
      </div>

      {/* Arrows */}
      <button className="db-slider-arrow" style={{ left: 14 }} onClick={() => go(-1)}><ChevronLeft size={16} /></button>
      <button className="db-slider-arrow" style={{ right: 14 }} onClick={() => go(1)}><ChevronRight size={16} /></button>

      {/* Dots */}
      <div className="db-hero-dots">
        {heroSlides.map((s, i) => (
          <button key={i} onClick={() => setCur(i)}
            style={{
              height: 4, borderRadius: 2, border: "none", cursor: "pointer",
              width: i === cur ? 24 : 8,
              background: i === cur ? s.accent : "rgba(255,255,255,0.3)",
              transition: "width 0.35s, background 0.35s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Bottom Slider ─────────────────────────────────────────────────────────────
function BottomSlider() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setCur(p => (p + 1) % bottomSlides.length); setFading(false); }, 380);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="db-bottom-slider">
      {bottomSlides.map((s, i) => (
        <img key={i} src={s.url} alt={s.label}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            opacity: i === cur ? (fading ? 0 : 1) : 0,
            transition: "opacity 0.55s ease",
          }}
        />
      ))}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.3) 60%)",
      }} />
      <div style={{
        position: "absolute", bottom: 14, left: 18,
        opacity: fading ? 0 : 1, transition: "opacity 0.4s",
      }}>
        <p style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
          {bottomSlides[cur].label}
        </p>
      </div>
      <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: 5 }}>
        {bottomSlides.map((_, i) => (
          <button key={i} onClick={() => setCur(i)}
            style={{
              width: i === cur ? 18 : 5, height: 5, borderRadius: 3,
              border: "none", cursor: "pointer",
              background: i === cur ? "#38bdf8" : "rgba(255,255,255,0.35)",
              transition: "width 0.3s, background 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuthStore();
  const { meetings, fetchMeetings, joinMeeting, deleteMeeting, isLoading } = useMeetingStore();
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [title, setTitle] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { fetchMeetings(); setTimeout(() => setMounted(true), 60); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Enter meeting title");
    setCreating(true);
    try {
      toast.success("Meeting created!");
      setShowCreate(false);
      setTitle("");
      fetchMeetings();
    } catch { toast.error("Failed to create meeting"); }
    finally { setCreating(false); }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return toast.error("Enter meeting code");
    setJoining(true);
    try {
      const meeting = await joinMeeting(joinCode.toUpperCase());
      navigate(`/meeting/${meeting.meetingCode}`);
    } catch { toast.error("Meeting not found"); }
    finally { setJoining(false); }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const stats = [
    { label: "Total Meetings", value: meetings.length, icon: Calendar, color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)" },
    { label: "Active Now", value: meetings.filter(m => m.status === "active").length, icon: Video, color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
    { label: "Completed", value: meetings.filter(m => m.status === "ended").length, icon: CheckCircle, color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Syne:wght@600;700;800&display=swap');

        .db-root {
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
          padding-bottom: 48px;
        }

        /* ── Hero Slider ── */
        .db-hero-slider {
          position: relative;
          width: 100%;
          height: 220px;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
        }
        .db-hero-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 20px 22px;
        }
        .db-hero-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0 0 5px;
          letter-spacing: -0.4px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
        }
        .db-hero-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          font-weight: 400;
          letter-spacing: 0.01em;
        }
        .db-slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.2s;
          opacity: 0;
        }
        .db-hero-slider:hover .db-slider-arrow { opacity: 1; }
        .db-slider-arrow:hover { background: rgba(255,255,255,0.25); }
        .db-hero-dots {
          position: absolute;
          bottom: 14px; right: 18px;
          display: flex; align-items: center; gap: 5px;
        }

        /* ── Top bar ── */
        .db-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : -10}px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .db-topbar-left { display: flex; align-items: center; gap: 12px; }
        .db-logo-gif {
          width: 44px; height: 44px;
          border-radius: 14px;
          object-fit: cover;
          border: 2px solid rgba(56,189,248,0.3);
          box-shadow: 0 0 18px rgba(56,189,248,0.2);
        }
        .db-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.5px;
        }
        .db-brand-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.03em;
          margin-top: 1px;
        }
        .db-live-badge {
          display: flex; align-items: center; gap: 5px;
          background: rgba(52,211,153,0.12);
          border: 1px solid rgba(52,211,153,0.25);
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 11px;
          color: #34d399;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .db-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #34d399;
          animation: dbPulse 1.8s ease-in-out infinite;
        }
        @keyframes dbPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        /* ── Greeting ── */
        .db-greeting {
          margin-bottom: 24px;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : 12}px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .db-greeting h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(22px, 5vw, 32px);
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.6px;
          line-height: 1.15;
        }
        .db-greeting-name { color: #38bdf8; }
        .db-greeting p {
          font-size: 14px;
          color: rgba(255,255,255,0.38);
          margin-top: 5px;
        }

        /* ── Stats ── */
        .db-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : 14}px);
          transition: opacity 0.7s ease 0.18s, transform 0.7s ease 0.18s;
        }
        @media (max-width: 500px) { .db-stats { grid-template-columns: 1fr; } }
        .db-stat-card {
          border-radius: 20px;
          padding: 18px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1px solid;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .db-stat-card:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
        .db-stat-icon {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .db-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
        }
        .db-stat-lbl {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
          margin-top: 3px;
          letter-spacing: 0.02em;
        }

        /* ── Action Buttons ── */
        .db-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          opacity: ${mounted ? 1 : 0};
          transition: opacity 0.7s ease 0.26s;
        }
        .db-btn-new {
          flex: 1;
          min-width: 140px;
          padding: 14px 20px;
          background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 60%, #1d4ed8 100%);
          border: none;
          border-radius: 16px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 6px 20px rgba(14,165,233,0.35);
          transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
          position: relative; overflow: hidden;
          letter-spacing: 0.02em;
        }
        .db-btn-new::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%);
        }
        .db-btn-new:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(14,165,233,0.45); filter: brightness(1.07); }
        .db-btn-new:active { transform: translateY(0); }

        .db-btn-join {
          flex: 1;
          min-width: 140px;
          padding: 14px 20px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          backdrop-filter: blur(10px);
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          letter-spacing: 0.02em;
        }
        .db-btn-join:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-2px);
        }

        /* ── Modal Form ── */
        .db-modal-bg {
          position: fixed; inset: 0;
          background: rgba(2,6,23,0.7);
          backdrop-filter: blur(12px);
          z-index: 100;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: dbFadeIn 0.25s ease;
        }
        @keyframes dbFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .db-modal {
          background: rgba(15,23,42,0.95);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 28px;
          padding: 32px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.7);
          animation: dbSlideUp 0.3s cubic-bezier(.22,1,.36,1);
        }
        @keyframes dbSlideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .db-modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #f8fafc;
          margin-bottom: 6px;
          display: flex; align-items: center; gap: 10px;
        }
        .db-modal-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 20px; }
        .db-modal-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 14px;
        }
        .db-modal-input::placeholder { color: rgba(255,255,255,0.2); }
        .db-modal-input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56,189,248,0.12);
        }
        .db-modal-actions { display: flex; gap: 10px; }
        .db-modal-submit {
          flex: 1;
          padding: 13px;
          background: linear-gradient(135deg, #0ea5e9, #2563eb);
          border: none; border-radius: 14px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(14,165,233,0.3);
          transition: filter 0.15s, transform 0.15s;
        }
        .db-modal-submit:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .db-modal-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .db-modal-cancel {
          padding: 13px 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: rgba(255,255,255,0.5);
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .db-modal-cancel:hover { background: rgba(255,255,255,0.09); color: #e2e8f0; }

        /* ── Meetings section ── */
        .db-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
          letter-spacing: -0.3px;
        }
        .db-section-count {
          font-size: 12px;
          background: rgba(56,189,248,0.12);
          color: #38bdf8;
          border: 1px solid rgba(56,189,248,0.2);
          border-radius: 20px;
          padding: 2px 10px;
          font-weight: 600;
        }

        /* ── Meeting Card ── */
        .db-meeting-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 18px 20px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .db-meeting-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(56,189,248,0.03) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .db-meeting-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        .db-meeting-card:hover::before { opacity: 1; }
        .db-meeting-icon {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          border: 1.5px solid;
        }
        .db-meeting-body { flex: 1; min-width: 0; }
        .db-meeting-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 5px;
          transition: color 0.15s;
        }
        .db-meeting-card:hover .db-meeting-title { color: #38bdf8; }
        .db-meeting-meta {
          display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
          font-size: 12px; color: rgba(255,255,255,0.35);
        }
        .db-meeting-code {
          font-family: 'DM Mono', monospace;
          background: rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 2px 8px;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.05em;
        }
        .db-status-pill {
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: 1px solid;
        }
        .db-meeting-actions {
          display: flex; gap: 8px; flex-shrink: 0;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .db-meeting-card:hover .db-meeting-actions { opacity: 1; }
        .db-icon-btn {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          background: transparent;
        }
        .db-icon-btn:hover { transform: scale(1.1); }

        /* ── Empty state ── */
        .db-empty {
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 60px 30px;
          text-align: center;
        }
        .db-empty-icon {
          width: 72px; height: 72px; border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
        }
        .db-empty h3 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #f1f5f9; margin-bottom: 8px; }
        .db-empty p { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 24px; }

        /* ── Spinner ── */
        @keyframes dbSpin { to { transform: rotate(360deg); } }
        .db-spinner {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 3px solid rgba(56,189,248,0.15);
          border-top-color: #38bdf8;
          animation: dbSpin 0.9s linear infinite;
          margin: 0 auto 14px;
        }

        /* ── Bottom Slider ── */
        .db-bottom-slider {
          position: relative;
          width: 100%;
          height: 130px;
          border-radius: 20px;
          overflow: hidden;
          margin-top: 32px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
        }

        /* ── Trust row ── */
        .db-trust {
          display: flex; justify-content: space-around;
          margin-top: 18px;
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
        }
        .db-trust-item {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
        }
        .db-trust-icon {
          width: 32px; height: 32px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .db-trust-lbl { font-size: 10px; color: rgba(255,255,255,0.35); font-weight: 500; text-align: center; line-height: 1.3; }

        @keyframes dbModalSpin { to { transform: rotate(360deg); } }
        .db-modal-spin { animation: dbModalSpin 0.7s linear infinite; }
      `}</style>

      <div className="db-root">

        {/* ── Top Bar ── */}
        <div className="db-topbar">
          <div className="db-topbar-left">
            <img src={PROFILE_GIF} alt="IntellMeet AI" className="db-logo-gif" />
            <div>
              <div className="db-brand-name">IntellMeet</div>
              <div className="db-brand-sub">AI-Powered Enterprise Meetings</div>
            </div>
          </div>
          <div className="db-live-badge">
            <div className="db-live-dot" />
            LIVE
          </div>
        </div>

        {/* ── Hero Slider ── */}
        <HeroSlider />

        {/* ── Greeting ── */}
        <div className="db-greeting">
          <h1>
            {greeting}, <span className="db-greeting-name">{user?.name?.split(" ")[0] || "there"}</span> 👋
          </h1>
          <p>Manage your meetings and track AI-powered insights.</p>
        </div>

        {/* ── Stats ── */}
        <div className="db-stats">
          {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className="db-stat-card" style={{ background: bg, borderColor: border }}>
              <div className="db-stat-icon" style={{ background: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <div className="db-stat-val" style={{ color }}>{value}</div>
                <div className="db-stat-lbl">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Action Buttons ── */}
        <div className="db-actions">
          <button className="db-btn-new" onClick={() => setShowCreate(true)}>
            <Plus size={18} /> New Meeting
          </button>
          <button className="db-btn-join" onClick={() => setShowJoin(true)}>
            <LogIn size={18} /> Join Meeting
          </button>
        </div>

        {/* ── Meetings List ── */}
        <div className="db-section-title">
          Your Meetings
          {meetings.length > 0 && <span className="db-section-count">{meetings.length}</span>}
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div className="db-spinner" />
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Loading your meetings…</p>
          </div>
        ) : meetings.length === 0 ? (
          <div className="db-empty">
            <div className="db-empty-icon"><Video size={28} style={{ color: "rgba(255,255,255,0.25)" }} /></div>
            <h3>No meetings yet</h3>
            <p>Create your first meeting to get started with IntellMeet</p>
            <button className="db-btn-new" style={{ display: "inline-flex", width: "auto", padding: "12px 28px" }} onClick={() => setShowCreate(true)}>
              <Plus size={16} /> Create First Meeting
            </button>
          </div>
        ) : (
          <div>
            {meetings.map((meeting) => {
              const isActive = meeting.status === "active";
              const isEnded = meeting.status === "ended";
              const iconColor = isActive ? "#34d399" : isEnded ? "#94a3b8" : "#38bdf8";
              const iconBorder = isActive ? "rgba(52,211,153,0.3)" : isEnded ? "rgba(148,163,184,0.2)" : "rgba(56,189,248,0.3)";
              const iconBg = isActive ? "rgba(52,211,153,0.1)" : isEnded ? "rgba(148,163,184,0.08)" : "rgba(56,189,248,0.1)";
              const pillColor = isActive ? "#34d399" : isEnded ? "#64748b" : "#38bdf8";
              const pillBorder = isActive ? "rgba(52,211,153,0.25)" : isEnded ? "rgba(100,116,139,0.2)" : "rgba(56,189,248,0.25)";
              const pillBg = isActive ? "rgba(52,211,153,0.1)" : isEnded ? "rgba(100,116,139,0.1)" : "rgba(56,189,248,0.1)";

              return (
                <div
                  key={meeting._id}
                  className="db-meeting-card"
                  onClick={() => !isEnded && navigate(`/meeting/${meeting.meetingCode}`)}
                >
                  <div className="db-meeting-icon" style={{ background: iconBg, borderColor: iconBorder }}>
                    <Video size={22} style={{ color: iconColor }} />
                  </div>

                  <div className="db-meeting-body">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                      <span className="db-meeting-title" style={{ marginBottom: 0 }}>{meeting.title}</span>
                      <span className="db-status-pill" style={{ color: pillColor, borderColor: pillBorder, background: pillBg }}>
                        {meeting.status}
                      </span>
                      {meeting.summary && (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          background: "rgba(167,139,250,0.1)", color: "#a78bfa",
                          border: "1px solid rgba(167,139,250,0.25)", borderRadius: 20,
                          padding: "2px 9px", fontSize: 10, fontWeight: 700,
                        }}>
                          <Sparkles size={9} /> AI Summary
                        </span>
                      )}
                    </div>
                    <div className="db-meeting-meta">
                      <span className="db-meeting-code">#{meeting.meetingCode}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Users size={11} /> {meeting.participants?.length || 0}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={11} /> {new Date(meeting.createdAt).toLocaleDateString()}
                      </span>
                      {meeting.duration && <span>{meeting.duration} min</span>}
                    </div>
                  </div>

                  <div className="db-meeting-actions">
                    {!isEnded && (
                      <button
                        className="db-icon-btn"
                        style={{ color: "#38bdf8", borderColor: "rgba(56,189,248,0.25)", background: "rgba(56,189,248,0.08)" }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/meeting/${meeting.meetingCode}`); }}
                        title="Join Meeting"
                      >
                        <ArrowRight size={16} />
                      </button>
                    )}
                    {isEnded && (
                      <button
                        className="db-icon-btn"
                        style={{ color: "#a78bfa", borderColor: "rgba(167,139,250,0.25)", background: "rgba(167,139,250,0.08)" }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/summary/${meeting._id}`); }}
                        title="AI Summary"
                      >
                        <Sparkles size={16} />
                      </button>
                    )}
                    <button
                      className="db-icon-btn"
                      style={{ color: "#f87171", borderColor: "rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.08)" }}
                      onClick={(e) => { e.stopPropagation(); if (confirm("Delete this meeting?")) deleteMeeting(meeting._id); }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bottom Slider ── */}
        <BottomSlider />

        {/* ── Trust Row ── */}
        <div className="db-trust">
          {[
            { icon: "🤖", label: "AI\nSummaries" },
            { icon: "🔒", label: "E2E\nEncrypted" },
            { icon: "⚡", label: "HD\nVideo" },
            { icon: "🌍", label: "40+\nLanguages" },
            { icon: "📊", label: "Analytics" },
          ].map(p => (
            <div className="db-trust-item" key={p.label}>
              <div className="db-trust-icon" style={{ background: "rgba(255,255,255,0.04)" }}>{p.icon}</div>
              <span className="db-trust-lbl" style={{ whiteSpace: "pre-line" }}>{p.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ── Create Modal ── */}
      {showCreate && (
        <div className="db-modal-bg" onClick={() => setShowCreate(false)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div className="db-modal-title">
                <span style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus size={18} style={{ color: "#38bdf8" }} />
                </span>
                New Meeting
              </div>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <p className="db-modal-sub">Give your meeting a clear title so participants know what to expect.</p>
            <form onSubmit={handleCreate}>
              <input
                className="db-modal-input"
                placeholder="e.g. Q3 Strategy Review"
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
              />
              <div className="db-modal-actions">
                <button type="submit" className="db-modal-submit" disabled={creating}>
                  {creating ? "Creating…" : "Create Meeting"}
                </button>
                <button type="button" className="db-modal-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Join Modal ── */}
      {showJoin && (
        <div className="db-modal-bg" onClick={() => setShowJoin(false)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div className="db-modal-title">
                <span style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LogIn size={18} style={{ color: "#34d399" }} />
                </span>
                Join Meeting
              </div>
              <button onClick={() => setShowJoin(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <p className="db-modal-sub">Enter the meeting code shared by the host.</p>
            <form onSubmit={handleJoin}>
              <input
                className="db-modal-input"
                placeholder="AB12-CD34"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                style={{ fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 18 }}
                autoFocus
              />
              <div className="db-modal-actions">
                <button type="submit" className="db-modal-submit" style={{ background: "linear-gradient(135deg, #34d399, #059669)" }} disabled={joining}>
                  {joining ? "Joining…" : "Join Meeting"}
                </button>
                <button type="button" className="db-modal-cancel" onClick={() => setShowJoin(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}