import React, {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("fixnearUser");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });


  // Login
  const login = (userData, token) => {

    setUser(userData);

    localStorage.setItem(
      "fixnearUser",
      JSON.stringify(userData)
    );

    if (token) {
      localStorage.setItem(
        "fixnearToken",
        token
      );
    }
  };


  // Logout
  const logout = () => {

    setUser(null);

    localStorage.removeItem("fixnearUser");
    localStorage.removeItem("fixnearToken");
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