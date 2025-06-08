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
      Alert.alert("Error", "Confirmation password does not match");
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
      Alert.alert("Success", "Registration successful!");
      router.push("/signin"); // hoặc router.replace nếu không muốn quay lại màn đăng ký
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Registration failed";
      Alert.alert("Error", errorMessage);
      console.error("Registration error:", errorMessage);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Sign Up" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <InputField
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <InputField
          placeholder="Middle Name"
          value={middleName}
          onChangeText={setMiddleName}
        />
        <InputField
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <InputField
          placeholder="Phone Number"
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
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <InputField
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
          <Text style={styles.btnTxt}>Register</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.loginTxt}>You already have an account? </Text>
          <Link href={"/signin"} asChild>
            <TouchableOpacity>
              <Text style={styles.loginTxtSpan}>Log in</Text>
            </TouchableOpacity>
          </Link>
        </View>
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
    marginTop: 15,
    color: Colors.black,
    fontSize: 14,
  },
  loginTxtSpan: {
    marginTop: 15,
    color: Colors.primary,
    fontWeight: "600",
  },
});
