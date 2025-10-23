import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FretesScreen from '../pages/Fretes';
import FreteDetalhesScreen from '../pages/FreteDetalhes';
import CriarFreteScreen from '../pages/CriarFrete';
import SchedulesScreen from '../pages/Schedule';
import ScheduleDetails from '../pages/ScheduleDetails';
import ServicesScreen from '../pages/Services';
// import EditarAgendamento from '../pages/EditarAgendamento';

const Stack = createNativeStackNavigator();

function FretesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Schedules" component={SchedulesScreen} />
      <Stack.Screen name="Services" component={ServicesScreen} />
      {/* <Stack.Screen name="FretesList" component={FretesScreen} />
      <Stack.Screen name="FreteDetalhes" component={FreteDetalhesScreen} />
      <Stack.Screen name="CriarFrete" component={CriarFreteScreen} /> */}

      <Stack.Screen name="DetalhesAgendamento" component={ScheduleDetails} />
      {/* <Stack.Screen name="CriarAgendamento" component={CriarAgendamento} />
      <Stack.Screen name="EditarAgendamento" component={EditarAgendamento} /> */}
    </Stack.Navigator>
  );
}

export default FretesStack;