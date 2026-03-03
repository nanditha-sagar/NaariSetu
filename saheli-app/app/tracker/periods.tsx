import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  PeriodLogEntry,
  PeriodInsights,
  getPeriodLogs,
  savePeriodLog,
  generatePeriodInsights,
  getToday,
} from "@/utils/trackerData";
import TriageZoneCard from "@/components/TriageZoneCard";
import SegmentedSelector from "@/components/SegmentedSelector";

export default function PeriodTrackerScreen() {
  const [bleeding, setBleeding] = useState<PeriodLogEntry["bleeding"]>("none");
  const [mucus, setMucus] = useState<PeriodLogEntry["mucus"]>("dry");
  const [painIntensity, setPainIntensity] = useState<number>(0);
  const [painLocation, setPainLocation] = useState<
    PeriodLogEntry["painLocation"]
  >([]);
  const [hormonalSymptoms, setHormonalSymptoms] = useState<
    PeriodLogEntry["hormonalSymptoms"]
  >([]);

  const [insights, setInsights] = useState<PeriodInsights | null>(null);

  const loadData = useCallback(async () => {
    const logs = await getPeriodLogs();
    const today = getToday();
    const todayLog = logs.find((l) => l.date === today);

    if (todayLog) {
      setBleeding(todayLog.bleeding);
      setMucus(todayLog.mucus);
      setPainIntensity(todayLog.painIntensity);
      setPainLocation(todayLog.painLocation);
      setHormonalSymptoms(todayLog.hormonalSymptoms);
      setInsights(generatePeriodInsights(todayLog));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleSave = async () => {
    const entry: PeriodLogEntry = {
      date: getToday(),
      bleeding,
      mucus,
      painIntensity,
      painLocation,
      hormonalSymptoms,
      timestamp: new Date().toISOString(),
    };

    await savePeriodLog(entry);
    setInsights(generatePeriodInsights(entry));
    Alert.alert("Success", "Daily cycle log saved successfully!");
  };

  const togglePainLocation = (loc: PeriodLogEntry["painLocation"][0]) => {
    setPainLocation((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  };

  const toggleHormonalSymptom = (
    sym: PeriodLogEntry["hormonalSymptoms"][0],
  ) => {
    setHormonalSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym],
    );
  };

  const getPhaseEmoji = (phase: string) => {
    switch (phase) {
      case "Menstruation":
        return "❄️";
      case "Follicular":
        return "🌱";
      case "Ovulation":
        return "☀️";
      case "Luteal":
        return "🍂";
      default:
        return "⏳";
    }
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
            Cycle Tracker
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

        {/* Flow Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="water-drop" size={20} color="#ec4899" />
            <Text className="text-lg font-bold text-slate-800">
              Flow & Fluid
            </Text>
          </View>

          <SegmentedSelector
            label="Bleeding Status"
            options={[
              { label: "None", value: "none" },
              { label: "Spot", value: "spotting" },
              { label: "Light", value: "light" },
              { label: "Med", value: "medium" },
              { label: "Heavy", value: "heavy", color: "#ef4444" },
              { label: "Clots", value: "clots", color: "#b91c1c" },
            ]}
            selectedValue={bleeding}
            onSelect={(v) => setBleeding(v as any)}
          />

          <View className="h-6" />

          <SegmentedSelector
            label="Cervical Mucus"
            options={[
              { label: "Dry", value: "dry" },
              { label: "Sticky", value: "sticky" },
              { label: "Creamy", value: "creamy" },
              { label: "Egg-white", value: "egg_white", color: "#10b981" },
            ]}
            selectedValue={mucus}
            onSelect={(v) => setMucus(v as any)}
          />
        </View>

        {/* Pain Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="healing" size={20} color="#ec4899" />
            <Text className="text-lg font-bold text-slate-800">
              Pain Profile
            </Text>
          </View>

          <View className="mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-semibold text-slate-600">
                Pain Intensity
              </Text>
              <Text className="text-sm font-bold text-pink-600">
                {painIntensity}/10
              </Text>
            </View>
            <View className="flex-row gap-1">
              {[...Array(10)].map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => setPainIntensity(i + 1)}
                  className={`flex-1 h-3 rounded-full ${painIntensity >= i + 1 ? "bg-pink-500" : "bg-slate-100"}`}
                />
              ))}
            </View>
          </View>

          <Text className="text-xs font-bold text-slate-400 uppercase mb-3">
            Location
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { id: "belly", label: "Lower Belly" },
              { id: "back", label: "Lower Back" },
              { id: "thighs", label: "Thighs" },
              { id: "headache", label: "Headache" },
              { id: "breasts", label: "Breasts" },
            ].map((l) => (
              <Pressable
                key={l.id}
                onPress={() => togglePainLocation(l.id as any)}
                className={`px-4 py-2 rounded-full border ${painLocation.includes(l.id as any) ? "bg-pink-100 border-pink-200" : "bg-slate-50 border-slate-100"}`}
              >
                <Text
                  className={`text-sm ${painLocation.includes(l.id as any) ? "text-pink-700 font-bold" : "text-slate-600"}`}
                >
                  {l.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Hormonal Symptoms */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="auto-fix-high" size={20} color="#ec4899" />
            <Text className="text-lg font-bold text-slate-800">
              Hormonal Profile
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {[
              { id: "bloating", label: "Bloating" },
              { id: "bowel_change", label: "Period Poop" },
              { id: "skin_breakout", label: "Breaking Out" },
              { id: "libido_high", label: "High Libido" },
              { id: "libido_low", label: "Low Libido" },
            ].map((s) => (
              <Pressable
                key={s.id}
                onPress={() => toggleHormonalSymptom(s.id as any)}
                className={`px-4 py-2 rounded-full border ${hormonalSymptoms.includes(s.id as any) ? "bg-purple-100 border-purple-200" : "bg-slate-50 border-slate-100"}`}
              >
                <Text
                  className={`text-sm ${hormonalSymptoms.includes(s.id as any) ? "text-purple-700 font-bold" : "text-slate-600"}`}
                >
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          className="bg-primary p-5 rounded-2xl mb-8 items-center shadow-lg shadow-pink-200"
        >
          <Text className="text-white font-bold text-lg">Save Daily Log</Text>
        </Pressable>

        <Text className="text-slate-400 text-xs text-center mb-12 italic">
          Disclaimer: A 28-day cycle is a myth for many. 21-35 days is the
          medical "normal". If pain is severe, consult a specialist.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
