import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
} from "react-native";
import React from "react";

type Props = {
  image: string[];
};

const width = Dimensions.get("screen").width;

const ImageSlider = ({ image }: Props) => {
  return (
    <View
      style={{ width: width, justifyContent: "center", alignItems: "center" }}
    >
      <FlatList
        data={image}
        renderItem={({ item }) => (
          <View>
            <Image
              style={{ width: width, height: 300 }}
              source={
                item
                  ? { uri: item }
                  : require("@/assets/images/no-image-available.jpg")
              }
            ></Image>
          </View>
        )}
        horizontal
        // showHorizontalScrollIndicator={false}
        pagingEnabled
      />
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({});
