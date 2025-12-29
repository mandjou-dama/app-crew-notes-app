import { create } from 'zustand';
import { Session, User } from '@/types/auth';

interface AuthState {
  user: User | null;
  session: Session | null;
  isHydrated: boolean;
  
  setAuth: (session: Session | null) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isHydrated: false,

  setAuth: (session) => set({ 
    session, 
    user: session ? session.user : null,
  }),
  
  clearAuth: () => set({ 
    session: null, 
    user: null,
  }),
  
  setHydrated: () => set({ isHydrated: true }),
}));
