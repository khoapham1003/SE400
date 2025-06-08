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
      style={{
        width: width,
        paddingVertical: 8,
        backgroundColor: "#fff",
        alignItems: "center",
      }}
    >
      <FlatList
        data={image}
        renderItem={({ item }) => (
          <View>
            <Image
              style={{
                width: width,
                height: width * 0.9,
                resizeMode: "contain",
                alignSelf: "center",
              }}
              source={
                item
                  ? { uri: item }
                  : require("@/assets/images/no-image-available.jpg")
              }
            />
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
