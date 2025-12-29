import { create } from 'zustand';

interface AuthState {
  session: any | null;
  isAuthenticated: boolean;
  setSession: (session: any | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isAuthenticated: false,
  setSession: (session) => set({ session, isAuthenticated: !!session }),
}));
