import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SolicitacoesScreen from "../pages/Solicitacoes";

const Stack = createNativeStackNavigator();

function SolicitacoesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Solicitacoes"
                component={SolicitacoesScreen}
                options={{ title: "Solicitacoes" }}
            />
        </Stack.Navigator>
    );
}

export default SolicitacoesStack;