import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { UserType } from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";

type Props = {
  thisUser: UserType;
};

const ProfileScreen = ({ thisUser }: Props) => {
  const router = useRouter();
  const [jwtToken, setJwtToken] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [userData, setUserData] = React.useState<UserType | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const token = await AsyncStorage.getItem("access_token");
      const user = await AsyncStorage.getItem("userId");
      if (token && user) {
        setJwtToken(token);
        setUserId(user);
      }
    };
    loadAuthData();
  }, []);

  const fetchUserData = async () => {
    try {
      const apiUrl = `http://${Personal_IP.data}:3000/user/get-user/${userId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const user = response.data.data;

      setUserData(user);
    } catch (error: any) {
      console.error(
        "Error fetching user data:",
        error?.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (userId && jwtToken) {
      fetchUserData();
    }
  }, [userId, jwtToken]);

  const handleEditProfile = () => {
    console.log("ProfileScreen - userId:", userId);
    console.log("ProfileScreen - userData:", userData);

    router.push({
      pathname: "/EditProfile",
      params: {
        id: userId,
        firstName: userData?.firstName || "",
        middleName: userData?.middleName || "",
        lastName: userData?.lastName || "",
        phoneNumber: userData?.phoneNumber || "",
      },
    });
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear all stored authentication data
              await AsyncStorage.multiRemove(['access_token', 'userId']);

              // Reset local state
              setJwtToken(null);
              setUserId(null);
              setUserData(null);

              // Navigate to login screen (replace with your actual login route)
              router.replace('/login'); // or router.replace('/(auth)/login') depending on your routing structure

            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const headerHeight = useHeaderHeight();

  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <View style={{ alignItems: "center", marginTop: 24 }}>
          <Image
            style={styles.userImg}
            source={{
              uri: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg",
            }}
          />
          <Text style={styles.userName}>{userData?.firstName}</Text>
          <Text style={styles.userSubtitle}>{userData?.email}</Text>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(tabs)/orderhistory")}
          >
            <Ionicons name="person-outline" size={22} color={Colors.primary} />
            <Text style={styles.buttonText}>Your Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(tabs)/cart")}
          >
            <Ionicons name="cart-outline" size={22} color={Colors.primary} />
            <Text style={styles.buttonText}>Your Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
            <Ionicons name="pencil-outline" size={22} color={Colors.primary} />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#F9FAFB",
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.black,
    marginTop: 12,
  },
  userImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary, // tuỳ theo màu thương hiệu của bạn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  buttonWrapper: {
    marginTop: 32,
    gap: 14,
  },
  button: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.black,
  },
});
