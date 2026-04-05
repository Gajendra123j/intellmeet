import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import api from "../services/api";
import toast from "react-hot-toast";
import { Camera, Mail, Save, Loader, LogOut, Shield, Pencil } from "lucide-react";

// ─── Default avatar by role ────────────────────────────────────────────────────
const ROLE_EMOJI: Record<string, string> = {
  admin:     "👑",
  moderator: "🛡️",
  user:      "🧑‍💼",
};

const ROLE_GRADIENT: Record<string, string> = {
  admin:     "linear-gradient(135deg, #f59e0b, #d97706)",
  moderator: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
  user:      "linear-gradient(135deg, #38bdf8, #0ea5e9)",
};

const ROLE_SHADOW: Record<string, string> = {
  admin:     "rgba(245,158,11,0.35)",
  moderator: "rgba(139,92,246,0.35)",
  user:      "rgba(56,189,248,0.35)",
};

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const role = user?.role || "user";
  const roleEmoji = ROLE_EMOJI[role] ?? "🧑";
  const hasAvatar = !!avatarPreview;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      form.append("name", name);
      if (avatarFile) form.append("avatar", avatarFile);
      const { data } = await api.put("/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ name: data.user.name, avatar: data.user.avatar });
      toast.success("Profile updated!");
    } catch {
      toast.error("Update failed");
    } finally { setSaving(false); }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out. See you soon!");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    } finally { setLoggingOut(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Syne:wght@600;700;800&display=swap');

        .pf-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: linear-gradient(160deg, #0a0f1e 0%, #0d1525 50%, #080d1a 100%);
          padding: 32px 20px 56px;
          position: relative;
          overflow-x: hidden;
        }

        /* Mesh glow */
        .pf-root::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 55% 40% at 15% 20%, rgba(56,189,248,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 45% 35% at 85% 75%, rgba(139,92,246,0.07) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
          animation: pfMesh 14s ease-in-out infinite alternate;
        }
        @keyframes pfMesh {
          0%   { opacity: 1; }
          100% { opacity: 0.6; filter: hue-rotate(20deg); }
        }

        /* Floating grid lines */
        .pf-root::after {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        .pf-inner {
          position: relative; z-index: 1;
          max-width: 560px;
          margin: 0 auto;
        }

        /* ── Page header ── */
        .pf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .pf-page-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 6vw, 36px);
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.8px;
          line-height: 1;
        }
        .pf-page-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin-top: 5px;
        }

        /* Logout button (header) */
        .pf-logout-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 18px;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 14px;
          color: #fca5a5;
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .pf-logout-btn:hover {
          background: rgba(248,113,113,0.15);
          border-color: rgba(248,113,113,0.4);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(248,113,113,0.18);
        }
        .pf-logout-btn:active { transform: translateY(0); }

        /* ── Card ── */
        .pf-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 36px 32px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 24px 64px rgba(0,0,0,0.5);
        }

        /* ── Avatar area ── */
        .pf-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .pf-avatar-ring {
          position: relative;
        }
        .pf-avatar-img {
          width: 110px; height: 110px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(255,255,255,0.12);
          box-shadow: 0 0 0 6px rgba(56,189,248,0.1), 0 16px 40px rgba(0,0,0,0.5);
          display: block;
        }
        /* Default emoji avatar */
        .pf-avatar-default {
          width: 110px; height: 110px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 52px;
          border: 3px solid rgba(255,255,255,0.1);
          box-shadow: 0 0 0 6px rgba(56,189,248,0.08), 0 16px 40px rgba(0,0,0,0.5);
          position: relative;
        }
        .pf-avatar-default::after {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%;
          background: conic-gradient(from 180deg, rgba(56,189,248,0.5), rgba(139,92,246,0.5), rgba(56,189,248,0.5));
          z-index: -1;
          animation: pfSpin 6s linear infinite;
        }
        @keyframes pfSpin { to { transform: rotate(360deg); } }

        .pf-camera-btn {
          position: absolute;
          bottom: 2px; right: 2px;
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #38bdf8, #2563eb);
          border: 2px solid rgba(10,15,30,0.9);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(56,189,248,0.35);
        }
        .pf-camera-btn:hover { transform: scale(1.15); box-shadow: 0 6px 18px rgba(56,189,248,0.5); }

        .pf-user-name {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.4px;
        }
        .pf-user-email {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
        }

        /* ── Section label ── */
        .pf-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        /* ── Input ── */
        .pf-field { margin-bottom: 18px; }
        .pf-input-wrap { position: relative; }
        .pf-input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          pointer-events: none;
          transition: color 0.2s;
        }
        .pf-input-wrap:focus-within .pf-input-icon { color: #38bdf8; }
        .pf-input {
          width: 100%;
          padding: 13px 14px 13px 44px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .pf-input::placeholder { color: rgba(255,255,255,0.2); }
        .pf-input:focus {
          border-color: #38bdf8;
          background: rgba(56,189,248,0.05);
          box-shadow: 0 0 0 3px rgba(56,189,248,0.1);
        }
        .pf-input:read-only {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .pf-input:read-only:focus {
          border-color: rgba(255,255,255,0.09);
          box-shadow: none;
          background: rgba(255,255,255,0.05);
        }
        .pf-input-hint {
          font-size: 11.5px;
          color: rgba(255,255,255,0.25);
          margin-top: 5px;
          padding-left: 2px;
        }

        /* ── Role badge ── */
        .pf-role-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          margin-bottom: 22px;
        }
        .pf-role-left {
          display: flex; align-items: center; gap: 10px;
        }
        .pf-role-icon {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .pf-role-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .pf-role-value {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          color: #f1f5f9;
          text-transform: capitalize;
        }
        .pf-role-pill {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #fff;
          box-shadow: 0 4px 14px;
        }

        /* ── Save button ── */
        .pf-save-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 55%, #1d4ed8 100%);
          border: none; border-radius: 16px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          letter-spacing: 0.02em;
          position: relative; overflow: hidden;
          box-shadow: 0 6px 20px rgba(14,165,233,0.35);
          transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
          margin-bottom: 14px;
        }
        .pf-save-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%);
        }
        .pf-save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(14,165,233,0.45);
          filter: brightness(1.07);
        }
        .pf-save-btn:active:not(:disabled) { transform: translateY(0); }
        .pf-save-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* ── Bottom logout ── */
        .pf-logout-full {
          width: 100%;
          padding: 13px;
          background: rgba(248,113,113,0.07);
          border: 1.5px solid rgba(248,113,113,0.18);
          border-radius: 16px;
          color: #fca5a5;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          letter-spacing: 0.02em;
          transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .pf-logout-full:hover {
          background: rgba(248,113,113,0.13);
          border-color: rgba(248,113,113,0.35);
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(248,113,113,0.18);
        }
        .pf-logout-full:active { transform: translateY(0); }

        /* ── Confirm dialog ── */
        .pf-confirm-bg {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(14px);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: pfFadeIn 0.22s ease;
        }
        @keyframes pfFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .pf-confirm-box {
          background: rgba(12,18,36,0.98);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 24px;
          padding: 32px;
          max-width: 380px; width: 100%;
          box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset;
          animation: pfSlideUp 0.3s cubic-bezier(.22,1,.36,1);
        }
        @keyframes pfSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .pf-confirm-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.2);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .pf-confirm-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800;
          color: #f8fafc;
          margin-bottom: 8px;
        }
        .pf-confirm-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .pf-confirm-btns { display: flex; gap: 10px; }
        .pf-confirm-yes {
          flex: 1;
          padding: 13px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none; border-radius: 14px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          box-shadow: 0 4px 14px rgba(239,68,68,0.3);
          transition: filter 0.15s, transform 0.15s;
        }
        .pf-confirm-yes:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .pf-confirm-yes:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .pf-confirm-no {
          padding: 13px 22px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: rgba(255,255,255,0.5);
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .pf-confirm-no:hover { background: rgba(255,255,255,0.09); color: #e2e8f0; }

        /* ── Spinner ── */
        @keyframes pfSpin2 { to { transform: rotate(360deg); } }
        .pf-spin { animation: pfSpin2 0.75s linear infinite; }
      `}</style>

      <div className="pf-root">
        <div className="pf-inner">

          {/* ── Header ── */}
          <div className="pf-header">
            <div>
              <h1 className="pf-page-title">Your Profile</h1>
              <p className="pf-page-sub">Manage your account settings</p>
            </div>
            <button className="pf-logout-btn" onClick={() => setShowLogoutConfirm(true)}>
              <LogOut size={15} />
              Sign Out
            </button>
          </div>

          {/* ── Card ── */}
          <div className="pf-card">
            <form onSubmit={handleSave}>

              {/* ── Avatar ── */}
              <div className="pf-avatar-section">
                <div className="pf-avatar-ring">
                  {hasAvatar ? (
                    <img src={avatarPreview} alt="Avatar" className="pf-avatar-img" />
                  ) : (
                    <div
                      className="pf-avatar-default"
                      style={{ background: "rgba(255,255,255,0.04)", border: "3px solid rgba(255,255,255,0.1)" }}
                    >
                      {roleEmoji}
                    </div>
                  )}
                  <button
                    type="button"
                    className="pf-camera-btn"
                    onClick={() => fileRef.current?.click()}
                    title="Change photo"
                  >
                    <Camera size={15} color="#fff" />
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
                <div style={{ textAlign: "center" }}>
                  <div className="pf-user-name">{user?.name || "Your Name"}</div>
                  <div className="pf-user-email">{user?.email}</div>
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(56,189,248,0.08)",
                    border: "1px solid rgba(56,189,248,0.18)",
                    borderRadius: 20, padding: "6px 16px",
                    color: "#7dd3fc", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(56,189,248,0.14)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(56,189,248,0.08)")}
                >
                  <Pencil size={12} /> Change Photo
                </button>
              </div>

              {/* ── Name ── */}
              <div className="pf-field">
                <label className="pf-label">Full Name</label>
                <div className="pf-input-wrap">
                  <span className="pf-input-icon" style={{ fontSize: 17 }}>👤</span>
                  <input
                    type="text"
                    className="pf-input"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* ── Email ── */}
              <div className="pf-field">
                <label className="pf-label">Email Address</label>
                <div className="pf-input-wrap">
                  <Mail className="pf-input-icon" size={16} />
                  <input
                    type="email"
                    className="pf-input"
                    value={user?.email || ""}
                    readOnly
                    placeholder="Email cannot be changed"
                  />
                </div>
                <p className="pf-input-hint">Your email is linked to your account and cannot be modified.</p>
              </div>

              {/* ── Role ── */}
              <div className="pf-role-row">
                <div className="pf-role-left">
                  <div className="pf-role-icon" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <Shield size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
                  </div>
                  <div>
                    <div className="pf-role-label">Account Role</div>
                    <div className="pf-role-value">{role}</div>
                  </div>
                </div>
                <span
                  className="pf-role-pill"
                  style={{
                    background: ROLE_GRADIENT[role] ?? ROLE_GRADIENT.user,
                    boxShadow: `0 4px 14px ${ROLE_SHADOW[role] ?? ROLE_SHADOW.user}`,
                  }}
                >
                  {roleEmoji} {role}
                </span>
              </div>

              {/* ── Save ── */}
              <button type="submit" className="pf-save-btn" disabled={saving}>
                {saving
                  ? <><Loader size={17} className="pf-spin" /> Saving…</>
                  : <><Save size={17} /> Save Changes</>
                }
              </button>

              {/* ── Divider ── */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 14px" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 600, letterSpacing: "0.06em" }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* ── Logout (bottom) ── */}
              <button
                type="button"
                className="pf-logout-full"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut size={16} />
                Sign Out of IntellMeet
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* ── Logout Confirm Modal ── */}
      {showLogoutConfirm && (
        <div className="pf-confirm-bg" onClick={() => setShowLogoutConfirm(false)}>
          <div className="pf-confirm-box" onClick={e => e.stopPropagation()}>
            <div className="pf-confirm-icon">
              <LogOut size={24} style={{ color: "#f87171" }} />
            </div>
            <div className="pf-confirm-title">Sign out?</div>
            <p className="pf-confirm-sub">
              You'll be returned to the login screen. Any unsaved changes to your profile will be lost.
            </p>
            <div className="pf-confirm-btns">
              <button className="pf-confirm-yes" disabled={loggingOut} onClick={handleLogout}>
                {loggingOut
                  ? <><Loader size={14} className="pf-spin" /> Signing out…</>
                  : <><LogOut size={14} /> Yes, Sign Out</>
                }
              </button>
              <button className="pf-confirm-no" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}