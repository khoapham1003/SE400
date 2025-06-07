"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icon = void 0;
var vector_icons_1 = require("@expo/vector-icons");
var react_native_1 = require("react-native");
exports.icon = {
    index: function (_a) {
        var color = _a.color;
        return (<vector_icons_1.Ionicons name="home-outline" size={22} color={color}/>);
    },
    explore: function (_a) {
        var color = _a.color;
        return (<vector_icons_1.Ionicons name="search-outline" size={22} color={color}/>);
    },
    notifications: function (_a) {
        var color = _a.color;
        return (<vector_icons_1.Ionicons name="notifications-outline" size={22} color={color}/>);
    },
    cart: function (_a) {
        var color = _a.color;
        return (<vector_icons_1.Ionicons name="cart-outline" size={22} color={color}/>);
    },
    profile: function (_a) {
        var color = _a.color;
        return (
        //<Ionicons name="person-outline" size={22} color={color} />
        <react_native_1.Image source={{
                uri: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1",
            }} style={styles.userImg}/>);
    },
};
var styles = react_native_1.StyleSheet.create({
    userImg: {
        width: 24,
        height: 24,
        borderRadius: 20,
    },
});
