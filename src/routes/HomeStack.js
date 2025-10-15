import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../pages/Home/index';
import Store from '../pages/Store/index';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Store} />
      <Stack.Screen name="StoreScreen" component={Store} />
    </Stack.Navigator>
  );
}

export default HomeStack;