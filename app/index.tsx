import { useState, useEffect } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Redirect, RelativePathString, useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { loginUser, registerUser } from "../services/firebaseAuthService";
import Globals from "@/services/globals"
import { syncUserWithAWS } from "../services/awsService"; 
import * as React from 'react';

export default function Index() {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u!));
    return () => unsubscribe();
  }, []);


  
  const handleSubmit = async () => {
    console.log("handleSubmit");
    await Globals.setUser("Wdd2FIDVF5b6EfLLbO5xGS6JhWM2");
    if (!email || !password) {
      return Alert.alert("Missing Info", "Please enter email and password.");
    }
  
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      router.push("/groups" as RelativePathString);
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login failed", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to GroupSync</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text.trim())}
          style={styles.input}
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        >
          {loading ? "Processing..." : "Login"}
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.push("/register" as RelativePathString)}
          style={[styles.button, styles.whiteButton]}
          labelStyle={{ color: "#fff" }}
        >
          Create an Account
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 100,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "85%",
    maxWidth: 300,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  button: {
    width: "100%",
    marginTop: 10,
  },
  whiteButton: {
    borderColor: "#fff",
  },
});
