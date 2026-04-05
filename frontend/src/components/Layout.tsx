import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useMeetingStore } from "@/store/meetingStore";
import { Video, Plus, LogIn, User, Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuthStore();
  const { createMeeting } = useMeetingStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreate, setShowCreate ] = useState(false);
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



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex">
      {/* Left Sidebar - Always visible */}
      <aside className="w-48 md:w-56 bg-slate-900/95 backdrop-blur-md shadow-lg border-r border-slate-700/50 flex flex-col z-30">
        {/* Profile Section - Top */}
        <div className="p-2.5 border-b border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <Video className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-base text-white block leading-tight">IntellMeet</span>
              <span className="text-xs text-slate-400">{user?.name?.split(" ")[0] || "User"}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate("/profile")}
            className="w-full menu-item-active px-2 py-2"
          >
            <User className="w-4.5 h-4.5 flex-shrink-0" />
            <span>My Profile</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5">
          <button 
            onClick={() => navigate("/dashboard")}
            className="menu-item-active w-full"
          >
            <Video className="w-4.5 h-4.5 flex-shrink-0" />
            <span>Dashboard</span>
          </button>
          <button className="menu-item w-full">
            <Plus className="w-4.5 h-4.5 flex-shrink-0" />
            <span>New Meeting</span>
          </button>
          <button className="menu-item w-full">
            <LogIn className="w-4.5 h-4.5 flex-shrink-0" />
            <span>Join Meeting</span>
          </button>
        </nav>



        {/* Mobile Hamburger Overlay */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-3 left-3 z-50 p-1.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="card-header border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <span className="font-display font-bold text-lg text-white hidden md:block">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/profile")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 -m-2 rounded-xl hover:bg-slate-800/50">
              {user?.avatar ? (
                <img src={user.avatar} className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700/50" alt={user.name} />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center ring-2 ring-slate-700/50">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
              )}
              <span className="text-sm font-semibold hidden lg:block">{user?.name}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container py-2 md:py-3 section-compact">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
