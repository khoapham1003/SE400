"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Colors_1 = require("../constants/Colors");
/**
 * A cross-platform text input that masks characters when
 * `secureTextEntry` is supplied (Android, iOS, **and** Web).
 */
var InputField = function (props) {
    // For web we need to force <input type="password">
    var extraWebProps = react_native_1.Platform.OS === "web" && props.secureTextEntry
        ? { type: "password" }
        : {};
    return (<react_native_1.TextInput {...props} {...extraWebProps} /* only affects the web build */ style={[styles.inputField, props.style]}/>);
};
exports.default = InputField;
var styles = react_native_1.StyleSheet.create({
    inputField: {
        backgroundColor: Colors_1.Colors.white,
        paddingVertical: 12,
        paddingHorizontal: 18,
        alignSelf: "stretch",
        borderRadius: 5,
        fontSize: 16,
        color: Colors_1.Colors.black,
        marginBottom: 20,
    },
});
