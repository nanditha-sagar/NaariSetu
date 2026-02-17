import React, { useState } from "react";
import { View, Text, Switch, Pressable, ScrollView, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    // Navigate directly to welcome to ensure it works
    router.replace("/welcome");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-slate-900">Profile</Text>
          {/* Optional: Add an Edit button or similar here if needed in future */}
        </View>

        {/* User Info Card */}
        <View className="mx-6 mt-2 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-row items-center">
          <View className="relative">
            <View className="w-16 h-16 bg-pink-50 rounded-full items-center justify-center border-2 border-white shadow-sm">
              <MaterialIcons name="person" size={40} color="#ec135b" />
            </View>
            <View className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-slate-900">Sarah Johnson</Text>
            <Text className="text-slate-500 text-sm">sarah.j@example.com</Text>
            <Pressable className="mt-2 bg-pink-50 self-start px-3 py-1 rounded-full">
              <Text className="text-pink-600 text-xs font-semibold">Edit Profile</Text>
            </Pressable>
          </View>
        </View>

        {/* Settings Groups */}
        <View className="mx-6 mb-8">
          <Text className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4 px-2">Preferences</Text>

          <View className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <View className="flex-row items-center justify-between p-4 border-b border-slate-50">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                  <MaterialIcons name="notifications" size={18} color="#3b82f6" />
                </View>
                <Text className="text-slate-700 font-medium">Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#e2e8f0", true: "#ec135b" }}
              />
            </View>

            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
                  <MaterialIcons name="dark-mode" size={18} color="#64748b" />
                </View>
                <Text className="text-slate-700 font-medium">Dark Mode</Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: "#e2e8f0", true: "#ec135b" }}
              />
            </View>
          </View>
        </View>

        <View className="mx-6 mb-8">
          <Text className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4 px-2">Support</Text>

          <View className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <Pressable className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-purple-50 items-center justify-center">
                  <MaterialIcons name="help" size={18} color="#a855f7" />
                </View>
                <Text className="text-slate-700 font-medium">Help Center</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
            </Pressable>

            <Pressable className="flex-row items-center justify-between p-4 active:bg-slate-50">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center">
                  <MaterialIcons name="privacy-tip" size={18} color="#f97316" />
                </View>
                <Text className="text-slate-700 font-medium">Privacy Policy</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          onPress={handleLogout}
          className="mx-6 mb-12 bg-red-50 p-4 rounded-xl flex-row items-center justify-center gap-2 border border-red-100 active:bg-red-100"
        >
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text className="text-red-500 font-semibold">Log Out</Text>
        </Pressable>

        <View className="items-center mb-8">
          <Text className="text-slate-400 text-xs">NaariSetu v1.0.0</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
