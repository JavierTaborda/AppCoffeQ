import { create } from "zustand";
import { supabase } from "@/services/supabase";

type AuthState = {
  session: any;
  role: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<boolean>;
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
      console.error("Error al iniciar sesión:", error);
      throw new Error("Error al iniciar sesión. Por favor, verifica tus credenciales.");
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
      console.error("Error al iniciar sesión con Google:", error);
      throw new Error("Error al iniciar sesión con Google.");
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ session: null, role: null });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw new Error("Error al cerrar sesión.");
    }
  },

  signUp: async (email, password) => {
    if (!email || !password) {
      throw new Error("El correo electrónico y la contraseña son obligatorios.");
    }
    if (!validateEmail(email)) {
      throw new Error("Por favor, ingresa una dirección de correo electrónico válida.");
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error al registrarse:", error);
      throw new Error("Error al registrarse. Por favor, inténtalo de nuevo.");
    }
  },

  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      throw new Error("Error al restablecer la contraseña. Por favor, inténtalo de nuevo.");
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
      console.error("Error al verificar la sesión:", error);
    }
  },

  setRole: (role: string) => {
    if (["admin", "user"].includes(role)) {
      set({ role });
    } else {
      console.warn("Rol inválido:", role);
    }
  },
}));

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
