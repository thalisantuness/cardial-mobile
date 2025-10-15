import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../pages/Login/index";
import RegisterTrucker from "../pages/RegisterTrucker/index";
import RegisterCompany from "../pages/RegisterCompany/index";
import ChooseRegister from "../pages/ChooseRegister";

const Stack = createNativeStackNavigator();

function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ChooseRegister" component={ChooseRegister} />
      <Stack.Screen name="RegisterCompany" component={RegisterCompany} />
      <Stack.Screen name="RegisterTrucker" component={RegisterTrucker} />
    
    </Stack.Navigator>
  );
}

export default LoginStack;
