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
  {
    id: "general",
    label: "General",
    emoji: "💤",
    color: "#7ed3d4",
    bg: "rgba(126,211,212,0.1)",
    route: "/tracker/general",
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
        <View className="flex-row justify-between items-center mb-8 mt-4">
          <View>
            <Text className="text-3xl font-bold text-slate-900">
              Hello, Sarah
            </Text>
            <Text className="text-slate-500 mt-1">
              How are you feeling today?
            </Text>
          </View>
          <View className="relative">
            <Pressable onPress={() => router.push("/(tabs)/profile")}>
              <View className="w-12 h-12 rounded-full bg-primary-20 items-center justify-center border-2 border-white">
                <MaterialIcons name="person" size={24} color="#f471b5" />
              </View>
            </Pressable>
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-bg-light" />
          </View>
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
                See History
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
              className="bg-white border border-slate-100 rounded-xl p-4"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden items-center justify-center">
                  {latestScreening.imageUri ? (
                    <Image
                      source={{ uri: latestScreening.imageUri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <MaterialIcons
                      name="fingerprint"
                      size={28}
                      color="#94a3b8"
                    />
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Last Analysis
                    </Text>
                    <Text className="text-xs text-slate-400">
                      {getTimeAgo(latestScreening.timestamp)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <RiskBadge risk={latestScreening.risk} />
                    <Text className="text-sm font-medium text-slate-700">
                      {latestScreening.condition}
                    </Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
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

        {/* Daily Tracking — 3 Tracker Buttons */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-slate-900 mb-4">
            Daily Tracking
          </Text>
          <View className="flex-row gap-3">
            {TRACKERS.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => handleTrackerPress(t)}
                className="flex-1 bg-white rounded-xl border border-slate-100 py-4 items-center active:opacity-80"
                style={{ opacity: t.active ? 1 : 0.55 }}
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
                {!t.active && (
                  <Text
                    className="text-[8px] font-bold mt-1"
                    style={{ color: t.color }}
                  >
                    SOON
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
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
