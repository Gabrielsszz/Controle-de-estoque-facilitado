import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Carregar token ao abrir o app
  useEffect(() => {
    async function loadToken() {
      const storedToken = await AsyncStorage.getItem("@token");
      if (storedToken) setToken(storedToken);
      setLoading(false);
    }

    loadToken();
  }, []);

  // 🔐 LOGIN
  async function signIn(email, password) {
    if (!email || !password) return false;

    try {
      const response = await fetch(
        "https://controle-de-estoque-facilitado.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("@token", data.token);
        setToken(data.token);
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // 📝 CADASTRO
  async function signUp({ name, email, password }) {
    try {
      const response = await fetch(
        "https://controle-de-estoque-facilitado.onrender.com/auth/register", 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      return response.ok;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // 🚪 LOGOUT
  async function signOut() {
    await AsyncStorage.removeItem("@token");
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        signed: !!token,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}