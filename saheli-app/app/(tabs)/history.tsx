import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreeningCard from "@/components/ScreeningCard";
import { ScreeningEntry } from "@/utils/data";
import { getScreenings } from "@/services/healthService";

export default function HistoryScreen() {
  const [screenings, setScreenings] = useState<ScreeningEntry[]>([]);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  useFocusEffect(
    useCallback(() => {
      loadScreenings();
    }, []),
  );

  const loadScreenings = async () => {
    const data = await getScreenings();
    setScreenings(data);
  };

  const sortedScreenings =
    sortOrder === "latest" ? [...screenings] : [...screenings].reverse();

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-slate-900">
            Screening History
          </Text>
          <Pressable
            onPress={() =>
              setSortOrder(sortOrder === "latest" ? "oldest" : "latest")
            }
            className="w-10 h-10 rounded-full bg-white border border-primary-10 items-center justify-center"
          >
            <MaterialIcons name="filter-list" size={20} color="#f471b5" />
          </Pressable>
        </View>
        <Text className="text-slate-500 mt-1">
          Track your health trends over time
        </Text>
      </View>

      {/* Sort Info */}
      <View className="px-6 py-2 flex-row items-center justify-between">
        <Text className="text-sm text-slate-400 font-medium">
          Sorted by{" "}
          <Text className="text-primary">
            {sortOrder === "latest" ? "Latest" : "Oldest"}
          </Text>
        </Text>
        <Text className="text-sm text-slate-400">
          {screenings.length} Screenings
        </Text>
      </View>

      {/* List */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {sortedScreenings.length > 0 ? (
          sortedScreenings.map((screening) => (
            <ScreeningCard
              key={screening.id}
              type={screening.type}
              timestamp={screening.timestamp}
              risk={screening.risk}
              imageUri={screening.imageUri}
              onPress={() =>
                router.push({
                  pathname: "/screening/results",
                  params: { id: screening.id, fromHistory: "true" },
                })
              }
            />
          ))
        ) : (
          <View className="items-center justify-center py-20 px-10">
            <View className="w-24 h-24 bg-primary-10 rounded-full items-center justify-center mb-6">
              <MaterialIcons
                name="history-toggle-off"
                size={40}
                color="#f471b5"
              />
            </View>
            <Text className="text-xl font-bold text-slate-900 mb-2 text-center">
              No screenings yet
            </Text>
            <Text className="text-slate-500 text-center mb-8">
              Start a screening to monitor your health trends with AI-powered
              analysis.
            </Text>
            <Pressable
              onPress={() => router.push("/screening" as any)}
              className="bg-primary py-3 px-8 rounded-full active:opacity-90"
            >
              <Text className="text-white font-semibold">Start First Scan</Text>
            </Pressable>
          </View>
        )}
        <View className="h-24" />
      </ScrollView>

      {/* FAB */}
      {screenings.length > 0 && (
        <View className="absolute bottom-24 right-6">
          <Pressable
            onPress={() => router.push("/screening" as any)}
            className="w-14 h-14 bg-primary rounded-full items-center justify-center active:opacity-90"
          >
            <MaterialIcons name="add-a-photo" size={26} color="white" />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
