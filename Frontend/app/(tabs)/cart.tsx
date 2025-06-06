import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";

import { CartItemType, CartType, UserType } from "@/types/type";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "react-native-paper";
import InputField from "@/components/InputField";

type Props = {
  thisUser: UserType;
};

const CartScreen = ({ thisUser }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMap, setLoadingMap] = useState<{ [key: number]: boolean }>({});

  const headerHeight = useHeaderHeight();
  const [jwtToken, setJwtToken] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [cartId, setCartId] = React.useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      const token = await AsyncStorage.getItem("access_token");
      const user = await AsyncStorage.getItem("userId");
      const cart = await AsyncStorage.getItem("cartId");
      if (token && user) {
        setJwtToken(token);
        setUserId(user);
        setCartId(cart);
      }
    };
    loadAuthData();
  }, []);

  const getCartData = async () => {
    setIsLoading(true);
    try {
      const cartDataURL = `http://${Personal_IP.data}:3000/cartitem/get-cart-data/${cartId}`;
      const cartDataResponse = await axios.get(cartDataURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      setCartItems(cartDataResponse.data);
    } catch (error: any) {
      console.error(
        "Error fetching Cart data:",
        error?.response?.data || error.message
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (cartId && jwtToken) {
      getCartData();
    }
  }, [cartId, jwtToken]);

  const toggleItem = (item: CartItemType) => {
    const isSelected = selectedItems.some((i) => i.id === item.id);
    if (isSelected) {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  const toggleAll = (value: boolean) => {
    setSelectedItems(value ? cartItems : []);
  };

  const handleRemoveItem = (cartItemId: number) => {
    removeCartItem(cartItemId);
  };

  const removeCartItem = async (cartItemId: number) => {
    setIsLoading(true);
    try {
      if (selectedItems.some((item) => item.id === cartItemId)) {
        setSelectedItems((prev) =>
          prev.filter((item) => item.id !== cartItemId)
        );
      }

      const URL = `http://${Personal_IP.data}:3000/cartitem/delete-cartitem/${cartItemId}`;
      const response = await axios.delete(URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      await getCartData();
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
    setIsLoading(false);
  };

  const handleQuantityChange = async (itemId: number, value: number) => {
    setLoadingMap((prev) => ({ ...prev, [itemId]: true }));
    try {
      const requestData = {
        quantity: value,
      };
      const URL = `http://${Personal_IP.data}:3000/cartitem/update-cartitem/${itemId}`;
      const response = await axios.patch(URL, JSON.stringify(requestData), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }
      await getCartData();
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
    setLoadingMap((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const requestData = {
        userId: userId,
        subTotal: totalAmount,
        totalDiscount: totalDiscount,
      };

      if (selectedItems.length === 0) {
        throw new Error("Please select at least one item to checkout.");
      }

      const URL = `http://${Personal_IP.data}:3000/orders/create-order/${userId}`;
      const response = await axios.post(URL, JSON.stringify(requestData), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      const orderResponse = await response.data;
      const orderId = orderResponse.id;
      await AsyncStorage.setItem("orderId", orderId.toString());
      await AsyncStorage.setItem(
        "orderSummary",
        JSON.stringify({
          totalAmount,
          totalDiscount,
          totalQuantity,
          totalPriceWithDiscount,
        })
      );
      await handleCheckoutItems(orderId);
      console.log("Order ID:", orderId);
      router.push("/checkout");
      console.log("Order placed successfully!");
    } catch (error) {
      console.error("Please select at least one item to checkout!");
    }
    setIsLoading(false);
  };

  const handleCheckoutItems = async (orderId: number) => {
    setIsLoading(true);
    try {
      const selectedVIds = selectedItems.map((item) => item.productVID);
      const selectedPrices = selectedItems.map(
        (item) => item?.productVariant?.product?.price
      );
      const selectedDiscount = selectedItems.map(
        (item) => item?.productVariant?.product?.discount
      );
      const selectQuantity = selectedItems.map((item) => item.quantity);

      const requestData = selectedVIds.map((productVID, index) => ({
        orderID: orderId,
        productVID: productVID,
        price: selectedPrices[index],
        discount: selectedDiscount[index],
        quantity: selectQuantity[index],
      }));

      const URL = `http://${Personal_IP.data}:3000/order-item/create-orderitems`;
      const response = await axios.post(URL, JSON.stringify(requestData), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      await AsyncStorage.setItem(
        "cartitemsId",
        JSON.stringify(selectedItems.map((item) => item.id))
      );
      console.log("Order items added:", response);
    } catch (error) {
      console.error("Error adding order items:", error);
    }
    setIsLoading(false);
  };

  const { totalAmount, totalQuantity, totalDiscount, totalPriceWithDiscount } =
    cartItems.reduce(
      (acc, item) => {
        const isSelected = selectedItems.some(
          (selected) => selected.id === item.id
        );
        if (!isSelected) return acc;

        const price = item.productVariant?.product?.price || 0;
        const quantity = item.quantity || 0;
        const discount = item.productVariant?.product?.discount || 0;

        acc.totalAmount += price * quantity;
        acc.totalQuantity += quantity;
        acc.totalDiscount += (price * quantity * discount) / 100;
        acc.totalPriceWithDiscount = acc.totalAmount - acc.totalDiscount;

        return acc;
      },
      {
        totalAmount: 0,
        totalQuantity: 0,
        totalDiscount: 0,
        totalPriceWithDiscount: 0,
      }
    );

  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <View style={styles.chooseAllWrapper}>
          <Checkbox.Android
            status={isAllSelected ? "checked" : "unchecked"}
            onPress={() => toggleAll(!isAllSelected)}
          />
          <Text>Chọn tất cả</Text>
        </View>
        <FlatList
          data={cartItems}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(300 + index * 100).duration(500)}
            >
              <CartItem
                item={item}
                index={index}
                isSelected={selectedItems.some((i) => i.id === item.id)}
                isLoadingQty={!!loadingMap[item.id]}
                onToggle={() => toggleItem(item)}
                onQuantityChange={(id, quantity) =>
                  handleQuantityChange(id, quantity)
                }
                onRemove={() => handleRemoveItem(item.id)}
              />
            </Animated.View>
          )}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.priceInfoWrapper}>
          <Text style={styles.totalText}>
            Total:
            {Number((totalAmount || 0) - (totalDiscount || 0)).toLocaleString(
              "vi-VN",
              {
                style: "currency",
                currency: "VND",
              }
            )}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => handleCheckout()}
        >
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const CartItem = ({
  item,
  index,
  isSelected,
  isLoadingQty,
  onToggle,
  onQuantityChange,
  onRemove,
}: {
  item: CartItemType;
  index: number;
  isSelected: boolean;
  isLoadingQty: boolean;
  onToggle: () => void;
  onQuantityChange: (cartItemId: number, newQuantity: number) => void;
  onRemove: () => void;
}) => {
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const openEditModal = (itemId: number, currentQty: number) => {
    setEditItemId(itemId);
    setEditValue(currentQty.toString());
    setModalVisible(true);
  };
  const handleEditConfirm = () => {
    const value = parseInt(editValue);
    if (!isNaN(value) && value > 0) {
      onQuantityChange(editItemId!, value);
    }
    setModalVisible(false);
    setEditItemId(null);
    setEditValue("");
  };
  const price = item.productVariant?.product?.price;
  const discount = item.productVariant?.product?.discount;
  const priceWithDiscount =
    price && discount ? price * (1 - discount / 100) : 0;

  return (
    <View style={styles.itemWrapper}>
      <Checkbox.Android
        status={isSelected ? "checked" : "unchecked"}
        onPress={onToggle}
        style={styles.checkbox}
      />
      <Image
        source={
          item.productVariant?.product?.picture
            ? { uri: item.productVariant?.product?.picture }
            : require("@/assets/images/no-image-available.jpg")
        }
        style={styles.itemImg}
      />
      <View style={styles.itemInfoWrapper}>
        <Text style={styles.itemTitle}>
          {item.productVariant?.product?.title}
        </Text>
        <Text style={styles.itemSubText}>
          Color: {item.productVariant?.color?.name || "None"} | Size:{" "}
          {item.productVariant?.size?.name || "None"}
        </Text>
        <View style={styles.itemPriceWrapper}>
          <Text style={styles.itemPrice}>
            {Number((priceWithDiscount || 0) * item.quantity).toLocaleString(
              "vi-VN",
              {
                style: "currency",
                currency: "VND",
              }
            )}
          </Text>
          <Text style={styles.itemOriginalPrice}>
            {Number((price || 0) * item.quantity).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>
        <View style={styles.itemControlWrapper}>
          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="trash-outline" size={20} color={Colors.red} />
          </TouchableOpacity>
          <View style={styles.quantityControlWrapper}>
            <TouchableOpacity
              style={[styles.quantityBtn, isLoadingQty && { opacity: 0.3 }]}
              onPress={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={isLoadingQty || item.quantity === 1}
            >
              {isLoadingQty ? (
                <ActivityIndicator size="small" color="#999" />
              ) : (
                <Ionicons
                  name="remove-outline"
                  size={20}
                  color={Colors.black}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openEditModal(item.id, item.quantity)}
            >
              <Text style={styles.quantityText}>{item.quantity}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quantityBtn, isLoadingQty && { opacity: 0.3 }]}
              onPress={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={isLoadingQty}
            >
              {isLoadingQty ? (
                <ActivityIndicator size="small" color="#999" />
              ) : (
                <Ionicons name="add-outline" size={20} color={Colors.black} />
              )}
            </TouchableOpacity>
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <Text style={{ fontSize: 16, marginBottom: 10 }}>
                    Nhập số lượng
                  </Text>
                  <InputField
                    value={editValue}
                    onChangeText={setEditValue}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Text style={{ marginHorizontal: 10 }}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleEditConfirm}>
                      <Text style={{ marginHorizontal: 10, color: "blue" }}>
                        OK
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  checkbox: {},
  itemImg: {
    width: 100,
    height: 100,
    borderColor: Colors.black,
    borderWidth: 0.5,
    borderRadius: 6,
    marginHorizontal: 8,
    backgroundColor: Colors.lightGray,
  },
  itemInfoWrapper: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
  },
  itemSubText: {
    fontSize: 12,
    color: "#666",
  },
  itemPriceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.primary,
  },
  itemOriginalPrice: {
    fontSize: 11,
    color: "#999",
    textDecorationLine: "line-through",
    verticalAlign: "bottom",
  },
  itemControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  quantityControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  quantityBtn: {
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 14,
    width: 32,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 4,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.lightGray,
  },
  priceInfoWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
  },
  checkoutBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 12,
  },
  checkoutBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  chooseAllWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
