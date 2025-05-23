import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";
import { CartItemType } from "@/types/type";
import { Stack } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type Props = {};

const CartScreen = (props: Props) => {
  const headerHeight = useHeaderHeight();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const userID = 1; //temp

  useEffect(() => {
    getCartData();
  }, []);

  const getCartData = async () => {
    const URL =
      "http://" +
      Personal_IP.data +
      ":3000//cart/find-cart-by-userid/" +
      { userID };
    const response = await axios.get(URL).catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: " + error.message
      );
      throw error;
    });
    setCartItems(response.data.data);
    console.log("cart data", response.data.data);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <FlatList
          data={cartItems}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(300 + index * 100).duration(500)}
            >
              <CartItem item={item} />
            </Animated.View>
          )}
        ></FlatList>
      </View>
      <View style={styles.footer}>
        <View style={styles.priceInfoWrapper}>
          <Text style={styles.totalText}>Total: $100</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const CartItem = ({ item }: { item: CartItemType }) => {
  return (
    <View style={styles.itemWrapper}>
      <Image
        source={{ uri: item.productVariant?.product?.picture }}
        style={styles.itemImg}
      />
      <View style={styles.itemInfoWrapper}>
        <Text style={styles.itemText}>
          {item.productVariant?.product?.title}
        </Text>
        <Text style={styles.itemText}>${item.price}</Text>
        <View style={styles.itemControlWrapper}>
          <TouchableOpacity>
            <Ionicons name="trash-outline" size={20} color={Colors.red} />
          </TouchableOpacity>
          <View style={styles.quantityControlWrapper}>
            <TouchableOpacity style={styles.quantityControl}>
              <Ionicons name="remove-outline" size={20} color={Colors.black} />
            </TouchableOpacity>
            <Text>{item.quantity}</Text>
            <TouchableOpacity style={styles.quantityControl}>
              <Ionicons name="add-outline" size={20} color={Colors.black} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    borderRadius: 5,
  },
  itemInfoWrapper: {
    flex: 1,
    alignSelf: "flex-start",
    gap: 10,
  },
  itemImg: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  itemText: {},
  itemControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  quantityControl: {
    padding: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    borderRadius: 5,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: Colors.white,
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  priceInfoWrapper: {
    flex: 1,
    justifyContent: "center",

    flexDirection: "row",
    marginBottom: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.black,
  },
  checkoutBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  checkoutBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
});
