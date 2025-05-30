import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";
import { ProductType } from "@/types/type";
import ImageSlider from "@/components/ImageSlider";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";

type Props = {};

const ProductDetails = (props: Props) => {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductType>();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    try {
      const URL = `http://${Personal_IP.data}:3000/product/get-product/${id}`;
      const response = await axios.get(URL);
      setProduct(response.data.data); // save response data in state
      console.log("Picture:", response.data.data.picture);
      setError(null);
    } catch (err) {
      setError("Failed to load product details.");
      console.error(err);
    }
  };

  const headerHeight = useHeaderHeight();

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
                <Text style={styles.price}>${product.price}</Text>
                <View style={styles.priceDiscount}>
                  <Text style={styles.priceDiscountText}>6% Off</Text>
                </View>
              </View>
              <Text style={styles.description}>{product.content}</Text>

              <View style={styles.productVariationWrapper}>
                <View style={styles.productVariationType}>
                  <Text style={styles.productVariationTitle}>Color</Text>
                  <View style={styles.productVariationValueWrapper}>
                    <View
                      style={{
                        borderColor: Colors.primary,
                        borderWidth: 1,
                        borderRadius: 100,
                        padding: 2,
                      }}
                    >
                      <View
                        style={[
                          styles.productVariationColorValue,
                          { backgroundColor: "#333" },
                        ]}
                      />
                    </View>

                    <View
                      style={[
                        styles.productVariationColorValue,
                        { backgroundColor: "#D4AF37" },
                      ]}
                    />
                    <View
                      style={[
                        styles.productVariationColorValue,
                        { backgroundColor: "#F44336" },
                      ]}
                    />
                    <View
                      style={[
                        styles.productVariationColorValue,
                        { backgroundColor: "#2196F3" },
                      ]}
                    />
                  </View>
                </View>
                <View>
                  <Text style={styles.productVariationTitle}>Size</Text>
                  <View style={styles.productVariationValueWrapper}>
                    <View
                      style={[
                        styles.productVariationSizeValue,
                        { borderColor: Colors.primary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.productVariationSizeValueText,
                          { color: Colors.primary, fontWeight: "bold" },
                        ]}
                      >
                        S
                      </Text>
                    </View>
                    <View style={styles.productVariationSizeValue}>
                      <Text style={styles.productVariationSizeValueText}>
                        M
                      </Text>
                    </View>
                    <View style={styles.productVariationSizeValue}>
                      <Text style={styles.productVariationSizeValueText}>
                        L
                      </Text>
                    </View>
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
            },
          ]}
        >
          <Ionicons name="cart-outline" size={20} color={Colors.primary} />
          <Text style={[styles.buttonText, { color: Colors.primary }]}>
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  productImg: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  container: {
    paddingHorizontal: 20,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.gray,
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
    color: Colors.black,
    letterSpacing: 0.6,
    lineHeight: 32,
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  price: {
    fontWeight: "600",
    fontSize: 18,
    color: Colors.black,
  },
  priceDiscount: {
    backgroundColor: Colors.extraLightGray,
    padding: 5,
    borderRadius: 5,
  },
  priceDiscountText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.primary,
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "400",
    color: Colors.black,
    letterSpacing: 0.6,
    lineHeight: 24,
  },
  productVariationWrapper: {
    flexDirection: "row",
    marginTop: 20,
    flexWrap: "wrap",
  },
  productVariationType: {
    width: "50%",
    gap: 5,
    marginBottom: 10,
  },
  productVariationTitle: {
    fontWeight: "500",
    fontSize: 16,
    color: Colors.black,
  },
  productVariationValueWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  productVariationColorValue: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.extraLightGray,
  },
  productVariationSizeValue: {
    width: 50,
    height: 30,
    borderRadius: 5,
    backgroundColor: Colors.extraLightGray,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productVariationSizeValueText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.black,
  },
  buttonWrapper: {
    position: "absolute",
    height: 90,
    padding: 20,
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.white,
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.primary,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    gap: 5,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.white,
  },
});
