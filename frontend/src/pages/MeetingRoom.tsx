import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useMeetingStore } from "@/store/meetingStore";
import { connectSocket, disconnectSocket } from "../services/socket";
import toast from "react-hot-toast";
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  PhoneOff, MessageSquare, Users, Hand, X, Send, Copy
} from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  sender: { name: string; id: string };
  timestamp: string;
}

interface Participant {
  id: string;
  name: string;
  socketId: string;
  avatar?: string;
}

export default function MeetingRoom() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { joinMeeting, endMeeting } = useMeetingStore();

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const socketRef = useRef<any>(null);

  // State
  const [meeting, setMeeting] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ICE servers for WebRTC
  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // Create peer connection for a remote user
  const createPeerConnection = useCallback((socketId: string) => {
    const pc = new RTCPeerConnection(iceServers);

    // Add local tracks
    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });

    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStreams((prev) => {
        const updated = new Map(prev);
        updated.set(socketId, event.streams[0]);
        return updated;
      });
    };

    // Send ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", {
          to: socketId,
          candidate: event.candidate,
          from: socketRef.current.id,
        });
      }
    };

    peerConnections.current.set(socketId, pc);
    return pc;
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        // 1) Join meeting
        const m = await joinMeeting(code!);
        setMeeting(m);

        // 2) Get local media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // 3) Connect socket
        const socket = connectSocket();
        socketRef.current = socket;

        socket.emit("join-room", {
          roomId: code,
          user: { id: user?.id, name: user?.name, avatar: user?.avatar },
        });

        // 4) Handle events
        socket.on("room-participants", ({ participants: ps }: any) => {
          setParticipants(ps);
        });

        socket.on("user-joined", async ({ user: joinedUser, participants: ps }: any) => {
          setParticipants(ps);
          toast.success(`${joinedUser.name} joined`);

          // Create offer for new user
          const pc = createPeerConnection(joinedUser.socketId);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { to: joinedUser.socketId, offer, from: socket.id });
        });

        socket.on("user-left", ({ socketId, user: leftUser, participants: ps }: any) => {
          setParticipants(ps);
          setRemoteStreams((prev) => { const m = new Map(prev); m.delete(socketId); return m; });
          peerConnections.current.get(socketId)?.close();
          peerConnections.current.delete(socketId);
          toast(`${leftUser?.name || "Someone"} left`, { icon: "👋" });
        });

        socket.on("offer", async ({ from, offer }: any) => {
          const pc = createPeerConnection(from);
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { to: from, answer, from: socket.id });
        });

        socket.on("answer", async ({ from, answer }: any) => {
          const pc = peerConnections.current.get(from);
          if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("ice-candidate", async ({ from, candidate }: any) => {
          const pc = peerConnections.current.get(from);
          if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("new-message", (msg: ChatMessage) => {
          setMessages((prev) => [...prev, msg]);
        });

        socket.on("user-typing", ({ user: typingUser, isTyping: typing }: any) => {
          setIsTyping((prev) =>
            typing ? [...prev.filter((n) => n !== typingUser.name), typingUser.name]
                   : prev.filter((n) => n !== typingUser.name)
          );
        });

        socket.on("transcript-update", ({ text }: any) => {
          setTranscript((prev) => prev + " " + text);
        });

        setIsLoading(false);
      } catch (err: any) {
        toast.error(err.message || "Failed to join meeting");
        navigate("/dashboard");
      }
    };

    init();

    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      peerConnections.current.forEach((pc) => pc.close());
      socketRef.current?.emit("leave-room", { roomId: code });
      disconnectSocket();
    };
  }, [code]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleMute = () => {
    const audio = localStreamRef.current?.getAudioTracks()[0];
    if (audio) { audio.enabled = !audio.enabled; setIsMuted(!audio.enabled); }
    socketRef.current?.emit("toggle-audio", { roomId: code, userId: user?.id, isMuted: !isMuted });
  };

  const toggleVideo = () => {
    const video = localStreamRef.current?.getVideoTracks()[0];
    if (video) { video.enabled = !video.enabled; setIsVideoOff(!video.enabled); }
    socketRef.current?.emit("toggle-video", { roomId: code, userId: user?.id, isVideoOff: !isVideoOff });
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = screen.getVideoTracks()[0];
        peerConnections.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          sender?.replaceTrack(videoTrack);
        });
        if (localVideoRef.current) localVideoRef.current.srcObject = screen;
        videoTrack.onended = () => toggleScreenShare();
        setIsScreenSharing(true);
        socketRef.current?.emit("screen-share-start", { roomId: code, userId: user?.id });
      } catch { toast.error("Screen share cancelled"); }
    } else {
      const video = localStreamRef.current?.getVideoTracks()[0];
      peerConnections.current.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (video) sender?.replaceTrack(video);
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
      setIsScreenSharing(false);
      socketRef.current?.emit("screen-share-stop", { roomId: code, userId: user?.id });
    }
  };

  const toggleHand = () => {
    const next = !handRaised;
    setHandRaised(next);
    socketRef.current?.emit(next ? "raise-hand" : "lower-hand", { roomId: code, user: { name: user?.name } });
    if (next) toast("✋ Hand raised", { duration: 2000 });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    socketRef.current?.emit("send-message", {
      roomId: code,
      message: msgInput,
      user: { id: user?.id, name: user?.name },
    });
    socketRef.current?.emit("typing-stop", { roomId: code, user: { name: user?.name } });
    setMsgInput("");
  };

  const handleTyping = (val: string) => {
    setMsgInput(val);
    if (val) socketRef.current?.emit("typing-start", { roomId: code, user: { name: user?.name } });
    else socketRef.current?.emit("typing-stop", { roomId: code, user: { name: user?.name } });
  };

  const handleLeave = async () => {
    if (meeting?.host?.id === user?.id) {
      if (confirm("End meeting for everyone?")) {
        await endMeeting(meeting._id);
        toast.success("Meeting ended");
      } else return;
    }
    navigate("/dashboard");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code!);
    toast.success("Meeting code copied!");
  };

  if (isLoading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60">Joining meeting...</p>
      </div>
    </div>
  );

  const allStreams = [
    { id: "local", name: `${user?.name} (You)`, stream: null, isLocal: true },
    ...Array.from(remoteStreams.entries()).map(([socketId, stream]) => ({
      id: socketId,
      name: participants.find((p) => p.socketId === socketId)?.name || "Participant",
      stream,
      isLocal: false,
    })),
  ];

  const gridClass = allStreams.length === 1 ? "grid-cols-1" :
    allStreams.length === 2 ? "grid-cols-2" : "grid-cols-2";

  return (
    <div className="h-screen bg-dark-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-dark-800/80 backdrop-blur">
        <div>
          <h1 className="font-semibold text-white">{meeting?.title}</h1>
          <button onClick={copyCode} className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors font-mono">
            <Copy className="w-3 h-3" /> {code}
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Users className="w-4 h-4" />
          <span>{participants.length || 1} participant{(participants.length || 1) !== 1 ? "s" : ""}</span>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video grid */}
        <div className={`flex-1 grid gap-2 p-3 ${gridClass}`} style={{ alignContent: "start" }}>
          {allStreams.map(({ id, name, stream, isLocal }) => (
            <VideoTile key={id} name={name} stream={stream} isLocal={isLocal}
              localRef={isLocal ? localVideoRef : undefined}
              isMuted={isLocal ? isMuted : false} isVideoOff={isLocal ? isVideoOff : false} />
          ))}
        </div>

        {/* Side panel */}
        {(showChat || showParticipants) && (
          <div className="w-80 border-l border-white/10 bg-dark-800 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-semibold text-white">{showChat ? "Chat" : "Participants"}</h3>
              <button onClick={() => { setShowChat(false); setShowParticipants(false); }}
                className="p-1 hover:bg-white/10 rounded">
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender.id === user?.id ? "items-end" : "items-start"}`}>
                      <span className="text-xs text-white/40 mb-1">{msg.sender.name}</span>
                      <div className={`rounded-2xl px-3 py-2 max-w-[85%] text-sm ${
                        msg.sender.id === user?.id ? "bg-primary-600 text-white" : "bg-white/10 text-white"
                      }`}>{msg.content}</div>
                    </div>
                  ))}
                  {isTyping.length > 0 && (
                    <p className="text-xs text-white/40 italic">{isTyping.join(", ")} typing...</p>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={sendMessage} className="p-3 border-t border-white/10 flex gap-2">
                  <input className="input-field text-sm flex-1"
                    placeholder="Type a message..."
                    value={msgInput}
                    onChange={(e) => handleTyping(e.target.value)} />
                  <button type="submit" className="p-2 bg-primary-600 rounded-lg hover:bg-primary-700">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </>
            )}

            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {participants.map((p) => (
                  <div key={p.socketId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                    <div className="w-8 h-8 bg-primary-600/30 rounded-full flex items-center justify-center text-sm font-medium text-primary-400">
                      {p.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-white">{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="px-6 py-4 border-t border-white/10 bg-dark-800/80 backdrop-blur flex items-center justify-center gap-3">
        <ControlBtn onClick={toggleMute} active={isMuted} danger={isMuted}
          icon={isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          label={isMuted ? "Unmute" : "Mute"} />
        <ControlBtn onClick={toggleVideo} active={isVideoOff} danger={isVideoOff}
          icon={isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          label={isVideoOff ? "Start Video" : "Stop Video"} />
        <ControlBtn onClick={toggleScreenShare} active={isScreenSharing}
          icon={isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          label={isScreenSharing ? "Stop Share" : "Share Screen"} />
        <ControlBtn onClick={toggleHand} active={handRaised}
          icon={<Hand className="w-5 h-5" />} label="Raise Hand" />
        <ControlBtn onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
          active={showChat} icon={<MessageSquare className="w-5 h-5" />} label="Chat" />
        <ControlBtn onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
          active={showParticipants} icon={<Users className="w-5 h-5" />} label="People" />
        <button onClick={handleLeave}
          className="flex flex-col items-center gap-1 p-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all text-white">
          <PhoneOff className="w-5 h-5" />
          <span className="text-xs">Leave</span>
        </button>
      </div>
    </div>
  );
}

// Sub-components
function VideoTile({ name, stream, isLocal, localRef, isMuted, isVideoOff }: any) {
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isLocal && remoteRef.current && stream) {
      remoteRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-dark-700 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
      {isLocal ? (
        <video ref={localRef} autoPlay muted playsInline
          className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`} />
      ) : (
        <video ref={remoteRef} autoPlay playsInline className="w-full h-full object-cover" />
      )}
      {isVideoOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-700">
          <div className="w-16 h-16 bg-primary-600/30 rounded-full flex items-center justify-center text-2xl font-bold text-primary-400">
            {name[0].toUpperCase()}
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black/60 rounded-md px-2 py-0.5 text-xs text-white flex items-center gap-1">
        {isMuted && <MicOff className="w-3 h-3 text-red-400" />}
        {name}
      </div>
    </div>
  );
}

function ControlBtn({ onClick, active, danger, icon, label }: any) {
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-white ${
        danger ? "bg-red-600/20 hover:bg-red-600/40 text-red-400" :
        active ? "bg-primary-600/20 text-primary-400" :
        "bg-white/10 hover:bg-white/20"
      }`}>
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
