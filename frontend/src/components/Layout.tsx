import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useMeetingStore } from "@/store/meetingStore";
import { Video, Plus, LogIn, User, Menu, X, LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const { createMeeting } = useMeetingStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [title, setTitle] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const meeting = await createMeeting({ title });
      setShowCreate(false);
      setTitle("");
      navigate(`/meeting/${meeting.meetingCode}`);
    } catch {
      // toast handled in store
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    // Join logic in page or store
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex">
      {/* Left Sidebar - Always visible */}
      <aside className="w-64 md:w-72 bg-slate-900/95 backdrop-blur-2xl shadow-2xl border-r border-slate-700/50 flex flex-col z-30">
        {/* Profile Section - Top */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-white block">IntellMeet</span>
              <span className="text-sm text-slate-400">{user?.name?.split(" ")[0] || "User"}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate("/profile")}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 hover:text-blue-100 transition-all menu-item-active"
          >
            <User className="w-5 h-5 flex-shrink-0" />
            <span>My Profile</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => navigate("/dashboard")}
            className="menu-item-active w-full flex items-center gap-3 text-left p-3 rounded-xl"
          >
            <Video className="w-5 h-5 flex-shrink-0" />
            <span>Dashboard</span>
          </button>
          <button className="menu-item w-full flex items-center gap-3 text-left p-3 rounded-xl">
            <Plus className="w-5 h-5 flex-shrink-0" />
            <span>New Meeting</span>
          </button>
          <button className="menu-item w-full flex items-center gap-3 text-left p-3 rounded-xl">
            <LogIn className="w-5 h-5 flex-shrink-0" />
            <span>Join Meeting</span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <button className="w-full btn-primary flex items-center gap-2 h-12">
            <Plus className="w-4 h-4" />
            Quick Start
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-left p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all font-medium"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Log out</span>
          </button>
        </div>

        {/* Mobile Hamburger Overlay */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="border-b border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-sm shadow-2xl z-20">
          <div className="flex items-center gap-4">
            <span className="font-display font-bold text-lg text-white hidden md:block">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/profile")} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              {user?.avatar ? (
                <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt={user.name} />
              ) : (
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
              )}
              <span className="text-sm font-medium hidden lg:block">{user?.name}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

