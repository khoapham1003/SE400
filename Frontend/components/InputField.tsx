import React from "react";
import {
  StyleSheet,
  TextInput,
  Platform,
  TextInputProps,
} from "react-native";
import { Colors } from "@/constants/Colors";

/**
 * A cross-platform text input that masks characters when
 * `secureTextEntry` is supplied (Android, iOS, **and** Web).
 */
const InputField = (props: TextInputProps) => {
  // For web we need to force <input type="password">
  const extraWebProps =
    Platform.OS === "web" && props.secureTextEntry
      ? { type: "password" as const }
      : {};

  return (
    <TextInput
      {...props}
      {...extraWebProps}   /* only affects the web build */
      style={[styles.inputField, props.style]}
    />
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputField: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: "stretch",
    borderRadius: 5,
    fontSize: 16,
    color: Colors.black,
    marginBottom: 20,
  },
});
