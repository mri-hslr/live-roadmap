// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import API from "../services/api";

export interface User {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  // Login
  async function login(name: string) {
    try {
      const res = await API.post("/auth/login", { name });

      const user = res.data.user;
      const token = res.data.token;

      setUser(user);
      setToken(token);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (err) {
      console.error("Login failed", err);
      return { success: false, error: err };
    }
  }

  // Logout
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common["Authorization"];
  }

  return {
    user,
    token,
    loading,
    login,
    logout
  };
}
