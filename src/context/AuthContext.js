import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as apiLogin } from "../services/api"; 

const AuthContext = createContext();

export const ContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userCreatedAt, setUserCreatedAt] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const storedToken = await AsyncStorage.getItem("userToken");
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setUserId(userData.usuario_id);
          setUserEmail(userData.email);
          setUserName(userData.nome_completo || "");
          setUserRole(userData.role || "");
          setIsAuth(true);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, senha) => {
    try {
      setLoading(true);
      const response = await apiLogin({ email, senha }); // Use apiLogin em vez de login
      const { token, usuario } = response;
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(usuario));
      setToken(token);
      setUser(usuario);
      setUserId(usuario.usuario_id);
      setUserEmail(usuario.email);
      setUserName(usuario.nome_completo || "");
      setUserRole(usuario.role || "");
      setIsAuth(true);
      return usuario;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      setToken("");
      setUser(null);
      setUserId(null);
      setUserEmail("");
      setUserName("");
      setUserRole("");
      setIsAuth(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        token,
        setToken,
        userName,
        setUserName,
        user,
        setUser,
        loading,
        setLoading,
        userId,
        setUserId,
        userEmail,
        setUserEmail,
        userCreatedAt,
        setUserCreatedAt,
        userRole,
        setUserRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useContextProvider = () => useContext(AuthContext);