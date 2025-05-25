import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Link, Stack, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import InputField from "@/components/InputField";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};

const SignInScreen = (props: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    setIsLoading(true);
    const URL = `http://${Personal_IP.data}:3000/auth/login`;

    const requestBody = {
      Email: username,
      Password: password,
    };

    try {
      console.log("Gửi đến:", URL);
      const response = await axios.post(URL, requestBody);
      console.log("Phần hề: ", response.data);
      const token = response.data.access_token;
      if (token) {
        await AsyncStorage.setItem("access_token", token);
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(
          Buffer.from(payloadBase64, "base64").toString("utf-8")
        );

        const email = decodedPayload.email;
        const CartId = String(decodedPayload.CartId);
        const UserId = String(decodedPayload.UserId);
        const role = decodedPayload.role;

        // Lưu vào AsyncStorage
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("CartId", CartId);
        await AsyncStorage.setItem("userId", UserId);
        await AsyncStorage.setItem("role", role);

        Alert.alert("Đăng nhập thành công!");
        router.dismissAll();
        router.push("/(tabs)");
      } else {
        Alert.alert("Lỗi", "Không nhận được token từ máy chủ.");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      const message =
        error.response?.data?.message || "Sai tài khoản hoặc mật khẩu";
      Alert.alert("Đăng nhập thất bại", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Sign In" }} />
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
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.btnTxt}>
            {isLoading ? "Đang đăng nhập..." : "Login"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.loginTxt}>
          You don't have an account?{" "}
          <Link href="/signup" asChild>
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
