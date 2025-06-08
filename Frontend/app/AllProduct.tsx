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
  Modal,
} from "react-native";
import axios from "axios";
import { CategoryType, ProductType } from "@/types/type";
import { Personal_IP } from "@/constants/ip";
import Categories from "@/components/Categories";
import ProductList from "@/components/ProductList";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";

// Sort options enum
enum SortOption {
  DEFAULT = "default",
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
  PRICE_LOW_HIGH = "price_low_high",
  PRICE_HIGH_LOW = "price_high_low",
  NEWEST = "newest",
  OLDEST = "oldest",
}

const sortOptions = [
  { key: SortOption.DEFAULT, label: "Default" },
  { key: SortOption.NAME_ASC, label: "Name (A-Z)" },
  { key: SortOption.NAME_DESC, label: "Name (Z-A)" },
  { key: SortOption.PRICE_LOW_HIGH, label: "Price: Low to High" },
  { key: SortOption.PRICE_HIGH_LOW, label: "Price: High to Low" },
  { key: SortOption.NEWEST, label: "Newest First" },
  { key: SortOption.OLDEST, label: "Oldest First" },
];

const AllProduct = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.DEFAULT);
  const [showSortModal, setShowSortModal] = useState(false);

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

  // Sort products function
  const sortProducts = (products: ProductType[], sortOption: SortOption): ProductType[] => {
    const sortedProducts = [...products];

    switch (sortOption) {
      case SortOption.NAME_ASC:
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));

      case SortOption.NAME_DESC:
        return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));

      case SortOption.PRICE_LOW_HIGH:
        return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));

      case SortOption.PRICE_HIGH_LOW:
        return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));

      case SortOption.NEWEST:
        return sortedProducts.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || 0);
          const dateB = new Date(b.createdAt || b.created_at || 0);
          return dateB.getTime() - dateA.getTime();
        });

      case SortOption.OLDEST:
        return sortedProducts.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || 0);
          const dateB = new Date(b.createdAt || b.created_at || 0);
          return dateA.getTime() - dateB.getTime();
        });

      case SortOption.DEFAULT:
      default:
        return sortedProducts; // Return original order
    }
  };

  // Filter and sort products
  const processedProducts = (() => {
    // First filter by search text
    const filtered = (products || []).filter(product => {
      if (searchText.trim() === "") return true;
      return product.title.toLowerCase().includes(searchText.toLowerCase());
    });

    // Then sort the filtered results
    return sortProducts(filtered, sortOption);
  })();

  const handleSortSelection = (option: SortOption) => {
    setSortOption(option);
    setShowSortModal(false);
  };

  console.log("🔍 Current state:");
  console.log("📦 products:", products);
  console.log("📊 products length:", products?.length || 0);
  console.log("🔍 searchText:", searchText);
  console.log("🏷️ selectedCategory:", selectedCategory);
  console.log("📋 processedProducts:", processedProducts);
  console.log("📈 processedProducts length:", processedProducts.length);
  console.log("🔄 sortOption:", sortOption);
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

      {/* Sort and Results Section */}
      <View style={styles.controlsContainer}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {processedProducts.length} product{processedProducts.length !== 1 ? 's' : ''} found
            {selectedCategory && (
              <Text style={styles.categoryInfo}>
                {' '}in {categories.find(cat => cat.id === selectedCategory)?.title}
              </Text>
            )}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortButtonText}>
            Sort: {sortOptions.find(opt => opt.key === sortOption)?.label}
          </Text>
          <Text style={styles.sortIcon}>⇅</Text>
        </TouchableOpacity>
      </View>

      <ProductList products={processedProducts} flatlist={false} />

      {processedProducts.length === 0 && !isLoading && (
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

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort Products</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSortModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={sortOptions}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.sortOptionButton,
                    sortOption === item.key && styles.sortOptionButtonSelected
                  ]}
                  onPress={() => handleSortSelection(item.key)}
                >
                  <Text style={[
                    styles.sortOptionText,
                    sortOption === item.key && styles.sortOptionTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {sortOption === item.key && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    paddingLeft: 10,
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
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsContainer: {
    flex: 1,
    paddingLeft: 10,
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
    marginRight: 6,
  },
  sortIcon: {
    fontSize: 14,
    color: '#666',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  sortOptionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionButtonSelected: {
    backgroundColor: '#f8f9ff',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
  sortOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '500',
  },
  checkMark: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});