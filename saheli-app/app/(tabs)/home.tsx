import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

import RiskBadge from "@/components/RiskBadge";
import HealthTipCard from "@/components/HealthTipCard";
import { getRandomTip, ScreeningEntry } from "@/utils/data";
import {
  getLatestScreening,
  getTimeAgo,
  getBPReadings,
  getGlucoseReadings,
} from "@/services/healthService";
import {
  getPeriodLogs,
  getMoodLogs,
  getAnemiaLogs,
  getToday,
} from "@/utils/trackerData";

const TRACKERS = [
  {
    id: "BP",
    label: "BP",
    emoji: "🩺",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    route: "/tracker/BP",
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
    id: "medical_report",
    label: "Report AI",
    emoji: "🔬",
    color: "#2563eb",
    bg: "rgba(37,99,235,0.12)",
    url: "https://opal.google/app/13fXZsoVmk4-PqdqF9bhr0B8QLS31D1tt",
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
    id: "Glucose",
    label: "Glucose",
    emoji: "◻️",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.1)",
    route: "/tracker/Glucose",
    active: true,
  },
  {
    id: "periods",
    label: "Periods",
    emoji: "🌸",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.1)",
    route: "/tracker/periods",
    active: true,
  },
];

const EDUCATIONAL_RESOURCES = [
  {
    id: "8",
    title: "Growing Up Safely: A Guide to Body Awareness",
    type: "Article",
    readTime: "5 min read",
    thumbnail: "https://img.freepik.com/free-vector/health-protection-concept-illustration_114360-1491.jpg",
    color: "#6366f1",
    route: "/educational/growing-up-safely",
  },
  {
    id: "7",
    title: "Your First Period Guide: A Simple Guide for Girls",
    type: "Article",
    readTime: "4 min read",
    thumbnail: "https://img.freepik.com/free-vector/menstrual-cycle-concept-illustration_114360-10118.jpg",
    color: "#ec4899",
    route: "/educational/first-period-guide",
  },
  {
    id: "6",
    title: "Breast Cancer Awareness: Warning Signs, Early Detection & Screening",
    type: "Article",
    readTime: "5 min read",
    thumbnail: "https://img.freepik.com/free-photo/pink-ribbon-breast-cancer-awareness-concept_53876-138379.jpg",
    color: "#db2777",
    route: "/educational/breast-cancer-awareness",
  },
  {
    id: "1",
    title: "Understanding PCOS Symptoms",
    type: "Video",
    duration: "5 min",
    thumbnail: "https://img.youtube.com/vi/HzG-zaMYZZ8/0.jpg",
    color: "#a855f7",
    url: "https://www.youtube.com/watch?v=HzG-zaMYZZ8",
  },
  {
    id: "2",
    title: "Get Relief from Period Cramps",
    type: "Video",
    duration: "10 min",
    thumbnail: "https://img.youtube.com/vi/LIsYbDCMfDc/0.jpg",
    color: "#ec135b",
    url: "https://www.youtube.com/watch?v=LIsYbDCMfDc",
  },
  {
    id: "5",
    title: "How to know if you have breast cancer",
    type: "Video",
    duration: "6 min",
    thumbnail: "https://img.youtube.com/vi/jeELLC2L65k/0.jpg",
    color: "#ec4899",
    url: "https://www.youtube.com/watch?v=jeELLC2L65k",
  },
];

const THOUGHTS = [
  "You’re doing better than you think, even on the days you doubt yourself.",
  "I hope you remember how strong you are — you’ve survived 100% of your hardest days.",
  "It’s okay to move slowly. You’re still moving, and that’s what matters.",
  "You deserve the same love and care you so easily give to others.",
  "Don’t forget — the world is better because you’re in it.",
  "Your health is an investment, not an expense. Take it one step at a time.",
];

