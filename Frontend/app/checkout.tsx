import InputField from "@/components/InputField";
import { Colors } from "@/constants/Colors";
import { Personal_IP } from "@/constants/ip";
import { CartItemType, InProcessItemType } from "@/types/type";
import { formatPrice } from "@/utils/format";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

const ProductList = ({ products }: { products: InProcessItemType[] }) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        marginBottom: 12,
        padding: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#e7e7e7",
      }}
    >
      <Text style={{ fontSize: 19, fontWeight: "700", marginBottom: 12 }}>
        Products
      </Text>

      {products.map(({ id, productVariant, price, discount, quantity }) => (
        <View
          key={id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Image
            source={
              productVariant.product?.picture
                ? { uri: productVariant.product?.picture }
                : require("@/assets/images/no-image-available.jpg")
            }
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {productVariant.product?.title}
            </Text>

            <Text style={{ fontSize: 14, color: "#555" }}>
              Color: {productVariant.color?.name || "N/A"} | Size:{" "}
              {productVariant.size?.name || "N/A"}
            </Text>

            <Text style={{ fontSize: 14, color: "#777" }}>Qty: {quantity}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {formatPrice(price * (1 - discount / 100) * quantity)}
            </Text>
            {!(discount === 0) && (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#555",
                  textDecorationLine: "line-through",
                }}
              >
                {formatPrice(price * quantity)}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const Checkout = () => {
  const [jwtToken, setJwtToken] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [orderId, setOrderId] = React.useState<string | null>(null);
  const [cartId, setCartId] = React.useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [totalAmount, setTotalAmount] = React.useState(0);
  const [totalDiscount, setTotalDiscount] = React.useState(0);
  const [totalQuantity, setTotalQuantity] = React.useState(0);
  const [totalPriceWithDiscount, setTotalPriceWithDiscount] = React.useState(0);
  const deliveryFee = 30000;

  const [items, setItems] = React.useState<InProcessItemType[]>([]);

  const [lastName, setLastName] = useState("Lương Lê");
  const [middleName, setMiddleName] = useState("Duy");
  const [firstName, setFirstName] = useState("Tiến");
  const [phoneNumber, setPhoneNumber] = useState("0123456789");
  const [email, setEmail] = useState("tien1234@gmail.com");
  const [line1, setLine1] = useState("1015 Thánh Gióng");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("TP Thủ Đức");
  const [province, setProvince] = useState("TP Hồ Chi Minh");
  const [country, setCountry] = useState("Việt Nam");

  const loadAuthData = async () => {
    const token = await AsyncStorage.getItem("access_token");
    const user = await AsyncStorage.getItem("userId");
    const cart = await AsyncStorage.getItem("cartId");
    const orderId = await AsyncStorage.getItem("orderId");
    if (token && user) {
      setJwtToken(token);
      setUserId(user);
      setCartId(cart);
      setOrderId(orderId);
    }
  };
  useEffect(() => {
    loadAuthData();
  }, []);
  useEffect(() => {
    const loadSummary = async () => {
      const summaryStr = await AsyncStorage.getItem("orderSummary");
      if (summaryStr) {
        const summary = JSON.parse(summaryStr);
        setTotalAmount(summary.totalAmount);
        setTotalDiscount(summary.totalDiscount);
        setTotalQuantity(summary.totalQuantity);
        setTotalPriceWithDiscount(summary.totalPriceWithDiscount);
      }
    };

    loadSummary();
  }, []);
  const fetchCheckOutData = async () => {
    try {
      const URL = `http://${Personal_IP.data}:3000/order-item/orderdata/${orderId}`;
      const response = await axios.get(URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      const data = await response;
      setItems(data.data);
      return data;
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (!jwtToken || !orderId) return;
    fetchCheckOutData();
  }, [jwtToken, orderId]);

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      const data = {
        lastName: lastName,
        middleName: middleName,
        firstName: firstName,
        phoneNumber: phoneNumber,
        email: email,
        line1: line1,
        line2: line2,
        city: city,
        province: province,
        country: country,

        status: "PENDING",
        subTotal: totalAmount,
        totalDiscount: totalDiscount,
        shippingFee: deliveryFee,
        grandTotal: totalPriceWithDiscount,
      };
      const URL = `http://${Personal_IP.data}:3000/orders/${cartId}/${orderId}/complete`;
      const response = await fetch(URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Order ID:", orderId);
      const stored = await AsyncStorage.getItem("cartitemsId");
      console.log("stored", stored);

      const cartitemsIdArray: number[] = stored ? JSON.parse(stored) : [];

      for (const cartItemId of cartitemsIdArray) {
        await removeCartItem(cartItemId);
      }
      router.push("/(tabs)/cart");
      console.log("Order placed successfully!");
    } catch (error) {
      console.error("Error occurs while place order:");
    }
    setIsLoading(false);
  };

  const removeCartItem = async (cartItemId: number) => {
    try {
      const response = await fetch(
        `http://${Personal_IP.data}:3000/cartitem/delete-cartitem/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          contentContainerStyle={styles.content}
          style={{ backgroundColor: "#f7f7f7" }}
        >
          <ProductList products={items} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Summary</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>

              <Text style={styles.summaryPrice}>
                {formatPrice(totalAmount)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>

              <TouchableOpacity>
                <FeatherIcon color="#454545" name="help-circle" size={17} />
              </TouchableOpacity>

              <Text style={styles.summaryPrice}>
                {formatPrice(deliveryFee)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>

              <TouchableOpacity>
                <FeatherIcon color="#454545" name="help-circle" size={17} />
              </TouchableOpacity>

              <Text style={styles.summaryPrice}>
                - {formatPrice(totalDiscount)}
              </Text>
            </View>

            <View style={styles.summaryTotal}>
              <Text style={styles.summaryLabel}>Total</Text>

              {!(totalDiscount === 0) && (
                <Text style={styles.summaryPriceOld}>
                  {formatPrice(totalAmount)}
                </Text>
              )}

              <Text style={styles.summaryPricePrimary}>
                {formatPrice(totalPriceWithDiscount)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => router.push("/(tabs)/cart")}
            >
              <FeatherIcon color="#1A1A1A" name="plus" size={14} />

              <Text style={styles.sectionButtonText}>Add more items</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            <View style={styles.sectionBody}>
              <View style={styles.shipContainer}>
                <InputField
                  placeholder="Last Name"
                  placeholderTextColor={Colors.gray}
                  autoCapitalize="none"
                  style={styles.shipInput}
                  value={lastName}
                  onChangeText={setLastName}
                  keyboardType="default"
                />
                <InputField
                  placeholder="Middle Name"
                  placeholderTextColor={Colors.gray}
                  autoCapitalize="none"
                  style={styles.shipInput}
                  value={middleName}
                  onChangeText={setMiddleName}
                />
                <InputField
                  placeholder="First Name"
                  placeholderTextColor={Colors.gray}
                  autoCapitalize="none"
                  style={styles.shipInput}
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <InputField
                  placeholder="Phone Number"
                  placeholderTextColor={Colors.gray}
                  style={styles.shipInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                <InputField
                  placeholder="Phone Number"
                  placeholderTextColor={Colors.gray}
                  style={styles.shipInput}
                  value={email}
                  onChangeText={setEmail}
                />
                <InputField
                  placeholder="Country"
                  placeholderTextColor={Colors.gray}
                  style={styles.shipInput}
                  value={country}
                  onChangeText={setCountry}
                />
                <InputField
                  placeholder="Province"
                  placeholderTextColor={Colors.gray}
                  style={styles.shipInput}
                  value={province}
                  onChangeText={setProvince}
                />
                <InputField
                  placeholder="City"
                  placeholderTextColor={Colors.gray}
                  style={styles.shipInput}
                  value={city}
                  onChangeText={setCity}
                />
                <InputField
                  placeholder="Address"
                  placeholderTextColor={Colors.gray}
                  style={styles.shipInput}
                  value={line1}
                  onChangeText={setLine1}
                  numberOfLines={2}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment methods</Text>
            <View style={styles.sectionBody}>
              <View style={styles.radioWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.radio}
                >
                  <Text style={styles.radioLabel}>Cash on Delivery</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.sectionButton}
            >
              <FeatherIcon color="#1A1A1A" name="plus" size={14} />

              <Text style={styles.sectionButtonText}>Add payment method</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.overlay}>
        <Text style={styles.totalAmount}>
          {formatPrice(totalPriceWithDiscount)}
        </Text>
        <TouchableOpacity
          onPress={() => {
            handlePlaceOrder();
          }}
          style={{ flex: 1, paddingHorizontal: 24 }}
        >
          <View style={styles.btn}>
            <Text style={styles.btnText}>
              {isLoading ? "Processing..." : "Place Order"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#efefef",
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1d1d1d",
  },
  /** Section */
  section: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e7e7e7",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1d1d1d",
  },
  sectionAction: {
    alignSelf: "center",
    backgroundColor: "#f7f7f7",
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
  sectionButton: {
    marginTop: 12,
    alignSelf: "flex-end",
    backgroundColor: "#f7f7f7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sectionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 4,
  },
  sectionBody: {
    marginTop: 16,
  },
  summaryRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    marginRight: 4,
    fontSize: 16,
    fontWeight: "500",
    color: "#454545",
  },
  summaryPrice: {
    marginLeft: "auto",
    fontSize: 16,
    fontWeight: "500",
    color: "#454545",
  },
  summaryTotal: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#E7E7E7",
    paddingTop: 8,
  },
  summaryPriceOld: {
    marginLeft: "auto",
    fontSize: 13,
    fontWeight: "500",
    color: "#555",
    textDecorationLine: "line-through",
  },
  summaryPricePrimary: {
    marginLeft: 6,
    fontSize: 20,
    fontWeight: "600",
    color: Colors.black,
  },
  radio: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  radioWrapper: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7e5",
    marginTop: -2,
  },
  radioActive: {
    backgroundColor: "#f1f4ff",
  },
  radioFirst: {
    marginTop: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  radioLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  radioInput: {
    width: 16,
    height: 16,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#1d1d1d",
    marginRight: 12,
  },
  radioInputActive: {
    borderWidth: 5,
    borderColor: "#1d1d1d",
  },
  radioImg: {
    width: 40,
    height: 30,
    borderWidth: 1,
    borderColor: "#CBCBCB",
    borderRadius: 4,
    marginRight: 12,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1d1d1d",
  },
  shipInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#e5e7e5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },

  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#F82E08",
    borderColor: "#F82E08",
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.45,
  },
  shipContainer: {
    paddingHorizontal: 12,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
  },
});
export default Checkout;
