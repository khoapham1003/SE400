import { StyleSheet, TextInput, Text, View, Alert } from "react-native";
import React, { useState } from "react";
import { Link, Stack, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import InputField from "@/components/InputField";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import { Personal_IP } from "@/constants/ip";

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    const URL = "http://" + Personal_IP.data + ":3000/auth/register";

    const requestBody = {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password,
      confirmPassword,
    };

    try {
      const response = await axios.post(URL, requestBody);
      Alert.alert("Thành công", "Đăng ký thành công!");
      router.push("/signin"); // hoặc router.replace nếu không muốn quay lại màn đăng ký
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Đăng ký thất bại";
      Alert.alert("Lỗi", errorMessage);
      console.error("Đăng ký lỗi:", errorMessage);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Sign Up" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Tạo Tài Khoản</Text>

        <InputField
          placeholder="Họ"
          value={lastName}
          onChangeText={setLastName}
        />
        <InputField
          placeholder="Tên lót"
          value={middleName}
          onChangeText={setMiddleName}
        />
        <InputField
          placeholder="Tên"
          value={firstName}
          onChangeText={setFirstName}
        />
        <InputField
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputField
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <InputField
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
          <Text style={styles.btnTxt}>Đăng ký</Text>
        </TouchableOpacity>

        <Text style={styles.loginTxt}>
          Bạn đã có tài khoản?{" "}
          <Link href={"/signin"} asChild>
            <TouchableOpacity>
              <Text style={styles.loginTxtSpan}>Đăng nhập</Text>
            </TouchableOpacity>
          </Link>
        </Text>
      </View>
    </>
  );
};

export default SignUpScreen;

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
    marginBottom: 30,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: "stretch",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 20,
  },
  btnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  loginTxt: {
    marginTop: 20,
    color: Colors.black,
    fontSize: 14,
    lineHeight: 24,
  },
  loginTxtSpan: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
