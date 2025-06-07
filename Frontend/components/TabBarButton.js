"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var Icons_1 = require("../constants/Icons");
var Colors_1 = require("../constants/Colors");
var TabBarButton = function (props) {
    var onPress = props.onPress, onLongPress = props.onLongPress, label = props.label, isFocused = props.isFocused, routeName = props.routeName;
    return (<react_native_1.Pressable onPress={onPress} onLongPress={onLongPress} style={styles.tabbarBtn}>
      {/* Hiển thị số hàng trong Cart ở tabbar */}
      {routeName == "cart" && (<react_native_1.View style={styles.badgeWrapper}>
          <react_native_1.Text style={styles.badgeText}>3</react_native_1.Text>
        </react_native_1.View>)}

      {Icons_1.icon[routeName]({
            color: isFocused ? Colors_1.Colors.primary : Colors_1.Colors.black,
        })}
      <react_native_1.Text style={{ color: isFocused ? "#673ab7" : "#222" }}>{label}</react_native_1.Text>
    </react_native_1.Pressable>);
};
exports.default = TabBarButton;
var styles = react_native_1.StyleSheet.create({
    tabbarBtn: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
    badgeWrapper: {
        position: "absolute",
        top: -5,
        right: 20,
        backgroundColor: Colors_1.Colors.highlight,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 10,
        zIndex: 10,
    },
    badgeText: {
        color: Colors_1.Colors.black,
        fontSize: 12,
    },
});
