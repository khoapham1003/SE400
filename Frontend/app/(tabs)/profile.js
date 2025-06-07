"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var expo_router_1 = require("expo-router");
var elements_1 = require("@react-navigation/elements");
var Colors_1 = require("../../constants/Colors");
var vector_icons_1 = require("@expo/vector-icons");
var ProfileScreen = function (props) {
    var headerHeight = (0, elements_1.useHeaderHeight)();
    return (<>
      <expo_router_1.Stack.Screen options={{ headerShown: true, headerTransparent: true }}/>
      <react_native_1.View style={[styles.container, { marginTop: headerHeight }]}>
        <react_native_1.View style={{ alignItems: "center" }}>
          <react_native_1.Image source={{
            uri: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1",
        }}/>
          <react_native_1.Text style={styles.userName}>PKBinnnn Name</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.buttonWrapper}>
          <react_native_1.TouchableOpacity style={styles.button}>
            <vector_icons_1.Ionicons name="person-outline" size={20} color={Colors_1.Colors.black}/>
            <react_native_1.Text style={styles.buttonText}>Your Order</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.button}>
            <vector_icons_1.Ionicons name="heart-outline" size={20} color={Colors_1.Colors.black}/>
            <react_native_1.Text style={styles.buttonText}>Your Wishlist</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.button}>
            <vector_icons_1.Ionicons name="card-outline" size={20} color={Colors_1.Colors.black}/>
            <react_native_1.Text style={styles.buttonText}>Payment History</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.button}>
            <vector_icons_1.Ionicons name="gift-outline" size={20} color={Colors_1.Colors.black}/>
            <react_native_1.Text style={styles.buttonText}>Reward Point</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.button}>
            <vector_icons_1.Ionicons name="help-circle-outline" size={20} color={Colors_1.Colors.black}/>
            <react_native_1.Text style={styles.buttonText}>Customer Support</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.button}>
            <vector_icons_1.Ionicons name="pencil-outline" size={20} color={Colors_1.Colors.black}/>
            <react_native_1.Text style={styles.buttonText}>Edit Profile</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.button}>
            <vector_icons_1.Ionicons name="settings-outline" size={20} color={Colors_1.Colors.black}/>
            <react_native_1.Text style={styles.buttonText}>Settings</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.button}>
            <vector_icons_1.Ionicons name="log-out-outline" size={20} color={Colors_1.Colors.black}/>
            <react_native_1.Text style={styles.buttonText}>Logout</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>
    </>);
};
exports.default = ProfileScreen;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    userName: {
        fontSize: 20,
        fontWeight: "500",
        color: Colors_1.Colors.black,
        marginTop: 10,
    },
    buttonWrapper: {
        marginTop: 20,
        gap: 10,
    },
    button: {
        padding: 10,
        borderTopColor: Colors_1.Colors.lightGray,
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "400",
        color: Colors_1.Colors.black,
    },
});
