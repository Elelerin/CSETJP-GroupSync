// services/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWVMrrZQ0xCXHDLvhlI13ewvaD3D-rKpY",
  authDomain: "groupsync-8fd87.firebaseapp.com",
  projectId: "groupsync-8fd87",
  storageBucket: "groupsync-8fd87.appspot.com",
  messagingSenderId: "443077174489",
  appId: "1:443077174489:web:01316c47198fb3ae03cac8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
