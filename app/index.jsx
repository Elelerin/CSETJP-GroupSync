import { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Redirect, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { loginUser, registerUser } from "../services/firebaseAuthService";

export default function Index() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);


  const handleSubmit = async () => {
    if (!email || !password) return Alert.alert("Missing Info", "Enter email & password");
  
    console.log("Email:", email);
    console.log("Password:", password);
  
    setLoading(true);
    try {
      if (isRegistering) {
        console.log("Registering...");
        await registerUser(email, password);
      } else {
        console.log("Logging in...");
        await loginUser(email, password);
      }
      console.log("Redirecting to /groups...");
      router.push("/groups");
    } catch (error) {
      console.error("Firebase Auth Error:", error);
      Alert.alert("Auth Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  

  if (user) return <Redirect href="/groups" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to GroupSync</Text>
      <Text style={styles.subtitle}>
        {isRegistering ? "Create an account" : "Sign in to continue"}
      </Text>

      <View style={styles.inputContainer}>
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
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        >
          {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
        </Button>

        <Button
          mode="outlined"
          onPress={() => setIsRegistering(!isRegistering)}
          style={[styles.button, styles.whiteButton]}
          labelStyle={{ color: "#fff" }}
        >
          {isRegistering ? "Back to Login" : "Create an Account"}
        </Button>
      </View>
    </View>
  );
}

const styles = {
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
};
