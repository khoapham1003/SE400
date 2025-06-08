import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { icon } from "@/constants/Icons";
import { Colors } from "@/constants/Colors";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItemType } from "@/types/type";

type Props = {
  onPress: () => void;
  onLongPress: () => void;
  label: string;
  isFocused: boolean;
  routeName: string;
};

const TabBarButton = (props: Props) => {
  const { onPress, onLongPress, label, isFocused, routeName } = props;
    const [jwtToken, setJwtToken] = React.useState<string | null>(null);
    const [userId, setUserId] = React.useState<string | null>(null);
    const [cartId, setCartId] = React.useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);
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
    useEffect(() => {
      if (cartId) {
        getCartData();
        console.log(cartItems.length);
      }
    }, [cartId]);
    const getCartData = async () => {
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
    };
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabbarBtn}
    >
      {/* Hiển thị số hàng trong Cart ở tabbar */}
      {routeName == "cart" && (
        <View style={styles.badgeWrapper}>
          <Text style={styles.badgeText}>{cartItems.length}</Text>
        </View>
      )}

      {icon[routeName as keyof typeof icon]({
        color: isFocused ? Colors.primary : Colors.black,
      })}
      <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>{label}</Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabbarBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  badgeWrapper: {
    position: "absolute",
    top: -5,
    right: 20,
    backgroundColor: Colors.highlight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    zIndex: 10,
  },
  badgeText: {
    color: Colors.black,
    fontSize: 12,
  },
});
