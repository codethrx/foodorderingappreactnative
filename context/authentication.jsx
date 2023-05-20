import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Auth = createContext();
export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState(false);
  const [user, setUser] = useState(null);
  console.log("mo", user);
  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const data = await AsyncStorage.getItem("credentials");
        console.log(data);
        setUser(JSON.parse(data));
        setAuthStatus(true);
      } catch (e) {
        console.log(e);
      }
    };
    getUserFromStorage();
  }, []);
  return (
    <Auth.Provider value={{ user, setUser, authStatus }}>
      {children}
    </Auth.Provider>
  );
}

export function useAuth() {
  return useContext(Auth);
}
