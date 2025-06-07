import {
  FlatList,
  FlatListComponent,
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";
import { CategoryType } from "@/types/type";
import { Stack, useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {};

const ExploreScreen = (props: Props) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const URL =
      "http://" + Personal_IP.data + ":3000/category/get-all-categories";
    const response = await axios.get(URL).catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: " + error.message
      );
      throw error;
    });
    setCategories(response.data.data);
    console.log("categories", response.data.data);
  };

  const onPressCategory = (categoryId: number) => {
    // Fixed: Navigate to AllProduct page with categoryId parameter
    router.push(`/AllProduct?categoryId=${categoryId}`);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <FlatList
          data={categories}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => onPressCategory(item.id)}>
              <Animated.View
                style={styles.itemWrapper}
                entering={FadeInDown.delay(300 + index * 100).duration(500)}
              >
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Image
                  source={{ uri: item.picture }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
        ></FlatList>
      </View>
    </>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    backgroundColor: Colors.extraLightGray,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 5,
  },
});