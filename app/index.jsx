// import { useState, useMemo, useEffect } from "react";
// //pushing to githubgi
// import * as WebBrowser from "expo-web-browser";
// import {
//   useAuthRequest,
//   exchangeCodeAsync,
//   revokeAsync,
//   ResponseType,
// } from "expo-auth-session";
// import { View, Alert, Image } from "react-native";
// import { Button, Text, TextInput, ActivityIndicator } from "react-native-paper";
// import { Redirect, useRouter } from "expo-router";
// import { Linking } from "react-native";

// WebBrowser.maybeCompleteAuthSession();

// const clientId = "13524tn38254dqsrm1tsn52hc9";
// const userPoolUrl =
//   // "https://us-east-2gnixjqqd3.auth.us-east-2.amazoncognito.com";

//   "https://us-east-2cu0pldapg.auth.us-east-2.amazoncognito.com/login?client_id=7lqfc69dea2l377pkc3mnvqvk4&redirect_uri=http://localhost:8081/&response_type=code"
// const redirectUri = "myapp://groups";

// export default function Index() {
//   const router = useRouter();
//   const [authTokens, setAuthTokens] = useState(null);
//   const [loading, setLoading] = useState(false); 
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const discoveryDocument = useMemo(
//     () => ({
//       authorizationEndpoint: userPoolUrl + "/oauth2/authorize",
//       tokenEndpoint: userPoolUrl + "/oauth2/token",
//       revocationEndpoint: userPoolUrl + "/oauth2/revoke",
//     }),
//     []
//   );

//   const [request, response, promptAsync] = useAuthRequest(
//     { clientId, responseType: ResponseType.Code, redirectUri, usePKCE: true },
//     discoveryDocument
//   );

  
//   const authUrl = "https://us-east-2cu0pldapg.auth.us-east-2.amazoncognito.com/login?client_id=7lqfc69dea2l377pkc3mnvqvk4&redirect_uri=http://localhost:8081/&response_type=code";

//   useEffect(() => {
//     const handleRedirect = async () => {
//       // Open the Cognito login in the main browser
//       Linking.openURL(authUrl);
      
//       // Listen for the redirect
//       const handleUrl = (event) => {
//         const url = event.url || window.location.href;
//         const urlParams = new URLSearchParams(new URL(url).search);
//         const authCode = urlParams.get("code");
  
//         if (authCode) {
//           console.log("Auth Code received:", authCode);
  
//           // Exchange the auth code for tokens
//           exchangeFn({
//             clientId: "7lqfc69dea2l377pkc3mnvqvk4",
//             code: authCode,
//             redirectUri: "http://localhost:8081;",
//           });
  
//           // Remove auth code from URL after handling
//           router.replace("/groups");
//         }
//       };
  
//       // Add event listener to handle redirect in React Native Web
//       Linking.addEventListener("url", handleUrl);
//       return () => Linking.removeEventListener("url", handleUrl);
//     };
  
//     handleRedirect();
//   }, []);
  

//   const logout = async () => {
//     await revokeAsync({ clientId, token: authTokens?.refreshToken }, discoveryDocument);
//     setAuthTokens(null);
//   };

//   if (authTokens) {
//     return <Redirect href="/groups" />;s
//   }

//   return (
//     <View style={styles.container}>

//       <Text style={styles.title}>Welcome to GroupSync</Text>
//       <Text style={styles.subtitle}>Sign in to continue</Text>
  
//       <View style={styles.inputContainer}>
//         <TextInput
//           label="Username"
//           value={username}
//           onChangeText={setUsername}
//           style={styles.input}
//         />
//         <TextInput
//           label="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//           style={styles.input}
//         />
  
  

// <Button
//   mode="contained"
//   onPress={() => {
//     const authUrl = "https://us-east-2cu0pldapg.auth.us-east-2.amazoncognito.com/login?client_id=7lqfc69dea2l377pkc3mnvqvk4&redirect_uri=http://localhost:8081/&response_type=code";
    
//     Linking.openURL(authUrl); // This ensures the whole page redirects, not just a popup
//   }}
//   loading={loading}
//   style={styles.button}
// >
//   {loading ? "Signing In..." : "Sign In"}
// </Button>



//         <Button
//           mode="outlined"
//           onPress={() => promptAsync()}
//           loading={loading}
//           style={[styles.button, styles.whiteButton]}
//           labelStyle={{ color: "#fff" }}
//         >
//           {loading ? "Redirecting to Sign Up..." : "Create an Account"}
//         </Button>
//       </View>
//     </View>
//   );
// }

// const styles = {
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     backgroundColor: "#121212",
//   },
//   title: {
//     fontSize: 45,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 100,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#ccc",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   inputContainer: {
//     width: "85%", 
//     maxWidth: 300, 
//   },
//   input: {
//     width: "100%",
//     marginBottom: 10,
//     backgroundColor: "#FFFFFF",
//   },
//   button: {
//     width: "100%",
//     marginTop: 10,
//   },
// };
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
import { Linking } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const clientId = "13524tn38254dqsrm1tsn52hc9";
const userPoolUrl =
  // "https://us-east-2gnixjqqd3.auth.us-east-2.amazoncognito.com";

  "https://us-east-2cu0pldapg.auth.us-east-2.amazoncognito.com/login?client_id=7lqfc69dea2l377pkc3mnvqvk4&redirect_uri=http://localhost:8081/&response_type=code"
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

  
  const authUrl = "https://us-east-2cu0pldapg.auth.us-east-2.amazoncognito.com/login?client_id=7lqfc69dea2l377pkc3mnvqvk4&redirect_uri=http://localhost:8081/&response_type=code";

  useEffect(() => {
    const handleRedirect = async () => {
      // Open the Cognito login in the main browser
      Linking.openURL(authUrl);
      
      // Listen for the redirect
      const handleUrl = (event) => {
        const url = event.url || window.location.href;
        const urlParams = new URLSearchParams(new URL(url).search);
        const authCode = urlParams.get("code");
  
        if (authCode) {
          console.log("Auth Code received:", authCode);
  
          // Exchange the auth code for tokens
          exchangeFn({
            clientId: "7lqfc69dea2l377pkc3mnvqvk4",
            code: authCode,
            redirectUri: "http://localhost:8081/tasks;",
          });
  
          // Remove auth code from URL after handling
          router.replace("/groups");
        }
      };
  
      // Add event listener to handle redirect in React Native Web
      Linking.addEventListener("url", handleUrl);
      return () => Linking.removeEventListener("url", handleUrl);
    };
  
    handleRedirect();
  }, []);
  

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
  onPress={() => {
    const authUrl = "https://us-east-2cu0pldapg.auth.us-east-2.amazoncognito.com/login?client_id=7lqfc69dea2l377pkc3mnvqvk4&redirect_uri=http://localhost:8081/&response_type=code";
    
    Linking.openURL(authUrl); // This ensures the whole page redirects, not just a popup
  }}
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