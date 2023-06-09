import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import "react-native-gesture-handler";
import { useAuth } from "../context/authentication";

import Login from "./login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Orders } from "./modules/waiter/orders";
import { Cart } from "./cart/cart";
import { CartIcon } from "./cart/cartIcon";
import { useCart } from "../context/cart";
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator useLegacyImplementation={true} initialRouteName="Feed">
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Article" component={Article} />
    </Drawer.Navigator>
  );
}
function HomeScreen({}) {
  const navigation = useNavigation();
  const { setUser } = useAuth();

  return (
    <View
      className="bg-[#FF0000]"
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text
        onPress={async () => {
          await AsyncStorage.removeItem("credentials");
          setUser(null);
        }}
      >
        Home Screen
      </Text>
    </View>
  );
}
function Feed({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text onPress={() => navigation.navigate("Home")}>Feed</Text>
    </View>
  );
}
function Article() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Artucke</Text>
    </View>
  );
}
export function Screens() {
  const { user, authStatus, setUser } = useAuth();
  const { resetCart } = useCart();
  // const { navigate } = useNavigation();
  return (
    <NavigationContainer>
      {!authStatus ? (
        <Text>Loading...</Text>
      ) : (
        <Stack.Navigator>
          {/* <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Drawer"
          options={{ headerShown: false }}
          component={MyDrawer}
        /> */}
          <Stack.Screen
            name={user ? "Orders" : "Login"}
            component={user ? Orders : Login}
            options={{
              headerTitleAlign: "center",
              headerTitleStyle: { fontFamily: "Poppins_600SemiBold" },
              headerLeft: ({}) => user && <CartIcon />,
              headerRight: ({}) =>
                user && (
                  <Text
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                    className="bg-blue-900 text-white p-1"
                    onPress={async () => {
                      await AsyncStorage.removeItem("credentials");
                      setUser(null);
                      resetCart();
                    }}
                  >
                    Logout
                  </Text>
                ),
            }}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerTitleStyle: { fontFamily: "Poppins_600SemiBold" },
            }}
            name={"Cart"}
            component={Cart}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
