import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContextProvider } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuth } = useContextProvider(); // Access auth state

  useEffect(() => {
    const initializeSocket = async () => {
      if (!isAuth) return; // Only initialize if authenticated
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const socketInstance = io("https://truckage-api-production.up.railway.app", {
          auth: { token },
        });

        socketInstance.on("connect", () => {
          console.log("Conectado ao servidor Socket.IO");
        });

        socketInstance.on("connect_error", (error) => {
          console.error("Erro de conexão:", error.message);
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
        };
      }
    };

    initializeSocket();
  }, [isAuth]); // Re-run if auth state changes

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);