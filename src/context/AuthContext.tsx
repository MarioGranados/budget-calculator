"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
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
      fetchUserData(storedToken); // Fetch user data if token exists
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to fetch user data:", err.message);
      } else {
        console.error("Failed to fetch user data:", String(err));
      }
      setUser(null); // Set user to null for errors
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      // Set token and user
      setToken(response.data.token);
      setUser(response.data.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login failed:", err.message);
      } else {
        console.error("Login failed:", String(err));
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login"); // Redirect to login page
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
