import {create} from "zustand";
import { supabase } from "@/services/supabase";

type AuthState = {
  session: any;
  role: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  role: null,

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({
      session: data.session,
      role: data.session?.user?.user_metadata?.role,
    });
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;

    // Escucha los cambios en el estado de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({ session, role: session.user?.user_metadata?.role });
      }
    });

    // Limpia la suscripción cuando ya no sea necesaria
    return () => subscription.unsubscribe();
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, role: null });
  },
}));
