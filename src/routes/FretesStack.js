import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FretesScreen from '../pages/Fretes';
import FreteDetalhesScreen from '../pages/FreteDetalhes';
import CriarFreteScreen from '../pages/CriarFrete';

const Stack = createNativeStackNavigator();

function FretesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FretesList" component={FretesScreen} />
      <Stack.Screen name="FreteDetalhes" component={FreteDetalhesScreen} />
      <Stack.Screen name="CriarFrete" component={CriarFreteScreen} />
    </Stack.Navigator>
  );
}

export default FretesStack;