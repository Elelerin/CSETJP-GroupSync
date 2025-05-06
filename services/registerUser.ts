import { getAuth } from "firebase/auth";
import { useState, useCallback } from "react";
import Globals from "./globals"

// this is now Globals.userURL
// const USER_REGISTRATION_URL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User";

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
      await syncUserToDatabase();
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

export async function syncUserToDatabase() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No logged-in user found.");
  }

  const authToken = await user.getIdToken();

  const response = await fetch(Globals.userURL, {
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
  console.log("User synced to database:", data);
  Globals.setUser(data.user.userID);
  console.log(Globals.user());
  console.log(data.user.userID);
  return data;
}
