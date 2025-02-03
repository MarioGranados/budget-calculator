"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

// Define a User interface based on the response structure (adjust as needed)
interface User {
  id: string;
  email: string;
  name: string;
  // Add other properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // fetchUserData(storedToken); 
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/users/login", { email, password });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      // Set token (no user data fetch here)
      setToken(response.data.token);
      setUser(response.data.user)
    } catch (err: any) {
      console.error("Login failed:", err.message || err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login"); // Redirect to login page
  };

  // Set isAuthenticated based on token and user
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
