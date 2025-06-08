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

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone number validation function
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Password strength validation
  const isStrongPassword = (password) => {
    return password.length >= 8;
  };

  const handleSignUp = async () => {
    // Check for empty required fields
    if (!firstName.trim()) {
      Alert.alert("Validation Error", "First name is required");
      return;
    }
    if (middleName && (middleName.trim().length < 1 || middleName.trim().length > 50)) {
          Alert.alert("Error", "middleName must be longer than or equal to 1 and shorter than or equal to 50 characters");
          return;
        }

    if (!lastName.trim()) {
      Alert.alert("Validation Error", "Last name is required");
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("Validation Error", "Phone number is required");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Validation Error", "Email is required");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Validation Error", "Password is required");
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert("Validation Error", "Please confirm your password");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    // Validate phone number format
    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert("Validation Error", "Please enter a valid phone number");
      return;
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long."
      );
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      Alert.alert("Error", "Confirmation password does not match");
      return;
    }

    // Show loading alert (optional) - Remove this line if you don't want any loading message
    Alert.alert("Please Wait", "Creating your account...");

    const URL = "http://" + Personal_IP.data + ":3000/auth/register";

    const requestBody = {
      firstName: firstName.trim(),
      middleName: middleName?.trim() || undefined,
      lastName: lastName.trim(),
      phoneNumber: phoneNumber?.trim() || undefined,
      email: email.trim().toLowerCase(),
      password,
      confirmPassword,
    };

    try {
      const response = await axios.post(URL, requestBody);
      Alert.alert(
        "Success",
        "Registration successful! Please check your email for verification.",
        [
          {
            text: "OK",
            onPress: () => router.push("/signin")
          }
        ]
      );
    } catch (error) {
      // Handle different types of errors
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        Alert.alert(
          "Connection Error",
          "Unable to connect to server. Please check your internet connection and try again."
        );
        return;
      }

      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message;

      switch (statusCode) {
        case 400:
          // Check if the error is specifically about email already existing
          if (errorMessage && errorMessage.toLowerCase().includes('email already exists')) {
            // Show custom alert for email exists error
            Alert.alert(
              "Email Already Registered",
              "This email is already registered. Please use a different email or sign in with your existing account.",
              [
                {
                  text: "Try Again",
                  style: "cancel"
                },
                {
                  text: "Sign In",
                  onPress: () => router.push("/signin")
                }
              ]
            );
            return;
          } else {
            // Show alert for other 400 errors
            Alert.alert("Invalid Data", errorMessage || "Please check your input and try again");
          }
          break;
        case 409:
          Alert.alert("Conflict Error", errorMessage || "There was a conflict with your request");
          break;
        case 422:
          Alert.alert("Validation Error", errorMessage || "Please check all fields and try again");
          break;
        case 500:
          Alert.alert("Server Error", "Something went wrong on our end. Please try again later.");
          break;
        default:
          Alert.alert("Registration Failed", errorMessage || "An unexpected error occurred. Please try again.");
      }

      console.error("Registration error:", {
        status: statusCode,
        message: errorMessage,
        fullError: error
      });
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