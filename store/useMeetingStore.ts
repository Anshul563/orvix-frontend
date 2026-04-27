import { create } from "zustand";

interface ChatMessage {
  roomId: string;
  senderId: string;
  message: string;
  createdAt?: string;
}

interface MeetingState {
  users: Record<string, any>;
  messages: ChatMessage[];
  activeSpeaker: string | null;
  role: string;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  localStream: MediaStream | null;
  remoteStreams: Record<string, MediaStream>;
  setUsers: (users: Record<string, any>) => void;
  addMessage: (msg: ChatMessage) => void;
  setActiveSpeaker: (id: string | null) => void;
  setRole: (role: string) => void;
  setChatOpen: (open: boolean) => void;
  setParticipantsOpen: (open: boolean) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  addRemoteStream: (socketId: string, stream: MediaStream) => void;
}





export const useMeetingStore = create<MeetingState>((set) => ({
  users: {},
  messages: [],
  activeSpeaker: null,
  role: "participant",
  isChatOpen: false,
  isParticipantsOpen: false,
  localStream: null,
  remoteStreams: {},

  setUsers: (users) => set({ users }),
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setActiveSpeaker: (id) => set({ activeSpeaker: id }),
  setRole: (role) => set({ role }),
  setChatOpen: (open) => set({ isChatOpen: open }),
  setParticipantsOpen: (open) => set({ isParticipantsOpen: open }),
  setLocalStream: (stream) => set({ localStream: stream }),
  addRemoteStream: (socketId, stream) =>
    set((state) => ({
      remoteStreams: { ...state.remoteStreams, [socketId]: stream },
    })),
}));