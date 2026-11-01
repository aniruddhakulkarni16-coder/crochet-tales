import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { checkToken, clearToken } from "./adminApi";

const AdminContext = createContext({
  isAdmin: false,
  ready: false,
  loginOpen: false,
  openLogin: () => {},
  closeLogin: () => {},
  refresh: () => {},
  logout: () => {},
});

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const refresh = useCallback(async () => {
    const ok = await checkToken();
    setIsAdmin(ok);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const logout = () => {
    clearToken();
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider
      value={{ isAdmin, ready, loginOpen, openLogin, closeLogin, refresh, logout }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}