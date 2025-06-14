import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import ProductItem from "./ProductItem";
import { Colors } from "@/constants/Colors";
import { ProductType } from "@/types/type";
import { useRouter } from "expo-router";

type Props = {
  products: ProductType[];
  flatlist?: boolean;
  categoryId?: number | null;
  hideHeader?: boolean;
};

const ProductList = ({
  products,
  flatlist = true,
  categoryId = null,
  hideHeader = false,
}: Props) => {
  const router = useRouter();

  const handleSeeAllPress = () => {
    if (categoryId) {
      // Navigate to AllProduct with specific category
      router.push(`/AllProduct?categoryId=${categoryId}`);
    } else {
      // Navigate to AllProduct showing all products
      router.push("/AllProduct");
    }
  };

  return (
    <View style={styles.container}>
      {!hideHeader && (
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>For You</Text>
          <TouchableOpacity onPress={handleSeeAllPress}>
            <Text style={styles.titleBtn}>See All</Text>
          </TouchableOpacity>
        </View>
      )}
      {flatlist ? (
        <FlatList
          data={products}
          numColumns={2}
          contentContainerStyle={{
            justifyContent: "space-between",
            marginBottom: 20,
          }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ index, item }) => (
            <ProductItem item={item} index={index} />
          )}
        />
      ) : (
        <View style={styles.itemsWrapper}>
          {products.map((item, index) => (
            <View key={index} style={styles.productWrapper}>
              <ProductItem item={item} index={index} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.6,
    color: Colors.black,
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleBtn: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.black,
    letterSpacing: 0.6,
  },
  itemsWrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
  },
  productWrapper: {
    width: "50%",
    paddingLeft: 5,
    marginBottom: 20,
  },
});
