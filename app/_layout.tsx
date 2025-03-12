import { Stack, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { Button } from "react-native";

export default function RootLayout() {
  const { session, signOut } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/auth/signIn");
    }
  }, [session, router]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
      {session && (
        <Button title="Sign Out" onPress={signOut} />
      )}
    </>
  );
}