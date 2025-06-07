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

  const headerHeight = useHeaderHeight();

  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <View style={{ alignItems: "center" }}>
          {/* <Image
            style={styles.userImg}
            source={{
              // uri: thisUser?.picture,
              uri: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1",
            }}
          /> */}
          <Text style={styles.userName}>{userData?.firstName}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="person-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonText}>Your Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="card-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonText}>Payment History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
            <Ionicons name="pencil-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button}>
            <Ionicons name="heart-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonText}>Your Wishlist</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.button}>
            <Ionicons name="gift-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonText}>Reward Point</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.button}>
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={Colors.black}
            />
            <Text style={styles.buttonText}>Customer Support</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.button}>
            <Ionicons name="settings-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await AsyncStorage.removeItem("email");
              await AsyncStorage.removeItem("cartId");
              await AsyncStorage.removeItem("userId");
              await AsyncStorage.removeItem("role");
              router.push("/signin");
            }}
          >
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
    padding: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.black,
    marginTop: 10,
  },
  buttonWrapper: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    padding: 10,
    borderTopColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.black,
  },
  userImg: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
});
