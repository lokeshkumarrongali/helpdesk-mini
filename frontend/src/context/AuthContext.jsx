import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount check for token and load user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      // Optionally, fetch user profile
      api.get("/auth/profile")
        .then(res => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  function login(userData, token) {
    localStorage.setItem("token", token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("token");
    delete api.defaults.headers.Authorization;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
