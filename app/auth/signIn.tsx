import React, { useState } from 'react';
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SignIn = () => {
  const { signIn, signInWithGoogle } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.replace("/(tabs)/Products");
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      router.replace("/");
    } catch (error) {

      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
      style={styles.input}
      value={email}
      onChangeText={setEmail}
      placeholder="Email"
      keyboardType="email-address"
      autoCapitalize="none"
      />
      <TextInput
      style={styles.input}
      value={password}
      onChangeText={setPassword}
      placeholder="Password"
      secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Sign In with Google" onPress={handleSignInWithGoogle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default SignIn;