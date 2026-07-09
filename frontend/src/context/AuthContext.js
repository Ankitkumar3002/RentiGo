import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setLoading(false); return; }
    authAPI.getMe()
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem("accessToken",  data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.user);
    return data.user;
  };

  const googleLogin = async (token) => {
    const { data } = await authAPI.googleLogin({ token });
    localStorage.setItem("accessToken",  data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
