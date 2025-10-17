import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "../pages/Cart";

const Stack = createNativeStackNavigator();

function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Carrinho" component={CartScreen} />
    </Stack.Navigator>
  );
}

export default CartStack;
