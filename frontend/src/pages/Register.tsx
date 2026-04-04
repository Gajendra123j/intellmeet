import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Video, User, Mail, Lock, Loader } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fadein">
        <div className="text-center mb-8">
          <img src="https://static.vecteezy.com/system/resources/thumbnails/019/493/288/small/black-zoom-meeting-logo-black-zoom-meeting-icon-zoom-symbol-free-free-vector.jpg" alt="IntellMeet Logo" className="mx-auto w-14 h-14 rounded-2xl mb-4" />
          <h1 className="text-3xl font-display font-bold text-gray-900">IntellMeet</h1>
          <p className="text-gray-600 mt-1">Start meeting smarter today</p>
        </div>

<div className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name", key: "name", type: "text", icon: User, placeholder: "John Doe" },
              { label: "Email", key: "email", type: "email", icon: Mail, placeholder: "you@IntellMeet.com" },
              { label: "Password", key: "password", type: "password", icon: Lock, placeholder: "Min. 6 characters" },
            ].map(({ label, key, type, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="block text-sm text-gray-700 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={type}
                    className="input-field pl-10"
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-gray-600 text-sm mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
