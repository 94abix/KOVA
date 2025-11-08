import { create } from "zustand";

interface AppState {
  currentSession: string | null;
  setCurrentSession: (sessionId: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentSession: null,
  setCurrentSession: (sessionId) => set({ currentSession: sessionId }),
}));

