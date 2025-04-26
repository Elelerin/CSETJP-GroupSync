// services/firebaseAuthService.js
import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { syncUserToDatabase } from "./registerUser"; 
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  try {
    await syncUserToDatabase(); 
  } catch (err) {
    console.error("Database sync after register failed (ignored):", err);
  }
  return userCredential;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  try {
    await syncUserToDatabase(); 
  } catch (err) {
    console.error("Database sync after login failed (ignored):", err);
  }
  return userCredential;
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const getCurrentUserUID = () => {
  return auth.currentUser ? auth.currentUser.uid : null;
};

export const getCurrentUserEmail = () => {
  return auth.currentUser ? auth.currentUser.email : null;
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const isUserLoggedIn = () => {
  return auth.currentUser !== null;
};

export const getAuthInstance = () => {
  return auth;
};

export const getAuthState = () => {
  return auth.currentUser;
};

export const getAuthStateListener = (callback) => {
  return auth.onAuthStateChanged(callback);
};

export const getAuthStateUnsubscribe = (unsubscribe) => {
  return unsubscribe();
};
