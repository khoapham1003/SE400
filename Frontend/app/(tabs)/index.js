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
var axios_1 = require("axios");
var expo_router_1 = require("expo-router");
var Header_1 = require("../../components/Header");
var ProductList_1 = require("../../components/ProductList");
var Categories_1 = require("../../components/Categories");
var FlashSale_1 = require("../../components/FlashSale");
var ip_1 = require("@/constants/ip");
var HomeScreen = function (props) {
    var _a = (0, react_1.useState)([]), products = _a[0], setProducts = _a[1];
    var _b = (0, react_1.useState)([]), saleProducts = _b[0], setSaleProducts = _b[1];
    var _c = (0, react_1.useState)([]), categories = _c[0], setCategories = _c[1];
    var _d = (0, react_1.useState)(true), isLoading = _d[0], setIsLoading = _d[1];
    (0, react_1.useEffect)(function () {
        getProducts();
        getCategories();
        getSaleProducts();
    }, []);
    var getProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
        var URL, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = "http://" + ip_1.Personal_IP.data + ":3000/product/get-all-products";
                    return [4 /*yield*/, axios_1.default.get(URL).catch(function (error) {
                            console.log("There has been a problem with your fetch operation: " + error.message);
                            throw error;
                        })];
                case 1:
                    response = _a.sent();
                    setProducts(response.data.data);
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var getCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
        var URL, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = "http://" + ip_1.Personal_IP.data + ":3000/category/get-all-categories";
                    return [4 /*yield*/, axios_1.default.get(URL).catch(function (error) {
                            console.log("There has been a problem with your fetch operation: " + error.message);
                            throw error;
                        })];
                case 1:
                    response = _a.sent();
                    setCategories(response.data.data);
                    setIsLoading(false);
                    console.log("categories", response.data.data);
                    return [2 /*return*/];
            }
        });
    }); };
    var getSaleProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
        var URL, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = "http://" + ip_1.Personal_IP.data + ":3000/product/get-all-products";
                    return [4 /*yield*/, axios_1.default.get(URL).catch(function (error) {
                            console.log("There has been a problem with your fetch operation: " + error.message);
                            throw error;
                        })];
                case 1:
                    response = _a.sent();
                    setSaleProducts(response.data.data);
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    if (isLoading) {
        return (<react_native_1.View>
            <react_native_1.ActivityIndicator size={'large'}/>
            </react_native_1.View>);
    }
    return (<>
      <expo_router_1.Stack.Screen options={{ headerShown: true, header: function () { return <Header_1.default />; } }}/>
      <react_native_1.ScrollView>
      <Categories_1.default categories={categories}></Categories_1.default>
      <FlashSale_1.default products={saleProducts}/>
      <react_native_1.View style={{ marginHorizontal: 20, marginBottom: 10 }}>
        <react_native_1.Image source={require('@/assets/images/sale-banner.jpg')} style={{ width: '100%', height: 150, borderRadius: 15 }}/>
      </react_native_1.View>
      <ProductList_1.default products={products} flatlist={false}/>
      </react_native_1.ScrollView>
    </>);
};
exports.default = HomeScreen;
var styles = react_native_1.StyleSheet.create({});
