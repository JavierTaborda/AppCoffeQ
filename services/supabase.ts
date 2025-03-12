
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY as string;


const isMobile = Platform.OS === "ios" || Platform.OS === "android";

const storage = isMobile ? AsyncStorage : undefined;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: storage, 
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: !isMobile, 
  },
});