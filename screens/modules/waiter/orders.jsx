import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCart } from "../../../context/cart";
import { db } from "../../../config";

export const Orders = () => {
  const { onItemAdd, disabledItems } = useCart();
  const [categories, setCategories] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [filteredItems, setFilteredItems] = React.useState([]);
  const [activeCategory, setActiveCategory] = React.useState("");
  const [status, setStatus] = React.useState({ loading: false, error: null });
  React.useEffect(() => {
    const getContent = async () => {
      setStatus({ loading: true, error: null });
      try {
        const categories = await getDocs(collection(db, "categories"));
        const formattedCategories = categories.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));
        const items = await getDocs(collection(db, "food-items"));
        const formattedFoodItems = items.docs.map((d) => ({
          ...d.data(),
          slug: d.id,
          selected: false,
        }));
        setCategories(
          formattedCategories.map((item, index) =>
            index === 0 ? { ...item, active: true } : { ...item, active: false }
          )
        );
        setActiveCategory(formattedCategories[0].title);
        setItems(formattedFoodItems);
        setFilteredItems(
          formattedFoodItems.filter(
            (elem) => elem.category === formattedCategories[0].title
          )
        );
        setStatus({ loading: false, error: null });
      } catch (e) {
        setStatus({ loading: false, error: "Error fetching data..." });
      }
    };
    getContent();
  }, []);

  const updateCategories = (elem) => {
    setCategories(
      categories.map((i) =>
        i.title === elem ? { ...i, active: true } : { ...i, active: false }
      )
    );
    setFilteredItems(items.filter((item) => item.category === elem));
    setActiveCategory(elem);
  };
  const addToCart = (item) => {
    if (disabledItems.includes(item.slug)) return;
    onItemAdd({ ...item, qty: 1 });
    setItems(
      items.map((i) => {
        return i.name === item.name ? { ...i, selected: true } : i;
      })
    );
    setFilteredItems(
      filteredItems.map((i) => {
        return i.name === item.name ? { ...i, selected: true } : i;
      })
    );
  };
  console.log(status.loading);
  return status.loading ? (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator color="rgb(30,58,138)" size="large" />
    </View>
  ) : (
    <ScrollView className="bg-gray-200" contentContainerStyle={{ flexGrow: 1 }}>
      <ScrollView
        horizontal
        contentContainerStyle={{ alignItems: "center" }}
        className="flex-[0.04] py-2"
      >
        {categories.map(({ title, active }) => (
          <Text
            onPress={() => updateCategories(title)}
            className={`
            px-4 py-2  rounded-full mx-2
            ${active ? "bg-blue-900 text-white" : "text-black bg-gray-300 "}`}
            key={title}
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {title}
          </Text>
        ))}
      </ScrollView>
      <View className="flex-1 flex-wrap flex-row ">
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.slug}
            className={`basis-[40%] m-4 pb-0 bg-white ${
              disabledItems.includes(item.slug) ? "opacity-40" : "opacity-100"
            }`}
          >
            <Image
              height={100}
              className="w-full"
              source={{ uri: item.image }}
            />
            <Text
              className="py-2 text-base text-center font-medium"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => addToCart(item)}
              className="w-full bg-blue-900 items-center justify-center  my-1 mb-0 py-2 "
            >
              <Text
                className="text-white"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                Add to Cart
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
