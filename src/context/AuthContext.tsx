/*
 * PURPOSE:
 * This component creates a global state provider for authentication. It listens
 * for login/logout events and makes the user's status available everywhere
 * in your app without needing to pass props down manually.
 *
 */
"use client"; // This is a client-side context

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";

// Define the shape of the context data
interface AuthContextType {
  user: User | null; // This is the Firebase User object
  loading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes from Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  // Render children only when not loading to prevent layout shifts or
  // showing the wrong UI momentarily.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context data
export const useAuth = () => {
  return useContext(AuthContext);
};
