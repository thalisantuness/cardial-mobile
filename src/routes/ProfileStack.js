import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from "../pages/Profile";
import EditProfileScreen from "../pages/EditProfile";

const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
