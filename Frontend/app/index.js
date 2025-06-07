"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var expo_router_1 = require("expo-router");
var expo_linear_gradient_1 = require("expo-linear-gradient");
var Colors_1 = require("../constants/Colors");
var vector_icons_1 = require("@expo/vector-icons");
var react_native_reanimated_1 = require("react-native-reanimated");
var WelcomeScreen = function (props) {
    return (<>
      <expo_router_1.Stack.Screen options={{ headerShown: false }}/>
      <react_native_1.ImageBackground source={require('@/assets/images/ecommerce-splash.jpg')} style={{ flex: 1 }} resizeMode="cover">
    <react_native_1.View style={styles.container}>
    <expo_linear_gradient_1.LinearGradient colors={["transparent", 'rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']} style={styles.background}>
      <react_native_1.View style={styles.wrapper}>
      <react_native_reanimated_1.default.Text style={styles.title} entering={react_native_reanimated_1.FadeInRight.delay(500).duration(300).springify()}>Fashion Shop</react_native_reanimated_1.default.Text>
      <react_native_reanimated_1.default.Text style={styles.description} entering={react_native_reanimated_1.FadeInRight.delay(500).duration(300).springify()}>One Stop Solution for All Your Needs.</react_native_reanimated_1.default.Text>

      <react_native_1.View style={styles.socialLoginWrapper}>
      <react_native_reanimated_1.default.View entering={react_native_reanimated_1.FadeInDown.delay(300).duration(500)}>
          <expo_router_1.Link href={"/signup"} asChild>
              <react_native_1.TouchableOpacity style={styles.button}>
                  <vector_icons_1.Ionicons name="mail-outline" size={20} color={Colors_1.Colors.black}/>
                <react_native_1.Text style={styles.btnTxt}>Continue with Email</react_native_1.Text>
              </react_native_1.TouchableOpacity>
          </expo_router_1.Link>
      </react_native_reanimated_1.default.View>

      </react_native_1.View>

      <react_native_1.Text style={styles.loginTxt}>
        Already have an account? {" "}
        <expo_router_1.Link href={"/signin"} asChild>
          <react_native_1.TouchableOpacity>
            <react_native_1.Text style={styles.loginTxtSpan}>Sign In</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </expo_router_1.Link>
      </react_native_1.Text>
      </react_native_1.View>
      </expo_linear_gradient_1.LinearGradient>
    </react_native_1.View>
    </react_native_1.ImageBackground>
    </>);
};
exports.default = WelcomeScreen;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    background: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end'
    },
    wrapper: {
        paddingBottom: 50,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 22,
        color: Colors_1.Colors.primary,
        fontWeight: '700',
        letterSpacing: 2.4,
        marginBottom: 5
    },
    description: {
        fontSize: 14,
        color: Colors_1.Colors.gray,
        letterSpacing: 1.2,
        lineHeight: 30,
        marginBottom: 20
    },
    socialLoginWrapper: {
        alignSelf: 'stretch'
    },
    button: {
        flexDirection: 'row',
        padding: 10,
        borderColor: Colors_1.Colors.gray,
        borderWidth: react_native_1.StyleSheet.hairlineWidth,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginBottom: 15
    },
    btnTxt: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors_1.Colors.black
    },
    loginTxt: {
        marginTop: 30,
        color: Colors_1.Colors.black,
        fontSize: 14,
        lineHeight: 24
    },
    loginTxtSpan: {
        color: Colors_1.Colors.primary,
        fontWeight: '600'
    }
});
