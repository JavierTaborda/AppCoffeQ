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

const SignUp = () => {
  const { signUp } = useAuthStore();
  const [name, setName] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignUp = async () => {
    setLoading(true);
    
    if (!name || !cedula || !email || !phone || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos son obligatorios",
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

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
  
      const { error } = await signUp(email, password);

      if (error) {
        
        let errorMessage = "Ocurrió un error durante el registro.";
        if (error.message.includes("already registered")) {
          errorMessage = "El correo electrónico ya está registrado.";
        } else if (error.message.includes("weak password")) {
          errorMessage = "La contraseña es demasiado débil.";
        }
        throw new Error(errorMessage);
      }


      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Registro exitoso. Por favor, inicia sesión.",
      });
      router.replace("/(auth)/signIn");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Ocurrió un error",
      });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerimg}>
        <Image
          source={require("@/assets/images/colorlogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Regístrate</Text>

      
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="person"
          size={20}
          color={colors.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre completo"
          placeholderTextColor={colors.darkGray}
          autoCapitalize="words"
        />
      </View>

      
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="credit-card"
          size={20}
          color={colors.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={cedula}
          onChangeText={setCedula}
          placeholder="Cédula"
          placeholderTextColor={colors.darkGray}
          keyboardType="numeric"
        />
      </View>

      
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
          name="phone"
          size={20}
          color={colors.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Teléfono"
          placeholderTextColor={colors.darkGray}
          keyboardType="phone-pad"
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

      
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="lock"
          size={20}
          color={colors.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirmar contraseña"
          placeholderTextColor={colors.darkGray}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <Text style={styles.buttonText}>Cargando...</Text>
        ) : (
          <Text style={styles.buttonText}>Regístrate</Text>
        )}
      </TouchableOpacity>

      
      <TouchableOpacity onPress={() => router.replace("/(auth)/signIn")}>
        <Text style={styles.linkText}>
          ¿Ya tienes una cuenta? Inicia sesión
        </Text>
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
    marginBottom: 10,
  },
  logo: {
    width: 400,
    height: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 15,
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
  },
  buttonDisabled: {
    backgroundColor: colors.inactive,
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

export default SignUp;
