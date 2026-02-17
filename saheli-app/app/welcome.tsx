import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  // Floating animation for blobs
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // Floating blob animation 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Floating blob animation 2 (delayed)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -15,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Content fade in + slide up
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1" style={{ backgroundColor: "#f8f6f6" }}>
      {/* Ambient Background Blobs */}
      <Animated.View
        style={{
          position: "absolute",
          top: -height * 0.1,
          left: -width * 0.1,
          width: width * 0.7,
          height: width * 0.7,
          borderRadius: width * 0.35,
          backgroundColor: "rgba(236, 19, 91, 0.10)",
          transform: [{ translateY: floatAnim1 }],
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          bottom: -height * 0.05,
          right: -width * 0.1,
          width: width * 0.8,
          height: width * 0.8,
          borderRadius: width * 0.4,
          backgroundColor: "rgba(236, 19, 91, 0.05)",
          transform: [{ translateY: floatAnim2 }],
        }}
      />
      <View
        style={{
          position: "absolute",
          top: height * 0.4,
          left: width * 0.2,
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: width * 0.2,
          backgroundColor: "rgba(129, 140, 248, 0.08)",
        }}
      />

      <SafeAreaView className="flex-1">
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 16,
            justifyContent: "space-between",
          }}
        >
          {/* Header / Logo Section */}
          <View style={{ alignItems: "center" }}>
            {/* Logo Icon */}
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: "rgba(236, 19, 91, 0.10)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(236, 19, 91, 0.20)",
              }}
            >
              <MaterialIcons name="favorite" size={32} color="#ec135b" />
            </View>

            {/* App Name */}
            <View style={{ alignItems: "center", marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "800",
                  color: "#1e293b",
                  letterSpacing: -0.5,
                }}
              >
                Naari<Text style={{ color: "#ec135b" }}>Setu</Text>
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ec135b",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginTop: 4,
                  opacity: 0.9,
                }}
              >
                Your Health Companion
              </Text>
            </View>
          </View>

          {/* Hero Illustration Area */}
          <View
            style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
          >
            <View
              style={{
                width: width * 0.75,
                height: width * 0.75,
                maxWidth: 320,
                maxHeight: 320,
                position: "relative",
              }}
            >
              {/* Decorative gradient circle behind */}
              <LinearGradient
                colors={["rgba(236,19,91,0.20)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: "absolute",
                  top: "5%",
                  left: "5%",
                  width: "90%",
                  height: "90%",
                  borderRadius: 999,
                }}
              />

              {/* Main Image Card */}
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "rgba(255,255,255,0.3)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.5)",
                  elevation: 8,
                  shadowColor: "rgba(236, 19, 91, 0.15)",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 1,
                  shadowRadius: 24,
                }}
              >
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcaCgsiPlTE5jfVtbkeGd-I9ph5W70uUhGRBsEY7k3Lw1_dQBK3hg3i0rmTsOYHKNCVCAyNyNRgvRRTeebI2V5_VXUZf3PDZaAY1d0thTPzximkqRyipJ3AqJ1E7X__PH78lHnO6ZcDQvBU-poZukqWK-5J9G5RdbIZD3TCQJ1x3uismWka5kglU7joFxG7RgzJ0qhPWJPd7T7KqDIle7yf5iXP7PkZcke186eF81WFvKnL3pFBBdEZcQbBsWm11__TRmn4dJF95w",
                  }}
                  style={{ width: "100%", height: "100%", opacity: 0.85 }}
                  resizeMode="cover"
                />

                {/* Overlay Gradient */}
                <LinearGradient
                  colors={["transparent", "rgba(236,19,91,0.15)"]}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "50%",
                  }}
                />

                {/* Floating Badge */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    right: 16,
                    backgroundColor: "rgba(255,255,255,0.92)",
                    borderRadius: 12,
                    padding: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.5)",
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(236, 19, 91, 0.10)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name="favorite" size={20} color="#ec135b" />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "500",
                        color: "#6b585d",
                      }}
                    >
                      Daily Wellness
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#1e293b",
                      }}
                    >
                      Cycle & Mood Tracking
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Description Text */}
            <Text
              style={{
                textAlign: "center",
                maxWidth: 280,
                marginTop: 28,
                fontSize: 15,
                lineHeight: 22,
                color: "#6b585d",
              }}
            >
              Empowering you with personalized insights and a caring AI
              assistant, available 24/7.
            </Text>
          </View>

          {/* Action Area */}
          <View style={{ gap: 16 }}>
            {/* Get Started Button */}
            <Pressable
              onPress={() => router.push("/signup")}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <LinearGradient
                colors={["#ec135b", "#ff4d8d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 999,
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  elevation: 6,
                  shadowColor: "rgba(236, 19, 91, 0.40)",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 12,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "700",
                    letterSpacing: 0.5,
                  }}
                >
                  Get Started
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </Pressable>

            {/* Login Link */}
            <View style={{ alignItems: "center" }}>
              <Pressable
                onPress={() => router.push("/login")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 14, color: "#6b585d" }}>
                  Already part of NaariSetu?{" "}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#ec135b",
                  }}
                >
                  Log In
                </Text>
                <MaterialIcons name="chevron-right" size={16} color="#ec135b" />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}