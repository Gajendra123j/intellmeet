import { create } from "zustand";
import api from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    set({ user: data.user, isAuthenticated: true });
  },

  register: async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.clear();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) { set({ isLoading: false }); return; }
      // Mock for frontend demo (no backend needed)
      const mockUser = {
        id: "demo1",
        name: "Demo User", 
        email: "demo@intellmeet.ai",
        role: "host",
        avatar: ""
      };
      localStorage.setItem("accessToken", "mock-token");
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
      return;

    } catch {
      localStorage.clear();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (updatedUser) =>
    set((state) => ({ user: state.user ? { ...state.user, ...updatedUser } : null })),
}));
