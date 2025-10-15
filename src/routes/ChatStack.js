import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConversasScreen from "../pages/Conversas";
import ChatScreen from "../pages/Chat";
import NovaConversaScreen from "../pages/Fretes";

const Stack = createNativeStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Conversas" component={ConversasScreen} options={{ title: "Conversas" }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat" }} />
      <Stack.Screen name="NovaConversa" component={NovaConversaScreen} options={{ title: "Contatos" }} />
    </Stack.Navigator>
  );
}

export default ChatStack;