"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var expo_router_1 = require("expo-router");
var TabBar_1 = require("../../components/TabBar");
function TabLayout() {
    return (<expo_router_1.Tabs tabBar={function (props) { return <TabBar_1.TabBar {...props}/>; }} screenOptions={{ headerShown: false }}>
      <expo_router_1.Tabs.Screen name="index" options={{
            title: "Home",
            // tabBarIcon: ({ color }) => (
            //   <Ionicons name="home-outline" size={22} color={color} />
            // ),
        }}/>
      <expo_router_1.Tabs.Screen name="explore" options={{
            title: "Explore",
            // tabBarIcon: ({ color }) => (
            //   <Ionicons name="search-outline" size={22} color={color} />
            // ),
        }}/>
      <expo_router_1.Tabs.Screen name="notifications" options={{
            title: "Notification",
            // tabBarIcon: ({ color }) => (
            //   <Ionicons name="notifications-outline" size={22} color={color} />
            // ),
        }}/>
      <expo_router_1.Tabs.Screen name="cart" options={{
            title: "Cart",
            tabBarBadge: 3,
            // tabBarIcon: ({ color }) => (
            //   <Ionicons name="cart-outline" size={22} color={color} />
            // ),
        }}/>
      <expo_router_1.Tabs.Screen name="profile" options={{
            title: "Profile",
            // tabBarIcon: ({ color }) => (
            //   <Ionicons name="person-outline" size={22} color={color} />
            // ),
        }}/>
    </expo_router_1.Tabs>);
}
exports.default = TabLayout;
