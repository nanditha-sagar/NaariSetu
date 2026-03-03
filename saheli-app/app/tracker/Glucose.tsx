import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Linking,
  TouchableOpacity,
  Modal,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  GlucoseLogEntry,
  GlucoseInsights,
  generateGlucoseInsights,
  getToday,
  GlucoseTiming,
  GlucoseSource,
} from "@/utils/trackerData";
import {
  saveGlucoseReading,
  getGlucoseReadings,
} from "@/services/healthService";
import TriageZoneCard from "@/components/TriageZoneCard";
import SegmentedSelector from "@/components/SegmentedSelector";
import MultiSelect from "@/components/MultiSelect";

export default function GlucoseTrackerScreen() {
  const [value, setValue] = useState<string>("");
  const [timing, setTiming] = useState<GlucoseTiming>("fasting");
  const [source, setSource] = useState<GlucoseSource>("glucometer");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [insulinMedication, setInsulinMedication] = useState<boolean>(false);
  const [activity, setActivity] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");

  // Women Factors
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [hasPCOS, setHasPCOS] = useState<boolean>(false);
  const [stressLevel, setStressLevel] = useState<"low" | "medium" | "high">(
    "low",
  );

  const [insights, setInsights] = useState<GlucoseInsights | null>(null);
  const [latestReading, setLatestReading] = useState<any>(null);
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    const logs = await getGlucoseReadings();
    if (logs.length > 0) {
      const latest = logs[0];
      setLatestReading(latest);
      setInsights(generateGlucoseInsights(latest as any));
      if (latest.timestamp && latest.timestamp.split("T")[0] === getToday()) {
        setHasLoggedToday(true);
      } else {
        setHasLoggedToday(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleSave = async () => {
    if (!value) {
      Alert.alert("Missing Value", "Please enter your glucose reading.");
      return;
    }

    const now = new Date();
    const entry: Omit<any, "userId"> = {
      date: getToday(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: parseFloat(value),
      unit: "mg/dL",
      timing,
      source,
      symptoms,
      insulinMedication,
      activity,
      notes,
      isPregnant,
      hasPCOS,
      stressLevel,
      timestamp: now.toISOString(),
      category: insights?.category || "Normal",
      alertStatus: insights?.alertStatus || "Green",
    };

    try {
      await saveGlucoseReading(entry);
      setHasLoggedToday(true);
      Alert.alert("Saved!", "Glucose log saved successfully!", [
        { text: "OK", onPress: () => loadData() },
      ]);
      setValue("");
      setSymptoms([]);
    } catch (error) {
      Alert.alert("Error", "Failed to save reading.");
    }
  };

  const toggleSymptom = (sym: string) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym],
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
            Glucose Tracker
          </Text>
          {hasLoggedToday && (
            <View className="ml-auto px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
              <Text className="text-[10px] font-bold text-emerald-600">
                ✓ LOGGED
              </Text>
            </View>
          )}
        </View>

        {/* Latest Reading Dashboard */}
        {latestReading && (
          <View className="bg-slate-900 rounded-3xl p-6 mb-8 shadow-xl">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Latest Reading
                </Text>
                <Text className="text-white text-xs opacity-60">
                  {latestReading.timing.replace("_", " ")} •{" "}
                  {latestReading.time}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${latestReading.alertStatus === "Green" ? "bg-green-500/20" : latestReading.alertStatus === "Amber" ? "bg-amber-500/20" : "bg-red-500/20"}`}
              >
                <Text
                  className={`text-[10px] font-bold ${latestReading.alertStatus === "Green" ? "text-green-400" : latestReading.alertStatus === "Amber" ? "text-amber-400" : "text-red-400"}`}
                >
                  {latestReading.category.toUpperCase()}
                </Text>
              </View>
            </View>

            <View className="flex-row items-end gap-3 mb-6">
              <Text className="text-5xl font-black text-white">
                {latestReading.value}
              </Text>
              <Text className="text-slate-400 font-bold mb-2">mg/dL</Text>
              {latestReading.trend && (
                <View className="flex-row items-center ml-2 mb-2">
                  <MaterialIcons
                    name={
                      latestReading.trend === "up"
                        ? "trending-up"
                        : latestReading.trend === "down"
                          ? "trending-down"
                          : "trending-flat"
                    }
                    size={20}
                    color={
                      latestReading.trend === "up"
                        ? "#ef4444"
                        : latestReading.trend === "down"
                          ? "#10b981"
                          : "#94a3b8"
                    }
                  />
                </View>
              )}
            </View>

            {insights && (
              <View className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <Text className="text-white text-sm font-medium leading-5">
                  💡 {insights.triageSuggestions[0]}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Triage Alert */}
        {insights && insights.alertStatus !== "Green" && (
          <View className="mb-8">
            <TriageZoneCard
              zone={insights.triageZone as any}
              message={insights.triageMessage}
              suggestions={insights.triageSuggestions}
            />
          </View>
        )}

        {/* Required Fields Card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
              <MaterialIcons name="add" size={20} color="#ec4899" />
            </View>
            <Text className="text-lg font-bold text-slate-800">New Entry</Text>
          </View>

          <View className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
            <Text className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[2px] mb-2">
              Glucose Level
            </Text>
            <TextInput
              className="text-5xl font-black text-center text-slate-900 mb-2"
              keyboardType="numeric"
              value={value}
              onChangeText={(v) => {
                setValue(v);
                if (v)
                  setInsights(
                    generateGlucoseInsights({
                      value: parseFloat(v),
                      timing,
                      hasPCOS,
                      isPregnant,
                    } as any),
                  );
              }}
              placeholder="100"
              placeholderTextColor="#cbd5e1"
            />
            <Text className="text-center text-slate-400 font-bold">mg/dL</Text>
          </View>

          <SegmentedSelector
            label="Timing"
            options={[
              { label: "Fasting", value: "fasting" },
              { label: "Before Meal", value: "before_meal" },
              { label: "1h After", value: "after_meal_1h" },
              { label: "2h After", value: "after_meal_2h" },
              { label: "Random", value: "random" },
            ]}
            selectedValue={timing}
            onSelect={(v) => setTiming(v as any)}
          />

          <View className="h-4" />

          <SegmentedSelector
            label="Source"
            options={[
              { label: "Glucometer", value: "glucometer" },
              { label: "Lab", value: "lab" },
              { label: "CGM", value: "cgm" },
            ]}
            selectedValue={source}
            onSelect={(v) => setSource(v as any)}
          />
        </View>

        {/* Optional Context */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <Text className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider opacity-50">
            Context & Symptoms
          </Text>

          <MultiSelect
            label="Symptoms"
            options={[
              "Shaky or tingling hands",
              "Sweaty",
              "Racing Heart",
              "Hungry",
              "Confused",
              "Thirsty",
              "Urination",
              "Blurry Vision",
              "Nausea",
            ]}
            selectedValues={symptoms}
            onToggle={toggleSymptom}
          />

          <SegmentedSelector
            label="Insulin/Medication?"
            options={[
              { label: "Yes", value: "yes", color: "#10b981" },
              { label: "No", value: "no" },
            ]}
            selectedValue={insulinMedication ? "yes" : "no"}
            onSelect={(v) => setInsulinMedication(v === "yes")}
          />

          <View className="h-4" />

          <SegmentedSelector
            label="Physical Activity?"
            options={[
              { label: "Yes", value: "yes", color: "#10b981" },
              { label: "No", value: "no" },
            ]}
            selectedValue={activity ? "yes" : "no"}
            onSelect={(v) => setActivity(v === "yes")}
          />

          <View className="h-4" />

          <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
            Notes
          </Text>
          <TextInput
            className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-800 min-h-[100px]"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any specific meals or stress factors?"
            textAlignVertical="top"
          />
        </View>

        {/* Women's Health Factors */}
        <View className="bg-purple-50 rounded-3xl p-6 border border-purple-100 mb-8">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="female" size={20} color="#9333ea" />
            <Text className="text-lg font-bold text-purple-900">
              Women's Health
            </Text>
          </View>

          <SegmentedSelector
            label="Stress Level"
            options={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high", color: "#ef4444" },
            ]}
            selectedValue={stressLevel}
            onSelect={(v) => setStressLevel(v as any)}
          />

          <View className="h-4" />

          <View className="flex-row gap-4">
            <Pressable
              onPress={() => setIsPregnant(!isPregnant)}
              className={`flex-1 p-4 rounded-2xl border flex-row items-center justify-center gap-2 ${isPregnant ? "bg-purple-200 border-purple-400" : "bg-white border-slate-100"}`}
            >
              <MaterialIcons
                name="pregnant-woman"
                size={18}
                color={isPregnant ? "#7e22ce" : "#94a3b8"}
              />
              <Text
                className={`text-xs font-bold ${isPregnant ? "text-purple-900" : "text-slate-500"}`}
              >
                Pregnant
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setHasPCOS(!hasPCOS)}
              className={`flex-1 p-4 rounded-2xl border flex-row items-center justify-center gap-2 ${hasPCOS ? "bg-purple-200 border-purple-400" : "bg-white border-slate-100"}`}
            >
              <MaterialIcons
                name="healing"
                size={18}
                color={hasPCOS ? "#7e22ce" : "#94a3b8"}
              />
              <Text
                className={`text-xs font-bold ${hasPCOS ? "text-purple-900" : "text-slate-500"}`}
              >
                PCOS
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          className="bg-primary p-5 rounded-2xl mb-8 items-center shadow-xl shadow-pink-200 active:opacity-90"
        >
          <Text className="text-white font-bold text-lg">Save Glucose Log</Text>
        </Pressable>

        <View className="bg-slate-100 p-4 rounded-2xl mb-12">
          <Text className="text-slate-500 text-[10px] text-center italic">
            Disclaimer: NaariSetu tracks trends. Adjusting insulin based solely
            on an app without doctor input is dangerous.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
