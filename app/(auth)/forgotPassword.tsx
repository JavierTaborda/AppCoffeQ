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

const forgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { resetPassword } = useAuthStore();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleResetPassword = async () => {
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
      const result = await resetPassword(email);
      if (result) {
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Se ha enviado un correo para restablecer tu contraseña.",
        });
        router.replace("/(auth)/signIn");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "El correo no está registrado en el sistema.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Ocurrió un error",
      });
    }
    finally{
      setLoading(false);
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
      <Text style={styles.title}>Restablecer Contraseña</Text>
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Enviando..." : "Restablecer Contraseña"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/(auth)/signIn")}>
        <Text style={styles.linkText}>Volver a Iniciar Sesión</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: colors.whiteBack,
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: colors.white,
    fontSize: 14,
    marginTop: 16,
    textDecorationLine: "underline",
  },
});

export default forgotPassword;
