import React, {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("fixnearUser");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  const login = (userData) => {

    setUser(userData);

    localStorage.setItem(
      "fixnearUser",
      JSON.stringify(userData)
    );
  };

  const logout = () => {

    setUser(null);

    localStorage.removeItem("fixnearUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
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