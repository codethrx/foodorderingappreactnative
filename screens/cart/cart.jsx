import { View, ScrollView, Touchable, Image, Text } from "react-native";
import { useCart } from "../../context/cart";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Entypo";
export function Cart() {
  const { itemsOfCart, onCartItemAdd, onCartItemRemove, cartTotalPrice } =
    useCart();
  const navigation = useNavigation();

  return (
    <View className="bg-gray-200 pt-8 flex-1">
      <View className="flex flex-row w-[55%] items-center justify-between p-4 flex-[0.03]">
        <Text onPress={() => navigation.goBack()}>
          <Icon name="cross" size={24} color="black" />
        </Text>
        <Text className="text-xl" style={{ fontFamily: "Poppins_600SemiBold" }}>
          Cart
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 ">
        {itemsOfCart.length >= 1 &&
          itemsOfCart.map((item) => (
            <View key={item.slug} className={`bg-white flex-row m-2 `}>
              <Image height={100} width={200} source={{ uri: item.image }} />
              <View className="justify-center ">
                <Text
                  className="text-base pl-2"
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                >
                  {item.name}
                </Text>
                <Text
                  className="py-2 pl-2"
                  style={{ fontFamily: "Poppins_500Medium" }}
                >
                  {item.price}
                </Text>
                <View className="flex flex-row w-16 ml-2  justify-between items-center">
                  <Text
                    className="text-base"
                    onPress={() => onCartItemRemove(item)}
                    style={{ fontFamily: "Poppins_500Medium" }}
                  >
                    <Icon name="minus" size={20} color="black" />
                  </Text>
                  <Text
                    className="text-base "
                    style={{ fontFamily: "Poppins_500Medium" }}
                  >
                    {item.qty}
                  </Text>
                  <Text
                    className="text-base "
                    style={{ fontFamily: "Poppins_500Medium" }}
                    onPress={() => onCartItemAdd(item)}
                  >
                    <Icon name="plus" size={20} color="black" />
                  </Text>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
      <View className="flex flex-row items-center justify-between p-4 flex-[0.03]">
        <Text className="text-base" style={{ fontFamily: "Poppins_500Medium" }}>
          Total:
        </Text>
        <Text className="text-base" style={{ fontFamily: "Poppins_500Medium" }}>
          {cartTotalPrice}
        </Text>
      </View>
    </View>
  );
}
