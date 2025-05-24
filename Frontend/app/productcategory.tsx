import {
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CategoryType, ProductType } from "@/types/type";
import { FlatList } from "react-native";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import ProductList from "@/components/ProductList";
import Categories from "@/components/Categories";
import { Personal_IP } from "@/constants/ip";

type Props = {
  categoryId: number;
};

const ProductCategoryScreen = ({ categoryId }: Props) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getProductsByCategory();
    getCategories();
  }, []);

  const getProductsByCategory = async () => {
    const URL =
      "http://" + Personal_IP.data + ":3000/product/category/" + categoryId;
    const response = await axios.get(URL).catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: " + error.message
      );
      throw error;
    });
    setProducts(response.data.data);
    setIsLoading(false);
  };

  const getCategories = async () => {
    const URL =
      "http://" + Personal_IP.data + ":3000/category/get-all-categories";
    const response = await axios.get(URL).catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: " + error.message
      );
      throw error;
    });
    setCategories(response.data.data);
    setIsLoading(false);
    console.log("categories", response.data.data);
  };

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, header: () => <Header /> }} />
      <ScrollView>
        <Categories categories={categories}></Categories>
        <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
          <Image
            source={require("@/assets/images/sale-banner.jpg")}
            style={{ width: "100%", height: 150, borderRadius: 15 }}
          />
        </View>
        <ProductList products={products} flatlist={false} />
      </ScrollView>
    </>
  );
};

export default ProductCategoryScreen;

const styles = StyleSheet.create({});
