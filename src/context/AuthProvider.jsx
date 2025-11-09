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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loginGoogle = () => signInWithPopup(auth, googleProvider);
  const signInEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const registerUser = (name, email, password, photo) =>
    createUserWithEmailAndPassword(auth, email, password).then((res) =>
      updateProfile(res.user, { displayName: name, photoURL: photo })
    );
  const logOut = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginGoogle,
        signInEmail,
        registerUser,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
