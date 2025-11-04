import React, { createContext, useState, useEffect } from "react";
import api from "../services/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Runs when app reloads to restore user session
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // decode JWT
        setUser({
          id: decoded.id,
          role: decoded.role,
        });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

 const login = async (username, password, role) => {
  const res = await api.post("/auth/login", {
    username,
    password,
    role,   // ✅ send role to backend
  });

  localStorage.setItem("token", res.data.token);

  const decoded = JSON.parse(atob(res.data.token.split(".")[1]));

  setUser({
    id: decoded.id,
    role: decoded.role,
  });
};

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
