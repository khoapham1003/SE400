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

import { CartItemType, CartType, UserType } from "@/types/type";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  thisUser: UserType;
};

const CartScreen = ({ thisUser }: Props) => {
  const headerHeight = useHeaderHeight();
  const [jwtToken, setJwtToken] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);

  const [cart, setCart] = React.useState<CartType | null>(null);

  const [cartItems, setCartItems] = useState<CartItemType[]>([]);


  useEffect(() => {
    const loadAuthData = async () => {
      const token = await AsyncStorage.getItem("access_token");
      const user = await AsyncStorage.getItem("userId");
      if (token && user) {
        setJwtToken(token);
        setUserId(user);
      }
    };
    loadAuthData();
  }, []);

  const getCart = async () => {
    try {
      const cartURL = `http://${Personal_IP.data}:3000/cart/find-cart-by-userId/${userId}`;
      const cartResponse = await axios.get(cartURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (cartResponse.data?.id !== cart?.id) {
        setCart(cartResponse.data);
      }
    } catch (error: any) {
      console.error(
        "Error fetching Cart:",
        error?.response?.data || error.message
      );
    }
  };

  const getCartData = async () => {
    try {
      const cartDataURL = `http://${Personal_IP.data}:3000/cartitem/get-cart-data/${cart?.id}`;
      const cartDataResponse = await axios.get(cartDataURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      setCartItems(cartDataResponse.data);
      console.log("------Cart Data response:", cartItems);
    } catch (error: any) {
      console.error(
        "Error fetching Cart data:",
        error?.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (userId && jwtToken) {
      getCart();
    }
  }, [userId, jwtToken]);
  useEffect(() => {
    if (cart && jwtToken) {
      getCartData();
    }
  }, [cart, jwtToken]);

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
              <CartItem item={item} index={index} />
            </Animated.View>
          )}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.priceInfoWrapper}>
          <Text style={styles.totalText}>Total: $100</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const CartItem = ({ item, index }: { item: CartItemType; index: number }) => {
  return (
    <View style={styles.itemWrapper}>
      <Image
        source={
          item.productVariant?.product?.picture
            ? { uri: item.productVariant?.product?.picture }
            : require("@/assets/images/no-image-available.jpg")
        }
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
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
  },
  itemImg: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: Colors.lightGray,
  },
  itemInfoWrapper: {
    flex: 1,
    gap: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.black,
  },
  itemControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  quantityControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityControl: {
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
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
});
