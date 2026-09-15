import React, {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("fixnearUser");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem("fixnearUser");
        return null;
      }
    }

    return null;
  });

  const login = (userData, token) => {
    setUser(userData);

    localStorage.setItem(
      "fixnearUser",
      JSON.stringify(userData)
    );

    if (token) {
      localStorage.setItem("fixnearToken", token);
    }
  };

  const logout = () => {
    localStorage.removeItem("fixnearUser");
    localStorage.removeItem("fixnearToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;