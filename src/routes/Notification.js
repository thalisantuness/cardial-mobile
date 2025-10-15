import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../pages/Orders";
// import ProductDetailsScreen from "../pages/ProductDetails";
// import ProductDetailsScreen from "../pages/Orders/ProductDetails";


const Stack = createNativeStackNavigator();

function SolicitacoesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Orders"
                component={OrdersScreen}
                options={{ title: "Pedidos" }}
            />
          {/* <Stack.Screen
                name="ProductDetails"
                component={ProductDetailsScreen}
                options={{ title: "Detalhes do Produto" }}
            />  */}
          
        </Stack.Navigator>
    );
}

export default SolicitacoesStack;