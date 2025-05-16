// app/register.jsx
import { useEffect, useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { RelativePathString, useRouter } from "expo-router";
import { registerUser } from "../services/firebaseAuthService";
import { useThemeColor, getThemeObject } from "@/hooks/useThemeColor";

// conditions for registering
const accountRequirements = {
  phoneNumberRequired: true,
  // requirements for passwords
  password: {
    minLength: 6, // 0 to remove the requirement
    mixedCase: true, // password must contain uppercase and lowercase characters
    containsNumber: true,
    containsSpecialCharacter: true
  }
};

let invalidPasswordMessage = "Password must ";
if (accountRequirements.password.minLength > 0) {
  invalidPasswordMessage += `be at least ${accountRequirements.password.minLength} characters`
}

let buffer: string[] = [];
if (accountRequirements.password.mixedCase) {
  buffer.push("uppercase and lowercase letters");
}
if (accountRequirements.password.containsNumber) {
  buffer.push("a number");
}
if (accountRequirements.password.containsSpecialCharacter) {
  buffer.push("a special character");
}

if (buffer.length > 0) {
  invalidPasswordMessage += " and contain ";
}
if (buffer.length === 1) {
  invalidPasswordMessage += `${buffer[0]}`;
}
else if (buffer.length === 2) {
  invalidPasswordMessage += `${buffer[0]} and ${buffer[1]}`;
}
else if (buffer.length === 3) {
  invalidPasswordMessage += `${buffer[0]}, ${buffer[1]}, and ${buffer[2]}`;
}

invalidPasswordMessage += ".";

// messages displayed at the bottom for each issue. if there are multiple issues, the message that
// is highest in this list is used
const errorMessages = {
  noUsername: "A username is required.",
  noEmail: "An email address is required.", // used when email is missing entirely
  invalidEmail: "Email address is invalid.",
  noPhoneNumber: "A phone number is required.", // used when phone number is missing entirely
  invalidPhoneNumber: "Phone number is invalid.",
  noPassword: "A password is required.", // used when password is missing entirely
  invalidPassword: invalidPasswordMessage, // used when password doesn't meet all requirements
  passwordsDoNotMatch: "Passwords do not match."
};

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const [currentErrorMessage, setCurrentErrorMessage] = useState(errorMessages.noUsername);

  // updates whether fields are enabled and returns what error message should be displayed
  function updateFieldStatus(): string {
    // assume registration is disabled
    setSubmitButtonEnabled(false);

    if (username === "") {
      return errorMessages.noUsername;
    }

    if (email === "") {
      return errorMessages.noEmail;
    }
    // this only checks if the email COULD exist, not if it actually does
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return errorMessages.invalidEmail;
    }

    if (phoneNumber === "" && accountRequirements.phoneNumberRequired) {
      return errorMessages.noPhoneNumber;
    }
    if (phoneNumber !== "" && !(/\+?[0-9]{3,5}\-[0-9]{3}-[0-9]{4}$/.test(phoneNumber))) {
      return errorMessages.invalidPhoneNumber;
    }

    if (password === "") {
      return errorMessages.noPassword;
    }

    // check if all password requirements are met
    let passwordValid = true;
    if (password.length < accountRequirements.password.minLength) {
      passwordValid = false;
    }
    if (passwordValid && accountRequirements.password.mixedCase) {
      passwordValid = /[a-z]/.test(password) && /[A-Z]/.test(password);
    }
    if (passwordValid && accountRequirements.password.containsNumber) {
      passwordValid = /\d/.test(password);
    }
    if (passwordValid && accountRequirements.password.containsSpecialCharacter) {
      passwordValid = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
    }
    if (!passwordValid) {
      return errorMessages.invalidPassword;
    }

    if (password !== password2) {
      return errorMessages.passwordsDoNotMatch;
    }

    setSubmitButtonEnabled(true);
    return "";
  }

  useEffect(() => {
    setCurrentErrorMessage(updateFieldStatus);
  }, [username, email, phoneNumber, password, password2]);

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
      router.replace("/groups" as RelativePathString);
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
        />
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
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
        <TextInput
          label="Reenter Password"
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
        />

        <Button
          mode="contained"
          onPress={()=>{}}
          loading={loading}
          style={styles.button}
          theme={submitButtonTheme}
          disabled={!submitButtonEnabled}
        >
          {loading ? "Processing..." : "Create Account"}
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.push("/" as RelativePathString)}
          style={[styles.button, styles.whiteButton]}
          labelStyle={{ color: "#fff" }}
        >
          Login With Existing Account
        </Button>

        <Text style={styles.errorText}>{currentErrorMessage}</Text>
      </View>
    </View>
  );
}

// for correct colors when the submit button is disabled
const submitButtonTheme = {
  ...getThemeObject(),
  colors: {
    ...getThemeObject().colors,
    surfaceDisabled: useThemeColor("surface"),
    onSurfaceDisabled: useThemeColor("surfaceVariant")
  }
};

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
  errorText: {
    fontSize: 16,
    color: "#ff4040",
    textAlign: "center",
    marginTop: 10,
  }
});

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

