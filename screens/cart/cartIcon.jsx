import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
export function CartIcon(props) {
  const { navigate } = useNavigation();
  return (
    <View className="relative">
      <Text onPress={() => navigate("Cart")}>
        <Icon name="shopping-cart" size={20} color="black" />
      </Text>
      <View className="absolute -top-4 -right-2  bg-red-600 w-4 h-4  items-center justify-center rounded-full">
        <Text className="text-xs font-bold">2</Text>
      </View>
    </View>
  );
}
