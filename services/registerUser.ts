// file: services/registerUser.ts
import { getAuth } from "firebase/auth";
import { useState, useCallback } from "react";

const USER_REGISTRATION_URL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User";

interface RegisterUserResult {
  loading: boolean;
  error: string | null;
  registerUser: () => Promise<any>;
}

export function useRegisterUser(): RegisterUserResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await syncUserToDatabase(); // <- Call the real function inside hook
    } catch (err: any) {
      console.error("registerUser error:", err);
      setError(err.message || "An unknown error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, registerUser };
}

// ✅ 2. Plain function (for services/firebaseAuthService.js)
export async function syncUserToDatabase() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No logged-in user found.");
  }

  const authToken = await user.getIdToken();

  const response = await fetch(USER_REGISTRATION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("User registered to database:", data);
  return data;
}
