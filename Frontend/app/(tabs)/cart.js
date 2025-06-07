"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var ip_1 = require("@/constants/ip");
var axios_1 = require("axios");
var expo_router_1 = require("expo-router");
var react_native_reanimated_1 = require("react-native-reanimated");
var elements_1 = require("@react-navigation/elements");
var Colors_1 = require("../../constants/Colors");
var vector_icons_1 = require("@expo/vector-icons");
var CartScreen = function (props) {
    var headerHeight = (0, elements_1.useHeaderHeight)();
    var _a = (0, react_1.useState)([]), cartItems = _a[0], setCartItems = _a[1];
    var userID = 1; //temp
    (0, react_1.useEffect)(function () {
        getCartData();
    }, []);
    var getCartData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var URL, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = "http://" +
                        ip_1.Personal_IP.data +
                        ":3000//cart/find-cart-by-userid/" +
                        { userID: userID };
                    return [4 /*yield*/, axios_1.default.get(URL).catch(function (error) {
                            console.log("There has been a problem with your fetch operation: " + error.message);
                            throw error;
                        })];
                case 1:
                    response = _a.sent();
                    setCartItems(response.data.data);
                    console.log("cart data", response.data.data);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<>
      <expo_router_1.Stack.Screen options={{ headerShown: true, headerTransparent: true }}/>
      <react_native_1.View style={[styles.container, { marginTop: headerHeight }]}>
        <react_native_1.FlatList data={cartItems} showsHorizontalScrollIndicator={false} keyExtractor={function (item) { return item.id.toString(); }} renderItem={function (_a) {
            var item = _a.item, index = _a.index;
            return (<react_native_reanimated_1.default.View entering={react_native_reanimated_1.FadeInDown.delay(300 + index * 100).duration(500)}>
              <CartItem item={item}/>
            </react_native_reanimated_1.default.View>);
        }}></react_native_1.FlatList>
      </react_native_1.View>
      <react_native_1.View style={styles.footer}>
        <react_native_1.View style={styles.priceInfoWrapper}>
          <react_native_1.Text style={styles.totalText}>Total: $100</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.TouchableOpacity style={styles.checkoutBtn}>
          <react_native_1.Text style={styles.checkoutBtnText}>Checkout</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </>);
};
var CartItem = function (_a) {
    var _b, _c, _d, _e;
    var item = _a.item;
    return (<react_native_1.View style={styles.itemWrapper}>
      <react_native_1.Image source={{ uri: (_c = (_b = item.productVariant) === null || _b === void 0 ? void 0 : _b.product) === null || _c === void 0 ? void 0 : _c.picture }} style={styles.itemImg}/>
      <react_native_1.View style={styles.itemInfoWrapper}>
        <react_native_1.Text style={styles.itemText}>
          {(_e = (_d = item.productVariant) === null || _d === void 0 ? void 0 : _d.product) === null || _e === void 0 ? void 0 : _e.title}
        </react_native_1.Text>
        <react_native_1.Text style={styles.itemText}>${item.price}</react_native_1.Text>
        <react_native_1.View style={styles.itemControlWrapper}>
          <react_native_1.TouchableOpacity>
            <vector_icons_1.Ionicons name="trash-outline" size={20} color={Colors_1.Colors.red}/>
          </react_native_1.TouchableOpacity>
          <react_native_1.View style={styles.quantityControlWrapper}>
            <react_native_1.TouchableOpacity style={styles.quantityControl}>
              <vector_icons_1.Ionicons name="remove-outline" size={20} color={Colors_1.Colors.black}/>
            </react_native_1.TouchableOpacity>
            <react_native_1.Text>{item.quantity}</react_native_1.Text>
            <react_native_1.TouchableOpacity style={styles.quantityControl}>
              <vector_icons_1.Ionicons name="add-outline" size={20} color={Colors_1.Colors.black}/>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
          <react_native_1.TouchableOpacity>
            <vector_icons_1.Ionicons name="heart-outline" size={20} color={Colors_1.Colors.black}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.default = CartScreen;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    itemWrapper: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginBottom: 10,
        borderWidth: react_native_1.StyleSheet.hairlineWidth,
        borderColor: Colors_1.Colors.lightGray,
        borderRadius: 5,
    },
    itemInfoWrapper: {
        flex: 1,
        alignSelf: "flex-start",
        gap: 10,
    },
    itemImg: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginRight: 10,
    },
    itemText: {},
    itemControlWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    quantityControlWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    quantityControl: {
        padding: 5,
        borderWidth: react_native_1.StyleSheet.hairlineWidth,
        borderColor: Colors_1.Colors.lightGray,
        borderRadius: 5,
    },
    footer: {
        flexDirection: "row",
        padding: 20,
        backgroundColor: Colors_1.Colors.white,
        // position: "absolute",
        // bottom: 0,
        // left: 0,
        // right: 0,
    },
    priceInfoWrapper: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        marginBottom: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: "500",
        color: Colors_1.Colors.black,
    },
    checkoutBtn: {
        flex: 1,
        backgroundColor: Colors_1.Colors.primary,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    checkoutBtnText: {
        color: Colors_1.Colors.white,
        fontSize: 16,
        fontWeight: "500",
    },
});
