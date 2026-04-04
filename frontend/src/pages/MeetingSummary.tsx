import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useMeetingStore } from "@/store/meetingStore";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  ArrowLeft, Sparkles, Clock, Users, CheckCircle,
  Copy, Download, ListTodo, FileText, Loader
} from "lucide-react";

export default function MeetingSummary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentMeeting, getMeetingById, generateSummary } = useMeetingStore();
  const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => { if (id) getMeetingById(id); }, [id]);

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      await generateSummary(id!);
      toast.success("AI summary generated!");
    } catch {
      toast.error("Failed to generate summary (check OpenAI key)");
    } finally { setGeneratingSummary(false); }
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(currentMeeting?.transcript || "");
    toast.success("Transcript copied!");
  };

  if (!currentMeeting) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back */}
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{currentMeeting.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentMeeting.duration ? `${currentMeeting.duration} minutes` : "Duration unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {currentMeeting.participants?.length || 0} participants
                </span>
                <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded">
                  {currentMeeting.meetingCode}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/50">Ended</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Summary */}
          <div className="card md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> AI Meeting Summary
              </h2>
              {!currentMeeting.summary && (
                <button onClick={handleGenerateSummary} disabled={generatingSummary}
                  className="btn-primary flex items-center gap-2 text-sm py-2">
                  {generatingSummary ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {generatingSummary ? "Generating..." : "Generate AI Summary"}
                </button>
              )}
            </div>
            {currentMeeting.summary ? (
              <p className="text-white/80 leading-relaxed bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                {currentMeeting.summary}
              </p>
            ) : (
              <div className="bg-white/5 rounded-lg p-6 text-center text-white/30">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No summary yet. Click "Generate AI Summary" to create one.</p>
                {!process.env.VITE_HAS_AI && (
                  <p className="text-xs mt-2">Requires OpenAI API key in backend .env</p>
                )}
              </div>
            )}
          </div>

          {/* Action Items */}
          <div className="card">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
              <ListTodo className="w-4 h-4 text-blue-400" /> Action Items
            </h2>
            {currentMeeting.actionItems?.length > 0 ? (
              <div className="space-y-3">
                {currentMeeting.actionItems.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{item.task}</p>
                      {item.assignee && (
                        <p className="text-xs text-white/40 mt-0.5">→ {item.assignee}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === "done" ? "bg-green-500/20 text-green-400" :
                      item.status === "in-progress" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-white/10 text-white/40"
                    }`}>{item.status || "pending"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-white/30">
                <ListTodo className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No action items extracted yet</p>
              </div>
            )}
          </div>

          {/* Participants */}
          <div className="card">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-green-400" /> Participants
            </h2>
            <div className="space-y-2">
              {currentMeeting.participants?.map((p: any) => (
                <div key={p._id || p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                  {p.avatar ? (
                    <img src={p.avatar} className="w-8 h-8 rounded-full object-cover" alt={p.name} />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600/30 rounded-full flex items-center justify-center text-sm font-medium text-primary-400">
                      {p.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-white">{p.name}</p>
                    <p className="text-xs text-white/40">{p.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript */}
          {currentMeeting.transcript && (
            <div className="card md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-yellow-400" /> Meeting Transcript
                </h2>
                <button onClick={copyTranscript} className="btn-ghost text-sm flex items-center gap-2 py-1.5">
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div className="bg-dark-900 rounded-lg p-4 max-h-60 overflow-y-auto">
                <p className="text-white/70 text-sm leading-relaxed font-mono whitespace-pre-wrap">
                  {currentMeeting.transcript}
                </p>
              </div>
            </div>
          )}

          {/* Chat history */}
          {currentMeeting.chatMessages?.length > 0 && (
            <div className="card md:col-span-2">
              <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-orange-400" /> Chat History
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {currentMeeting.chatMessages.map((msg: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-white/40 text-xs flex-shrink-0 mt-0.5">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-primary-400 font-medium flex-shrink-0">{msg.senderName}:</span>
                    <span className="text-white/70">{msg.content}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
