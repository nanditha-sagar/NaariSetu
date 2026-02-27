import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Image, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import RiskBadge from "@/components/RiskBadge";
import HealthTipCard from "@/components/HealthTipCard";
import {
  getLatestScreening,
  getRandomTip,
  getTimeAgo,
  ScreeningEntry,
} from "@/utils/data";

const TRACKERS = [
  {
    id: "period",
    label: "Period",
    emoji: "🩸",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    route: "/tracker/period",
    active: true,
  },
  {
    id: "mood",
    label: "Mood",
    emoji: "😊",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    route: "/tracker/mood",
    active: true,
  },
  {
    id: "skin",
    label: "Skin",
    emoji: "✨",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    route: "/tracker/skin",
    active: true,
  },
  {
    id: "cravings",
    label: "Cravings",
    emoji: "🍫",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    route: "/tracker/cravings",
    active: true,
  },
  {
    id: "anemia",
    label: "Anemia",
    emoji: "🩸",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    route: "/tracker/anemia",
    active: true,
  },
  {
    id: "pcos",
    label: "PCOS",
    emoji: "🔬",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.1)",
    route: "/tracker/pcos",
    active: true,
  },
];

const EDUCATIONAL_RESOURCES = [
  {
    id: "1",
    title: "Understanding PCOS Symptoms",
    type: "Video",
    duration: "5 min",
    thumbnail: "https://img.youtube.com/vi/3w3s3q3q3q3/0.jpg", // Placeholder
    color: "#a855f7",
  },
  {
    id: "2",
    title: "Yoga for Menstrual Cramps",
    type: "Video",
    duration: "10 min",
    thumbnail: "https://img.youtube.com/vi/4w4s4q4q4q4/0.jpg", // Placeholder
    color: "#ec135b",
  },
  {
    id: "3",
    title: "Iron-Rich Diet for Anemia",
    type: "Article",
    readTime: "3 min read",
    color: "#ef4444",
  },
  {
    id: "4",
    title: "Mental Health & Hormones",
    type: "Article",
    readTime: "4 min read",
    color: "#7ed3d4",
  },
];

