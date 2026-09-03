import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { GovernmentOfficer, Startup } from '../types';

interface AuthStore {
  user: any | null;
  profile: GovernmentOfficer | Startup | null;
  role: 'government_officer' | 'startup' | 'admin' | null;
  session: any;
  initialized: boolean;
  setSession: (session: any) => void;
  setProfile: (profile: any) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      role: null,
      session: null,
      initialized: false,

      setSession: (session) =>
        set({
          session,
          user: session?.user ?? null,
          role: session?.user?.user_metadata?.role ?? null,
        }),

      setProfile: (profile) => set({ profile }),

      logout: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null, profile: null, role: null });
      },

      initialize: async () => {
        if (get().initialized) return;
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          set({
            session: data.session,
            user: data.session.user,
            role: data.session.user?.user_metadata?.role ?? null,
          });
        }
        set({ initialized: true });

        // Listen for auth state changes (login/logout from other tabs, token refresh)
        supabase.auth.onAuthStateChange((_event, session) => {
          set({
            session,
            user: session?.user ?? null,
            role: session?.user?.user_metadata?.role ?? null,
          });
        });
      },
    }),
    {
      name: 'pragati-auth',
      // Only persist role for fast initial render — session is re-validated via initialize()
      partialize: (state) => ({ role: state.role, user: state.user }),
    }
  )
);
