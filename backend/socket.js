const Meeting = require("./models/Meeting");

const setupSocket = (io) => {
  // Track active rooms and users
  const rooms = new Map(); // roomId -> Set of users

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ─── JOIN MEETING ROOM ───────────────────────────────────
    socket.on("join-room", ({ roomId, user }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userData = user;

      if (!rooms.has(roomId)) rooms.set(roomId, new Map());
      rooms.get(roomId).set(socket.id, { ...user, socketId: socket.id });

      // Notify others in room
      socket.to(roomId).emit("user-joined", {
        user: { ...user, socketId: socket.id },
        participants: Array.from(rooms.get(roomId).values()),
      });

      // Send current participants to new joiner
      socket.emit("room-participants", {
        participants: Array.from(rooms.get(roomId).values()),
      });

      console.log(`👤 ${user.name} joined room ${roomId}`);
    });

    // ─── LEAVE ROOM ──────────────────────────────────────────
    socket.on("leave-room", ({ roomId }) => {
      handleLeaveRoom(socket, roomId, rooms, io);
    });

    // ─── WEBRTC SIGNALING ────────────────────────────────────
    socket.on("offer", ({ to, offer, from }) => {
      socket.to(to).emit("offer", { from, offer });
    });

    socket.on("answer", ({ to, answer, from }) => {
      socket.to(to).emit("answer", { from, answer });
    });

    socket.on("ice-candidate", ({ to, candidate, from }) => {
      socket.to(to).emit("ice-candidate", { from, candidate });
    });

    // ─── CHAT MESSAGES ───────────────────────────────────────
    socket.on("send-message", async ({ roomId, message, user }) => {
      const msgData = {
        id: Date.now().toString(),
        content: message,
        sender: user,
        timestamp: new Date().toISOString(),
      };

      // Broadcast to room
      io.to(roomId).emit("new-message", msgData);

      // Save to DB
      try {
        await Meeting.findOneAndUpdate(
          { meetingCode: roomId },
          {
            $push: {
              chatMessages: {
                sender: user.id,
                senderName: user.name,
                content: message,
              },
            },
          }
        );
      } catch (err) {
        console.error("Chat save error:", err.message);
      }
    });

    // ─── TYPING INDICATORS ───────────────────────────────────
    socket.on("typing-start", ({ roomId, user }) => {
      socket.to(roomId).emit("user-typing", { user, isTyping: true });
    });

    socket.on("typing-stop", ({ roomId, user }) => {
      socket.to(roomId).emit("user-typing", { user, isTyping: false });
    });

    // ─── MEDIA CONTROLS ──────────────────────────────────────
    socket.on("toggle-audio", ({ roomId, userId, isMuted }) => {
      socket.to(roomId).emit("user-audio-toggle", { userId, isMuted });
    });

    socket.on("toggle-video", ({ roomId, userId, isVideoOff }) => {
      socket.to(roomId).emit("user-video-toggle", { userId, isVideoOff });
    });

    socket.on("screen-share-start", ({ roomId, userId }) => {
      socket.to(roomId).emit("user-screen-share", { userId, isSharing: true });
    });

    socket.on("screen-share-stop", ({ roomId, userId }) => {
      socket.to(roomId).emit("user-screen-share", { userId, isSharing: false });
    });

    // ─── LIVE TRANSCRIPT ─────────────────────────────────────
    socket.on("transcript-update", ({ roomId, text }) => {
      socket.to(roomId).emit("transcript-update", { text });
    });

    // ─── RAISE HAND ──────────────────────────────────────────
    socket.on("raise-hand", ({ roomId, user }) => {
      io.to(roomId).emit("hand-raised", { user });
    });

    socket.on("lower-hand", ({ roomId, user }) => {
      io.to(roomId).emit("hand-lowered", { user });
    });

    // ─── DISCONNECT ──────────────────────────────────────────
    socket.on("disconnect", () => {
      if (socket.roomId) {
        handleLeaveRoom(socket, socket.roomId, rooms, io);
      }
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

function handleLeaveRoom(socket, roomId, rooms, io) {
  socket.leave(roomId);
  if (rooms.has(roomId)) {
    rooms.get(roomId).delete(socket.id);
    if (rooms.get(roomId).size === 0) {
      rooms.delete(roomId);
    } else {
      io.to(roomId).emit("user-left", {
        socketId: socket.id,
        user: socket.userData,
        participants: Array.from(rooms.get(roomId).values()),
      });
    }
  }
}

module.exports = setupSocket;
