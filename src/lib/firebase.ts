import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "elaborate-stronghold-rb34d",
  appId: "1:110543058753:web:b1a99acb41b8af634b93c0",
  apiKey: "AIzaSyDMLejiJqRG6MRBsyryyX4kN2_CQW4GbDM",
  authDomain: "elaborate-stronghold-rb34d.firebaseapp.com",
  storageBucket: "elaborate-stronghold-rb34d.firebasestorage.app",
  messagingSenderId: "110543058753",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-bloggerstudio-30f038c1-a3cd-4de3-951c-0c7131425949");
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
