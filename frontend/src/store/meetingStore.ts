import { create } from "zustand";
import api from "../services/api";

interface Meeting {
  _id: string;
  title: string;
  meetingCode: string;
  host: { id: string; name: string; email: string; avatar: string };
  participants: Array<{ id: string; name: string; email: string; avatar: string }>;
  status: "scheduled" | "active" | "ended";
  description: string;
  transcript: string;
  summary: string;
  actionItems: Array<{ text: string; assignee: string }>;
  chatMessages: Array<{ senderName: string; content: string; timestamp: string }>;
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  createdAt: string;
}

interface MeetingState {
  meetings: Meeting[];
  currentMeeting: Meeting | null;
  isLoading: boolean;
  fetchMeetings: () => Promise<void>;
  createMeeting: (data: { title: string; description?: string; scheduledAt?: string }) => Promise<Meeting>;
  joinMeeting: (code: string) => Promise<Meeting>;
  getMeetingById: (id: string) => Promise<void>;
  endMeeting: (id: string) => Promise<void>;
  generateSummary: (id: string) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  setCurrentMeeting: (m: Meeting | null) => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetings: [],
  currentMeeting: null,
  isLoading: false,

  fetchMeetings: async () => {
    const saved = localStorage.getItem('intellmeetMeetings');
    let meetings: Meeting[] = saved ? JSON.parse(saved) : [
      {
        _id: "1",
        title: "Yesterday's Team Sync",
        meetingCode: "AB12CD34",
        host: {id: "demo1", name: "Demo User", email: "demo@intellmeet.ai", avatar: ""},
        participants: [],
        status: "ended",
        description: "",
        transcript: "",
        summary: "Great discussion on Q4 goals. Action items assigned.",
        actionItems: [{text: "Follow up on API docs"}],
        chatMessages: [],
        createdAt: new Date(Date.now() - 24*60*60*1000).toISOString()
      },
      {
        _id: "2",
        title: "Product Roadmap Planning (Active)",
        meetingCode: "XY99AB12",
        host: {id: "demo1", name: "Demo User", email: "demo@intellmeet.ai", avatar: ""},
        participants: [{id: "demo2", name: "Alice", email: "", avatar: ""}],
        status: "active",
        description: "Discuss Q1 features",
        transcript: "",
        summary: "",
        actionItems: [],
        chatMessages: [],
        startedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 1000*60*60).toISOString()
      }
    ];
    set({ meetings, isLoading: false });
  },

  createMeeting: async (meetingData: { title: string; description?: string; scheduledAt?: string }) => {
    const { title, description = "" } = meetingData;
    const newMeeting: Meeting = {
      _id: `mock-${Date.now()}`,
      title,
      meetingCode: `M${Math.random().toString(36).slice(-6).toUpperCase()}${Math.random().toString(36).slice(-6).toUpperCase().slice(0,2)}`,
      host: { id: "demo1", name: "Demo User", email: "demo@intellmeet.ai", avatar: "" },
      participants: [],
      status: "scheduled",
      description,
      transcript: "",
      summary: "",
      actionItems: [],
      chatMessages: [],
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ meetings: [newMeeting, ...state.meetings] }));
    set({ currentMeeting: newMeeting });
    return newMeeting;
  },

  joinMeeting: async (code: string) => {
    const upperCode = code.toUpperCase();
    const state = get();
    let meeting = state.meetings.find((m) => m.meetingCode === upperCode);
    if (!meeting) {
      meeting = {
        _id: `mock-join-${Date.now()}`,
        title: `Join Code Meeting: ${upperCode}`,
        meetingCode: upperCode,
        host: { id: "other", name: "Host User", email: "host@example.com", avatar: "" },
        participants: [{ id: "demo2", name: "Alice", email: "", avatar: "" }],
        status: "active",
        description: "Demo active meeting",
        transcript: "Active meeting transcript... (WebRTC demo)",
        summary: "",
        actionItems: [],
        chatMessages: [],
        startedAt: new Date(Date.now() - 30*60*1000).toISOString(),
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ meetings: [meeting, ...state.meetings] }));
    }
    set({ currentMeeting: meeting });
    return meeting;
  },

  getMeetingById: async (id: string) => {
    const state = get();
    const meeting = state.meetings.find((m) => m._id === id);
    if (meeting) {
      set({ currentMeeting: meeting });
    }
  },

  endMeeting: async (id: string) => {
    set((state) => ({
      meetings: state.meetings.map((m) =>
        m._id === id
          ? {
              ...m,
              status: "ended",
              endedAt: new Date().toISOString(),
              duration: Math.floor(Math.random() * 60) + 30,
            }
          : m
      ),
    }));
  },

  generateSummary: async (id: string) => {
    set((state) => ({
      meetings: state.meetings.map((m) =>
        m._id === id
          ? {
              ...m,
              summary: "Excellent discussion! Key decisions made and action items assigned. Next steps clearly defined.",
              actionItems: [
                { text: "Follow up on API integration", assignee: "John" },
                { text: "Review Q4 roadmap", assignee: "Alice" },
                { text: "Prepare demo video", assignee: "Demo User" },
              ],
              chatMessages: [
                { senderName: "Alice", content: "Great meeting!", timestamp: new Date().toISOString() },
                { senderName: "John", content: "Thanks everyone", timestamp: new Date().toISOString() },
              ],
            }
          : m
      ),
    }));
  },

  deleteMeeting: async (id: string) => {
    set((state) => ({
      meetings: state.meetings.filter((m) => m._id !== id),
    }));
  },

  setCurrentMeeting: (m: Meeting | null) => set({ currentMeeting: m }),
})); 

