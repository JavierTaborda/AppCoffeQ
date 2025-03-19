import React, { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const { signIn, signInWithGoogle } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor, complete todos los campos",
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor, ingrese un email válido",
      });
      return;
    }
    try {
      setLoading(true);
      await signIn(email, password);
      router.replace("/");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Ocurrió un error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const session = await signInWithGoogle();
      if (session) {
        router.replace("/");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Ocurrió un error",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerimg}>
        <Image
          source={require("@/assets/images/logowhite.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="email"
          size={20}
          color={colors.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.darkGray}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="lock"
          size={20}
          color={colors.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          placeholderTextColor={colors.darkGray}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Procesando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.googleButton}
        onPress={handleSignInWithGoogle}
      >
        <Image
          source={require("@/assets/images/google.png")}
          style={styles.googleIcon}
        />
        
        <Text style={styles.googleButtonText}>Iniciar Sesión con Google</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => router.push("/(auth)/forgotPassword")}>
        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/signUp")}>
        <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.secondary,
  },
  containerimg: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.whiteBack,
    borderColor: colors.lightWhite,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
    elevation: 3,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.darkGray,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
    elevation: 3,
  },
  buttonText: {
    color: colors.whiteBack,
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    justifyContent: "center",
    backgroundColor: colors.whiteBack,
    borderWidth: 1,
    borderColor: colors.whiteBack,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleButtonText: {
    color: colors.darkGray,
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: colors.white,
    fontSize: 14,
    marginTop: 16,
    textDecorationLine: "underline",
  },

  loadingText: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: colors.inactive,
  },
});

export default SignIn;
