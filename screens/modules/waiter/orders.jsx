import { View, Text, ScrollView } from "react-native";
import React from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config";
export const Orders = () => {
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
          id: d.id,
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
    setActiveCategory(elem);
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ScrollView horizontal>
        {categories.map(({ title, active }) => (
          <Text
            onPress={() => updateCategories(title)}
            className={`${active ? "text-red-500" : "text-black"}`}
            key={title}
          >
            {title}
          </Text>
        ))}
      </ScrollView>
    </ScrollView>
  );
};
