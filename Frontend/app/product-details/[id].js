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
var expo_router_1 = require("expo-router");
var ip_1 = require("@/constants/ip");
var axios_1 = require("axios");
var ImageSlider_1 = require("../../components/ImageSlider");
var vector_icons_1 = require("@expo/vector-icons");
var Colors_1 = require("../../constants/Colors");
var elements_1 = require("@react-navigation/elements");
var ProductDetails = function (props) {
    var id = (0, expo_router_1.useLocalSearchParams)().id;
    var _a = (0, react_1.useState)({}), product = _a[0], setProduct = _a[1];
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    (0, react_1.useEffect)(function () {
        getProductDetails();
    }, []);
    var getProductDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
        var URL_1, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    URL_1 = "http://".concat(ip_1.Personal_IP.data, ":3000/product/get-product/").concat(id);
                    return [4 /*yield*/, axios_1.default.get(URL_1)];
                case 1:
                    response = _a.sent();
                    setProduct(response.data.data); // save response data in state
                    console.log('Picture:', response.data.data.picture);
                    setError(null);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    setError('Failed to load product details.');
                    console.error(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var headerHeight = (0, elements_1.useHeaderHeight)();
    return (<>
        <expo_router_1.Stack.Screen options={{ title: "Product Details", headerTransparent: true }}/>
        <react_native_1.ScrollView style={{ marginTop: headerHeight, marginBottom: 90 }}>
        <react_native_1.View>
            {product && <ImageSlider_1.default image={Array.isArray(product.picture) ? product.picture : [product.picture]}/>}
            {product && (<react_native_1.View style={styles.container}>
                    <react_native_1.View style={styles.ratingWrapper}>
                        <react_native_1.View style={styles.ratingWrapper}>
                            <vector_icons_1.Ionicons name="star" size={18} color={"#D4AF37"}/>
                            <react_native_1.Text style={styles.rating}>4.7 <react_native_1.Text>(136)</react_native_1.Text></react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.TouchableOpacity>
                            <vector_icons_1.Ionicons name='heart-outline' size={20} color={Colors_1.Colors.black}/>
                        </react_native_1.TouchableOpacity>
                    </react_native_1.View>
                    <react_native_1.Text>{product.title}</react_native_1.Text>
                    <react_native_1.View style={styles.priceWrapper}>
                        <react_native_1.Text style={styles.price}>${product.price}</react_native_1.Text>
                        <react_native_1.View style={styles.priceDiscount}>
                            <react_native_1.Text style={styles.priceDiscountText}>6% Off</react_native_1.Text>
                        </react_native_1.View>
                    </react_native_1.View>
                    <react_native_1.Text style={styles.description}>{product.content}</react_native_1.Text>

                    <react_native_1.View style={styles.productVariationWrapper}>
                        <react_native_1.View style={styles.productVariationType}>
                            <react_native_1.Text style={styles.productVariationTitle}>Color</react_native_1.Text>
                            <react_native_1.View style={styles.productVariationValueWrapper}>
                                <react_native_1.View style={{ borderColor: Colors_1.Colors.primary, borderWidth: 1, borderRadius: 100, padding: 2 }}>
                                    <react_native_1.View style={[styles.productVariationColorValue, { backgroundColor: "#333" }]}/>
                                </react_native_1.View>

                                <react_native_1.View style={[styles.productVariationColorValue, { backgroundColor: "#D4AF37" }]}/>
                                <react_native_1.View style={[styles.productVariationColorValue, { backgroundColor: "#F44336" }]}/>
                                <react_native_1.View style={[styles.productVariationColorValue, { backgroundColor: "#2196F3" }]}/>
                            </react_native_1.View>
                        </react_native_1.View>
                        <react_native_1.View>
                            <react_native_1.Text style={styles.productVariationTitle}>Size</react_native_1.Text>
                            <react_native_1.View style={styles.productVariationValueWrapper}>
                                <react_native_1.View style={[styles.productVariationSizeValue, { borderColor: Colors_1.Colors.primary }]}>
                                    <react_native_1.Text style={[styles.productVariationSizeValueText, { color: Colors_1.Colors.primary, fontWeight: 'bold' }]}>S</react_native_1.Text>
                                </react_native_1.View>
                                <react_native_1.View style={styles.productVariationSizeValue}>
                                    <react_native_1.Text style={styles.productVariationSizeValueText}>M</react_native_1.Text>
                                </react_native_1.View>
                                <react_native_1.View style={styles.productVariationSizeValue}>
                                    <react_native_1.Text style={styles.productVariationSizeValueText}>L</react_native_1.Text>
                                </react_native_1.View>
                            </react_native_1.View>
                        </react_native_1.View>
                    </react_native_1.View>
                </react_native_1.View>)}
        </react_native_1.View>
        </react_native_1.ScrollView>
        <react_native_1.View style={styles.buttonWrapper}>
            <react_native_1.TouchableOpacity style={[styles.button, { backgroundColor: Colors_1.Colors.white, borderColor: Colors_1.Colors.primary, borderWidth: 1 }]}>
                <vector_icons_1.Ionicons name="cart-outline" size={20} color={Colors_1.Colors.primary}/>
                <react_native_1.Text style={[styles.buttonText, { color: Colors_1.Colors.primary }]}>Add to Cart</react_native_1.Text>
            </react_native_1.TouchableOpacity>
            <react_native_1.TouchableOpacity style={styles.button}>
                <react_native_1.Text style={styles.buttonText}>Buy Now</react_native_1.Text>
            </react_native_1.TouchableOpacity>
        </react_native_1.View>
        </>);
};
exports.default = ProductDetails;
var styles = react_native_1.StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    ratingWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5
    },
    rating: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '400',
        color: Colors_1.Colors.gray
    },
    title: {
        fontSize: 20,
        fontWeight: '400',
        color: Colors_1.Colors.black,
        letterSpacing: 0.6,
        lineHeight: 32
    },
    priceWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        gap: 5
    },
    price: {
        fontWeight: '600',
        fontSize: 18,
        color: Colors_1.Colors.black
    },
    priceDiscount: {
        backgroundColor: Colors_1.Colors.extraLightGray,
        padding: 5,
        borderRadius: 5
    },
    priceDiscountText: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors_1.Colors.primary
    },
    description: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: '400',
        color: Colors_1.Colors.black,
        letterSpacing: 0.6,
        lineHeight: 24
    },
    productVariationWrapper: {
        flexDirection: 'row',
        marginTop: 20,
        flexWrap: 'wrap'
    },
    productVariationType: {
        width: '50%',
        gap: 5,
        marginBottom: 10
    },
    productVariationTitle: {
        fontWeight: '500',
        fontSize: 16,
        color: Colors_1.Colors.black
    },
    productVariationValueWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        flexWrap: 'wrap'
    },
    productVariationColorValue: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors_1.Colors.extraLightGray
    },
    productVariationSizeValue: {
        width: 50,
        height: 30,
        borderRadius: 5,
        backgroundColor: Colors_1.Colors.extraLightGray,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    productVariationSizeValueText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors_1.Colors.black
    },
    buttonWrapper: {
        position: 'absolute',
        height: 90,
        padding: 20,
        bottom: 0,
        width: '100%',
        backgroundColor: Colors_1.Colors.white,
        flexDirection: 'row',
        gap: 10
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors_1.Colors.primary,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        gap: 5,
        elevation: 5,
        shadowColor: Colors_1.Colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors_1.Colors.white
    }
});
