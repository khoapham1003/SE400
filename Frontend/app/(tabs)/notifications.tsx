import {
  FlatList,
  FlatListComponent,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";
import { CategoryType, NotificationType } from "@/types/type";
import { Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {};

const NotificationsScreen = (props: Props) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  useEffect(() => {
    getNotifications();
  });
  const headerHeight = useHeaderHeight();
  const userId = 1; //temp

  const getNotifications = async () => {
    const URL =
      "http://" + Personal_IP.data + ":3000/orders/order-history/" + { userId };
    const response = await axios.get(URL).catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: " + error.message
      );
      throw error;
    });
    setNotifications(response.data.data);
    console.log("notifications", response.data.data);
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <FlatList
          data={notifications}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View
              style={styles.notificationWrapper}
              entering={FadeInDown.delay(300 + index * 100).duration(500)}
            >
              <View style={styles.notificationIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="black"
                />
              </View>
              <View style={styles.notificationInfo}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationTimestamp}>
                    {item.timestamp}
                  </Text>
                </View>
                <Text style={styles.notificationMessage}>{item.message}</Text>
              </View>
            </Animated.View>
          )}
        ></FlatList>
      </View>
    </>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationWrapper: {
    flexDirection: "row",
    alignContent: "center",
    padding: 10,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.extraLightGray,
    borderRadius: 5,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignContent: "center",
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.black,
  },
  notificationTimestamp: {},
  notificationMessage: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 5,
    lineHeight: 20,
  },
});
