const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const setupSocket = require("./socket");

dotenv.config();

// Connections handled in startServer()

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupSocket(io);

// ─── Middleware ────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ─── Routes ───────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/meetings", require("./routes/meetingRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Health check
app.get("/", (req, res) =>
  res.json({ message: "✅ IntellMeet API running", version: "2.0" })
);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (dbError) {
    console.warn('⚠️ MongoDB connection failed, continuing without DB:', dbError.message);
  }
  
  try {
    await connectRedis();
  } catch (redisError) {
    console.warn('⚠️ Redis connection failed, continuing without Redis:', redisError.message);
  }
  
  server.listen(PORT, () => {
    console.log(`🚀 IntellMeet server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();
