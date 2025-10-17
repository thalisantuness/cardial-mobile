import React from "react";
import AppNavigator from "./src/routes/AppNavigator";
import { ContextProvider } from "./src/context/AuthContext";
import { SocketProvider } from "./src/context/SocketContext";
import {CartProvider} from "./src/context/CartContext";

export default function App() {
  return (
    <ContextProvider>
      <SocketProvider>
        <CartProvider>
        <AppNavigator />
        </CartProvider>
      </SocketProvider>
    </ContextProvider>
  );
}