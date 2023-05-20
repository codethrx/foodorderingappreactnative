import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCart } from "../../../context/cart";
import { db } from "../../../config";

export const Orders = () => {
  const { onItemAdd, removedItems } = useCart();
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
    if (item.selected) {
      console.log("Item already selcted");
      return;
    }
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
  return (
    <ScrollView className="bg-gray-200" contentContainerStyle={{ flexGrow: 1 }}>
      <ScrollView horizontal className="bg-red-400 flex-[0.04] py-4">
        {categories.map(({ title, active }) => (
          <Text
            onPress={() => updateCategories(title)}
            // className={`${active ? "text-red-500" : "text-black"}`}
            key={title}
          >
            {title}
          </Text>
        ))}
      </ScrollView>
      <View className="flex-1">
        {filteredItems.map((item) => (
          <TouchableOpacity
            onPress={() => addToCart(item)}
            key={item.slug}
            className={`bg-slate-500 ${
              item.selected ? "opacity-40" : "opacity-100"
            }`}
          >
            <Image height={100} width={200} source={{ uri: item.image }} />
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
