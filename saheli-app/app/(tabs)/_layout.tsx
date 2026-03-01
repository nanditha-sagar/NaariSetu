import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f471b5",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "rgba(255,255,255,0.95)",
          borderTopColor: "#f1f5f9",
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 28,
          height: 85,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan-action"
        options={{
          title: "",
          tabBarIcon: () => (
            <View
              style={{
                backgroundColor: "#f471b5",
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -24,
                borderWidth: 4,
                borderColor: "white",
                elevation: 6,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              }}
            >
              <MaterialIcons name="add" size={30} color="white" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/screening" as any);
          },
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="insights" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
