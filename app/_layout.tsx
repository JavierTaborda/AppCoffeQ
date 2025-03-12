import Toast from "react-native-toast-message";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { Button } from "react-native";
export default function RootLayout() {
  const { session, checkSession, signOut } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkSession(); 
  }, [checkSession]);

  useEffect(() => {
    if (session) {
      router.replace("/"); 
    } else {
      router.replace("/auth/signIn"); 
    }
  }, [session, router]);

  return (
    <>
      <Stack>
        <Stack.Screen name="auth/signIn" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signUp" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
      {typeof window !== "undefined" && session && (
        <Button title="Sign Out" onPress={signOut} />
      )}
    </>
  );
}
