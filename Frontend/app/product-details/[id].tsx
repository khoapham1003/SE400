import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, Stack, router, useRouter } from "expo-router";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";
import {
  ColorType,
  ProductType,
  ProductVariantType,
  SizeType,
} from "@/types/type";
import ImageSlider from "@/components/ImageSlider";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatPrice } from "@/utils/format";

type Props = {};

const ProductDetails = (props: Props) => {
  const { id } = useLocalSearchParams();
  const [jwtToken, setJwtToken] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [cartId, setCartId] = React.useState<string | null>(null);
  const [product, setProduct] = useState<ProductType>();
  const [productvariants, setProductVariants] = useState<ProductVariantType[]>();
  const [color, setColor] = useState<ColorType[]>([]);
  const [size, setSize] = useState<SizeType[]>([]);
  const [selectedColor, setSelectedColor] = useState<ColorType>();
  const [selectedSize, setSelectedSize] = useState<SizeType>();
  const [availableColors, setAvailableColors] = useState<ColorType[]>([]);
  const [availableSizes, setAvailableSizes] = useState<SizeType[]>([]);
  const [availableColorIds, setAvailableColorIds] = useState<number[]>([]);
  const [availableSizeIds, setAvailableSizeIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const user = await AsyncStorage.getItem("userId");
        const cart = await AsyncStorage.getItem("cartId");
        if (token && user) {
          setJwtToken(token);
          setUserId(user);
          setCartId(cart);
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        Alert.alert("Error", "Failed to load authentication data. Please try logging in again.");
      }
    };
    loadAuthData();
  }, []);

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    try {
      setIsLoading(true);
      const URL = `http://${Personal_IP.data}:3000/product/get-product/${id}`;
      const response = await axios.get(URL);

      if (response.data && response.data.data) {
        setProduct(response.data.data);
        setError(null);
      } else {
        throw new Error("Product data not found");
      }
    } catch (err: any) {
      console.error("Error fetching product details:", err);
      setError("Failed to load product details.");

      // Show user-friendly alert based on error type
      if (err.response?.status === 404) {
        Alert.alert(
          "Product Not Found",
          "The product you're looking for doesn't exist or has been removed.",
          [
            { text: "Go Back", onPress: () => router.back() }
          ]
        );
      } else if (err.response?.status >= 500) {
        Alert.alert(
          "Server Error",
          "Our servers are experiencing issues. Please try again later.",
          [
            { text: "Retry", onPress: () => getProductDetails() },
            { text: "Go Back", onPress: () => router.back() }
          ]
        );
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        Alert.alert(
          "Connection Error",
          "Please check your internet connection and try again.",
          [
            { text: "Retry", onPress: () => getProductDetails() },
            { text: "Go Back", onPress: () => router.back() }
          ]
        );
      } else {
        Alert.alert(
          "Error",
          "Failed to load product details. Please try again.",
          [
            { text: "Retry", onPress: () => getProductDetails() },
            { text: "Go Back", onPress: () => router.back() }
          ]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductVariant = async () => {
    try {
      const response = await fetch(
        `http://${Personal_IP.data}:3000/product-variants/get-by-productId/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // No variants found - this might be normal for some products
          setProductVariants([]);
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProductVariants(data);

      const tempColors: ColorType[] = [];
      const tempSizes: SizeType[] = [];

      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (
            item.color &&
            !tempColors.some((color) => color.id === item.color.id)
          ) {
            tempColors.push(item.color);
          }
          if (
            item.size &&
            !tempSizes.some((size) => size.size === item.size.size)
          ) {
            tempSizes.push(item.size);
          }
        });

        setColor(tempColors);
        setAvailableColors(tempColors);
        setSize(tempSizes);
        setAvailableSizes(tempSizes);

        if (tempColors.length > 0) {
          setSelectedColor(tempColors[0]);
        }
        if (tempSizes.length > 0) {
          setSelectedSize(tempSizes[0]);
        }
      } else {
        console.error("Expected array, got:", typeof data, data);
        Alert.alert("Error", "Invalid product variant data received.");
      }

      return data;
    } catch (error: any) {
      console.error("Error fetching product variant:", error);

      // Only show alert for significant errors, not for missing variants
      if (error.message.includes('HTTP error') && !error.message.includes('404')) {
        Alert.alert(
          "Error",
          "Failed to load product options. Some features may not be available.",
          [{ text: "OK" }]
        );
      }
    }
  };

  useEffect(() => {
    if (jwtToken) {
      fetchProductVariant();
    }
  }, [jwtToken]);

  const handleColorSelect = (color: ColorType) => {
    if (selectedColor?.id === color.id) {
      setSelectedColor(undefined);
    } else {
      setSelectedColor(color);
    }
  };

  const handleSizeSelect = (size: SizeType) => {
    if (selectedSize?.id === size.id) {
      setSelectedSize(undefined);
    } else {
      setSelectedSize(size);
    }
  };

  useEffect(() => {
    if (!productvariants || productvariants.length === 0) {
      return;
    }

    if (!selectedColor && !selectedSize) {
      const allSizeIds = size.map((s) => s.id);
      const allColorIds = color.map((c) => c.id);
      setAvailableSizeIds(allSizeIds);
      setAvailableColorIds(allColorIds);
      return;
    }

    if (selectedColor) {
      const validSizes = productvariants
        .filter((variant) => variant.color!.id === selectedColor.id)
        .map((variant) => variant.size!.id);
      setAvailableSizeIds(validSizes);
    } else {
      setAvailableSizeIds(size.map((s) => s.id));
    }

    if (selectedSize) {
      const validColors = productvariants
        .filter((variant) => variant.size!.id === selectedSize.id)
        .map((variant) => variant.color!.id);
      setAvailableColorIds(validColors);
    } else {
      setAvailableColorIds(color.map((c) => c.id));
    }
  }, [selectedColor, selectedSize, productvariants, color, size]);

  const handleAddToCart = async () => {
    // Validation checks with user-friendly alerts
    if (!jwtToken || !userId) {
      Alert.alert(
        "Login Required",
        "Please log in to add items to your cart.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/login") }
        ]
      );
      return;
    }

    if (!product) {
      Alert.alert("Error", "Product information is not available.");
      return;
    }

    // Check if color/size selection is required
    if (color.length > 0 && !selectedColor) {
      Alert.alert("Selection Required", "Please select a color before adding to cart.");
      return;
    }

    if (size.length > 0 && !selectedSize) {
      Alert.alert("Selection Required", "Please select a size before adding to cart.");
      return;
    }

    setIsAddingToCart(true);

    try {
      const data = {
        colorId: selectedColor?.id,
        sizeId: selectedSize?.id,
        quantity: 1,
        cartID: cartId ? parseInt(cartId, 10) : null,
        productId: product?.id,
        price: product?.price,
        discount: product?.discount,
      };

      const response = await fetch(
        `http://${Personal_IP.data}:3000/cartitem/create-cart-item`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        Alert.alert(
          "Success!",
          "Product has been added to your cart.",
          [
            { text: "Continue Shopping", onPress: () => router.push("/(tabs)/") },
            { text: "View Cart", onPress: () => router.push("/cart") }
          ]
        );
      } else {
        const errorText = await response.text();
        let errorMessage = "Failed to add item to cart.";

        // Parse specific error messages
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Use the raw error text if it's not JSON
          if (errorText && errorText.length < 200) {
            errorMessage = errorText;
          }
        }

        // Handle specific error cases
        if (response.status === 400) {
          Alert.alert("Invalid Request", errorMessage);
        } else if (response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Please log in again to continue.",
            [{ text: "Login", onPress: () => router.push("/login") }]
          );
        } else if (response.status === 409) {
          Alert.alert("Already in Cart", "This item is already in your cart.");
        } else if (response.status >= 500) {
          Alert.alert(
            "Server Error",
            "Our servers are experiencing issues. Please try again later."
          );
        } else {
          Alert.alert("Error", errorMessage);
        }
      }
    } catch (error: any) {
      console.error("Error adding item to cart:", error);

      if (error.name === 'NetworkError' || error.message.includes('Network')) {
        Alert.alert(
          "Connection Error",
          "Please check your internet connection and try again."
        );
      } else {
        Alert.alert(
          "Error",
          "Something went wrong while adding the item to cart. Please try again."
        );
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const headerHeight = useHeaderHeight();
  const router = useRouter();

  // Loading state
  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{ title: "Product Details", headerTransparent: true }}
        />
        <View style={[styles.container, { marginTop: headerHeight, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 16, color: Colors.gray }}>Loading product...</Text>
        </View>
      </>
    );
  }

  // Error state
  if (error && !product) {
    return (
      <>
        <Stack.Screen
          options={{ title: "Product Details", headerTransparent: true }}
        />
        <View style={[styles.container, { marginTop: headerHeight, justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.gray} />
          <Text style={{ marginTop: 16, color: Colors.gray, textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 20, backgroundColor: Colors.primary }]}
            onPress={() => getProductDetails()}
          >
            <Text style={[styles.buttonText, { color: Colors.white }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{ title: "Product Details", headerTransparent: true }}
      />
      <ScrollView style={{ marginTop: headerHeight, marginBottom: 90 }}>
        <View>
          {product && (
            <ImageSlider image={product?.picture ? [product.picture] : [""]} />
          )}
          {product && (
            <View style={styles.container}>
              <View style={styles.ratingWrapper}>
                <View style={styles.ratingWrapper}>
                  <Ionicons name="star" size={18} color={"#D4AF37"} />
                  <Text style={styles.rating}>
                    4.7 <Text>(136)</Text>
                  </Text>
                </View>
                <TouchableOpacity>
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    color={Colors.black}
                  />
                </TouchableOpacity>
              </View>
              <Text>{product.title}</Text>
              <View style={styles.priceWrapper}>
                <Text style={styles.price}>
                  {formatPrice(product.price || 0)}
                </Text>
                <View style={styles.priceDiscount}>
                  <Text style={styles.priceDiscountText}>
                    {product.discount}% Off
                  </Text>
                </View>
              </View>
              <Text style={styles.description}>{product.content}</Text>

              <View style={styles.productVariationWrapper}>
                <View style={styles.productVariationType}>
                  <Text style={styles.productVariationTitle}>Color</Text>
                  <View style={styles.productVariationValueWrapper}>
                    {color.map((c) => {
                      const isSelected = selectedColor?.id === c.id;
                      const isAvailable = availableColorIds.includes(c.id);

                      return (
                        <TouchableOpacity
                          key={c.id}
                          disabled={!isAvailable}
                          onPress={() => {
                            if (isAvailable) handleColorSelect(c);
                          }}
                          style={[
                            styles.productVariationColorValue,
                            {
                              backgroundColor: c.hex,
                              opacity: isAvailable ? 1 : 0.2,
                              borderWidth: isSelected ? 3 : 1,
                              borderColor: isSelected ? "#000" : "#999",
                            },
                          ]}
                        />
                      );
                    })}
                  </View>
                </View>
                <View>
                  <Text style={styles.productVariationTitle}>Size</Text>
                  <View style={styles.productVariationValueWrapper}>
                    {size.map((s) => {
                      const isSelected = selectedSize?.id === s.id;
                      const isAvailable = availableSizeIds.includes(s.id);

                      return (
                        <TouchableOpacity
                          key={s.id}
                          disabled={!isAvailable}
                          onPress={() => {
                            if (isAvailable) handleSizeSelect(s);
                          }}
                          style={[
                            styles.productVariationSizeValue,
                            {
                              borderWidth: isSelected ? 2 : 1,
                              borderColor: isSelected ? "#000" : "#ccc",
                              backgroundColor: isSelected
                                ? "#f0f0f0"
                                : "transparent",
                              opacity: isAvailable ? 1 : 0.4,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              fontWeight: isSelected ? "bold" : "normal",
                            }}
                          >
                            {s.name || `Size: ${s.size || "?"}`}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: Colors.white,
              borderColor: Colors.primary,
              borderWidth: 1,
              opacity: isAddingToCart ? 0.6 : 1,
            },
          ]}
          onPress={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <>
              <Ionicons name="cart-outline" size={20} color={Colors.primary} />
              <Text style={[styles.buttonText, { color: Colors.primary }]}>
                Add to Cart
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    marginLeft: 6,
    color: "#333",
    fontWeight: "500",
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E53935",
  },
  priceDiscount: {
    backgroundColor: "#FFCDD2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  priceDiscountText: {
    color: "#C62828",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  productVariationWrapper: {
    marginTop: 24,
  },
  productVariationType: {
    marginBottom: 20,
  },
  productVariationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 10,
  },
  productVariationValueWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  productVariationColorValue: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  productVariationSizeValue: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSize: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  selectedSizeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonBuyNow: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
