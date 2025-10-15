import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GiftsScreen from "../pages/Gifts";
// import IndicateFriendScreen from "../pages/IndicateFriend";
// import MyIndicationsScreen from "../pages/MyIndications";
// import RewardsScreen from "../pages/Rewards";
// import RewardsHistoryScreen from "../pages/RewardsHistory";

const Stack = createNativeStackNavigator();

function GiftStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Gifts"
                component={GiftsScreen}
            />
            {/* <Stack.Screen
                name="IndicateFriend"
                component={IndicateFriendScreen}
            />
            <Stack.Screen
                name="MyIndications"
                component={MyIndicationsScreen}
            />
            <Stack.Screen
                name="Rewards"
                component={RewardsScreen}
            />
            <Stack.Screen
                name="RewardsHistory"
                component={RewardsHistoryScreen}
            /> */}
        </Stack.Navigator>
    );
}

export default GiftStack;