import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Personal_IP } from '@/constants/ip';

const EditProfile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse userData from params
  let initialUserData = {
    id: null, // Add user ID for API calls
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
  };

  // Handle both JSON string and individual params
  if (params.userData) {
    try {
      initialUserData = JSON.parse(params.userData as string);
    } catch (error) {
      console.log('Error parsing userData:', error);
    }
  } else {
    // Handle individual params
    initialUserData = {
      id: params.id || null,
      firstName: (params.firstName as string) || '',
      middleName: (params.middleName as string) || '',
      lastName: (params.lastName as string) || '',
      phoneNumber: (params.phoneNumber as string) || '',
    };
  }

  const [formData, setFormData] = useState({
    firstName: initialUserData.firstName,
    middleName: initialUserData.middleName,
    lastName: initialUserData.lastName,
    phoneNumber: initialUserData.phoneNumber,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userId] = useState(initialUserData.id);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  // Debug: Log the userId to see what we're getting
  useEffect(() => {
    console.log('EditProfile - Parsed userData:', initialUserData);
    console.log('EditProfile - userId:', userId);
    console.log('EditProfile - userId type:', typeof userId);
  }, []);

  // Load JWT token from AsyncStorage
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        setJwtToken(token);
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    };
    loadAuthData();
  }, []);

  // Validation functions
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'firstName':
      case 'middleName':
      case 'lastName':
        if (value && (value.length < 1 || value.length > 50)) {
          newErrors[field] = 'Must be between 1 and 50 characters';
        } else {
          delete newErrors[field];
        }
        break;
      case 'phoneNumber':
        if (value && (value.length < 1 || value.length > 20)) {
          newErrors[field] = 'Must be between 1 and 20 characters';
        } else {
          delete newErrors[field];
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate profile fields
    Object.keys(formData).forEach(field => {
      const value = formData[field];
      if (value) {
        if ((field === 'firstName' || field === 'middleName' || field === 'lastName') &&
            (value.length < 1 || value.length > 50)) {
          newErrors[field] = 'Must be between 1 and 50 characters';
        }
        if (field === 'phoneNumber' && (value.length < 1 || value.length > 20)) {
          newErrors[field] = 'Must be between 1 and 20 characters';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateUserProfile = async (userId, updatePayload) => {
    try {
      const response = await fetch(`http://${Personal_IP.data}:3000/user/updater-user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleSaveProfile = async () => {
    // Debug logging
    console.log('Save Profile - userId:', userId);
    console.log('Save Profile - userId type:', typeof userId);
    console.log('Save Profile - jwtToken exists:', !!jwtToken);

    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the form errors before saving.');
      return;
    }

    if (!userId || userId === 'null' || userId === null) {
      console.log('UserId validation failed:', { userId, type: typeof userId });
      Alert.alert('Error', 'User ID is required to update profile.');
      return;
    }

    if (!jwtToken) {
      Alert.alert('Error', 'Authentication token not found. Please login again.');
      return;
    }

    setLoading(true);
    try {
      // Create update payload with only non-empty fields
      const updatePayload = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] && formData[key].trim()) {
          updatePayload[key] = formData[key].trim();
        }
      });

      // Check if there's anything to update
      if (Object.keys(updatePayload).length === 0) {
        Alert.alert('No Changes', 'No changes detected to save.');
        setLoading(false);
        return;
      }

      console.log('Updating profile:', updatePayload);
      const response = await updateUserProfile(userId, updatePayload);

      console.log('API Response:', response);

      Alert.alert(
        'Success',
        response.message || 'Profile updated successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back and potentially refresh the previous screen
              router.replace(`/profile?refresh=${Date.now()}`);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Update Error:', error);

      let errorMessage = 'Failed to update profile. Please try again.';

      // Handle specific error cases
      if (error.message.includes('User not found')) {
        errorMessage = 'User not found. Please check your account.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    router.push('/ChangePassword');
  };

  const renderInput = (field, placeholder, value, secureTextEntry = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{placeholder}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => handleInputChange(field, text)}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#999"
        editable={!loading}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  // Show warning if no user ID or token
  useEffect(() => {
    if (!userId) {
      Alert.alert(
        'Warning',
        'User ID not found. You may not be able to save changes.',
        [{ text: 'OK' }]
      );
    }
  }, [userId]);
    useEffect(() => {
      console.log('FormData changed:', formData);
    }, [formData]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
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
            {/* Profile Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile Information</Text>

              {renderInput('firstName', 'First Name', formData.firstName)}
              {renderInput('middleName', 'Middle Name (Optional)', formData.middleName)}
              {renderInput('lastName', 'Last Name', formData.lastName)}
              {renderInput('phoneNumber', 'Phone Number', formData.phoneNumber)}

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  loading && styles.primaryButtonDisabled
                ]}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Save Profile</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Change Password Button */}
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={handleChangePassword}
              disabled={loading}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#007AFF" />
              <Text style={styles.changePasswordText}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#007AFF" />
            </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonDisabled: {
    backgroundColor: '#ccc',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  changePasswordButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  changePasswordText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
});

export default EditProfile;