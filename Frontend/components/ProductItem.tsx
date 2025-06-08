import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { ProductType } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Link } from "expo-router";
import { formatPrice } from "@/utils/format";

type Props = {
  item: ProductType;
  index: number;
};

const width = Dimensions.get("window").width - 40;

const ProductItem = ({ item, index }: Props) => {
  return (
    <Link href={`/product-details/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View
          entering={FadeInDown.delay(300 + index * 100).duration(500)}
          style={styles.container}
        >
          <Image
            style={styles.productImg}
            source={
              item.picture
                ? { uri: item.picture }
                : require("@/assets/images/no-image-available.jpg")
            }
          ></Image>
          <TouchableOpacity style={styles.bookmarkBtn}>
            <Ionicons name="heart-outline" size={22} color={Colors.black} />
          </TouchableOpacity>
          <View style={styles.productInfo}>
            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.priceFinal}>
              {formatPrice(
                (item.price || 0) * (1 - (item.discount || 0) / 100)
              )}
            </Text>

            {item.discount > 0 && (
              <View style={styles.priceMetaWrapper}>
                <Text style={styles.priceOriginal}>
                  {formatPrice(item.price)}
                </Text>
                <View style={styles.priceDiscountBadge}>
                  <Text style={styles.priceDiscountText}>
                    {item.discount}% OFF
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 10,
  },
  productImg: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  bookmarkBtn: {
    position: "absolute",
    right: 20,
    top: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 30,
    padding: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    letterSpacing: 1.1,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rating: {
    fontSize: 14,
    color: Colors.gray,
  },
  priceDiscount: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },

  productInfo: {
    marginTop: 12,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },

  priceFinal: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },

  priceMetaWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  priceOriginal: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },

  priceDiscountBadge: {
    backgroundColor: "#FF5252",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  priceDiscountText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