export default function HomeScreen() {
  const [latestScreening, setLatestScreening] = useState<ScreeningEntry | null>(
    null,
  );
  const [healthTip, setHealthTip] = useState(getRandomTip());

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    const latest = await getLatestScreening();
    setLatestScreening(latest);
  };

  const handleTrackerPress = (tracker: (typeof TRACKERS)[0]) => {
    if (tracker.active && tracker.route) {
      router.push(tracker.route as any);
    } else {
      Alert.alert(
        `${tracker.emoji} ${tracker.label} Tracker`,
        "Coming soon! This tracker is under development.",
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        {/* Right Icons */}
        <View className="flex-row items-center gap-3">

          {/* Notifications Button */}
          <Pressable
            onPress={() => router.push("/notifications")}
            className="relative"
          >
            <View className="w-12 h-12 rounded-full bg-white items-center justify-center border border-slate-200">
              <MaterialIcons name="notifications-none" size={22} color="#ec4899" />
            </View>

            {/* Notification Dot */}
            <View className="absolute top-1 right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-white" />
          </Pressable>

          {/* Profile Button */}
          <Pressable onPress={() => router.push("/(tabs)/profile")}>
            <View className="w-12 h-12 rounded-full bg-primary-20 items-center justify-center border-2 border-white">
              <MaterialIcons name="person" size={24} color="#f471b5" />
            </View>

            {/* Online Dot */}
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-bg-light" />
          </Pressable>

        </View>

        {/* Start Screening CTA */}
        <Pressable
          onPress={() => router.push("/screening/symptoms")}
          className="w-full bg-primary p-6 rounded-xl mb-8 items-center relative overflow-hidden active:opacity-90"
        >
          <View className="absolute top-0 right-0 w-32 h-32 bg-white-10 rounded-full -mr-10 -mt-10" />
          <View className="bg-white-20 p-4 rounded-full mb-4">
            <MaterialIcons name="fingerprint" size={40} color="white" />
          </View>
          <Text className="text-xl font-semibold text-white mb-1">
            Start New Screening
          </Text>
          <Text className="text-white-80 text-sm">
            Scan your nails for an AI health check
          </Text>
          <View className="mt-6 flex-row items-center gap-2 bg-white-10 px-4 py-2 rounded-full">
            <MaterialIcons name="auto-awesome" size={14} color="white" />
            <Text className="text-white text-xs font-medium">
              AI-Powered Analysis
            </Text>
          </View>
        </Pressable>

        {/* Health Snapshot */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-lg font-semibold text-slate-900">
              Health Snapshot
            </Text>
            <Pressable onPress={() => router.push("/history" as any)}>
              <Text className="text-primary text-sm font-medium">
                View History
              </Text>
            </Pressable>
          </View>

          {latestScreening ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/screening/results",
                  params: { id: latestScreening.id, fromHistory: "true" },
                })
              }
              className="bg-[#fde8ef] rounded-2xl p-5"
            >
              {/* Top Row */}
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-xs uppercase tracking-wider text-pink-500 font-bold mb-1">
                    hematology
                  </Text>
                  <Text className="text-base font-semibold text-slate-900">
                    {latestScreening.condition}
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    Last checked: {getTimeAgo(latestScreening.timestamp)}
                  </Text>
                </View>

                {/* Risk Badge */}
                <View className="bg-yellow-100 px-3 py-1 rounded-full">
                  <Text className="text-yellow-700 text-xs font-semibold">
                    {latestScreening.risk} Risk
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="mb-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-[10px] text-slate-400">Low</Text>
                  <Text className="text-[10px] text-slate-400">Medium</Text>
                  <Text className="text-[10px] text-slate-400">High</Text>
                </View>

                <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-yellow-400"
                    style={{
                      width:
                        latestScreening.risk === "Low"
                          ? "30%"
                          : latestScreening.risk === "Medium"
                            ? "60%"
                            : "90%",
                    }}
                  />
                </View>
              </View>

              {/* Info Tip */}
              <View className="flex-row items-start gap-2">
                <MaterialIcons
                  name="info-outline"
                  size={16}
                  color="#ec4899"
                />
                <Text className="text-xs text-slate-600 flex-1">
                  Consider increasing intake of leafy greens and Vitamin C to improve
                  absorption.
                </Text>
              </View>
            </Pressable>
          ) : (
            <View className="bg-white border border-slate-100 rounded-xl p-6 items-center">
              <MaterialIcons
                name="health-and-safety"
                size={32}
                color="#cbd5e1"
              />
              <Text className="text-slate-400 text-sm mt-2">
                No screenings yet. Start your first scan!
              </Text>
            </View>
          )}
        </View>

        {/* Daily Tracking —  Tracker Buttons */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-slate-900 mb-4">
            Daily Tracking
          </Text>

          <View className="flex-row flex-wrap justify-between gap-y-4">
            {TRACKERS.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => handleTrackerPress(t)}
                className="w-[30%] bg-white rounded-xl border border-slate-100 py-4 items-center active:opacity-80"
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: t.bg }}
                >
                  <Text className="text-xl">{t.emoji}</Text>
                </View>

                <Text className="text-xs font-semibold text-slate-700">
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        {/* Diet */}
        <View className="mb-8">
          {/* Section Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-slate-900">
              Diet
            </Text>
            <Pressable onPress={() => router.push("/tracker/diet")}>
              <Text className="text-green-600 text-sm font-medium">
                View Details
              </Text>
            </Pressable>
          </View>

          {/* Diet Card */}
          <Pressable
            onPress={() => router.push("/tracker/diet")}
            className="bg-[#ECFDF5] rounded-2xl p-5"
          >
            {/* Calories */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-slate-500">
                  Calories Consumed Today
                </Text>
                <Text className="text-xs font-semibold text-slate-700">
                  1,250 / 2,000 kcal
                </Text>
              </View>

              <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "62%" }}
                />
              </View>
            </View>

            {/* Recommendations */}
            <View className="bg-white/80 rounded-xl p-3">
              <Text className="text-xs font-semibold text-slate-700 mb-1">
                Recommended Foods (Iron Deficiency)
              </Text>

              <Text className="text-xs text-slate-600 leading-5">
                • Spinach & leafy greens{"\n"}
                • Lentils & beans{"\n"}
                • Lean red meat{"\n"}
                • Citrus fruits (for better iron absorption)
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Educational Hub */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-lg font-semibold text-slate-900">
              Educational Hub
            </Text>
            <Pressable>
              <Text className="text-pink-600 text-sm font-medium">See All</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {EDUCATIONAL_RESOURCES.map((item) => (
              <Pressable
                key={item.id}
                className="w-60 bg-white rounded-xl border border-slate-100 overflow-hidden"
              >
                <View className="h-32 bg-slate-100 relative">
                  {/* Placeholder for real image */}
                  <View
                    className="absolute inset-0 items-center justify-center opacity-20"
                    style={{ backgroundColor: item.color }}
                  >
                    <MaterialIcons
                      name={item.type === "Video" ? "play-circle" : "article"}
                      size={48}
                      color={item.color}
                    />
                  </View>
                  <View className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                    <Text
                      style={{ color: item.color, fontSize: 10, fontWeight: "700" }}
                    >
                      {item.type.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View className="p-3">
                  <Text
                    className="text-slate-900 font-semibold mb-1"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-slate-500 text-xs">
                    {item.type === "Video" ? item.duration : item.readTime}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Health Tip */}
        <HealthTipCard tip={healthTip} />

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
