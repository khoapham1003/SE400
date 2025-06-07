"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var ProductItem_1 = require("./ProductItem");
var Colors_1 = require("../constants/Colors");
var ProductList = function (_a) {
    var products = _a.products, _b = _a.flatlist, flatlist = _b === void 0 ? true : _b;
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.titleWrapper}>
        <react_native_1.Text style={styles.title}>For You</react_native_1.Text>
        <react_native_1.TouchableOpacity>
          <react_native_1.Text style={styles.titleBtn}>See All</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
      {flatlist ? (<react_native_1.FlatList data={products} numColumns={2} contentContainerStyle={{
                justifyContent: "space-between",
                marginBottom: 20,
            }} keyExtractor={function (item) { return item.id.toString(); }} renderItem={function (_a) {
                var index = _a.index, item = _a.item;
                return (<ProductItem_1.default item={item} index={index}/>);
            }}/>) : (<react_native_1.View style={styles.itemsWrapper}>
          {products.map(function (item, index) { return (<react_native_1.View key={index} style={styles.productWrapper}>
              <ProductItem_1.default item={item} index={index}/>
            </react_native_1.View>); })}
        </react_native_1.View>)}
    </react_native_1.View>);
};
exports.default = ProductList;
var styles = react_native_1.StyleSheet.create({
    container: {
        marginHorizontal: 20,
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
        marginBottom: 10,
    },
    titleBtn: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors_1.Colors.black,
        letterSpacing: 0.6,
    },
    itemsWrapper: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'stretch'
    },
    productWrapper: {
        width: '50%',
        paddingLeft: 5,
        marginBottom: 20
    }
});
