"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var Colors_1 = require("../constants/Colors");
var Categories = function (_a) {
    var categories = _a.categories;
    console.log("categories", categories);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.titleWrapper}>
        <react_native_1.Text style={styles.title}>Categories</react_native_1.Text>
        <react_native_1.TouchableOpacity>
          <react_native_1.Text style={styles.titleBtn}>See All</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
      <react_native_1.FlatList data={categories} horizontal showsHorizontalScrollIndicator={false} keyExtractor={function (item) { return item.id.toString(); }} renderItem={function (_a) {
            var item = _a.item, index = _a.index;
            return (<react_native_1.TouchableOpacity>
            <react_native_1.View style={styles.item}>
              {/* <Image source={{ uri: item.image }} style={styles.itemImg} /> */}
              <react_native_1.Text>{item.title}</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.TouchableOpacity>);
        }}></react_native_1.FlatList>
    </react_native_1.View>);
};
exports.default = Categories;
var styles = react_native_1.StyleSheet.create({
    container: {
        marginBottom: 20
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: 0.6,
        color: Colors_1.Colors.black,
    },
    titleWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
    },
    titleBtn: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors_1.Colors.black,
        letterSpacing: 0.6,
    },
    itemImg: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: Colors_1.Colors.lightGray,
    },
    item: {
        marginVertical: 10,
        gap: 5,
        alignItems: "center",
        marginLeft: 20,
    },
});
