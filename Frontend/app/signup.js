"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var expo_router_1 = require("expo-router");
var Colors_1 = require("../constants/Colors");
var InputField_1 = require("../components/InputField");
var react_native_2 = require("react-native");
var SignUpScreen = function (props) {
    return (<>
        <expo_router_1.Stack.Screen options={{ headerTitle: 'Sign Up' }}/>
        <react_native_1.View style={styles.container}>
          <react_native_1.Text style={styles.title}>Create an Account</react_native_1.Text>
          <InputField_1.default placeholder="Email Address" placeholderTextColor={Colors_1.Colors.gray} autoCapitalize="none" keyboardType="email-address"/>
          <InputField_1.default placeholder="Password" placeholderTextColor={Colors_1.Colors.gray} secureTextEntry={true}/>
          <InputField_1.default placeholder="Confirm Password" placeholderTextColor={Colors_1.Colors.gray} secureTextEntry={true}/>

            <react_native_2.TouchableOpacity style={styles.btn}>
            <react_native_1.Text style={styles.btnTxt}>Create an Account</react_native_1.Text>
            </react_native_2.TouchableOpacity>

            <react_native_1.Text style={styles.loginTxt}>
                Already have an account? {" "}
                <expo_router_1.Link href={"/signin"} asChild>
                  <react_native_2.TouchableOpacity>
                    <react_native_1.Text style={styles.loginTxtSpan}>Sign In</react_native_1.Text>
                  </react_native_2.TouchableOpacity>
                </expo_router_1.Link>
            </react_native_1.Text>
        </react_native_1.View>
      </>);
};
exports.default = SignUpScreen;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors_1.Colors.background
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: 1.2,
        color: Colors_1.Colors.black,
        marginBottom: 50
    },
    btn: {
        backgroundColor: Colors_1.Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 18,
        alignSelf: 'stretch',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20
    },
    btnTxt: {
        color: Colors_1.Colors.white,
        fontSize: 16,
        fontWeight: '600'
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
