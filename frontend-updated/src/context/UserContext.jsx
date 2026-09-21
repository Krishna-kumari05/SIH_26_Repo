import { createContext, useContext, useState, useEffect } from "react";
import {getCurrentUser} from "../services/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // { username, email, phone }
  const [loading, setLoading] = useState(true);

  // Called right after Signup succeeds.
  function setSignupUser({ username, email, phone }) {
    setUser({ username, email, phone: phone || null });
  }

  // data returned form bacckend--username + email
  function setLoginUser(userData) {
    if (!userData) {
      setUser(null);
      return;
    }
    setUser({
      username: userData.username || null,
      email: userData.email,
      phone: userData.phone || null,
    });
  }

  useEffect(() => {
  async function loadUser() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await getCurrentUser();

      setUser({
        id: data.id,
        username: data.username ?? data.name ?? null,
        email: data.email,
        phone: data.phone ?? null,
      });
    } catch (error) {
      console.error("Failed to load current user:", error);

      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  loadUser();
}, []);

  function clearUser() {
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, setSignupUser, setLoginUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}