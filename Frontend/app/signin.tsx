import { StyleSheet, TextInput, Text, View } from "react-native";
import React, { useState } from "react";
import { Link, Stack, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import InputField from "@/components/InputField";
import { TouchableOpacity } from "react-native";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

type Props = {};

const SignInScreen = (props: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    const URL = "http://" + Personal_IP.data + ":3000/auth/login";
    router.dismissAll();
    router.push("/(tabs)");
    /*
    try {
      const response = await axios.post(URL, {
        username,
        password,
      });
      const token = response.data.access_token;
      await AsyncStorage.setItem("access_token", token);
      Alert.alert("Đăng nhập thành công!");
     
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Đăng nhập thất bại", "Sai tài khoản hoặc mật khẩu");
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Sign Up" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Login to Your Account</Text>
        <InputField
          placeholder="Username"
          placeholderTextColor={Colors.gray}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <InputField
          placeholder="Password"
          placeholderTextColor={Colors.gray}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            router.dismissAll();
            router.push("/(tabs)");
          }}
        >
          <Text style={styles.btnTxt}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.loginTxt}>
          You don't have an account?{" "}
          <Link href={"/signup"} asChild>
            <TouchableOpacity>
              <Text style={styles.loginTxtSpan}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </Text>
      </View>
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: Colors.black,
    marginBottom: 50,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: "stretch",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  btnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  loginTxt: {
    marginTop: 30,
    color: Colors.black,
    fontSize: 14,
    lineHeight: 24,
  },
  loginTxtSpan: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
