import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  SkinLogEntry,
  SkinInsights,
  generateSkinInsights,
  getToday,
} from "@/utils/trackerData";
import { getSkinLogs, saveSkinLog } from "@/services/healthService";
import TriageZoneCard from "@/components/TriageZoneCard";
import SegmentedSelector from "@/components/SegmentedSelector";

export default function SkinTrackerScreen() {
  const [itching, setItching] = useState<number>(3);
  const [pain, setPain] = useState<SkinLogEntry["pain"]>("none");
  const [heatCheck, setHeatCheck] = useState<boolean>(false);
  const [texture, setTexture] = useState<SkinLogEntry["texture"]>("smooth");
  const [isTrackingSpot, setIsTrackingSpot] = useState<boolean>(false);
  const [spotChanges, setSpotChanges] = useState<SkinLogEntry["spotChanges"]>(
    [],
  );
  const [dietTriggers, setDietTriggers] = useState<
    SkinLogEntry["dietTriggers"]
  >([]);
  const [stressLevel, setStressLevel] = useState<number>(5);

  const [insights, setInsights] = useState<SkinInsights | null>(null);

  const loadData = useCallback(async () => {
    const logs = await getSkinLogs();
    const today = getToday();
    const todayLog = logs.find((l) => l.date === today);

    if (todayLog) {
      setItching(todayLog.itching);
      setPain(todayLog.pain);
      setHeatCheck(todayLog.heatCheck);
      setTexture(todayLog.texture);
      setIsTrackingSpot(todayLog.isTrackingSpot);
      if (todayLog.spotChanges) setSpotChanges(todayLog.spotChanges);
      setDietTriggers(todayLog.dietTriggers);
      setStressLevel(todayLog.stressLevel);
      setInsights(generateSkinInsights(todayLog));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleSave = async () => {
    const entry: SkinLogEntry = {
      date: getToday(),
      itching,
      pain,
      heatCheck,
      texture,
      isTrackingSpot,
      spotChanges,
      dietTriggers,
      stressLevel,
      timestamp: new Date().toISOString(),
    };

    await saveSkinLog(entry);
    setInsights(generateSkinInsights(entry));
    Alert.alert("Success", "Skin log saved successfully!");
    router.navigate("/(tabs)/home");
  };

  const toggleSpotChange = (change: "size" | "color" | "bleeding") => {
    setSpotChanges((prev) =>
      prev?.includes(change)
        ? prev.filter((c) => c !== change)
        : [...(prev || []), change],
    );
  };

  const toggleDietTrigger = (trigger: SkinLogEntry["dietTriggers"][0]) => {
    setDietTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center mt-6 mb-8">
          <Pressable onPress={() => router.back()} className="mr-4">
            <MaterialIcons name="arrow-back" size={24} color="#334155" />
          </Pressable>
          <Text className="text-2xl font-bold text-slate-900">
            Skin Tracker
          </Text>
        </View>

        {/* Triage Card */}
        {insights && (
          <View className="mb-8">
            <TriageZoneCard
              zone={
                insights.triageZone === "Yellow"
                  ? "Amber"
                  : (insights.triageZone as any)
              }
              message={insights.triageMessage}
              suggestions={insights.triageSuggestions}
            />
          </View>
        )}

        {/* Sensory Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="touch-app" size={20} color="#8b5cf6" />
            <Text className="text-lg font-bold text-slate-800">
              Sensory Check
            </Text>
          </View>

          <View className="mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-semibold text-slate-600">
                Itch Level
              </Text>
              <Text className="text-sm font-bold text-purple-600">
                {itching}/10
              </Text>
            </View>
            <View className="flex-row gap-1">
              {[...Array(10)].map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => setItching(i + 1)}
                  className={`flex-1 h-3 rounded-full ${itching >= i + 1 ? "bg-purple-500" : "bg-slate-100"}`}
                />
              ))}
            </View>
          </View>

          <SegmentedSelector
            label="Pain/Tenderness?"
            options={[
              { label: "None", value: "none" },
              { label: "Mild", value: "mild", color: "#f59e0b" },
              { label: "Throbbing", value: "throbbing", color: "#ef4444" },
            ]}
            selectedValue={pain}
            onSelect={(v) => setPain(v as any)}
          />

          <View className="h-4" />

          <SegmentedSelector
            label="Heat Check: Does it feel hot?"
            options={[
              { label: "No", value: "no" },
              { label: "Yes (Urgent)", value: "yes", color: "#ef4444" },
            ]}
            selectedValue={heatCheck ? "yes" : "no"}
            onSelect={(v) => setHeatCheck(v === "yes")}
          />
        </View>

        {/* Texture Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <SegmentedSelector
            label="Skin Texture"
            options={[
              { label: "Smooth", value: "smooth" },
              { label: "Dry/Flaky", value: "dry_flaky" },
              { label: "Rough", value: "rough_bumpy" },
              { label: "Weeping", value: "weeping", color: "#ef4444" },
            ]}
            selectedValue={texture}
            onSelect={(v) => setTexture(v as any)}
          />
        </View>

        {/* ABCDE / Spot Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold text-slate-800">
              Tracking a specific spot?
            </Text>
            <Pressable
              onPress={() => setIsTrackingSpot(!isTrackingSpot)}
              className={`w-12 h-6 rounded-full px-1 justify-center ${isTrackingSpot ? "bg-purple-500 items-end" : "bg-slate-200 items-start"}`}
            >
              <View className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </Pressable>
          </View>

          {isTrackingSpot && (
            <View className="mt-2 pt-4 border-t border-slate-50">
              <Text className="text-xs font-bold text-slate-400 uppercase mb-3">
                Changes Observed
              </Text>
              <View className="flex-row gap-2">
                {[
                  { id: "size", label: "Change in Size" },
                  { id: "color", label: "Change in Color" },
                  { id: "bleeding", label: "Bleeding" },
                ].map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() => toggleSpotChange(c.id as any)}
                    className={`flex-1 p-3 rounded-xl border items-center ${spotChanges?.includes(c.id as any) ? "bg-purple-100 border-purple-200" : "bg-slate-50 border-slate-100"}`}
                  >
                    <Text
                      className={`text-[10px] text-center font-bold ${spotChanges?.includes(c.id as any) ? "text-purple-700" : "text-slate-500"}`}
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Context Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="assignment" size={20} color="#8b5cf6" />
            <Text className="text-lg font-bold text-slate-800">Context</Text>
          </View>

          <Text className="text-xs font-bold text-slate-400 uppercase mb-3">
            Potential Triggers (Last 3 days)
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {[
              { id: "sugar", label: "High Sugar" },
              { id: "dairy", label: "High Dairy" },
              { id: "new_product", label: "New Product" },
            ].map((t) => (
              <Pressable
                key={t.id}
                onPress={() => toggleDietTrigger(t.id as any)}
                className={`px-4 py-2 rounded-full border ${dietTriggers.includes(t.id as any) ? "bg-orange-100 border-orange-200" : "bg-slate-50 border-slate-100"}`}
              >
                <Text
                  className={`text-sm ${dietTriggers.includes(t.id as any) ? "text-orange-700 font-bold" : "text-slate-600"}`}
                >
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-semibold text-slate-600">
                Stress Level
              </Text>
              <Text className="text-sm font-bold text-purple-600">
                {stressLevel}/10
              </Text>
            </View>
            <View className="flex-row gap-1">
              {[...Array(10)].map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => setStressLevel(i + 1)}
                  className={`flex-1 h-3 rounded-full ${stressLevel >= i + 1 ? "bg-purple-500" : "bg-slate-100"}`}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          className="bg-primary p-5 rounded-2xl mb-8 items-center shadow-lg shadow-pink-200"
        >
          <Text className="text-white font-bold text-lg">Save Skin Log</Text>
        </Pressable>

        <Text className="text-slate-400 text-xs text-center mb-12 italic">
          Disclaimer: AI cannot diagnose cancer or infection definitively. If a
          mole changes or a rash spreads, see a dermatologist.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
