// app/register.jsx
import { useState } from "react";
import { View, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { registerUser } from "../services/firebaseAuthService";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      return Alert.alert("Missing Info", "Username, email and password required.");
    }
    if (password.length < 6) {
      return Alert.alert("Weak Password", "Must be at least 6 characters.");
    }

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

      <View style={styles.inputContainer}>
      <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Reenter Password"
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
        />

        <Button
          mode="contained"
          onPress={()=>{}}
          loading={loading}
          style={styles.button}
        >
          {loading ? "Processing..." : "Create Account"}
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.push("/")}
          style={[styles.button, styles.whiteButton]}
          labelStyle={{ color: "#fff" }}
        >
          Login With Existing Account
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

// const styles = {
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     paddingHorizontal: 20,
//     backgroundColor: "#121212",
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   inputContainer: {
//     width: "85%",
//     maxWidth: 300,
//     alignSelf: "center",
//   },
//   input: {
//     marginBottom: 10,
//     backgroundColor: "#fff",
//   },
//   button: {
//     marginTop: 10,
//   },
// };

