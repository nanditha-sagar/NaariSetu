import React, { useState } from "react";
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

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            router.replace("/(tabs)/home");
        }, 1500);
    };

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
                    <View className="items-center mt-12 mb-10">
                        <View className="w-20 h-20 bg-pink-50 rounded-2xl items-center justify-center mb-6 rotate-3">
                            <MaterialIcons name="favorite" size={40} color="#ec135b" />
                        </View>
                        <Text className="text-3xl font-bold text-slate-900 mb-2">
                            Welcome Back
                        </Text>
                        <Text className="text-slate-500 text-base text-center px-10">
                            Sign in to continue your wellness journey with NaariSetu
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View className="px-8 space-y-6">
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
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View className="mb-2">
                            <Text className="text-slate-700 font-semibold mb-2 ml-1">
                                Password
                            </Text>
                            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 focus:border-pink-500 focus:bg-pink-50/10">
                                <MaterialIcons name="lock" size={20} color="#94a3b8" />
                                <TextInput
                                    className="flex-1 ml-3 text-slate-900 text-base"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#cbd5e1"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    <MaterialIcons
                                        name={showPassword ? "visibility" : "visibility-off"}
                                        size={20}
                                        color="#94a3b8"
                                    />
                                </Pressable>
                            </View>
                            <Pressable className="self-end mt-2">
                                <Text className="text-pink-500 font-medium text-sm">
                                    Forgot Password?
                                </Text>
                            </Pressable>
                        </View>

                        {/* Login Button */}
                        <Pressable
                            onPress={handleLogin}
                            disabled={isLoading}
                            className="mt-4"
                            style={({ pressed }) => ({
                                opacity: pressed || isLoading ? 0.8 : 1,
                                transform: [{ scale: pressed ? 0.98 : 1 }],
                            })}
                        >
                            <LinearGradient
                                colors={["#ec135b", "#ff4d8d"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-14 rounded-xl items-center justify-center flex-row space-x-2"
                            >
                                {isLoading ? (
                                    <Text className="text-white font-bold text-lg">
                                        Signing in...
                                    </Text>
                                ) : (
                                    <>
                                        <Text className="text-white font-bold text-lg mr-2">
                                            Log In
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

                        {/* Social Login Divider (Optional placeholder) */}
                        <View className="flex-row items-center my-6">
                            <View className="flex-1 h-px bg-slate-200" />
                            <Text className="mx-4 text-slate-400 text-sm">Or</Text>
                            <View className="flex-1 h-px bg-slate-200" />
                        </View>

                        {/* Sign Up Link */}
                        <View className="flex-row justify-center items-center">
                            <Text className="text-slate-500 text-base">
                                Don't have an account?{" "}
                            </Text>
                            <Pressable
                                onPress={() => router.push("/signup")}
                            >
                                <Text className="text-pink-600 font-bold text-base">
                                    Sign Up
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
