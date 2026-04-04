import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import api from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Camera, User, Mail, Save, Loader } from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 md:p-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl mb-8">Your Profile</h1>

        <div className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-3xl p-10 animate-fadein hover:shadow-3xl transition-all">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4 mb-12">
              <div className="relative group">
                {avatarPreview ? (
                  <img src={avatarPreview} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/20 shadow-2xl ring-4 ring-transparent group-hover:ring-blue-500/30 transition-all" alt="Avatar" />
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl ring-4 ring-transparent group-hover:ring-blue-500/30 transition-all">
                    <User className="w-12 h-12 md:w-16 md:h-16 text-blue-300" />
                  </div>
                )}
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-2xl border-2 border-white/20 group-hover:scale-110 transition-all hover:shadow-3xl">
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <p className="text-slate-400 text-sm md:text-base text-center max-w-md">Click camera icon to upload new profile photo</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xl font-semibold text-slate-300 mb-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <input 
                  type="text" 
                  className="input-field pl-16 h-16 md:h-20 text-lg md:text-xl placeholder-slate-300 font-semibold" 
                  placeholder="Enter your full name"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-xl font-semibold text-slate-300 mb-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <input 
                  type="email" 
                  className="input-field pl-16 h-16 md:h-20 text-lg md:text-xl bg-slate-800/50 text-slate-200 opacity-75 cursor-not-allowed" 
                  value={user?.email || ""} 
                  readOnly 
                  placeholder="Email cannot be changed"
                />
              </div>
              <p className="text-slate-500 text-sm md:text-base mt-2 pl-1">Your email address is linked to your account and cannot be modified</p>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <span className="text-lg font-semibold text-slate-300 w-24">Role:</span>
              <span className={`px-6 py-3 rounded-2xl text-lg font-bold shadow-lg capitalize text-white tracking-wide ${
                user?.role === 'admin' ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                user?.role === 'moderator' ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 
                'bg-gradient-to-r from-blue-500 to-sky-500'
              }`}>
                {user?.role || 'user'}
              </span>
            </div>

            <button 
              type="submit" 
              disabled={saving} 
              className="btn-primary w-full h-16 md:h-20 text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5 transition-all group"
            >
              {saving ? (
                <>
                  <Loader className="w-6 h-6 md:w-7 md:h-7 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-6 h-6 md:w-7 md:h-7" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
