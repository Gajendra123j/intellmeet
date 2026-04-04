# 🤖 IntellMeet – AI-Powered Enterprise Meeting Platform

> Real-Time Video Meetings · AI Summaries · Smart Action Items · Team Collaboration

Production-grade MERN full-stack application built for Zidio Development – Version 2.0

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Redis (optional – app works without it)
- Git

---

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd intellmeet
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/intellmeet
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional – for avatar uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional – for AI summaries
OPENAI_API_KEY=your_openai_key
```

Start the backend:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4. Open in Browser

Go to `http://localhost:5173` → Register → Create a Meeting → Share the code → Join from another tab!

---

## 🐳 Docker (Full Stack)

```bash
# Copy env values
cp .env.example .env  # fill in Cloudinary + OpenAI keys

# Start everything
docker-compose up --build
```

App: `http://localhost:5173`
API: `http://localhost:5000`

---

## 📁 Project Structure

```
intellmeet/
├── backend/
│   ├── config/          # DB, Redis, Cloudinary
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── utils/           # JWT, AI helper
│   ├── socket.js        # Socket.io events
│   └── server.js        # Entry point
│
└── frontend/
    └── src/
        ├── pages/       # Login, Register, Dashboard, MeetingRoom, Summary, Profile
        ├── store/        # Zustand state (auth, meetings)
        ├── services/     # Axios API, Socket.io
        └── App.tsx       # Router
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth | JWT + Refresh tokens, bcrypt hashing, rate limiting |
| 📹 Video Meetings | WebRTC peer-to-peer video + audio |
| 💬 Real-time Chat | Socket.io in-meeting chat with typing indicators |
| 🖥️ Screen Share | Native screen sharing via `getDisplayMedia` |
| ✋ Raise Hand | Notify others you want to speak |
| 🤖 AI Summary | OpenAI GPT-4o-mini generates meeting summaries |
| ✅ Action Items | AI extracts tasks with assignees automatically |
| 📊 Dashboard | View all meetings, stats, history |
| 👤 Profile | Avatar upload via Cloudinary |
| 🔴 Redis Cache | Session and meeting data caching |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + Lucide Icons |
| State | Zustand |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io + WebRTC |
| AI | OpenAI GPT-4o-mini + Whisper |
| Cache | Redis (ioredis) |
| Auth | JWT + bcryptjs |
| Files | Cloudinary |
| Deploy | Docker + Docker Compose |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/logout | Logout |

### Meetings
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/meetings | Create meeting |
| GET | /api/meetings | Get all meetings |
| GET | /api/meetings/join/:code | Join by code |
| GET | /api/meetings/:id | Get by ID |
| PUT | /api/meetings/:id/start | Start meeting |
| PUT | /api/meetings/:id/end | End meeting |
| POST | /api/meetings/:id/summary | Generate AI summary |
| DELETE | /api/meetings/:id | Delete meeting |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/tasks | Create task |
| GET | /api/tasks | Get tasks |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

---

## 🔒 Security

- JWT with short-lived access tokens (15 min) + refresh tokens (7 days)
- bcrypt password hashing (12 rounds)
- Rate limiting on auth routes (20 req / 15 min)
- Helmet.js HTTP headers
- CORS restricted to frontend origin
- No secrets committed (`.env` in `.gitignore`)

---

## 🌐 Deployment

### Vercel (Frontend)
```bash
cd frontend && npm run build
# Deploy dist/ to Vercel
```

### Render (Backend)
- Create Web Service pointing to `/backend`
- Set all env variables in Render dashboard
- Start command: `npm start`

### MongoDB Atlas
- Create free cluster at mongodb.com/atlas
- Update `MONGO_URI` in env

---

## 📝 Notes

- **Without OpenAI key**: AI summary button will show a message; all other features work fully
- **Without Cloudinary**: Avatar upload won't work; use default initials avatar
- **Without Redis**: App works normally, just without caching
- **WebRTC**: Works best on Chrome/Edge; requires HTTPS in production (use ngrok for local testing across devices)

---

Built with ❤️ for Zidio Development – Web Development (MERN) Domain
March 2026 | Version 2.0
