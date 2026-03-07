import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const login = (data) => {
    const authData = {
      token: data.token,
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
    };

    setUser(authData);
    localStorage.setItem("user", JSON.stringify(authData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
