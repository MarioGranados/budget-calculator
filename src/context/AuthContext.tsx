"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  username: string;
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
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser) as User);
      setToken(storedToken);
    } else if (storedToken && !storedUser) {
      fetchUserData(storedToken); // Fetch user data if token exists
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user correctly
    } catch (err: unknown) {
      console.error("Failed to fetch user data:", err);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });

      // Store token and user in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setToken(response.data.token);
      setUser(response.data.user);
    } catch (err: unknown) {
      console.error("Login failed:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/login");
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
