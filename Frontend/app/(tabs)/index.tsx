import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CategoryType, ProductType } from "@/types/type";
import { FlatList } from "react-native";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import ProductItem from "@/components/ProductItem";
import { Colors } from "@/constants/Colors";
import ProductList from "@/components/ProductList";
import Categories from "@/components/Categories";
import { Personal_IP } from "@/constants/ip";

type Props = {};

const HomeScreen = (props: Props) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const getProducts = async () => {
    const URL = "http://" + Personal_IP.data + ":3000/product/get-all-products";
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

  return (
    <>
      <Stack.Screen options={{ headerShown: true, header: () => <Header /> }} />
      <Categories categories={categories}></Categories>
      <ProductList products={products} />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
