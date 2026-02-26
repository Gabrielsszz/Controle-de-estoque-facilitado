import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  async function signIn(email, password) {
    if (!email || !password) return false;

    const storedUsers = await AsyncStorage.getItem("@users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      return true;
    }

    return false;
  }

  async function signUp({ name, email, password }) {
    if (!name || !email || !password) return false;

    const storedUsers = await AsyncStorage.getItem("@users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const userExists = users.some((u) => u.email === email);
    if (userExists) return false;

    const newUser = { name, email, password };

    users.push(newUser);
    await AsyncStorage.setItem("@users", JSON.stringify(users));

    return true;
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
