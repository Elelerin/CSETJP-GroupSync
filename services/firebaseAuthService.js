// services/firebaseAuthService.js
import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getAuth } from "firebase/auth";

export const getIdToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};
