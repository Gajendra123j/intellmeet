import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useMeetingStore } from "@/store/meetingStore";
import toast from "react-hot-toast";
import {
  Video, Plus, LogIn, Clock, Users, Sparkles,
  Calendar, CheckCircle, Trash2, LogOut, User,
  Menu, X, ChevronRight
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { meetings, fetchMeetings, joinMeeting, deleteMeeting, isLoading } = useMeetingStore();
  const navigate = useNavigate();

  const [showCreate, setShowCreate ] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [title, setTitle] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => { fetchMeetings(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Enter meeting title");
    setCreating(true);
    try {
      // createMeeting handled in Layout
      toast.success("Meeting created!");
      setShowCreate(false);
      setTitle("");
      fetchMeetings();
    } catch {
      toast.error("Failed to create meeting");
    } finally { setCreating(false); }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return toast.error("Enter meeting code");
    setJoining(true);
    try {
      const meeting = await joinMeeting(joinCode.toUpperCase());
      navigate(`/meeting/${meeting.meetingCode}`);
    } catch {
      toast.error("Meeting not found");
    } finally { setJoining(false); }
  };

  const stats = {
    total: meetings.length,
    active: meetings.filter((m) => m.status === "active").length,
    ended: meetings.filter((m) => m.status === "ended").length,
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <img src="https://static.vecteezy.com/system/resources/thumbnails/019/493/288/small/black-zoom-meeting-logo-black-zoom-meeting-icon-zoom-symbol-free-free-vector.jpg" alt="IntellMeet Logo" className="w-10 h-10 rounded-lg flex-shrink-0" />
        <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">IntellMeet Dashboard</h2>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening" },{" "}
          <span className="text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text drop-shadow-lg">{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Manage your meetings and track AI-powered insights.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Meetings", value: stats.total, icon: Calendar, color: "bg-blue-500/10 text-blue-400" },
          { label: "Active Now", value: stats.active, icon: Video, color: "bg-emerald-500/10 text-emerald-400" },
          { label: "Completed", value: stats.ended, icon: CheckCircle, color: "bg-purple-500/10 text-purple-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm shadow-sm rounded-2xl p-6 md:p-8 flex items-center gap-4 border border-blue-100 hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-slate-900">{value}</p>
              <p className="text-slate-500 text-sm md:text-base font-medium mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center justify-center gap-2 h-14 flex-1 font-semibold shadow-lg hover:shadow-xl">
          <Plus className="w-5 h-5" /> New Meeting
        </button>
        <button onClick={() => setShowJoin(true)} className="btn-ghost flex items-center justify-center gap-2 h-14 flex-1 shadow-lg hover:shadow-xl">
          <LogIn className="w-5 h-5" /> Join Meeting
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white/5 backdrop-blur-lg shadow-2xl rounded-3xl p-8 mb-8 border border-white/10 animate-fadein hover:shadow-3xl transition-all">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Plus className="w-6 h-6 text-blue-400" /> Create New Meeting
          </h3>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
            <input 
              className="input-field flex-1 font-semibold placeholder-slate-300" 
              placeholder="Enter meeting title..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              autoFocus 
            />
            <button type="submit" disabled={creating} className="btn-primary px-8 h-14 flex-shrink-0 font-semibold shadow-lg">
              {creating ? "Creating..." : "Create"}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost px-8 h-14 flex-shrink-0">Cancel</button>
          </form>
        </div>
      )}

      {/* Join form */}
      {showJoin && (
        <div className="bg-white/5 backdrop-blur-lg shadow-2xl rounded-3xl p-8 mb-8 border border-white/10 animate-fadein hover:shadow-3xl transition-all">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <LogIn className="w-6 h-6 text-emerald-400" /> Join Meeting
          </h3>
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-4">
            <input 
              className="input-field flex-1 font-mono uppercase tracking-widest text-lg placeholder-slate-300" 
              placeholder="AB12-CD34" 
              value={joinCode} 
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())} 
              autoFocus 
            />
            <button type="submit" disabled={joining} className="btn-primary px-8 h-14 flex-shrink-0 font-semibold shadow-lg">
              {joining ? "Joining..." : "Join"}
            </button>
            <button type="button" onClick={() => setShowJoin(false)} className="btn-ghost px-8 h-14 flex-shrink-0">Cancel</button>
          </form>
        </div>
      )}

      {/* Meetings list */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent drop-shadow-lg mb-8">Your Meetings</h2>
        {isLoading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="w-16 h-16 border-4 border-slate-700/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading your meetings...</p>
          </div>
        ) : meetings.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-lg shadow-2xl rounded-3xl p-16 text-center border border-white/10 animate-fadein">
            <Video className="w-20 h-20 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">No meetings yet</h3>
            <p className="text-slate-400 text-lg mb-8">Create your first meeting to get started with IntellMeet</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary px-8 py-3 text-lg font-semibold">
              <Plus className="w-5 h-5 inline mr-2" /> Create First Meeting
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div 
                key={meeting._id} 
                className="group bg-white/5 backdrop-blur-lg hover:bg-white/10 shadow-xl hover:shadow-2xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => meeting.status !== "ended" && navigate(`/meeting/${meeting.meetingCode}`)}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                      meeting.status === "active" ? "bg-emerald-500/20 border-2 border-emerald-400" :
                      meeting.status === "ended" ? "bg-slate-500/20 border-2 border-slate-400" : "bg-blue-500/20 border-2 border-blue-400"
                    }`}>
                      <Video className={`w-7 h-7 ${
                        meeting.status === "active" ? "text-emerald-400" :
                        meeting.status === "ended" ? "text-slate-400" : "text-blue-400"
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold text-white truncate group-hover:text-blue-300 transition-colors">{meeting.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                          meeting.status === "active" ? "bg-emerald-100/80 text-emerald-800 border-emerald-300/50" :
                          meeting.status === "ended" ? "bg-slate-100/80 text-slate-800 border-slate-300/50" :
                          "bg-blue-100/80 text-blue-800 border-blue-300/50"
                        } border`}>{meeting.status.toUpperCase()}</span>
                        {meeting.summary && (
                          <span className="px-3 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-400/50 flex items-center gap-1 shadow-md">
                            <Sparkles className="w-3 h-3 animate-pulse" /> AI Summary
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-slate-400 mb-1 flex-wrap">
                        <span className="font-mono bg-slate-800/50 px-3 py-1 rounded-xl font-medium">#{meeting.meetingCode}</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {meeting.participants?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(meeting.createdAt).toLocaleDateString()}
                        </span>
                        {meeting.duration && <span>{meeting.duration} min</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4 flex-shrink-0">
                    {meeting.status === "ended" && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/summary/${meeting._id}`); }}
                        className="p-3 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-all shadow-lg hover:shadow-xl border border-indigo-400/30"
                        title="View AI Summary"
                      >
                        <Sparkles className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(confirm("Delete this meeting?")) deleteMeeting(meeting._id); }}
                      className="p-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-all shadow-lg hover:shadow-xl border border-red-400/30"
                      title="Delete Meeting"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
