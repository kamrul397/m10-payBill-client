import { useState, useEffect } from "react";
import { auth } from "../firebase.config";
import { AuthContext } from "./AuthContex";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track current logged-in user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Google login
  const loginGoogle = () => signInWithPopup(auth, googleProvider);

  // Email login (RENAMED for Login.jsx)
  const loginEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Register new user
  const registerUser = (name, email, password, photo) =>
    createUserWithEmailAndPassword(auth, email, password).then((res) =>
      updateProfile(res.user, { displayName: name, photoURL: photo })
    );

  // Logout
  const logOut = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginGoogle,
        loginEmail, // ✔ NOW available for Login.jsx
        registerUser,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
