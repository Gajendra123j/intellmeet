import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Video, Mail, Lock, Loader } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fadein">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src=" https://static.vecteezy.com/system/resources/thumbnails/019/493/288/small/black-zoom-meeting-logo-black-zoom-meeting-icon-zoom-symbol-free-free-vector.jpg"alt="IntellMeet Logo" className="mx-auto w-14 h-14 rounded-2xl mb-4" />
          <h1 className="text-3xl font-display font-bold text-gray-900">IntellMeet</h1>
          <p className="text-gray-600 mt-1">AI-Powered Enterprise Meetings</p>
        </div>

        {/* Card */}
<div className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  className="input-field pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-5">
            No account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
              Create one free
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 text-center text-gray-500 text-xs">
          Demo: IntellMeet@example.com / 123456
        </div>
      </div>
    </div>
  );
}
