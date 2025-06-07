import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { CategoryType } from "@/types/type";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

type Props = {
  categories: CategoryType[];
};

const Categories = ({ categories }: Props) => {
  const router = useRouter();
  console.log("categories", categories);
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.titleBtn}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => router.push(`/AllProduct?categoryId=${item.id}`)}
          >
            <View style={styles.item}>
              <Image source={{ uri: item.picture }} style={styles.itemImg} />
              <Text>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      ></FlatList>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
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
    marginHorizontal: 20,
  },
  titleBtn: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.black,
    letterSpacing: 0.6,
  },
  itemImg: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
  },
  item: {
    marginVertical: 10,
    gap: 5,
    alignItems: "center",
    marginLeft: 20,
  },
});
