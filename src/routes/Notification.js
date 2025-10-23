import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import ProductsOrder from "../pages/ProductsOrder";
import OrdersList from "../pages/OrdersList";
import OrderDetailsView from "../pages/OrderDetailsView";


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
            <Stack.Screen
                name="ProductsOrder"
                component={ProductsOrder}
                options={{ title: "Produtos para Pedidos" }}
            />
            <Stack.Screen
                name="OrdersList"
                component={OrdersList}
                options={{ title: "Meus Pedidos" }}
            />
            <Stack.Screen
                name="OrderDetailsView"
                component={OrderDetailsView}
                options={{ title: "Detalhes do Pedido" }}
            />
        </Stack.Navigator>
    );
}

export default SolicitacoesStack;