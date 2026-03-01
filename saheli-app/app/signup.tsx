import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignup } from "@/hooks/useSignup";
import Colors from "@/constants/Colors";

export default function SignupScreen() {
  const { form, ui, handleSignup } = useSignup();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="items-center mt-8 mb-8">
            <View className="w-16 h-16 bg-pink-50 rounded-2xl items-center justify-center mb-4 -rotate-3">
              <MaterialIcons
                name="person-add"
                size={32}
                color={Colors.light.tint}
              />
            </View>
            <Text className="text-3xl font-bold text-slate-900 mb-2">
              Create Account
            </Text>
            <Text className="text-slate-500 text-base text-center px-10">
              Join NaariSetu for a personalized health journey
            </Text>
          </View>

          {/* Form Section */}
          <View className="px-8 space-y-5">
            {/* Name Input */}
            <View>
              <Text className="text-slate-700 font-semibold mb-2 ml-1">
                Full Name
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 focus:border-pink-500 focus:bg-pink-50/10">
                <MaterialIcons name="person" size={20} color="#94a3b8" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 text-base"
                  placeholder="Jane Doe"
                  placeholderTextColor="#cbd5e1"
                  autoCapitalize="words"
                  value={form.name}
                  onChangeText={form.setName}
                />
              </View>
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-slate-700 font-semibold mb-2 ml-1">
                Email Address
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 focus:border-pink-500 focus:bg-pink-50/10">
                <MaterialIcons name="email" size={20} color="#94a3b8" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 text-base"
                  placeholder="hello@example.com"
                  placeholderTextColor="#cbd5e1"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={form.setEmail}
                />
              </View>
            </View>

            {/* Phone Number Input */}
            <View>
              <Text className="text-slate-700 font-semibold mb-2 ml-1">
                Phone Number
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 focus:border-pink-500 focus:bg-pink-50/10">
                <MaterialIcons name="phone" size={20} color="#94a3b8" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 text-base"
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#cbd5e1"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={form.setPhone}
                />
              </View>
            </View>

            {/* Age and Country Row */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-slate-700 font-semibold mb-2 ml-1">
                  Age
                </Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 focus:border-pink-500 focus:bg-pink-50/10">
                  <MaterialIcons name="cake" size={20} color="#94a3b8" />
                  <TextInput
                    className="flex-1 ml-3 text-slate-900 text-base"
                    placeholder="25"
                    placeholderTextColor="#cbd5e1"
                    keyboardType="number-pad"
                    maxLength={3}
                    value={form.age}
                    onChangeText={form.setAge}
                  />
                </View>
              </View>

              <View className="flex-[1.5]">
                <Text className="text-slate-700 font-semibold mb-2 ml-1">
                  Country
                </Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 focus:border-pink-500 focus:bg-pink-50/10">
                  <MaterialIcons name="public" size={20} color="#94a3b8" />
                  <TextInput
                    className="flex-1 ml-3 text-slate-900 text-base"
                    placeholder="India"
                    placeholderTextColor="#cbd5e1"
                    autoCapitalize="words"
                    value={form.country}
                    onChangeText={form.setCountry}
                  />
                </View>
              </View>
            </View>

            {/* State and City Row */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-slate-700 font-semibold mb-2 ml-1">
                  State
                </Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 focus:border-pink-500 focus:bg-pink-50/10">
                  <MaterialIcons name="map" size={20} color="#94a3b8" />
                  <TextInput
                    className="flex-1 ml-3 text-slate-900 text-base"
                    placeholder="State"
                    placeholderTextColor="#cbd5e1"
                    autoCapitalize="words"
                    value={form.state}
                    onChangeText={form.setState}
                  />
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-slate-700 font-semibold mb-2 ml-1">
                  City
                </Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 focus:border-pink-500 focus:bg-pink-50/10">
                  <MaterialIcons
                    name="location-city"
                    size={20}
                    color="#94a3b8"
                  />
                  <TextInput
                    className="flex-1 ml-3 text-slate-900 text-base"
                    placeholder="City"
                    placeholderTextColor="#cbd5e1"
                    autoCapitalize="words"
                    value={form.city}
                    onChangeText={form.setCity}
                  />
                </View>
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-2">
              <Text className="text-slate-700 font-semibold mb-2 ml-1">
                New Password
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 focus:border-pink-500 focus:bg-pink-50/10">
                <MaterialIcons name="lock" size={20} color="#94a3b8" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 text-base"
                  placeholder="Create a password"
                  placeholderTextColor="#cbd5e1"
                  secureTextEntry={!ui.showPassword}
                  value={form.password}
                  onChangeText={form.setPassword}
                />
                <Pressable onPress={() => ui.setShowPassword(!ui.showPassword)}>
                  <MaterialIcons
                    name={ui.showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#94a3b8"
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-2">
              <Text className="text-slate-700 font-semibold mb-2 ml-1">
                Confirm Password
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 focus:border-pink-500 focus:bg-pink-50/10">
                <MaterialIcons name="lock-outline" size={20} color="#94a3b8" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 text-base"
                  placeholder="Confirm password"
                  placeholderTextColor="#cbd5e1"
                  secureTextEntry={!ui.showConfirmPassword}
                  value={form.confirmPassword}
                  onChangeText={form.setConfirmPassword}
                />
                <Pressable
                  onPress={() =>
                    ui.setShowConfirmPassword(!ui.showConfirmPassword)
                  }
                >
                  <MaterialIcons
                    name={
                      ui.showConfirmPassword ? "visibility" : "visibility-off"
                    }
                    size={20}
                    color="#94a3b8"
                  />
                </Pressable>
              </View>
            </View>

            {/* Signup Button */}
            <Pressable
              onPress={handleSignup}
              disabled={ui.isLoading}
              className="mt-4"
              style={({ pressed }) => ({
                opacity: pressed || ui.isLoading ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <LinearGradient
                colors={[Colors.light.secondary, Colors.light.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-14 rounded-xl items-center justify-center flex-row space-x-2"
              >
                {ui.isLoading ? (
                  <Text className="text-white font-bold text-lg">
                    Creating Account...
                  </Text>
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">
                      Sign Up
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={20}
                      color="white"
                    />
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Terms */}
            <Text className="text-center text-xs text-slate-400 px-4 leading-5">
              By signing up, you agree to our Terms of Service and Privacy
              Policy.
            </Text>

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-slate-200" />
              <Text className="mx-4 text-slate-400 text-sm">Or</Text>
              <View className="flex-1 h-px bg-slate-200" />
            </View>

            {/* Log In Link */}
            <View className="flex-row justify-center items-center mb-8">
              <Text className="text-slate-500 text-base">
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/login")}>
                <Text className="text-pink-600 font-bold text-base">
                  Log In
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <Pressable
          onPress={() => router.back()}
          className="absolute top-12 left-6 p-2 rounded-full bg-slate-50"
        >
          <MaterialIcons name="arrow-back" size={24} color="#64748b" />
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
