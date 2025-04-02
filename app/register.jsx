// app/register.jsx
import { useState } from "react";
import { View, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { registerUser } from "../services/firebaseAuthService";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) return Alert.alert("Missing Info", "Email and password required.");
    if (password.length < 6) return Alert.alert("Weak Password", "Must be at least 6 characters.");

    setLoading(true);
    try {
      await registerUser(email.trim(), password);
      Alert.alert("Success", "Account created!");
      router.replace("/groups");
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text.trim())}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        style={styles.button}
      >
        {loading ? "Creating Account..." : "Register"}
      </Button>

      <Button
        mode="text"
        onPress={() => router.replace("/")}
        style={styles.button}
      >
        Back to Login
      </Button>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "85%",
    maxWidth: 300,
    alignSelf: "center",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
  },
};

