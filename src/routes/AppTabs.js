import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import HomeStack from "./HomeStack";
import ChatStack from "./ChatStack";
import ProfileStack from "./ProfileStack";
import FretesStack from "./FretesStack";
import CartStack from "./CartStack";
import GiftStack from "./GiftStack";
import SolicitacoesStack from "./Notification";
import { colors } from "../colors";

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.laranjaPrincipal,
        tabBarInactiveTintColor: colors.cinza,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "HomeTab":
              iconName = focused ? "home" : "home";
              break;
            case "Chat":
              iconName = focused ? "message-circle" : "message-circle";
              break;
            case "Solicitações":
              iconName = "inbox";
              break;
            case "Perfil":
              iconName = focused ? "user" : "user";
              break;
            case "Fretes":
              iconName = "truck";
              break;
            default:
              iconName = "inbox";
              break;
          }
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Loja" component={HomeStack} />
      <Tab.Screen name="Agendar" component={FretesStack} />
      <Tab.Screen name="Pedidos" component={SolicitacoesStack} />
      <Tab.Screen name="Presentes" component={GiftStack} />
      <Tab.Screen name="Chat" component={ChatStack} />                                                                                                                                                
      <Tab.Screen name="Carrinho" component={CartStack} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default AppTabs;
