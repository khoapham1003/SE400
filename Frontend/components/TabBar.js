"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBar = void 0;
var react_native_1 = require("react-native");
var TabBarButton_1 = require("./TabBarButton");
var Colors_1 = require("../constants/Colors");
var react_native_reanimated_1 = require("react-native-reanimated");
var react_1 = require("react");
function TabBar(_a) {
    var state = _a.state, descriptors = _a.descriptors, navigation = _a.navigation;
    var _b = (0, react_1.useState)({ width: 100, height: 20 }), dimensions = _b[0], setDimensions = _b[1];
    var buttonWidth = dimensions.width / state.routes.length;
    (0, react_1.useEffect)(function () {
        tabPositionX.value = (0, react_native_reanimated_1.withTiming)(buttonWidth * state.index, {
            duration: 200,
        });
    }, [state.index]);
    var onTabBarLayout = function (e) {
        setDimensions({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        });
    };
    var tabPositionX = (0, react_native_reanimated_1.useSharedValue)(0);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        return {
            transform: [{ translateX: tabPositionX.value }],
        };
    });
    return (<react_native_1.View onLayout={onTabBarLayout} style={styles.tabbar}>
      <react_native_reanimated_1.default.View style={[
            animatedStyle,
            {
                position: "absolute",
                backgroundColor: Colors_1.Colors.primary,
                top: 0,
                left: 20,
                width: buttonWidth / 2,
                height: 2,
            },
        ]}></react_native_reanimated_1.default.View>
      {state.routes.map(function (route, index) {
            var options = descriptors[route.key].options;
            var label = options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                    ? options.title
                    : route.name;
            var isFocused = state.index === index;
            var onPress = function () {
                var event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                }
            };
            var onLongPress = function () {
                navigation.emit({
                    type: "tabLongPress",
                    target: route.key,
                });
            };
            return (<TabBarButton_1.default key={route.name} onLongPress={onLongPress} onPress={onPress} label={label} isFocused={isFocused} routeName={route.name}/>);
        })}
    </react_native_1.View>);
}
exports.TabBar = TabBar;
var styles = react_native_1.StyleSheet.create({
    tabbar: {
        flexDirection: "row",
        paddingTop: 16,
        paddingBottom: 40,
        backgroundColor: Colors_1.Colors.white,
    },
});
