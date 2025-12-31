import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";
import { supabase } from "@/services/supabase";

export function useAuth() {
  const { setAuth, clearAuth, setHydrated, isHydrated } = useAuthStore();

  useEffect(() => {
    // 1. Initial Session Hydration
    const hydrateAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          setAuth(session);
        } else {
          clearAuth(); // Explicitly clear to ensures clean state
        }
      } catch (error) {
        console.warn("Auth hydration failed:", error);
        clearAuth();
      } finally {
        setHydrated();
      }
    };

    hydrateAuth();

    // 2. Auth State Sync Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session);
      } else {
        clearAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, clearAuth, setHydrated]);

  return { isHydrated };
}
