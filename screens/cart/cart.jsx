import { View, ScrollView, Touchable, Image, Text } from "react-native";
import { useCart } from "../../context/cart";
export function Cart() {
  const { itemsOfCart, onCartItemAdd, onCartItemRemove } = useCart();
  return (
    <ScrollView className="bg-gray-200" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1">
        {itemsOfCart.length >= 1 &&
          itemsOfCart.map((item) => (
            <View key={item.slug} className={`bg-slate-500 `}>
              <Image height={100} width={200} source={{ uri: item.image }} />
              <Text>{item.name}</Text>
              <Text>{item.price}</Text>
              <View className="flex flex-row">
                <Text
                  className="text-base mr-2"
                  onPress={() => onCartItemRemove(item)}
                >
                  -
                </Text>
                <Text>{item.qty}</Text>
                <Text
                  className="text-base mr-2"
                  onPress={() => onCartItemAdd(item)}
                >
                  +
                </Text>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}
