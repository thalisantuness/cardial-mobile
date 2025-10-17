import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";


const Stack = createNativeStackNavigator();

function SolicitacoesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Orders"
                component={OrdersScreen}
                options={{ title: "Pedidos" }}
            />
          <Stack.Screen
                name="OrderDetails"
                component={OrderDetails}
                options={{ title: "Detalhes do Produto do pedido" }}
            /> 
          
        </Stack.Navigator>
    );
}

export default SolicitacoesStack;