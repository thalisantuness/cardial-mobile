import React from "react";
import AppNavigator from "./src/routes/AppNavigator";
import { ContextProvider } from "./src/context/AuthContext";
import { SocketProvider } from "./src/context/SocketContext";

export default function App() {
  return (
    <ContextProvider>
      <SocketProvider>
        <AppNavigator />
      </SocketProvider>
    </ContextProvider>
  );
}