import { useState, useMemo, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  useAuthRequest,
  exchangeCodeAsync,
  revokeAsync,
  ResponseType,
} from "expo-auth-session";
import { View, Alert, Image } from "react-native";
import { Button, Text, TextInput, ActivityIndicator } from "react-native-paper";
import { Redirect, useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const clientId = "13524tn38254dqsrm1tsn52hc9";
const userPoolUrl =
  "https://us-east-2gnixjqqd3.auth.us-east-2.amazoncognito.com";
const redirectUri = "myapp://groups";

export default function Index() {
  const router = useRouter();
  const [authTokens, setAuthTokens] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const discoveryDocument = useMemo(
    () => ({
      authorizationEndpoint: userPoolUrl + "/oauth2/authorize",
      tokenEndpoint: userPoolUrl + "/oauth2/token",
      revocationEndpoint: userPoolUrl + "/oauth2/revoke",
    }),
    []
  );

  const [request, response, promptAsync] = useAuthRequest(
    { clientId, responseType: ResponseType.Code, redirectUri, usePKCE: true },
    discoveryDocument
  );

  useEffect(() => {
    const exchangeFn = async (exchangeTokenReq) => {
      try {
        setLoading(true);
        const exchangeTokenResponse = await exchangeCodeAsync(
          exchangeTokenReq,
          discoveryDocument
        );
        setAuthTokens(exchangeTokenResponse);
        router.push("/groups"); 
      } catch (error) {
        console.error(error);
        Alert.alert("Login Failed", "Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (response) {
      if (response.error) {
        Alert.alert(
          "Authentication error",
          response.params.error_description || "Something went wrong"
        );
        return;
      }
      if (response.type === "success") {
        exchangeFn({
          clientId,
          code: response.params.code,
          redirectUri,
          extraParams: { code_verifier: request.codeVerifier },
        });
      }
    }
  }, [discoveryDocument, request, response, router]);

  const logout = async () => {
    await revokeAsync({ clientId, token: authTokens?.refreshToken }, discoveryDocument);
    setAuthTokens(null);
  };

  if (authTokens) {
    return <Redirect href="/groups" />;s
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Welcome to GroupSync</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
  
      {/* 🔹 Login Inputs */}
      <View style={styles.inputContainer}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
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
          onPress={() => promptAsync()}
          loading={loading}
          style={styles.button}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <Button
          mode="outlined"
          onPress={() => promptAsync()}
          loading={loading}
          style={[styles.button, styles.whiteButton]} 
          labelStyle={{ color: "#fff" }}
        >
          {loading ? "Redirecting to Sign Up..." : "Create an Account"}
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
};
