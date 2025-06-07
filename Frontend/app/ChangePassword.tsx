import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Personal_IP } from "@/constants/ip";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChangePassword = () => {
  const router = useRouter();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation functions
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'currentPassword':
        if (!value) {
          newErrors[field] = 'Current password is required';
        } else {
          delete newErrors[field];
        }
        break;
      case 'newPassword':
        if (!value) {
          newErrors[field] = 'New password is required';
        } else if (value.length < 6) {
          newErrors[field] = 'Password must be at least 8 characters';
        } else {
          delete newErrors[field];
        }
        break;
      case 'confirmPassword':
        if (!value) {
          newErrors[field] = 'Please confirm your new password';
        } else if (value !== passwordData.newPassword) {
          newErrors[field] = 'Passwords do not match';
        } else {
          delete newErrors[field];
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Error", "Authentication failed. Please log in again.");
        setLoading(false);
        return;
      }

      const Url = `http://${Personal_IP.data}:3000/user/change-password/${userId}`;

      // Fix 1: Use axios.patch instead of axios.put
      // Fix 2: Match the DTO field names
      const response = await axios.patch(
        Url,
        {
          oldPassword: passwordData.currentPassword,     // Changed from currentPassword
          password: passwordData.newPassword,           // Changed from newPassword
          confirmPassword: passwordData.confirmPassword // Added confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert(
        "Success",
        response?.data?.message || "Password changed successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Change password error:", error?.response?.data || error.message);
      Alert.alert("Error", error?.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (field, placeholder, value, showPassword, setShowPassword) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{placeholder}</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput, errors[field] && styles.inputError]}
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => handleInputChange(field, text)}
          secureTextEntry={!showPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Change Password',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Security Info */}
            <View style={styles.infoContainer}>
              <Ionicons name="shield-checkmark" size={24} color="#007AFF" />
              <Text style={styles.infoText}>
                Choose a strong password with at least 8 characters to keep your account secure.
              </Text>
            </View>

            {/* Password Form */}
            <View style={styles.section}>
              {renderPasswordInput(
                'currentPassword',
                'Current Password',
                passwordData.currentPassword,
                showCurrentPassword,
                setShowCurrentPassword
              )}

              {renderPasswordInput(
                'newPassword',
                'New Password',
                passwordData.newPassword,
                showNewPassword,
                setShowNewPassword
              )}

              {renderPasswordInput(
                'confirmPassword',
                'Confirm New Password',
                passwordData.confirmPassword,
                showConfirmPassword,
                setShowConfirmPassword
              )}

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => router.back()}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.changeButton, loading && styles.disabledButton]}
                  onPress={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.changeButtonText}>Change Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={passwordData.newPassword.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
                  size={16}
                  color={passwordData.newPassword.length >= 8 ? "#22c55e" : "#666"}
                />
                <Text style={[
                  styles.requirementText,
                  passwordData.newPassword.length >= 8 && styles.requirementMet
                ]}>
                  At least 8 characters
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword ? "checkmark-circle" : "ellipse-outline"}
                  size={16}
                  color={passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword ? "#22c55e" : "#666"}
                />
                <Text style={[
                  styles.requirementText,
                  passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword && styles.requirementMet
                ]}>
                  Passwords match
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  passwordInput: {
    paddingRight: 45,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  changeButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  requirementsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  requirementMet: {
    color: '#22c55e',
  },
});

export default ChangePassword;