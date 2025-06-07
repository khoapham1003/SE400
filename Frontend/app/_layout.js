"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expo_font_1 = require("expo-font");
var expo_router_1 = require("expo-router");
var SplashScreen = require("expo-splash-screen");
var react_1 = require("react");
require("react-native-reanimated");
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
function RootLayout() {
    var loaded = (0, expo_font_1.useFonts)({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    })[0];
    (0, react_1.useEffect)(function () {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);
    if (!loaded) {
        return null;
    }
    return (<expo_router_1.Stack>
        <expo_router_1.Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <expo_router_1.Stack.Screen name="signin" options={{ presentation: 'modal' }}/>
        <expo_router_1.Stack.Screen name="signup" options={{ presentation: 'modal' }}/>
      </expo_router_1.Stack>);
}
exports.default = RootLayout;