import { auth, db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function HomeScreen() {
  const [latestScreening, setLatestScreening] = useState<ScreeningEntry | null>(
    null,
  );
  const [healthTip, setHealthTip] = useState(getRandomTip());
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loggedStatus, setLoggedStatus] = useState<Record<string, boolean>>({});
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const thought = useMemo(() => {
    return THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Fetch profile
        const docSnap = await getDoc(doc(db, "profiles", user.uid));

        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      }

      const latest = await getLatestScreening();
      setLatestScreening(latest);
      await checkTodayLogs();
    } catch (error) {
      console.error("Error loading home data:", error);
    }
  };

  const checkTodayLogs = async () => {
    const today = getToday();
    const status: Record<string, boolean> = {};

    try {
      const [bp, glucose, periods, mood, anemia] = await Promise.all([
        getBPReadings(),
        getGlucoseReadings(),
        getPeriodLogs(),
        getMoodLogs(),
        getAnemiaLogs(),
      ]);

      status["BP"] = bp.some(
        (r) => r.timestamp && r.timestamp.split("T")[0] === today,
      );
      status["glucose"] = glucose.some(
        (r) => r.timestamp && r.timestamp.split("T")[0] === today,
      );
      status["periods"] = periods.some((r) => r.date === today);
      status["mood"] = mood.some((r) => r.date === today);
      status["anemia"] = anemia.some((r) => r.date === today);

      setLoggedStatus(status);
    } catch (e) {
      console.error("Error checking today's logs:", e);
    }
  };

  const handleTrackerPress = (tracker: any) => {
    if (tracker.url) {
      WebBrowser.openBrowserAsync(tracker.url);
      return;
    }
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
        <View className="flex-row justify-between items-center mt-6 mb-8">
          {/* Welcome Text */}
          <View>
            <Text className="text-2xl font-bold text-slate-900">
              {userProfile?.full_name || "Welcome Back"}
            </Text>
            <Text className="text-slate-400 text-xs mt-1">
              {userProfile
                ? `${userProfile.age || "--"} yrs • ${userProfile.city || "India"}`
                : "Guest User"}
            </Text>
          </View>

          {/* Right Icons */}
          <View className="flex-row items-center gap-3">
            {/* Notifications Button */}
            <Pressable
              onPress={() => router.push("/notifications" as any)}
              className="relative"
            >
              <View className="w-11 h-11 rounded-full bg-white items-center justify-center border border-slate-100 shadow-sm">
                <MaterialIcons
                  name="notifications-none"
                  size={20}
                  color="#ec4899"
                />
              </View>

              {/* Notification Dot */}
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white" />
            </Pressable>

            {/* Profile Button */}
            <Pressable onPress={() => router.push("/(tabs)/profile")}>
              <View className="w-11 h-11 rounded-full bg-pink-50 items-center justify-center border border-pink-100">
                <MaterialIcons name="person" size={22} color="#f471b5" />
              </View>

              {/* Online Dot */}
              <View className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-bg-light" />
            </Pressable>
          </View>
        </View>

        {/* ─── Mood Check-in ─── */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-bold text-slate-800">
              How are you feeling today?
            </Text>
          </View>

          <View className="flex-row justify-between">
            {[
              { label: "Happy", emoji: "😊", color: "#fef3c7", accent: "#f59e0b", suggestions: ["Keep doing what makes you happy!", "Share your joy with someone you love.", "Write down what made you smile today."] },
              { label: "Neutral", emoji: "😐", color: "#f1f5f9", accent: "#64748b", suggestions: ["Try a short walk to refresh your mind.", "Listen to your favourite music.", "Drink water and take a short break."] },
              { label: "Angry", emoji: "😠", color: "#fee2e2", accent: "#ef4444", suggestions: ["Take 5 deep breaths slowly.", "Step away from the situation for a few minutes.", "Write down what's bothering you."] },
              { label: "Sad", emoji: "😔", color: "#e0f2fe", accent: "#3b82f6", suggestions: ["It's okay to feel this way. Be gentle with yourself.", "Talk to someone you trust about how you feel.", "Try a warm drink and a calming activity."] },
            ].map((mood) => (
              <Pressable
                key={mood.label}
                onPress={() => setSelectedMood(selectedMood === mood.label ? null : mood.label)}
                className="items-center"
              >
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-1.5"
                  style={{
                    backgroundColor: mood.color,
                    borderWidth: selectedMood === mood.label ? 2 : 0,
                    borderColor: mood.accent,
                  }}
                >
                  <Text className="text-2xl">{mood.emoji}</Text>
                </View>
                <Text className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">
                  {mood.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Mood Suggestions */}
          {selectedMood && (() => {
            const moodData = [
              { label: "Happy", accent: "#f59e0b", bg: "#fef3c7", suggestions: ["Keep doing what makes you happy!", "Share your joy with someone you love.", "Write down what made you smile today."] },
              { label: "Neutral", accent: "#64748b", bg: "#f1f5f9", suggestions: ["Try a short walk to refresh your mind.", "Listen to your favourite music.", "Drink water and take a short break."] },
              { label: "Angry", accent: "#ef4444", bg: "#fee2e2", suggestions: ["Take 5 deep breaths slowly.", "Step away from the situation for a few minutes.", "Write down what's bothering you."] },
              { label: "Sad", accent: "#3b82f6", bg: "#e0f2fe", suggestions: ["It's okay to feel this way. Be gentle with yourself.", "Talk to someone you trust about how you feel.", "Try a warm drink and a calming activity."] },
            ].find(m => m.label === selectedMood);
            if (!moodData) return null;
            return (
              <View className="mt-4 p-4 rounded-xl" style={{ backgroundColor: moodData.bg }}>
                <Text className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: moodData.accent }}>
                  Suggestions for you
                </Text>
                {moodData.suggestions.map((s, i) => (
                  <View key={i} className="flex-row items-start mb-1.5">
                    <Text style={{ color: moodData.accent }} className="mr-2">•</Text>
                    <Text className="text-sm text-slate-700 flex-1">{s}</Text>
                  </View>
                ))}
              </View>
            );
          })()}
        </View>

        {/* ─── Thought of the Day ─── */}
        <View className="bg-pink-50/50 p-4 rounded-2xl mb-6 border border-pink-100/50">
          <View className="flex-row items-center gap-2 mb-1">
            <MaterialIcons name="lightbulb" size={16} color="#db2777" />
            <Text className="text-[10px] font-bold text-pink-600 uppercase tracking-widest">
              Thought of the Day
            </Text>
          </View>
          <Text className="text-slate-700 text-sm italic leading-5">
            "{thought}"
          </Text>
        </View>

        {/* Start Screening CTA (Reduced Size) */}
        <Pressable
          onPress={() => router.push("/screening" as any)}
          className="w-full bg-primary p-4 rounded-2xl mb-8 flex-row items-center relative overflow-hidden active:opacity-90"
        >
          <View className="absolute top-0 right-0 w-24 h-24 bg-white-10 rounded-full -mr-8 -mt-8" />
          <View className="bg-white-20 p-3 rounded-full mr-4">
            <MaterialIcons name="fingerprint" size={28} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-white">
              Start New Screening
            </Text>
            <Text className="text-white-80 text-xs">
              AI-powered scan for rapid assessment
            </Text>
          </View>
          <MaterialIcons name="arrow-forward" size={20} color="white" />
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
                <MaterialIcons name="info-outline" size={16} color="#ec4899" />
                <Text className="text-xs text-slate-600 flex-1">
                  Consider increasing intake of leafy greens and Vitamin C to
                  improve absorption.
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

        {/* Daily Insights CTA */}
        <Pressable
          onPress={() => router.push("/insights")}
          className="bg-white rounded-2xl p-5 border border-slate-100 mb-8 shadow-sm flex-row items-center justify-between active:opacity-80"
        >
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <MaterialIcons name="auto-awesome" size={20} color="#f471b5" />
              <Text className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">
                Daily Insights
              </Text>
            </View>
            <Text className="text-slate-900 font-bold text-base mb-1">
              Personalized Health Recommendations
            </Text>
            <Text className="text-slate-500 text-xs">
              Diet, yoga, and meditation tips based on your profile.
            </Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center ml-4">
            <MaterialIcons name="chevron-right" size={24} color="#ec4899" />
          </View>
        </Pressable>

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
                className="w-[30%] bg-white rounded-xl border border-slate-100 py-4 items-center active:opacity-80 relative"
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
            <Text className="text-lg font-semibold text-slate-900">Diet</Text>
            <Pressable
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://opal.google/app/13fXZsoVmk4-PqdqF9bhr0B8QLS31D1tt",
                )
              }
            >
              <Text className="text-green-600 text-sm font-medium">
                View Details
              </Text>
            </Pressable>
          </View>

          {/* Diet Card */}
          <Pressable
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://opal.google/app/13fXZsoVmk4-PqdqF9bhr0B8QLS31D1tt",
              )
            }
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
                • Spinach & leafy greens{"\n"}• Lentils & beans{"\n"}• Lean red
                meat{"\n"}• Citrus fruits (for better iron absorption)
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
            {EDUCATIONAL_RESOURCES.map((item: any) => (
              <Pressable
                key={item.id}
                onPress={() => item.url ? Linking.openURL(item.url) : (item.route && router.push(item.route))}
                className="w-60 bg-white rounded-xl border border-slate-100 overflow-hidden active:opacity-95"
              >
                <View className="h-32 bg-slate-100 relative">
                  {item.thumbnail && (
                    <Image
                      source={{ uri: item.thumbnail }}
                      className="absolute inset-0 w-full h-full"
                      resizeMode="cover"
                    />
                  )}
                  <View className="absolute inset-0 items-center justify-center bg-black/20">
                    <MaterialIcons
                      name={item.type === "Video" ? "play-circle" : "article"}
                      size={48}
                      color="white"
                    />
                  </View>
                  <View className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                    <Text
                      style={{
                        color: item.color,
                        fontSize: 10,
                        fontWeight: "700",
                      }}
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
