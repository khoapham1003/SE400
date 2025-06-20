import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet } from "react-native";

export const icon = {
  index: ({ color }: { color: string }) => (
    <Ionicons name="home-outline" size={22} color={color} />
  ),
  explore: ({ color }: { color: string }) => (
    <Ionicons name="search-outline" size={22} color={color} />
  ),
  orderhistory: ({ color }: { color: string }) => (
    <Ionicons name="cube-outline" size={22} color={color} />
  ),
  cart: ({ color }: { color: string }) => (
    <Ionicons name="cart-outline" size={22} color={color} />
  ),
  profile: ({ color }: { color: string }) => (
    //<Ionicons name="person-outline" size={22} color={color} />
    <Image
      source={{
        uri: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1",
      }}
      style={styles.userImg}
    />
  ),
};
const styles = StyleSheet.create({
  userImg: {
    width: 24,
    height: 24,
    borderRadius: 20,
  },
});
