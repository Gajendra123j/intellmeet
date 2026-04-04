import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import Login from "@/pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MeetingRoom from "./pages/MeetingRoom";
import MeetingSummary from "./pages/MeetingSummary";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return isAuthenticated ? <Layout><>{children}</></Layout> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return null;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const { checkAuth } = useAuthStore();
  useEffect(() => { checkAuth(); }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1a1a2e", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
          duration: 3000,
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/meeting/:code" element={<PrivateRoute><MeetingRoom /></PrivateRoute>} />
        <Route path="/summary/:id" element={<PrivateRoute><MeetingSummary /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
