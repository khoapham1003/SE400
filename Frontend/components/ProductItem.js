"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var vector_icons_1 = require("@expo/vector-icons");
var Colors_1 = require("../constants/Colors");
var react_native_reanimated_1 = require("react-native-reanimated");
var expo_router_1 = require("expo-router");
var width = react_native_1.Dimensions.get("window").width - 40;
var ProductItem = function (_a) {
    var item = _a.item, index = _a.index;
    return (<expo_router_1.Link href={"/product-details/".concat(item.id)} asChild>
      <react_native_1.TouchableOpacity>
    <react_native_reanimated_1.default.View entering={react_native_reanimated_1.FadeInDown.delay(300 + index * 100).duration(500)} style={styles.container}>
      <react_native_1.Image source={{ uri: item.picture }} style={styles.productImg}/>
      <react_native_1.TouchableOpacity style={styles.bookmarkBtn}>
        <vector_icons_1.Ionicons name="heart-outline" size={22} color={Colors_1.Colors.black}/>
      </react_native_1.TouchableOpacity>
      <react_native_1.View style={styles.productInfo}>
        <react_native_1.Text style={styles.price}>${item.price}</react_native_1.Text>
        <react_native_1.View style={styles.ratingWrapper}>
          <vector_icons_1.Ionicons name="star" size={20} color="#D5AF37"/>
          <react_native_1.Text style={styles.rating}>4.6</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
      <react_native_1.Text style={styles.title}>{item.title}</react_native_1.Text>
    </react_native_reanimated_1.default.View>
    </react_native_1.TouchableOpacity>
    </expo_router_1.Link>);
};
exports.default = ProductItem;
var styles = react_native_1.StyleSheet.create({
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
        color: Colors_1.Colors.black,
        letterSpacing: 1.1,
    },
    productInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors_1.Colors.primary,
    },
    ratingWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    rating: {
        fontSize: 14,
        color: Colors_1.Colors.gray,
    },
});
