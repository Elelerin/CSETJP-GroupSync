// services/firebaseAuthService.js
import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {getAuth} from "firebase/auth";


export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
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