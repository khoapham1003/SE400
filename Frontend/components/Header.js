"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var Colors_1 = require("../constants/Colors");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
var Header = function (props) {
    var insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    return (<react_native_1.View style={[styles.container, { paddingTop: insets.top }]}>
      <react_native_1.Text style={styles.logo}>Header</react_native_1.Text>
      <expo_router_1.Link href={"/explore"} asChild>
        <react_native_1.TouchableOpacity style={styles.searchBar}>
          <react_native_1.Text style={styles.searchTxt}>Search</react_native_1.Text>
          <vector_icons_1.Ionicons name="search-outline" size={22} color={Colors_1.Colors.primary}/>
        </react_native_1.TouchableOpacity>
      </expo_router_1.Link>
    </react_native_1.View>);
};
exports.default = Header;
var styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors_1.Colors.white,
        paddingHorizontal: 20,
        paddingBottom: 10,
        gap: 15,
    },
    logo: {
        fontSize: 24,
        fontWeight: "700",
        color: Colors_1.Colors.primary,
    },
    searchBar: {
        flex: 1,
        backgroundColor: Colors_1.Colors.background,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    searchTxt: {
        color: Colors_1.Colors.gray,
    },
});
