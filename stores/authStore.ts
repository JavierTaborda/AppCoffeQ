import { create } from "zustand";
import { supabase } from "@/services/supabase";

type AuthState = {
  session: any;
  role: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  checkSession: () => Promise<void>;
  setRole: (role: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  role: null,

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const role = data.session?.user?.user_metadata?.role || "user";
      set({ session: data.session, role });
      return data;
    } catch (error) {
      console.error("Error signing in:", error);
      throw new Error("Failed to sign in. Please check your credentials.");
    }
  },

  signInWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;

     
      return new Promise((resolve, reject) => {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            const role = session.user?.user_metadata?.role || "user";
            set({ session, role }); 
            subscription.unsubscribe(); 
            resolve(session); 
          }
        });
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw new Error("Failed to sign in with Google.");
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ session: null, role: null });
    } catch (error) {
      console.error("Error signing out:", error);
      throw new Error("Failed to sign out.");
    }
  },

  signUp: async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    if (!validateEmail(email)) {
      throw new Error("Please enter a valid email address.");
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing up:", error);
      throw new Error("Failed to sign up. Please try again.");
    }
  },

  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw new Error("Failed to reset password. Please try again.");
    }
  },

  checkSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (data.session) {
        const role = data.session.user?.user_metadata?.role || "user";
        set({ session: data.session, role });
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  },

  setRole: (role: string) => {
    if (["admin", "user"].includes(role)) {
      set({ role });
    } else {
      console.warn("Invalid role:", role);
    }
  },
}));

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
