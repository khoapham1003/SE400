import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { CategoryType, ProductType } from "@/types/type";
import { Personal_IP } from "@/constants/ip";
import Categories from "@/components/Categories";
import ProductList from "@/components/ProductList";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";

const AllProduct = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log("🚀 AllProduct component mounted");
    console.log("🌐 Personal_IP.data:", Personal_IP.data);
    getCategories();
  }, []);

  useEffect(() => {
    console.log("🔄 useEffect triggered with params:", params);
    console.log("🏷️ categoryId from params:", params.categoryId);

    // Handle category selection from navigation params or load all products
    if (params.categoryId) {
      const categoryId = Number(params.categoryId);
      console.log("📋 Setting selected category to:", categoryId);
      setSelectedCategory(categoryId);
      getProductsByCategory(categoryId);
    } else {
      console.log("📋 No category selected, loading all products");
      setSelectedCategory(null);
      getAllProducts();
    }
  }, [params.categoryId]);

  const getAllProducts = async () => {
    setIsLoading(true);
    try {
      const URL = "http://" + Personal_IP.data + ":3000/product/get-all-products";
      console.log("🔍 Fetching all products from URL:", URL);

      const response = await axios.get(URL);

      const productsData = response.data.data || [];
      setProducts(productsData);
      console.log("✅ Products set to state:", productsData);
    } catch (error) {
      setProducts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsByCategory = async (categoryId: number) => {
    setIsLoading(true);
    try {
      const URL = "http://" + Personal_IP.data + ":3000/product/category/" + categoryId;
      console.log("🔍 Fetching products by category from URL:", URL);
      console.log("🏷️ Category ID:", categoryId);

      const response = await axios.get(URL);
      console.log("📦 Raw API response for category:", response);
      console.log("📊 Response data:", response.data);
      console.log("🛍️ Products data:", response.data.data);
      console.log("📈 Products count:", response.data.data?.length || 0);

      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      const productsData = data.filter((item: any) => item !== null);
      setProducts(productsData);
      console.log("✅ Category products set to state:", productsData);
    } catch (error) {
      console.error("❌ Error fetching products by category:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      setProducts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
      console.log("🏁 getProductsByCategory finished, isLoading set to false");
    }
  };

  const getCategories = async () => {
    try {
      const URL = "http://" + Personal_IP.data + ":3000/category/get-all-categories";

      const response = await axios.get(URL);
      const categoriesData = response.data.data || [];
      setCategories(categoriesData);
    } catch (error) {
      setCategories([]); // Set empty array on error
    }
  };

  const handleCategoryPress = (id: number) => {
    setSelectedCategory(id);
    setSearchText(""); // Clear search when switching categories
    getProductsByCategory(id);
  };

  const handleShowAllProducts = () => {
    setSelectedCategory(null);
    setSearchText(""); // Clear search when showing all products
    getAllProducts();
  };

  // Filter products based on search text only (category filtering is handled by API)
  // Add safety check to ensure products is always an array
  const filteredProducts = (products || []).filter(product => {
    if (searchText.trim() === "") return true;
    return product.title.toLowerCase().includes(searchText.toLowerCase());
  });

  console.log("🔍 Current state:");
  console.log("📦 products:", products);
  console.log("📊 products length:", products?.length || 0);
  console.log("🔍 searchText:", searchText);
  console.log("🏷️ selectedCategory:", selectedCategory);
  console.log("📋 filteredProducts:", filteredProducts);
  console.log("📈 filteredProducts length:", filteredProducts.length);
  console.log("⏳ isLoading:", isLoading);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Search products..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchBar}
      />

      <View style={styles.categoriesList}>
        <FlatList
          data={[{ id: 0, title: "All" }, ...(categories || [])]} // Add safety check
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                (selectedCategory === item.id || (selectedCategory === null && item.id === 0)) &&
                styles.categoryButtonSelected,
              ]}
              onPress={() => {
                if (item.id === 0) {
                  handleShowAllProducts();
                } else {
                  handleCategoryPress(item.id);
                }
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  (selectedCategory === item.id || (selectedCategory === null && item.id === 0)) &&
                  styles.categoryTextSelected,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Show results count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          {selectedCategory && (
            <Text style={styles.categoryInfo}>
              {' '}in {categories.find(cat => cat.id === selectedCategory)?.title}
            </Text>
          )}
        </Text>
      </View>

      <ProductList products={filteredProducts} flatlist={false} />

      {filteredProducts.length === 0 && !isLoading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubText}>
            {searchText.trim() !== ""
              ? "Try adjusting your search term"
              : "No products available in this category"
            }
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AllProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  categoriesList: {
    marginBottom: 20,
  },
  categoryButton: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  categoryButtonSelected: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  categoryTextSelected: {
    color: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  resultsContainer: {
    marginBottom: 15,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
  },
  categoryInfo: {
    fontWeight: "400",
    color: "#666",
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: 'center',
  },
});