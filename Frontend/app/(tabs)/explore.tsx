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
import { CategoryType } from "@/types/type";
import { Stack, useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ChevronRight } from "lucide-react-native";

const ExploreScreen = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const URL = `http://${Personal_IP.data}:3000/category/get-all-categories`;
        const response = await axios.get(URL);
        setCategories(response.data.data);
      } catch (error: any) {
        console.log("Error fetching categories:", error.message);
      }
    };

    getCategories();
  }, []);

  const onPressCategory = (categoryId: number) => {
    router.push(`/AllProduct?categoryId=${categoryId}`);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => onPressCategory(item.id)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={styles.card}
                entering={FadeInDown.delay(300 + index * 100).duration(500)}
              >
                <Image
                  source={{
                    uri: item.picture || "https://via.placeholder.com/80",
                  }}
                  style={styles.image}
                />
                <Text style={styles.title}>{item.title}</Text>
              </Animated.View>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.extraLightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
  },
});
